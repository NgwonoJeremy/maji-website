import { useState, useEffect } from 'react';

function OrderHistory() {
  const [currentOrder,    setCurrentOrder]    = useState(null);
  const [previousOrders,  setPreviousOrders]  = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("maji_user"));
        if (!user) return;

        const res  = await fetch("http://localhost:3001/api/orders");
        const data = await res.json();

        const myOrders = data.filter(
          order => order.customer_id === user.id
        );
        const active = myOrders.find(
          order => order.status !== "delivered" &&
                   order.status !== "cancelled"
        );
        const completed = myOrders.filter(
          order => order.status === "delivered"
        );

        setCurrentOrder(active   || null);
        setPreviousOrders(completed);

      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  if (loading) return <p>Loading orders...</p>;


  return (
    <section className="panel history-panel">
      <h2>Order History</h2>
      <p className="eyebrow">CURRENT ORDER STATUS</p>

      <div className="current-order-box">
        <h3>Current Order</h3>

      
        {currentOrder ? (
          <>
            <p><strong>Order ID:</strong> ORD-{currentOrder.id}</p>
            <p><strong>Status:</strong> {currentOrder.status}</p>
            <p><strong>Quantity:</strong> {currentOrder.volume} Litres</p>
            <p><strong>Location:</strong> {currentOrder.estate}</p>
            <p><strong>Delivery Time:</strong> {currentOrder.delivery_time}</p>
            <p><strong>Total:</strong> KSh {currentOrder.total_amount}</p>
          </>
        ) : (
          <p>No active order at the moment.</p>
        )}
      </div>

      <div className="previous-orders-box">
        <h3>Previous Orders</h3>

        {previousOrders.length === 0 ? (
          <p>No previous orders yet.</p>
        ) : (
          <div className="previous-orders-list">
            {previousOrders.map((order) => (
              <div className="previous-order-item" key={order.id}>
                <div>
                  <strong>ORD-{order.id}</strong>
                  <p>{order.volume} Litres to {order.estate}</p>
                </div>
                <div>
                  <span>{order.status}</span>
                  <p>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}

export default OrderHistory;