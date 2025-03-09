import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/" className="logo-link">
            {/* <Leaf className="logo-icon" /> */}
            <img className="logopng" src="/images/logo.png" alt="Eco Farm" />
            <span>Eco Farm</span>
          </Link>
        </div>

        <div className="about-section">
          <h2>About Eco Farm</h2>
          <p>
            Eco Farm is dedicated to sustainable agriculture, helping users grow suitable crops based on their
            local soil and climate conditions. Our AI-based platform aims to empower farmers and gardeners alike
            with data-driven insights for optimal growth.
          </p>
          <div className="social-media">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin />
            </a>
          </div>
        </div>

        <div className="services">
          <h2>Our Services</h2>
          <ul>
            <li><a href="#recommendation">Crop Recommendations</a></li>
            <li><a href="#soil-testing">Soil Testing</a></li>
            <li><a href="#climate-analysis">Climate Analysis</a></li>
            <li><a href="#consultation">Expert Consultation</a></li>
          </ul>
        </div>

        <div className="contact-info">
          <h2>Contact Us</h2>
          <p><strong>Address:</strong> 123 Greenway Lane, AgriCity, PK</p>
          <p><strong>Phone:</strong> <a href="tel:+123456789">+123 456 789</a></p>
          <p><strong>Email:</strong> <a href="mailto:support@ecofarm.com">support@ecofarm.com</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Eco Farm. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;