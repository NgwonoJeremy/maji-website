import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

const NAIROBI_CENTER = [-1.2921, 36.8219];

function TrackOrder() {
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetchActiveOrder = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("maji_user"));
        if (!user) return;

        const res  = await fetch("http://localhost:3001/api/orders");
        const data = await res.json();

        
        const myOrders = data.filter(o => o.customer_id === user.id);
        const active   = myOrders.find(
          o => o.status !== "delivered" && o.status !== "cancelled"
        );

        setActiveOrder(active || null);
      } catch (err) {
        console.error("Failed to fetch active order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrder();
  }, []);

  if (loading) return <p>Loading map...</p>;

  return (
    <section className="panel map-panel">
      <h2>Location</h2>
      <p className="eyebrow">MAP</p>

      {activeOrder ? (
        <p className="order-status-label">
          Order ORD-{activeOrder.id} — Status: <strong>{activeOrder.status}</strong>
        </p>
      ) : (
        <p className="order-status-label">No active order to track.</p>
      )}

      <MapContainer
        center={NAIROBI_CENTER}
        zoom={13}
        className="real-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={NAIROBI_CENTER}>
          <Popup>
            {activeOrder
              ? `Delivery to ${activeOrder.estate}`
              : 'Nairobi'}
          </Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}

export default TrackOrder;