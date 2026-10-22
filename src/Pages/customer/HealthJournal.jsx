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

// Severity -> existing order-status pill colours
const SEVERITY_CLASS = {
  low: "status-processing",
  moderate: "status-pending",
  high: "status-cancelled",
  critical: "status-cancelled",
};

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
  const [chlorine, setChlorine] = useState({ status: "loading", data: [] });

  // Products and chlorine stock don't depend on the customer: load straight away.
  useEffect(() => {
    loadSection("/health/products", setProducts);
    loadSection("/health/chlorine", setChlorine);
  }, []);

  // The customer's estate = the estate of their most recent Maji order.
  useEffect(() => {
    const findEstate = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("maji_user"));
        if (!user) return setEstate({ status: "none", name: null });

        const res = await fetch(`${API}/orders`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const orders = await res.json();

        const latest = orders
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
              and where to find chlorine tablets today.
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
                  <p>SafeMeds has no waterborne illness reports for this estate in the last 30 days.</p>
                </div>
              </div>
            )}

            {estate.status === "found" && alerts.status === "ready" && alerts.data.length > 0 && (
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
                    <span className={`order-status ${SEVERITY_CLASS[alert.severity] || "status-pending"}`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Make it safe to drink */}
          <section className="panel journal-panel journal-wide">
            <h2>Make it safe to drink</h2>
            <p className="eyebrow">Top-rated water purification products</p>

            {products.status === "loading" && <p>Loading products...</p>}

            {products.status === "error" && (
              <Unavailable>Water purification products are unavailable right now. Please try again later.</Unavailable>
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

          {/* Where to find chlorine tablets */}
          <section className="panel journal-panel journal-narrow">
            <h2>Where to find chlorine tablets</h2>
            <p className="eyebrow">Available at SafeMeds pharmacies</p>

            {chlorine.status === "loading" && <p>Loading stock...</p>}

            {chlorine.status === "error" && (
              <Unavailable>Chlorine tablet stock is unavailable right now. Please try again later.</Unavailable>
            )}

            {chlorine.status === "ready" && chlorine.data.length === 0 && (
              <div className="journal-notice">
                <p>No chlorine tablets in stock right now.</p>
              </div>
            )}

            {chlorine.status === "ready" && chlorine.data.length > 0 && (
              <div className="history-list">
                {chlorine.data.map((item) => (
                  <div className="history-item" key={item.productId}>
                    <div className="journal-row-main">
                      <FontAwesomeIcon icon={faCapsules} className="journal-pill-icon" />
                      <div>
                        <h3>{item.productName}</h3>
                        <p>{item.availableQuantity} units available</p>
                      </div>
                    </div>
                    <span className={`order-status ${item.isAvailable ? "status-delivered" : "status-cancelled"}`}>
                      {item.isAvailable ? "In stock" : "Out of stock"}
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
