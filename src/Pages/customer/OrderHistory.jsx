const currentOrder = {
  orderId: 'ORD-1024',
  status: 'Out for delivery',
  quantity: '100 Liters',
  location: 'Kilimani',
  deliveryTime: 'Afternoon (12pm - 6pm)',
  eta: '25 minutes',
};

const previousOrders = [
  {
    id: 'ORD-1019',
    quantity: '50 Liters',
    location: 'Westlands',
    date: '2026-06-15',
    status: 'Delivered',
  },
  {
    id: 'ORD-1012',
    quantity: '150 Liters',
    location: 'Embakasi',
    date: '2026-06-12',
    status: 'Delivered',
  },
  {
    id: 'ORD-1008',
    quantity: '100 Liters',
    location: 'Kasarani',
    date: '2026-06-09',
    status: 'Delivered',
  },
];

function OrderHistory() {
  return (
    <section className="panel history-panel">
      <h2>Order History</h2>
      <p className="eyebrow">CURRENT ORDER STATUS</p>

      <div className="current-order-box">
        <h3>Current Order</h3>

        <p>
          <strong>Order ID:</strong> {currentOrder.orderId}
        </p>
        <p>
          <strong>Status:</strong> {currentOrder.status}
        </p>
        <p>
          <strong>Quantity:</strong> {currentOrder.quantity}
        </p>
        <p>
          <strong>Location:</strong> {currentOrder.location}
        </p>
        <p>
          <strong>Delivery Time:</strong> {currentOrder.deliveryTime}
        </p>
        <p>
          <strong>ETA:</strong> {currentOrder.eta}
        </p>
      </div>

      <div className="previous-orders-box">
        <h3>Previous Orders</h3>

        <div className="previous-orders-list">
          {previousOrders.map((order) => (
            <div className="previous-order-item" key={order.id}>
              <div>
                <strong>{order.id}</strong>
                <p>
                  {order.quantity} to {order.location}
                </p>
              </div>

              <div>
                <span>{order.status}</span>
                <p>{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrderHistory;