import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AllOrders.css';

const AllOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/orders");
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="all-orders-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">All Orders</h1>
        <div className="order-count">Total: {orders.length} orders</div>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6">No orders yet.</td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="order-row">
                  <td className="order-id">{order.id}</td>
                  <td className="customer-name">{order.customer_name}</td>
                  <td className="location">{order.estate}</td>
                  <td className="capacity">{order.volume}</td>
                  <td className="amount">{order.total_amount}</td>
                  <td className="status">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
