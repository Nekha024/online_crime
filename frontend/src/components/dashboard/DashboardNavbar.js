import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/dashboard/DashboardNavbar.css";
import {
  FaShieldAlt,
  FaBars,
  FaSearch,
  FaBell,
  FaExclamationCircle,
  FaSignOutAlt,
  FaUserCheck,
  FaCheckDouble
} from "react-icons/fa";
import { useCrime } from "../../context/CrimeContext";

const DashboardNavbar = ({ onToggleMobileSidebar }) => {
  const { userProfile, notifications, markAllNotificationsRead } = useCrime();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out of the Citizen Portal?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/my-complaints?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="dash-navbar">
      {/* Left: Mobile Menu Trigger + Brand Logo */}
      <div className="dash-nav-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>

        <Link to="/dashboard" className="dash-logo-title">
          <FaShieldAlt style={{ color: "#1e3a8a", fontSize: "1.4rem" }} />
          <span>Crime Portal</span>
          <span className="dash-logo-badge">Citizen</span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <form className="dash-nav-search" onSubmit={handleSearchSubmit}>
        <FaSearch className="search-icon-inside" />
        <input
          type="text"
          placeholder="Search FIR number, crime category, or station..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Right: Quick SOS, Notifications, Profile, Logout */}
      <div className="dash-nav-right">
        {/* Quick Emergency SOS Link */}
        <Link to="/dashboard/emergency" className="sos-badge-btn" title="Emergency Help">
          <FaExclamationCircle />
          <span>SOS ALERT</span>
        </Link>

        {/* Notification Bell Dropdown */}
        <div className="notif-container">
          <button
            className="notif-trigger-btn"
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="Notifications"
          >
            <FaBell />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotifs && (
            <div className="notif-dropdown-menu">
              <div className="notif-header">
                <h4>Notifications ({unreadCount} new)</h4>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllNotificationsRead}>
                    <FaCheckDouble /> Mark read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    className={`notif-item ${notif.unread ? "unread" : ""}`}
                  >
                    <div className="notif-title">
                      <span>{notif.title}</span>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                    <div className="notif-desc">{notif.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="user-profile-badge" title={`Logged in as ${userProfile.name}`}>
          <div className="user-avatar-initials">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "C"}
          </div>
          <div className="user-meta-info">
            <span className="user-name-text">{userProfile.name}</span>
            <span className="user-tag-text">
              <FaUserCheck style={{ marginRight: "3px" }} />
              Verified Citizen
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button className="dash-logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardNavbar;
