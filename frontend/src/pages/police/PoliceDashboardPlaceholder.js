import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShieldAlt, FaSignOutAlt, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import '../../css/PoliceAuth.css';

const PoliceDashboardPlaceholder = () => {
    const navigate = useNavigate();
    const storedStation = sessionStorage.getItem('police_station');
    const station = storedStation ? JSON.parse(storedStation) : {};
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
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
            console.error("Logout error:", err);
        } finally {
            // Requirement 6: Purge storage so /police/dashboard/ is immediately inaccessible
            sessionStorage.removeItem('police_token');
            sessionStorage.removeItem('police_station');
            navigate('/police/login/', { replace: true });
        }
    };

    return (
        <div className="police-dash-wrapper">
            {/* Top Navigation */}
            <header className="police-nav-bar">
                <div className="police-nav-brand">
                    <FaShieldAlt style={{ color: '#38bdf8', fontSize: '1.4rem' }} />
                    <div>
                        <div className="police-nav-brand-title">CrimeAI Law Enforcement System</div>
                        <div className="police-nav-brand-sub">Official Station Portal</div>
                    </div>
                </div>

                <div className="police-nav-actions">
                    <button
                        onClick={handleLogout}
                        className="police-logout-btn"
                        disabled={isLoggingOut}
                        id="police-logout-button"
                    >
                        <FaSignOutAlt />
                        <span>{isLoggingOut ? 'Logging out...' : 'Police Logout'}</span>
                    </button>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="police-dash-content">
                <div className="police-status-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <FaCheckCircle style={{ color: '#4ade80', fontSize: '2rem' }} />
                        <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                                Police Authentication Active
                            </h2>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.86rem' }}>
                                Logged in as authorized law enforcement unit. Full station dashboard features will be enabled in Task 2.
                            </p>
                        </div>
                    </div>
                    <span className="police-tag" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                        SECURE SESSION VERIFIED
                    </span>
                </div>

                <div className="police-station-details-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                        <FaBuilding style={{ color: '#38bdf8', fontSize: '1.2rem' }} />
                        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>
                            Authenticated Police Station Profile
                        </h3>
                    </div>

                    <div className="police-grid-info">
                        <div className="police-info-item">
                            <div className="police-info-label">Station Name</div>
                            <div className="police-info-value">{station.station_name || 'N/A'}</div>
                        </div>

                        <div className="police-info-item">
                            <div className="police-info-label">Station Code</div>
                            <div className="police-info-value">{station.station_code || 'N/A'}</div>
                        </div>

                        <div className="police-info-item">
                            <div className="police-info-label">Police District</div>
                            <div className="police-info-value">{station.police_district || 'N/A'}</div>
                        </div>

                        <div className="police-info-item">
                            <div className="police-info-label">Revenue District</div>
                            <div className="police-info-value">{station.revenue_district || 'N/A'}</div>
                        </div>

                        <div className="police-info-item">
                            <div className="police-info-label">Station Type</div>
                            <div className="police-info-value">{station.station_type || 'General'}</div>
                        </div>

                        <div className="police-info-item">
                            <div className="police-info-label">Username</div>
                            <div className="police-info-value">{station.username || 'N/A'}</div>
                        </div>

                        <div className="police-info-item">
                            <div className="police-info-label">State / Country</div>
                            <div className="police-info-value">{station.state || 'Kerala'}, {station.country || 'India'}</div>
                        </div>

                        <div className="police-info-item">
                            <div className="police-info-label">Status</div>
                            <div className="police-info-value" style={{ color: '#4ade80' }}>Active & Operational</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PoliceDashboardPlaceholder;
