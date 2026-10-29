// Health Journal routes: Maji's server calls the SafeMeds API (our upstream partner)
// and passes back only the fields the Health Journal page needs.
// The browser never talks to SafeMeds directly, so the SafeMeds key stays on the server.
const express = require("express");
const db = require("../db");
const router = express.Router();

const SAFEMEDS_URL = process.env.SAFEMEDS_URL;         // SafeMeds base URL, set in .env
const SAFEMEDS_API_KEY = process.env.SAFEMEDS_API_KEY; // SafeMeds key, set in .env, never committed

// Sends one request to SafeMeds and returns the raw fetch Response.
async function safeMedsFetch(path, options = {}) {
  if (!SAFEMEDS_URL) {
    throw new Error("SAFEMEDS_URL is not set in .env");
  }

  const headers = { ...(options.headers || {}) };
  if (SAFEMEDS_API_KEY) headers["X-API-Key"] = SAFEMEDS_API_KEY;

  return fetch(`${SAFEMEDS_URL}${path}`, { ...options, headers });
}

// GETs one SafeMeds list endpoint. Returns the parsed JSON array,
// or throws an error whose message says what went wrong.
async function getList(path) {
  const response = await safeMedsFetch(path);

  if (!response.ok) {
    throw new Error(`SafeMeds returned ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("SafeMeds response was not a list");
  }

  return data;
}

// Sends a safe fallback response when SafeMeds can't be used.
// Logs the reason (never a key), and tells the page with a 502.
function partnerUnavailable(res, what, err) {
  console.error(`SafeMeds ${what} failed:`, err.cause?.code || err.message);
  res.status(502).json({ message: "Partner data unavailable" });
}

// GET /api/health/alerts?estate=Kasarani
// Waterborne-illness alerts for the customer's estate over the last 30 days.
// SafeMeds only returns alerts from its own recent window, and only for regions it has data for.
router.get("/alerts", async (req, res) => {
  const { estate } = req.query;

  if (!estate || typeof estate !== "string" || !estate.trim()) {
    return res.status(400).json({ message: "estate is required" });
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD, as SafeMeds expects

  try {
    const alerts = await getList(
      `/v1/health-signals/area-alerts?region=${encodeURIComponent(estate.trim())}&since=${since}`
    );

    // SafeMeds sends aggregate counts and no severity, so the page shows the
    // illness, the date and how far above normal the prescriptions were.
    res.json(
      alerts.map((alert) => ({
        alertId: `${alert.illnessCategory}-${alert.alertDate}`,
        illnessType: alert.illnessCategory,
        detectedAt: alert.alertDate,
        prescriptionCount: alert.prescriptionCount,
        spikeRatio: alert.spikeRatio,
        signalMode: alert.signalMode,
      }))
    );
  } catch (err) {
    partnerUnavailable(res, "alerts", err);
  }
});

// GET /api/health/products
// Top-rated water-treatment products (SafeMeds returns the top 3).
router.get("/products", async (req, res) => {
  try {
    const products = await getList("/reviews");

    res.json(
      products.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
        topComment: product.topComment,
      }))
    );
  } catch (err) {
    partnerUnavailable(res, "products", err);
  }
});

// GET /api/health/stock
// Water-treatment tablets currently in stock at SafeMeds.
router.get("/stock", async (req, res) => {
  try {
    const items = await getList("/inventory?available=true");

    res.json(
      items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        availableQuantity: item.availableQuantity,
        isAvailable: item.isAvailable,
      }))
    );
  } catch (err) {
    partnerUnavailable(res, "stock", err);
  }
});

// POST /api/health/orders
// Body: { customerId, productId, productName, quantity }
// Places the order with SafeMeds, then keeps a copy in Maji's own database so the
// customer can see it in the Health Journal.
router.post("/orders", async (req, res) => {
  const { customerId, productId, productName, quantity } = req.body || {};

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({ message: "customerId must be a positive whole number" });
  }
  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "productId must be a positive whole number" });
  }
  if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 100) {
    return res.status(400).json({ message: "quantity must be a whole number from 1 to 100" });
  }
  if (typeof productName !== "string" || !productName.trim() || productName.length > 120) {
    return res.status(400).json({ message: "productName is required" });
  }

  try {
    // The customer's name comes from Maji's database, not from the browser.
    const [customers] = await db.query("SELECT name FROM customers WHERE id = ?", [customerId]);

    if (customers.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const response = await safeMedsFetch("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, customerName: customers[0].name }),
    });

    // SafeMeds refused the order itself (for example, bad product): tell the customer why.
    if (response.status === 400) {
      const body = await response.json().catch(() => ({}));
      return res.status(400).json({ message: body.message || "SafeMeds could not place this order" });
    }

    if (!response.ok) {
      throw new Error(`SafeMeds returned ${response.status}`);
    }

    const order = await response.json();

    let recorded = true;
    try {
      await db.query(
        `INSERT INTO health_orders
           (customer_id, safemeds_order_id, product_id, product_name, quantity, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [customerId, order.orderId, productId, productName.trim(), quantity, order.status || "Pending"]
      );
    } catch (err) {
      // The order exists at SafeMeds, so do not report a failure; just log it.
      recorded = false;
      console.error("Health order saved at SafeMeds but not in Maji:", err.message);
    }

    res.status(201).json({
      orderId: order.orderId,
      productId,
      productName: productName.trim(),
      quantity,
      status: order.status || "Pending",
      recorded,
    });
  } catch (err) {
    partnerUnavailable(res, "order", err);
  }
});

// GET /api/health/orders?customerId=3
// The customer's treatment orders, newest first.
router.get("/orders", async (req, res) => {
  const customerId = Number(req.query.customerId);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({ message: "customerId must be a positive whole number" });
  }

  try {
    const [rows] = await db.query(
      `SELECT safemeds_order_id AS orderId,
              product_id AS productId,
              product_name AS productName,
              quantity,
              status,
              created_at AS createdAt
         FROM health_orders
        WHERE customer_id = ?
        ORDER BY created_at DESC`,
      [customerId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Health orders list failed:", err.message);
    res.status(500).json({ message: "Failed to load your orders" });
  }
});

module.exports = router;
