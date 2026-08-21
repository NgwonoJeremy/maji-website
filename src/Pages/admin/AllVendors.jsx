import React from 'react';
import { useNavigate } from 'react-router-dom';
import Vendors from '../admin/data/Vendor.json';
import './styles/AllVendors.css';

const AllVendors = () => {
  const navigate = useNavigate();

  return (
    <div className="all-vendors-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">All Vendors</h1>
        <div className="vendor-count">Total: {Vendors.length} vendors</div>
      </div>

      <div className="table-wrapper">
        <table className="vendor-table full-table">
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Vendor Name</th>
              <th>Location</th>
              <th>Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {Vendors.map((vendor, index) => (
              <tr key={index} className="vendor-row">
                <td className="vendor-id">{vendor.ID}</td>
                <td className="vendor-name">{vendor.Name}</td>
                <td className="vendor-location">{vendor.Location}</td>
                <td className="vendor-status">{vendor.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllVendors;