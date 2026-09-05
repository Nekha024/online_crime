import React from "react";
import "../css/Footer.css";

import {
  FaShieldAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">

          <div className="footer-logo">
            <FaShieldAlt />
            <span>CrimeAI</span>
          </div>

          <p>
            AI-Based Online Crime Reporting and Analysis System that
            enables secure cybercrime reporting, intelligent complaint
            classification, and faster investigation through Artificial
            Intelligence.
          </p>

        </div>

        <div className="footer-links">

          <h3>Quick Links</h3>

          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>

        </div>

        <div className="footer-contact">

          <h3>Contact</h3>

          <p>
            <FaEnvelope /> support@crimeai.com
          </p>

          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>

          <p>
            <FaMapMarkerAlt /> India
          </p>

        </div>

        <div className="footer-social">

          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="/">
              <FaFacebook />
            </a>

            <a href="/">
              <FaTwitter />
            </a>

            <a href="/">
              <FaLinkedin />
            </a>

            <a href="/">
              <FaGithub />
            </a>

          </div>

        </div>

      </div>

      <hr />

      <div className="copyright">
        © {new Date().getFullYear()} CrimeAI | AI-Based Online Crime Reporting
        and Analysis System. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;