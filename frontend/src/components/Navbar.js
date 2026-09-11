import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Navbar.css";
import {
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaTachometerAlt
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [citizenUser, setCitizenUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if citizen is logged in
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken && storedUser) {
      try {
        setCitizenUser(JSON.parse(storedUser));
      } catch (e) {
        setCitizenUser({ name: "Citizen" });
      }
    } else {
      setCitizenUser(null);
    }

    // Scroll listener for sticky navbar styling
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (anchorId) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + anchorId);
    } else {
      const element = document.querySelector(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Public Citizen Portal Logo */}
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-badge">
            <FaShieldAlt className="logo-icon" />
          </div>
          <div className="logo-text-block">
            <span className="logo-title">CrimeAI</span>
            <span className="logo-sub">Citizen Portal</span>
          </div>
        </Link>

        {/* Public Navigation Links */}
        <ul className={menuOpen ? "nav-links active" : "nav-links"}>
          <li>
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}>
              Home
            </a>
          </li>
          <li>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick("#how-it-works"); }}>
              How It Works
            </a>
          </li>
          <li>
            <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick("#services"); }}>
              Services
            </a>
          </li>
          <li>
            <a href="#process" onClick={(e) => { e.preventDefault(); handleNavClick("#process"); }}>
              Process
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick("#about"); }}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}>
              Contact
            </a>
          </li>

          {/* Mobile Only Action Buttons */}
          <li className="mobile-auth-item">
            {citizenUser ? (
              <button className="login-btn mobile-btn" onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}>
                <FaTachometerAlt /> My Dashboard
              </button>
            ) : (
              <div className="mobile-btn-group">
                <button className="login-btn" onClick={() => { setMenuOpen(false); navigate("/login"); }}>
                  <FaSignInAlt /> Login
                </button>
                <button className="register-btn" onClick={() => { setMenuOpen(false); navigate("/register"); }}>
                  <FaUserPlus /> Register
                </button>
              </div>
            )}
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="nav-buttons">
          {citizenUser ? (
            <button className="register-btn" onClick={() => navigate("/dashboard")} title="Go to Citizen Dashboard">
              <FaUserCircle /> <span>Dashboard</span>
            </button>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate("/login")}>
                <FaSignInAlt /> <span>Login</span>
              </button>
              <button className="register-btn" onClick={() => navigate("/register")}>
                <FaUserPlus /> <span>Register</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Hamburger Toggle */}
        <button
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;