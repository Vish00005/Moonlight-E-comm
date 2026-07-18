import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3 className="footer-title">MoonLight</h3>
          <p className="footer-desc">
            Curated minimalist accessories for everyday elegance. Discover your inner radiance with our exclusive collections.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Explore</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/#new-arrivals">New Arrivals</a></li>
            <li><a href="/cart">Cart</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Contact</h4>
          <ul className="footer-links">
            <li>Email: support@moonlight.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Address: 123 Elegance Ave, NY</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MoonLight. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
