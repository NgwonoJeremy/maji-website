// Health Journal routes: Maji's server calls the SafeMeds API (our upstream partner)
// and passes back only the fields the Health Journal page needs.
// The browser never talks to SafeMeds directly.
const express = require("express");
const router = express.Router();

const PARTNER_URL = process.env.PARTNER_URL;         // SafeMeds base URL, set in .env
const PARTNER_API_KEY = process.env.PARTNER_API_KEY; // optional: SafeMeds needs no key today

// Calls one SafeMeds endpoint. Returns the parsed JSON array,
// or throws an error whose message says what went wrong.
async function callSafeMeds(path) {
  if (!PARTNER_URL) {
    throw new Error("PARTNER_URL is not set in .env");
  }

  const headers = {};
  if (PARTNER_API_KEY) headers["X-API-Key"] = PARTNER_API_KEY;

  const response = await fetch(`${PARTNER_URL}${path}`, { headers });

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
router.get("/alerts", async (req, res) => {
  const { estate } = req.query;

  if (!estate || typeof estate !== "string" || !estate.trim()) {
    return res.status(400).json({ message: "estate is required" });
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD, as SafeMeds expects

  try {
    const alerts = await callSafeMeds(
      `/health-signals/area-alerts?region=${encodeURIComponent(estate.trim())}&since=${since}`
    );

    // SafeMeds currently ignores `since` and can return older alerts,
    // so Maji keeps only alerts detected on or after `since` itself.
    const recent = alerts.filter(
      (alert) => alert.detectedAt && alert.detectedAt.slice(0, 10) >= since
    );

    res.json(
      recent.map((alert) => ({
        alertId: alert.alertId,
        illnessType: alert.illnessType,
        severity: alert.severity,
        detectedAt: alert.detectedAt,
      }))
    );
  } catch (err) {
    partnerUnavailable(res, "alerts", err);
  }
});

// GET /api/health/products
// Water-purification products, highest rated first.
router.get("/products", async (req, res) => {
  try {
    const products = await callSafeMeds("/products/water-purification?sort=rating");

    res.json(
      products.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
      }))
    );
  } catch (err) {
    partnerUnavailable(res, "products", err);
  }
});

// GET /api/health/chlorine
// Chlorine tablets currently in stock at SafeMeds.
router.get("/chlorine", async (req, res) => {
  try {
    const items = await callSafeMeds("/inventory?product=chlorine-tablets&available=true");

    res.json(
      items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        availableQuantity: item.availableQuantity,
        isAvailable: item.isAvailable,
      }))
    );
  } catch (err) {
    partnerUnavailable(res, "chlorine stock", err);
  }
});

module.exports = router;
