import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

const vendorPosition = [-1.2921, 36.8219]; // Nairobi CBD
const customerPosition = [-1.3000, 36.7850]; // Example customer location

function TrackOrder() {
  return (
    <section className="panel map-panel">
      <h2>Location</h2>
      <p className="eyebrow">MAP</p>

      <MapContainer
        center={vendorPosition}
        zoom={13}
        className="real-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={vendorPosition}>
          <Popup>Vendor</Popup>
        </Marker>

        <Marker position={customerPosition}>
          <Popup>You</Popup>
        </Marker>

        <Polyline positions={[vendorPosition, customerPosition]} />
      </MapContainer>
    </section>
  );
}

export default TrackOrder;