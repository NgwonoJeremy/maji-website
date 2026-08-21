import { useState } from 'react';

const locationOptions = ['Kilimani', 'Westlands', 'Embakasi', 'Kasarani'];

const quantityOptions = [
  '10 Liters',
  '50 Liters',
  '100 Liters',
  '150 Liters',
  '200 Liters',
  '250 Liters',
  '300 Liters',
];

const deliveryTimeOptions = [
  'Morning (6am - 12pm)',
  'Afternoon (12pm - 6pm)',
  'Evening (6pm - 12am)',
];

function OrderWater() {
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [orderMessage, setOrderMessage] = useState('');

  function handlePlaceOrder() {
    if (!location || !quantity || !deliveryTime) {
      setOrderMessage('Please choose location, quantity, and delivery time.');
      return;
    }

    setOrderMessage(
      `Order placed: ${quantity} to ${location}, delivery time: ${deliveryTime}.`
    );
  }

  return (
    <section className="panel order-panel">
      <h2>Order Water</h2>
      <p className="eyebrow">LOCATION, QUANTITY, DELIVERY TIME</p>

      <div className="order-options">
        <div className="order-option-section">
          <h3>Location</h3>

          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            <option value="">Choose location</option>
            {locationOptions.map((locationOption) => (
              <option key={locationOption} value={locationOption}>
                {locationOption}
              </option>
            ))}
          </select>
        </div>

        <div className="order-option-section">
          <h3>Quantity</h3>

          <select
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          >
            <option value="">Choose quantity</option>
            {quantityOptions.map((quantityOption) => (
              <option key={quantityOption} value={quantityOption}>
                {quantityOption}
              </option>
            ))}
          </select>
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

      <button type="button" onClick={handlePlaceOrder}>
        Place Order
      </button>

      {orderMessage && <p>{orderMessage}</p>}
    </section>
  );
}

export default OrderWater;