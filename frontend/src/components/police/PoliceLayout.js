import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  FaShieldAlt,
  FaTachometerAlt,
  FaFolderOpen,
  FaClipboardList,
  FaTasks,
  FaBuilding,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaMapMarkerAlt
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const PoliceLayout = () => {
  const [station, setStation] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const raw = sessionStorage.getItem('police_station');
    if (raw) {
      try {
        setStation(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse station info:", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    const token = sessionStorage.getItem('police_token');
    try {
      if (token) {
        await axios.post('http://localhost:8000/api/police/logout/', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      sessionStorage.removeItem('police_token');
      sessionStorage.removeItem('police_station');
      navigate('/police/login/', { replace: true });
    }
  };

  return (
    <div className="police-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className={`police-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="police-sidebar-brand">
          <FaShieldAlt className="police-sidebar-logo-icon" />
          <div className="police-brand-text">
            <h3>Police Portal</h3>
            <span>LAW ENFORCEMENT</span>
          </div>
        </div>

        <ul className="police-sidebar-menu">
          <li className={`police-menu-item ${location.pathname === '/police/dashboard' || location.pathname === '/police/dashboard/' ? 'active' : ''}`}>
            <NavLink to="/police/dashboard" onClick={() => setMobileOpen(false)}>
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className={`police-menu-item ${location.pathname.startsWith('/police/crimes') ? 'active' : ''}`}>
            <NavLink to="/police/crimes" onClick={() => setMobileOpen(false)}>
              <FaFolderOpen />
              <span>Reported Crimes</span>
            </NavLink>
          </li>

          <li className={`police-menu-item ${location.pathname.startsWith('/police/complaints') ? 'active' : ''}`}>
            <NavLink to="/police/complaints" onClick={() => setMobileOpen(false)}>
              <FaClipboardList />
              <span>Complaints</span>
            </NavLink>
          </li>

          <li className={`police-menu-item ${location.pathname === '/police/status' || location.pathname === '/police/status/' ? 'active' : ''}`}>
            <NavLink to="/police/status" onClick={() => setMobileOpen(false)}>
              <FaTasks />
              <span>Crime Status</span>
            </NavLink>
          </li>

          <li className={`police-menu-item ${location.pathname === '/police/station' || location.pathname === '/police/station/' ? 'active' : ''}`}>
            <NavLink to="/police/station" onClick={() => setMobileOpen(false)}>
              <FaBuilding />
              <span>Station Information</span>
            </NavLink>
          </li>
        </ul>

        <div className="police-sidebar-footer">
          <button onClick={handleLogout} className="police-sidebar-logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="police-main-wrapper">
        {/* Top Header */}
        <header className="police-header">
          <div className="police-header-left">
            <button
              className="police-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className="police-station-badge-group">
              <span className="police-station-name-title">
                {station.station_name || 'Kerala Police'}
              </span>
              {station.police_district && (
                <span className="police-station-district-tag">
                  <FaMapMarkerAlt /> {station.police_district}
                </span>
              )}
              {station.station_code && (
                <span className="police-station-code-tag">
                  {station.station_code}
                </span>
              )}
            </div>
          </div>

          <div className="police-header-right">
            <div className="police-live-status">
              <span className="police-status-dot"></span>
              <span>Online & Dispatched</span>
            </div>

            <button
              onClick={handleLogout}
              className="police-sidebar-logout-btn"
              style={{ width: 'auto', padding: '6px 14px' }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Views Rendered via Router Outlet */}
        <main className="police-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PoliceLayout;
