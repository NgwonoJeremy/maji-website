import { useState } from 'react';

const paymentMethods = ['M-Pesa', 'Cash'];

function Payment({ totalAmount }) {
  const [phoneNumber,    setPhoneNumber]    = useState('');
  const [paymentMethod,  setPaymentMethod]  = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  function handlePayment() {

    if (!paymentMethod) {
      setPaymentMessage('Please choose a payment method.');
      return;
    }

    if (!totalAmount || totalAmount <= 0) {
      setPaymentMessage('Please place an order first.');
      return;
    }


    if (paymentMethod === 'M-Pesa') {
      if (!phoneNumber.trim()) {
        setPaymentMessage('Please enter your M-Pesa phone number.');
        return;
      }
      if (!/^(07|01)\d{8}$/.test(phoneNumber.replace(/\s/g, ''))) {
        setPaymentMessage('Enter a valid Kenyan number (07XX or 01XX).');
        return;
      }
      setPaymentMessage(
        `Payment request of KSh ${totalAmount} sent to ${phoneNumber}.`
      );
      return;
    }

    if (paymentMethod === 'Cash') {
      setPaymentMessage(
        `Cash payment of KSh ${totalAmount} will be collected on delivery.`
      );
    }
  }

  return (
    <section className="panel payment-panel">
      <h2>Payment</h2>
      <p className="eyebrow">PAY WITH M-PESA OR CASH</p>

      <div className="payment-options">

        <div className="payment-option-section">
          <h3>Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Choose payment method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        
        <div className="payment-option-section">
          <h3>Amount</h3>
          <p className="payment-amount">
            {totalAmount > 0
              ? `KSh ${totalAmount.toFixed(2)}`
              : 'Place an order first'}
          </p>
        </div>

        {paymentMethod === 'M-Pesa' && (
          <div className="payment-option-section phone-section">
            <h3>Phone Number</h3>
            <input
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
            />
          </div>
        )}

      </div>

      <button
        type="button"
        className="payment-button"
        onClick={handlePayment}
      >
        Send Payment Request
      </button>

      {paymentMessage && (
        <p className="payment-message">{paymentMessage}</p>
      )}
    </section>
  );
}

export default Payment;