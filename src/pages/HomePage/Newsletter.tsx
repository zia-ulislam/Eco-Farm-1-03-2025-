import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore'; 
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase'; // Import the analytics instance

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setPopupMessage('Please enter a valid email.');
      setIsSuccess(false);
      setShowPopup(true);

      // Log an event for invalid email submission
      logEvent(analytics, 'newsletter_invalid_email', {
        message: 'User tried to subscribe with an invalid email.',
      });

      return;
    }

    try {
      // Add the email to Firestore
      await addDoc(collection(db, 'subscribers'), {
        email,
        timestamp: new Date().toISOString(), // Add a timestamp for reference
      });

      // Show success popup
      setPopupMessage('Thank you for subscribing to our newsletter!');
      setIsSuccess(true);
      setEmail('');

      // Log an event for successful subscription
      logEvent(analytics, 'newsletter_subscribe_success', {
        email, // Include the email in the event parameters (optional)
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      setPopupMessage('Failed to subscribe. Please try again.');
      setIsSuccess(false);

      // Log an event for subscription failure
      logEvent(analytics, 'newsletter_subscribe_failure', {
        errorMessage: error.message, // Include the error message in the event parameters
      });
    }

    // Show the popup
    setShowPopup(true);

    // Hide the popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <section className="newsletter-section">
      {/* Popup Message */}
      {showPopup && (
        <div className={`popup ${isSuccess ? 'success' : 'error'}`}>
          <p>{popupMessage}</p>
        </div>
      )}

      <div className="newsletter-content">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for the latest farming tips and product updates</p>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;