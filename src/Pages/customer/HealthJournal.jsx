import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faStar,
  faCapsules,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";

const API = "http://localhost:3001/api";

// Order status -> existing order-status pill colours
const ORDER_STATUS_CLASS = {
  pending: "status-pending",
  confirmed: "status-processing",
  delivered: "status-delivered",
  cancelled: "status-cancelled",
};

// The logged-in customer, as saved by the login page.
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("maji_user"));
  } catch {
    return null;
  }
}

// Fetches one Maji health route. Each section has its own state,
// so if one SafeMeds endpoint is down, the other sections still load.
async function loadSection(path, setSection) {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const data = await res.json();
    setSection({ status: "ready", data: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error(`Health Journal: ${path} unavailable:`, err.message);
    setSection({ status: "error", data: [] });
  }
}

// Shown in a section when its data could not be loaded.
function Unavailable({ children }) {
  return (
    <div className="journal-notice journal-notice-error">
      <FontAwesomeIcon icon={faTriangleExclamation} className="journal-notice-error-icon" />
      <p>{children}</p>
    </div>
  );
}

function HealthJournal() {
  // estate.status: "loading" | "found" | "none" (no orders yet) | "error"
  const [estate, setEstate] = useState({ status: "loading", name: null });
  const [alerts, setAlerts] = useState({ status: "loading", data: [] });
  const [products, setProducts] = useState({ status: "loading", data: [] });
  const [stock, setStock] = useState({ status: "loading", data: [] });
  const [orders, setOrders] = useState({ status: "loading", data: [] });

  // Ordering: quantity typed per product, which product is being ordered, and the result message.
  const [quantities, setQuantities] = useState({});
  const [placing, setPlacing] = useState(null);
  const [notice, setNotice] = useState(null);

  // Products and stock don't depend on the customer: load straight away.
  useEffect(() => {
    loadSection("/health/products", setProducts);
    loadSection("/health/stock", setStock);
  }, []);

  // The customer's treatment orders.
  useEffect(() => {
    const user = getUser();
    if (!user) return setOrders({ status: "ready", data: [] });
    loadSection(`/health/orders?customerId=${Number(user.id)}`, setOrders);
  }, []);

  // The customer's estate = the estate of their most recent Maji order.
  useEffect(() => {
    const findEstate = async () => {
      try {
        const user = getUser();
        if (!user) return setEstate({ status: "none", name: null });

        const res = await fetch(`${API}/orders`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const allOrders = await res.json();

        const latest = allOrders
          .filter((order) => order.customer_id === user.id)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

        setEstate(latest ? { status: "found", name: latest.estate } : { status: "none", name: null });
      } catch (err) {
        console.error("Health Journal: could not find customer estate:", err.message);
        setEstate({ status: "error", name: null });
      }
    };

    findEstate();
  }, []);

  // Alerts need the estate, so they load once it is known.
  useEffect(() => {
    if (estate.status === "found") {
      loadSection(`/health/alerts?estate=${encodeURIComponent(estate.name)}`, setAlerts);
    }
  }, [estate]);

  // Sends one treatment order through the Maji server to SafeMeds.
  const placeOrder = async (item) => {
    const user = getUser();
    if (!user) {
      return setNotice({ type: "error", text: "Please log in to place an order." });
    }

    const quantity = Number(quantities[item.productId] ?? 1);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return setNotice({ type: "error", text: "Quantity must be a whole number from 1 to 100." });
    }

    setPlacing(item.productId);
    setNotice(null);

    try {
      const res = await fetch(`${API}/health/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(user.id),
          productId: item.productId,
          productName: item.productName,
          quantity,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || `Server responded with ${res.status}`);

      setNotice({
        type: "ok",
        text: `Order #${body.orderId} placed: ${quantity} x ${item.productName}.`,
      });
      loadSection(`/health/orders?customerId=${Number(user.id)}`, setOrders);
    } catch (err) {
      console.error("Health Journal: order failed:", err.message);
      setNotice({
        type: "error",
        text:
          err.message === "Partner data unavailable"
            ? "SafeMeds could not take your order right now. Please try again later."
            : err.message,
      });
    } finally {
      setPlacing(null);
    }
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="dashboard-page">
      <section className="dashboard-frame">
        <Navbar title="Health Journal" />

        <div className="dashboard-content">
          {/* Intro */}
          <section className="panel journal-intro">
            <p className="eyebrow">
              Health Journal{estate.name ? ` · ${estate.name}` : ""} · {today}
            </p>
            <h2 className="journal-title">Safe water doesn't stop at delivery</h2>
            <p>
              What is happening in your estate, which products make water safe to drink,
              and where to order water treatment tablets today.
            </p>
          </section>

          {/* In your area */}
          <section className="panel journal-panel journal-full">
            <h2>In your area</h2>
            <p className="eyebrow">Waterborne illness alerts</p>

            {estate.status === "loading" && <p>Loading alerts...</p>}

            {estate.status === "none" && (
              <div className="journal-notice">
                <p>Place an order so we can show health alerts for your estate.</p>
              </div>
            )}

            {estate.status === "error" && (
              <Unavailable>We couldn't find your estate right now. Please try again later.</Unavailable>
            )}

            {estate.status === "found" && alerts.status === "loading" && <p>Loading alerts...</p>}

            {estate.status === "found" && alerts.status === "error" && (
              <Unavailable>Health alerts are unavailable right now. Please try again later.</Unavailable>
            )}

            {estate.status === "found" && alerts.status === "ready" && alerts.data.length === 0 && (
              <div className="journal-notice journal-notice-ok">
                <FontAwesomeIcon icon={faCircleCheck} className="journal-notice-icon" />
                <div>
                  <h3>No alerts on record for {estate.name}</h3>
                  <p>SafeMeds has no waterborne illness spikes for this estate in the last 7 days.</p>
                </div>
              </div>
            )}

            {estate.status === "found" && alerts.status === "ready" && alerts.data.length > 0 && (
              <>
                <div className="history-list">
                  {alerts.data.map((alert) => (
                    <div className="history-item" key={alert.alertId}>
                      <div className="journal-row-main">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="journal-alert-icon" />
                        <div>
                          <h3>{alert.illnessType}</h3>
                          <p>Detected {new Date(alert.detectedAt).toLocaleDateString("en-GB")}</p>
                        </div>
                      </div>
                      <span className="order-status status-cancelled">
                        {alert.prescriptionCount} prescriptions
                        {alert.spikeRatio ? ` · ${alert.spikeRatio}x usual` : ""}
                      </span>
                    </div>
                  ))}
                </div>
                {alerts.data.some((alert) => alert.signalMode === "demo") && (
                  <p className="journal-note">
                    These are demonstration signals from SafeMeds, not confirmed outbreaks.
                  </p>
                )}
              </>
            )}
          </section>

          {/* Make it safe to drink */}
          <section className="panel journal-panel journal-narrow">
            <h2>Make it safe to drink</h2>
            <p className="eyebrow">Top-rated water treatment products</p>

            {products.status === "loading" && <p>Loading products...</p>}

            {products.status === "error" && (
              <Unavailable>Water treatment products are unavailable right now. Please try again later.</Unavailable>
            )}

            {products.status === "ready" && products.data.length === 0 && (
              <div className="journal-notice">
                <p>No products listed at the moment.</p>
              </div>
            )}

            {products.status === "ready" && products.data.length > 0 && (
              <div className="history-list">
                {products.data.map((product, index) => (
                  <div className="history-item" key={product.productId}>
                    <div className="journal-row-main">
                      <span className="journal-rank">{index + 1}</span>
                      <div>
                        <h3>{product.productName}</h3>
                        <p>{product.reviewCount} reviews</p>
                        {product.topComment && <p className="journal-comment">"{product.topComment}"</p>}
                      </div>
                    </div>
                    <div className="journal-rating">
                      <FontAwesomeIcon icon={faStar} className="journal-star" />
                      <strong>{product.averageRating}</strong>
                      <small>/ 5</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Water treatment tablets in stock, with ordering */}
          <section className="panel journal-panel journal-wide">
            <h2>Water treatment tablets in stock</h2>
            <p className="eyebrow">Order from SafeMeds pharmacies</p>

            {notice && notice.type === "ok" && (
              <div className="journal-notice journal-notice-ok journal-order-notice">
                <FontAwesomeIcon icon={faCircleCheck} className="journal-notice-icon" />
                <p>{notice.text}</p>
              </div>
            )}
            {notice && notice.type === "error" && (
              <div className="journal-order-notice">
                <Unavailable>{notice.text}</Unavailable>
              </div>
            )}

            {stock.status === "loading" && <p>Loading stock...</p>}

            {stock.status === "error" && (
              <Unavailable>Tablet stock is unavailable right now. Please try again later.</Unavailable>
            )}

            {stock.status === "ready" && stock.data.length === 0 && (
              <div className="journal-notice">
                <p>No water treatment tablets in stock right now.</p>
              </div>
            )}

            {stock.status === "ready" && stock.data.length > 0 && (
              <div className="history-list">
                {stock.data.map((item) => (
                  <div className="history-item" key={item.productId}>
                    <div className="journal-row-main">
                      <FontAwesomeIcon icon={faCapsules} className="journal-pill-icon" />
                      <div>
                        <h3>{item.productName}</h3>
                        <p>{item.availableQuantity} units available</p>
                      </div>
                    </div>
                    <div className="journal-order-controls">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        value={quantities[item.productId] ?? 1}
                        onChange={(e) =>
                          setQuantities({ ...quantities, [item.productId]: e.target.value })
                        }
                        aria-label={`Quantity of ${item.productName}`}
                      />
                      <button
                        type="button"
                        onClick={() => placeOrder(item)}
                        disabled={!item.isAvailable || placing === item.productId}
                      >
                        {placing === item.productId ? "Ordering..." : "Order"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* The customer's treatment orders */}
          <section className="panel journal-panel journal-full">
            <h2>Your treatment orders</h2>
            <p className="eyebrow">Placed from the Health Journal and sent to SafeMeds</p>

            {orders.status === "loading" && <p>Loading your orders...</p>}

            {orders.status === "error" && (
              <Unavailable>We couldn't load your orders right now. Please try again later.</Unavailable>
            )}

            {orders.status === "ready" && orders.data.length === 0 && (
              <div className="journal-notice">
                <p>You haven't ordered any water treatment tablets yet.</p>
              </div>
            )}

            {orders.status === "ready" && orders.data.length > 0 && (
              <div className="history-list">
                {orders.data.map((order) => (
                  <div className="history-item" key={order.orderId}>
                    <div className="journal-row-main">
                      <FontAwesomeIcon icon={faCapsules} className="journal-pill-icon" />
                      <div>
                        <h3>{order.productName}</h3>
                        <p>
                          Order #{order.orderId} · {order.quantity} units ·{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`order-status ${
                        ORDER_STATUS_CLASS[String(order.status).toLowerCase()] || "status-pending"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <p className="journal-footer">
            Live data from SafeMeds, fetched through the Maji server.
          </p>
        </div>
      </section>
    </main>
  );
}

export default HealthJournal;
