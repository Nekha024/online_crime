import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import {
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaTachometerAlt
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" style={{ textDecoration: "none" }}>
          <FaShieldAlt className="logo-icon" />
          <span>CrimeAI</span>
        </Link>

        {/* Navigation Links */}
        <ul className={menuOpen ? "nav-links active" : "nav-links"}>
          <li>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
          </li>

          <li>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>
          </li>

          <li>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
          </li>

          <li>
            <a href="#statistics" onClick={() => setMenuOpen(false)}>
              Statistics
            </a>
          </li>

          <li>
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#38bdf8", fontWeight: "600" }}
            >
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Buttons */}
        <div className="nav-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            <FaSignInAlt /> Login
          </button>

          <button className="register-btn" onClick={() => navigate("/register")}>
            <FaTachometerAlt /> Register
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;