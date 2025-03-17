import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import './ContactPage.css';
import { db } from '../../firebase'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase'; // Import the analytics instance

const ContactPage = () => {
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data
    const formData = {
      name: e.currentTarget.name.value,
      email: e.currentTarget.email.value,
      subject: e.currentTarget.subject.value,
      message: e.currentTarget.message.value,
      timestamp: new Date().toISOString(), // Add a timestamp for reference
    };

    // Generate a custom document ID
    const customDocId = `${formData.name.replace(/\s+/g, '_')}_${Date.now()}`;

    try {
      // Use the custom document ID with `setDoc`
      await setDoc(doc(db, 'messages', customDocId), formData);

      // Log success event in Firebase Analytics
      logEvent(analytics, 'contact_form_submission_success', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
      });

      // Show success popup
      setPopupMessage('Message sent successfully!');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error sending message:', error);

      // Log failure event in Firebase Analytics
      logEvent(analytics, 'contact_form_submission_failure', {
        errorMessage: error.message,
      });

      // Show error popup
      setPopupMessage('Failed to send message. Please try again.');
      setIsSuccess(false);
    }

    // Show the popup
    setShowPopup(true);

    // Reset the form
    e.currentTarget.reset();

    // Hide the popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <h1>Contact Us</h1>

      {/* Popup Message */}
      {showPopup && (
        <div className={`popup ${isSuccess ? 'success' : 'error'}`}>
          <p>{popupMessage}</p>
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="contact-form">
        <h2>Send Us a Message</h2>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <input type="text" name="subject" placeholder="Subject" />
        <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>

      {/* Contact Information */}
      <div className="contact-info">
        <h2>Our Contact Details</h2>
        <div className="info-item">
          <FaMapMarkerAlt />
          <p>123 Greenway Lane, AgriCity, PK</p>
        </div>
        <div className="info-item">
          <FaEnvelope />
          <p><a href="mailto:support@ecofarm.com">support@ecofarm.com</a></p>
        </div>
        <div className="info-item">
          <FaPhone />
          <p><a href="tel:+123456789">+123 456 789</a></p>
        </div>
      </div>

      {/* Map */}
      <div className="map-section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.758422837192!2d-73.99445328460072!3d40.75004997932871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a3f8b3e8b3%3A0x8fa6f9b2e6f9f9b2!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1698765432109!5m2!1sen!2sus"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;