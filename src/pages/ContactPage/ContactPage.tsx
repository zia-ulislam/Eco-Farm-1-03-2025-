// ContactPage.tsx
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import './ContactPage.css';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to backend or email service)
    alert('Message sent successfully!');
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <h1>Contact Us</h1>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="contact-form">
        <h2>Send Us a Message</h2>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <input type="text" placeholder="Subject" />
        <textarea placeholder="Your Message" rows="5" required></textarea>
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