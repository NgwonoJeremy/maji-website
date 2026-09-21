import './styles/Admin_dash.css';
import { useNavigate } from 'react-router-dom';
import React,{useState, useEffect} from 'react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const[vendors, setVendors]=useState([]);
  const[orders, setOrders]=useState([]);
  const[loading,setLoading]=useState([]);
  const[error,setError]=useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, vendorsRes] = await Promise.all([
          fetch("http://localhost:3001/api/orders"),
          fetch("http://localhost:3001/api/vendors"),
        ]);

        const ordersData  = await ordersRes.json();
        const vendorsData = await vendorsRes.json();

        setOrders(ordersData);
        setVendors(vendorsData);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load data. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  // Show only first 5 items
  const displayedOrders = orders.slice(0, 5);
  const displayedVendors = vendors.slice(0, 5);

  const totalRevenue = orders.reduce(
    (sum,order) => sum + Number(order.total_Amount ||0),0
  );
  if (loading) {
    return (
      <div className="admin-body">
        <div className="main-body">
          <p>Loading Dashbord data ...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="admin-body">
        <div className="main-body">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-body">
      <div className="main-body">
        <h1 className="dash-title">Admin Dashboard</h1>
        
        <section className="orders-container">
          <div className="table-header-wrapper">
            <h2 className="table-heading">ORDERS TABLE</h2>
            <button 
              className="view-all-btn" 
              onClick={() => navigate('/orders')}
            >
              VIEW ALL
            </button>
          </div>
          <table className="orders-table">
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
              {displayedOrders.map((order, index) => (
                <tr key={index} className="order-row">
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
          <div className="table-footer">
            <span>Showing 5 of {orders.length} orders</span>
          </div>
        </section>
        
        <section className="vendor-container">
          <div className="table-header-wrapper">
            <h2 className="table-heading">VENDOR VERIFICATION</h2>
            <button 
              className="view-all-btn" 
              onClick={() => navigate('/vendors')}
            >
              VIEW ALL
            </button>
          </div>
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Vendor Name</th>
                <th>Location</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedVendors.map((vendor, index) => (
                <tr key={index} className="vendor-row">
                  <td className="vendor-id">{vendor.id}</td>
                  <td className="vendor-name">{vendor.vendor_name}</td>
                  <td className="vendor-location">{vendor.estate}</td>
                  <td className="vendor-status">{vendor.is_verified ? "Verified" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span>Showing 5 of {vendors.length} vendors</span>
          </div>
        </section>

        <section className="analytics-section">
          <div className="analytics-container">
            <div className="total-revenue">
              <h4>Total Revenue</h4>
              <p>KSH {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="total-orders">
              <h4>Total Orders</h4>
              <p>{orders.length}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;