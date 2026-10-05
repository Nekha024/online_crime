import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock
} from "react-icons/fa";
import "../css/LandingPage.css";

const Footer = () => {
  return (
    <footer className="public-footer">
      <div className="landing-container">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo-title">
              <FaShieldAlt />
              <span>Crime Reporting Platform</span>
            </div>
            <p>
              An online crime reporting and analysis system enabling citizens to report incidents,
              submit evidence, and track investigation progress securely.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "0.82rem" }}>
              <FaLock />
              <span>Secure Citizen Communication</span>
            </div>
          </div>

          {/* Public Navigation */}
          <div className="footer-col">
            <h4>Public Navigation</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#process">Reporting Process</a></li>
              <li><a href="#trust">Trust & Security</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Citizen Services */}
          <div className="footer-col">
            <h4>Citizen Services</h4>
            <ul>
              <li><Link to="/report">Report a Crime</Link></li>
              <li><Link to="/dashboard/file-complaint">File a Complaint</Link></li>
              <li><Link to="/dashboard/my-complaints">Track Report Status</Link></li>
              <li><Link to="/dashboard/police-stations">Police Station Directory</Link></li>
              <li><Link to="/login">Citizen Login</Link></li>
              <li><Link to="/register">Citizen Registration</Link></li>
            </ul>
          </div>

          {/* Emergency & Helplines */}
          <div className="footer-col">
            <h4>Emergency & Helplines</h4>
            <ul>
              <li style={{ color: "#fca5a5", fontWeight: 600 }}>
                <FaPhoneAlt style={{ marginRight: "6px" }} />
                All Emergencies: 112
              </li>
              <li style={{ color: "#93c5fd", fontWeight: 600 }}>
                <FaPhoneAlt style={{ marginRight: "6px" }} />
                Cyber Crime Helpline: 1930
              </li>
              <li>
                <FaEnvelope style={{ marginRight: "6px" }} />
                support@onlinecrime.gov.in
              </li>
              <li>
                <FaMapMarkerAlt style={{ marginRight: "6px" }} />
                National Citizen Safety Service
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Policy Row */}
        <div className="footer-bottom-row">
          <div>
            © {new Date().getFullYear()} Online Crime Reporting and Analysis System. All Rights Reserved.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>Terms of Public Service</span>
            <span>Privacy Policy</span>
            <span>Citizen Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;