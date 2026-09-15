import { useState } from 'react';



const deliveryTimeOptions = [
  'Morning (6am - 12pm)',
  'Afternoon (12pm - 6pm)',
  'Evening (6pm - 12am)',
];

function OrderWater({onOrderPlaced}) {
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [loading, setLoading]= useState(false);


  const totalAmount =quantity ? Number(quantity) *0.5:0;
  const handlePlaceOrder= async() => {
    setOrderMessage(''); 
    if (!location || !quantity || !deliveryTime) {
      setOrderMessage('Please fill in all fields.');
      return;
    }
    const litres =Number(quantity);
    
    if (litres <= 0 || litres > 10000) {
      setOrderMessage('Please enter a quantity between 1 and 10,000 litres.');
      return;
    }
    setLoading(true);
    setOrderMessage('');
    
    try {
      const user=JSON.parse(localStorage.getItem("maji_user"));

      if(!user) {
        setOrderMessage('You must be logged in to place an order.');
        return;
      }

      const response = await fetch("http://localhost:3001/api/orders",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify ({
          customerId: user.id,
          vendorId: null,
          estate: location,
          volume: litres,
          deliveryTime: deliveryTime,
          totalAmount: totalAmount,
          paymentMethod: "cash",
        }),
      });

      const data = await response.json ();
      if (!response.ok) {
        setOrderMessage(data.message || "Failed to place order.");
        return;
      }
      if (onOrderPlaced) {
        onOrderPlaced(totalAmount);
      }
      setOrderMessage(
        `Order placed successfully! ${litres}L to ${location}, delivery: ${deliveryTime}. Total: KSh ${totalAmount}`
      );

      setLocation('');
      setQuantity('');
      setDeliveryTime('');
    } catch (err) {
      setOrderMessage ('Cannot connect to server.Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel order-panel">
      <h2>Order Water</h2>
      <p className="eyebrow">LOCATION, QUANTITY, DELIVERY TIME</p>

      <div className="order-options">
        <div className="order-option-section">
          <h3>Location</h3>
          <input
           type="text"
           value={location}
           onChange={(event)=> setLocation(event.target.value)}
           placeholder="Enter a place within Nairobi"
          />
          
        </div>

        <div className="order-option-section">
          <h3>Quantity (Litres)</h3>
          <input
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Enter litres e.g."
          min="1"
          max="10000"
          />
        </div>

        <div className="order-option-section">
          <h3>Delivery Time</h3>

          <select
            value={deliveryTime}
            onChange={(event) => setDeliveryTime(event.target.value)}
          >
            <option value="">Choose delivery time</option>
            {deliveryTimeOptions.map((timeOption) => (
              <option key={timeOption} value={timeOption}>
                {timeOption}
              </option>
            ))}
          </select>
        </div>
      </div>

     <button type="button" onClick={handlePlaceOrder} disabled={loading}>
       {loading ? "Placing order..." : "Place Order"}
     </button>

      {orderMessage && <p>{orderMessage}</p>}
    </section>
  );
}

export default OrderWater;