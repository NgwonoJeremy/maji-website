import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AllVendors.css';

const AllVendors = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/vendors");
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setVendors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        setError("Failed to load vendors. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="all-vendors-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">All Vendors</h1>
        <div className="vendor-count">Total: {vendors.length} vendors</div>
      </div>

      {loading && <p>Loading vendors...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="vendor-table full-table">
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Vendor Name</th>
                <th>Business Name</th>
                <th>Location</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 && (
                <tr>
                  <td colSpan="5">No vendors yet.</td>
                </tr>
              )}
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="vendor-row">
                  <td className="vendor-id">{vendor.id}</td>
                  <td className="vendor-name">{vendor.vendor_name}</td>
                  <td className="vendor-business">{vendor.business_name || "—"}</td>
                  <td className="vendor-location">{vendor.estate}</td>
                  <td className="vendor-status">{vendor.is_verified ? "Verified" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllVendors;
