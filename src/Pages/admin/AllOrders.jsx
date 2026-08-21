import React from 'react';
import { useNavigate } from 'react-router-dom';
import Orders from '../admin/data/Orders.json';
import './styles/AllOrders.css';

const AllOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="all-orders-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">All Orders</h1>
        <div className="order-count">Total: {Orders.length} orders</div>
      </div>

      <div className="table-wrapper">
        <table className="orders-table full-table">
          <thead>
            <tr>
              <th>Order_ID</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Total Cost</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {Orders.map((order, index) => (
              <tr key={index} className="order-row">
                <td className="order-id">{order.ID}</td>
                <td className="customer-name">{order.Customer}</td>
                <td className="location">{order.Location}</td>
                <td className="capacity">{order.Capacity}</td>
                <td className="amount">{order.Amount}</td>
                <td className="status">{order.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;