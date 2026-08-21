import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VendorDashboard.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const ESTATE_COORDS = {
  'Greenwood Estates': [-1.3010, 36.7890],
  'Kilimani Heights': [-1.2917, 36.7856],
  'South C Enclave': [-1.3167, 36.8283]
};
const NAIROBI_CENTER = [-1.2921, 36.8219];

const DEMO_PROFILE = {
  businessName: 'AquaPure Springs Ltd',
  ownerName: 'Demo Vendor',
  phone: '0700 000 000',
  estateCoverage: 'Greenwood Estates',
  capacityLiters: '2000'
};

const findEstateCoords = (address) => {
  const match = Object.keys(ESTATE_COORDS).find(estate => address.includes(estate));
  return match ? ESTATE_COORDS[match] : null;
};

// Maps an order status to the modifier class used for its badge/action styling.
const STATUS_CLASS = {
  Pending: 'vd-status-badge--pending',
  Accepted: 'vd-status-badge--accepted',
  Delivered: 'vd-status-badge--delivered'
};

const VendorDashboard = () => {
  const [profile, setProfile] = useState(DEMO_PROFILE);
  const [isDemoData, setIsDemoData] = useState(true);

  // Operational metrics not covered by registration (would come from your backend)
  const [vendorMetrics, setVendorMetrics] = useState({
    isAcceptingOrders: true,
    basePrice: 500,
    totalEarnings: 42500,
    litersDelivered: 1720
  });

  const [orders, setOrders] = useState([
    { id: "MAJI-9821", customer: "Alex Amina", address: "Greenwood Estates, Block B", quantity: "3 x 20L", total: 1500, status: "Pending" },
    { id: "MAJI-9822", customer: "Sarah Ochieng", address: "Greenwood Estates, Apt 4C", quantity: "1 x 20L", total: 500, status: "Accepted" },
    { id: "MAJI-9740", customer: "Michael Kamau", address: "Kilimani Heights, Rm 12", quantity: "2 x 20L", total: 1000, status: "Delivered" }
  ]);

  // Pull in whatever VendorRegister saved. Falls back to demo data if the
  // vendor landed here directly without registering yet.
  useEffect(() => {
    const stored = localStorage.getItem('majiVendorProfile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setIsDemoData(false);
      } catch {
        // malformed data in storage — keep demo fallback
      }
    }
  }, []);

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
  };

  const toggleStoreStatus = () => {
    setVendorMetrics(prev => ({ ...prev, isAcceptingOrders: !prev.isAcceptingOrders }));
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value) || 0;
    setVendorMetrics(prev => ({ ...prev, basePrice: newPrice }));
  };

  const coverageCoords = ESTATE_COORDS[profile.estateCoverage] || NAIROBI_CENTER;

  return (
    <div className="vd-container">
      {isDemoData && (
        <div className="vd-demo-banner">
          Showing demo data — no registered vendor profile found in this browser. Register a station to see your own info here.
        </div>
      )}

      {/* Dashboard Top Header Bar */}
      <header className="vd-header">
        <div>
          <h1 className="vd-title">{profile.businessName} Portal</h1>
          <p className="vd-subtitle">Manage your incoming water fulfillment queues</p>
          <p className="vd-coverage-tag">
            📍 Covering <b>{profile.estateCoverage}</b> · Registered capacity: <b>{profile.capacityLiters} L/day</b>
          </p>
        </div>
        <div className="vd-toggle-wrapper">
          <span className={`vd-status-label ${vendorMetrics.isAcceptingOrders ? 'vd-status-label--online' : 'vd-status-label--offline'}`}>
            {vendorMetrics.isAcceptingOrders ? "● Online & Accepting Orders" : "○ Offline / Closed"}
          </span>
          <button
            onClick={toggleStoreStatus}
            className={`vd-action-btn ${vendorMetrics.isAcceptingOrders ? 'vd-action-btn--online' : 'vd-action-btn--offline'}`}
          >
            Toggle Status
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="vd-stats-grid">
        <div className="vd-stat-card">
          <span className="vd-stat-label">Total Revenue</span>
          <p className="vd-stat-value vd-stat-value--green">Ksh {vendorMetrics.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="vd-stat-card">
          <span className="vd-stat-label">Volume Dispatched</span>
          <p className="vd-stat-value vd-stat-value--blue">{vendorMetrics.litersDelivered} Liters</p>
        </div>
        <div className="vd-stat-card">
          <span className="vd-stat-label">Active Workload</span>
          <p className="vd-stat-value vd-stat-value--yellow">
            {orders.filter(o => o.status !== 'Delivered').length} Orders
          </p>
        </div>
      </section>

      {/* Control Panel / Pricing Configuration Layout */}
      <div className="vd-main-grid">
        <section className="vd-orders-card">
          <h2 className="vd-section-heading">Incoming Order Dispatch Queue</h2>
          <div className="vd-table-scroll">
            <table className="vd-table">
              <thead>
                <tr className="vd-table-head-row">
                  <th className="vd-th">Order ID</th>
                  <th className="vd-th">Customer</th>
                  <th className="vd-th">Address</th>
                  <th className="vd-th">Items</th>
                  <th className="vd-th">Status</th>
                  <th className="vd-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="vd-table-row">
                    <td className="vd-td vd-td--strong">{order.id}</td>
                    <td className="vd-td">{order.customer}</td>
                    <td className="vd-td">{order.address}</td>
                    <td className="vd-td">{order.quantity}</td>
                    <td className="vd-td">
                      <span className={`vd-status-badge ${STATUS_CLASS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="vd-td">
                      {order.status === 'Pending' && (
                        <button onClick={() => updateOrderStatus(order.id, 'Accepted')} className="vd-small-btn vd-small-btn--accept">Accept</button>
                      )}
                      {order.status === 'Accepted' && (
                        <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="vd-small-btn vd-small-btn--deliver">Mark Delivered</button>
                      )}
                      {order.status === 'Delivered' && <span className="vd-complete-label">Complete</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delivery Coverage Map */}
          <h2 className="vd-section-heading vd-section-heading--spaced">Delivery Coverage Map</h2>
          <div className="vd-map-wrapper">
            <MapContainer center={coverageCoords} zoom={13}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker
                center={coverageCoords}
                radius={28}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 2 }}
              >
                <Popup>Your registered coverage: {profile.estateCoverage}</Popup>
              </CircleMarker>
              {orders.map((order) => {
                const coords = findEstateCoords(order.address);
                if (!coords) return null;
                return (
                  <Marker key={order.id} position={coords}>
                    <Popup>
                      <b>{order.id}</b><br />
                      {order.customer}<br />
                      {order.address}<br />
                      Status: {order.status}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>

        {/* Pricing Inventory Config Sidebar Panel */}
        <section className="vd-config-card">
          <h2 className="vd-section-heading">Refill Unit Config</h2>
          <div className="vd-field-group">
            <label className="vd-label">Rate per 20L Refill Bottle (Ksh)</label>
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
            <p className="vd-info-box-text">✓ KEBS Safety Verification verified valid until Dec 2026.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VendorDashboard;