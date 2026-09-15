import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VendorDashboard.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const NAIROBI_CENTER = [-1.2921, 36.8219];
const STATUS_CLASS = {
  pending:      'vd-status-badge--pending',
  accepted:     'vd-status-badge--accepted',
  'on the way': 'vd-status-badge--accepted',
  delivered:    'vd-status-badge--delivered',
  cancelled:    'vd-status-badge--pending',
};

const VendorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("maji_user"));

  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [profile,       setProfile]       = useState({
    businessName:   user?.name || "Vendor",
    ownerName:      user?.name || "Vendor",
    estateCoverage: "Nairobi",
    capacityLiters: "2000",
  });
  const [vendorMetrics, setVendorMetrics] = useState({
    isAcceptingOrders: true,
    basePrice:         500,
    totalEarnings:     0,
    litersDelivered:   0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const ordersRes  = await fetch("http://localhost:3001/api/orders");
        const ordersData = await ordersRes.json();

        const myOrders = ordersData.filter(
          order => order.vendor_id === user.id
        );

        setOrders(myOrders);

        const delivered = myOrders.filter(o => o.status === "delivered");

        const earnings = delivered.reduce(
          (sum, o) => sum + Number(o.total_amount || 0), 0
        );
        const litres = delivered.reduce(
          (sum, o) => sum + Number(o.volume || 0), 0
        );

        setVendorMetrics(prev => ({
          ...prev,
          totalEarnings:   earnings,
          litersDelivered: litres,
        }));

        const vendorsRes  = await fetch("http://localhost:3001/api/vendors");
        const vendorsData = await vendorsRes.json();
        const myProfile   = vendorsData.find(v => v.user_id === user.id);

        if (myProfile) {
          setProfile({
            businessName:   myProfile.business_name  || user.name,
            ownerName:      myProfile.owner_name     || user.name,
            estateCoverage: myProfile.estate         || "Nairobi",
            capacityLiters: myProfile.daily_capacity || "2000",
          });
        }

      } catch (err) {
        console.error("Failed to fetch vendor data:", err);
        setError("Failed to load data. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/orders/${orderId}/status`,
        {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ status: nextStatus }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update order status");
        return;
      }

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: nextStatus }
            : order
        )
      );

      if (nextStatus === "delivered") {
        const deliveredOrder = orders.find(o => o.id === orderId);
        setVendorMetrics(prev => ({
          ...prev,
          totalEarnings:   prev.totalEarnings + Number(deliveredOrder?.total_amount || 0),
          litersDelivered: prev.litersDelivered + Number(deliveredOrder?.volume || 0),
        }));
      }

    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const toggleStoreStatus = () => {
    setVendorMetrics(prev => ({
      ...prev,
      isAcceptingOrders: !prev.isAcceptingOrders
    }));
  };

  const handlePriceChange = (e) => {
    setVendorMetrics(prev => ({
      ...prev,
      basePrice: parseInt(e.target.value) || 0
    }));
  };

  if (loading) {
    return (
      <div className="vd-container">
        <p style={{ padding: "2rem" }}>Loading vendor dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vd-container">
        <p style={{ padding: "2rem", color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="vd-container">

      <header className="vd-header">
        <div>
          <h1 className="vd-title">{profile.businessName} Portal</h1>
          <p className="vd-subtitle">
            Manage your incoming water fulfillment queues
          </p>
          <p className="vd-coverage-tag">
            📍 Covering <b>{profile.estateCoverage}</b> · Registered capacity:{" "}
            <b>{profile.capacityLiters} L/day</b>
          </p>
        </div>
        <div className="vd-toggle-wrapper">
          <span className={`vd-status-label ${
            vendorMetrics.isAcceptingOrders
              ? 'vd-status-label--online'
              : 'vd-status-label--offline'
          }`}>
            {vendorMetrics.isAcceptingOrders
              ? "● Online & Accepting Orders"
              : "○ Offline / Closed"}
          </span>
          <button
            onClick={toggleStoreStatus}
            className={`vd-action-btn ${
              vendorMetrics.isAcceptingOrders
                ? 'vd-action-btn--online'
                : 'vd-action-btn--offline'
            }`}
          >
            Toggle Status
          </button>
        </div>
      </header>

      <section className="vd-stats-grid">
        <div className="vd-stat-card">
          <span className="vd-stat-label">Total Revenue</span>
          <p className="vd-stat-value vd-stat-value--green">
            Ksh {vendorMetrics.totalEarnings.toLocaleString()}
          </p>
        </div>
        <div className="vd-stat-card">
          <span className="vd-stat-label">Volume Dispatched</span>
          <p className="vd-stat-value vd-stat-value--blue">
            {vendorMetrics.litersDelivered} Liters
          </p>
        </div>
        <div className="vd-stat-card">
          <span className="vd-stat-label">Active Workload</span>
          <p className="vd-stat-value vd-stat-value--yellow">
            {orders.filter(o => o.status !== 'delivered').length} Orders
          </p>
        </div>
      </section>

      <div className="vd-main-grid">

        <section className="vd-orders-card">
          <h2 className="vd-section-heading">
            Incoming Order Dispatch Queue
          </h2>

          {orders.length === 0 ? (
            <p style={{ padding: "1rem", color: "#888" }}>
              No orders assigned to you yet.
            </p>
          ) : (
            <div className="vd-table-scroll">
              <table className="vd-table">
                <thead>
                  <tr className="vd-table-head-row">
                    <th className="vd-th">Order ID</th>
                    <th className="vd-th">Customer</th>
                    <th className="vd-th">Location</th>
                    <th className="vd-th">Volume</th>
                    <th className="vd-th">Status</th>
                    <th className="vd-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="vd-table-row">
                      <td className="vd-td vd-td--strong">MAJI-{order.id}</td>
                      <td className="vd-td">{order.customer_name}</td>
                      <td className="vd-td">{order.estate}</td>
                      <td className="vd-td">{order.volume} L</td>
                      <td className="vd-td">
                        <span className={`vd-status-badge ${STATUS_CLASS[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="vd-td">
                        {order.status === "pending" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "accepted")}
                            className="vd-small-btn vd-small-btn--accept"
                          >
                            Accept
                          </button>
                        )}
                        {order.status === "accepted" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "on the way")}
                            className="vd-small-btn vd-small-btn--deliver"
                          >
                            On the Way
                          </button>
                        )}
                        {order.status === "on the way" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className="vd-small-btn vd-small-btn--deliver"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.status === "delivered" && (
                          <span className="vd-complete-label">Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="vd-section-heading vd-section-heading--spaced">
            Delivery Coverage Map
          </h2>
          <div className="vd-map-wrapper">
            <MapContainer center={NAIROBI_CENTER} zoom={13}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker
                center={NAIROBI_CENTER}
                radius={28}
                pathOptions={{
                  color:       '#3b82f6',
                  fillColor:   '#3b82f6',
                  fillOpacity: 0.15,
                  weight:      2
                }}
              >
                <Popup>Coverage area: {profile.estateCoverage}</Popup>
              </CircleMarker>
            </MapContainer>
          </div>
        </section>

        <section className="vd-config-card">
          <h2 className="vd-section-heading">Refill Unit Config</h2>
          <div className="vd-field-group">
            <label className="vd-label">
              Rate per 20L Refill Bottle (Ksh)
            </label>
            <input
              type="number"
              value={vendorMetrics.basePrice}
              onChange={handlePriceChange}
              className="vd-input"
            />
            <p className="vd-input-hint">
              Changes will instantly reflect across customer browsing maps.
            </p>
          </div>
          <div className="vd-info-box">
            <h4 className="vd-info-box-title">Compliance Status</h4>
            <p className="vd-info-box-text">
              ✓ KEBS Safety Verification verified valid until Dec 2026.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default VendorDashboard;