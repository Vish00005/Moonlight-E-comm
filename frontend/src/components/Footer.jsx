import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3 className="footer-title">MoonLight</h3>
          <p className="footer-desc">
            Curated minimalist accessories for everyday elegance. Discover your
            inner radiance with our exclusive collections.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Explore</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/#new-arrivals">New Arrivals</a>
            </li>
            <li>
              <a href="/cart">Cart</a>
            </li>
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
        <p>
          &copy; {new Date().getFullYear()} MoonLight Jewels. All rights
          reserved.
        </p>
        <p
          style={{
            marginTop: "8px",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
          }}
        >
          Built with ❤️ by{" "}
          <a
            href="https://kiki-web-tech.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-color)",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            KIKI Tech Solutions
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
