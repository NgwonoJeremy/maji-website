import { useState } from 'react';

const paymentMethods = ['M-Pesa','Cash'];
const paymentAmounts = ['KSh 350', 'KSh 700', 'KSh 1050'];

function Payment() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  function handlePayment() {
  if (!paymentMethod || !amount) {
    setPaymentMessage('Please choose payment method and amount.');
    return;
  }

  if (paymentMethod === 'M-Pesa' && !phoneNumber) {
    setPaymentMessage('Please enter your M-Pesa phone number.');
    return;
  }

  if (paymentMethod === 'Cash') {
    setPaymentMessage(`Cash payment of ${amount} will be made on delivery.`);
    return;
  }

  setPaymentMessage(
    `Payment request sent to ${phoneNumber} for ${amount} using ${paymentMethod}.`
  );
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
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="">Choose payment method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="payment-option-section phone-selection">
          <h3>Amount</h3>

          <select
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          >
            <option value="">Choose amount</option>
            {paymentAmounts.map((paymentAmount) => (
              <option key={paymentAmount} value={paymentAmount}>
                {paymentAmount}
              </option>
            ))}
          </select>
        </div>

        {paymentMethod === 'M-Pesa' && (
            <div className="payment-option-section phone-section">
                <h3>Phone Number</h3>

                <input
                    type="tel"
                    placeholder="e.g., 0712345678"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                />
            </div>
        )}
      </div>
      
      <button type="button" className="payment-button" onClick={handlePayment}>
        Send Payment Request
      </button>

      {paymentMessage && <p className="payment-message">{paymentMessage}</p>}
    </section>
  );
}

export default Payment;