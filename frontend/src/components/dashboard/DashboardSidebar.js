import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/dashboard/DashboardSidebar.css";
import {
  FaShieldAlt,
  FaHome,
  FaFileAlt,
  FaListAlt,
  FaBuilding,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaTimes,
  FaShieldVirus,
  FaLock
} from "react-icons/fa";
import { useCrime } from "../../context/CrimeContext";

const DashboardSidebar = ({ isMobileOpen, onCloseMobileSidebar }) => {
  const { complaints, userProfile } = useCrime();

  const pendingCount = complaints.filter(
    (c) => c.status === "Pending Review" || c.status === "Under Investigation"
  ).length;

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <FaHome />,
      end: true
    },
    {
      to: "/dashboard/file-complaint",
      label: "File Complaint",
      icon: <FaFileAlt />,
      badge: "New"
    },
    {
      to: "/dashboard/my-complaints",
      label: "View Complaints",
      icon: <FaListAlt />,
      badge: pendingCount > 0 ? `${pendingCount} active` : null
    },
    {
      to: "/dashboard/police-stations",
      label: "Police Stations",
      icon: <FaBuilding />
    },
    {
      to: "/dashboard/map",
      label: "Crime & Safety Map",
      icon: <FaMapMarkedAlt />
    },
    {
      to: "/dashboard/emergency",
      label: "Emergency Numbers",
      icon: <FaPhoneAlt />,
      badge: "SOS",
      badgeType: "sos"
    }
  ];

  return (
    <aside className={`dash-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
      <div>
        {/* Top Brand Info inside Sidebar */}
        <div className="sidebar-brand-section">
          <div className="sidebar-brand-logo">
            <FaShieldAlt className="sidebar-logo-icon" />
            <div className="sidebar-brand-text">
              Crime<span>Guard</span>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onCloseMobileSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-section-title">Main Portal</div>
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? "active" : ""}`
                }
                onClick={onCloseMobileSidebar}
              >
                <div className="sidebar-link-content">
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`sidebar-item-badge ${
                      item.badgeType === "sos" ? "sos-badge" : ""
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Safety Index Footer Card */}
      <div className="sidebar-footer-card">
        <FaShieldVirus className="shield-pulse-icon" />
        <h5>Safety Shield Active</h5>
        <p>Your regional safety score is monitored 24/7 with encrypted reporting.</p>
        <div className="safety-score-pill">
          <FaLock style={{ marginRight: "4px" }} />
          Citizen Score: {userProfile.safetyScore}/100
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
