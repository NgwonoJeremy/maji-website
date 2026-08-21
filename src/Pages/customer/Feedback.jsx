import { useState } from 'react';

const ratingOptions = [1, 2, 3, 4, 5];

function Feedback() {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  function handleSubmitFeedback() {
    if (!rating) {
      setFeedbackMessage('Please choose a rating before submitting.');
      return;
    }

    setFeedbackMessage(`Thank you for rating your last order ${rating}/5.`);
  }

  return (
    <section className="panel feedback-panel">
      <h2>Feedback</h2>
      <p className="eyebrow">RATINGS</p>

      <div className="feedback-card">
        <div className="feedback-summary">
          <div>
            <h3>Last Order</h3>
            <p>Delivered successfully</p>
          </div>

          <span>5/5</span>
        </div>

        <div className="feedback-form">
          <div className="feedback-field">
            <h3>Your Rating</h3>

            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="">Choose rating</option>
              {ratingOptions.map((ratingOption) => (
                <option key={ratingOption} value={ratingOption}>
                  {ratingOption}/5
                </option>
              ))}
            </select>
          </div>

          <div className="feedback-field">
            <h3>Comment</h3>

            <textarea
              placeholder="Write your feedback"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          className="feedback-button"
          onClick={handleSubmitFeedback}
        >
          Submit Feedback
        </button>

        {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
      </div>
    </section>
  );
}

export default Feedback;