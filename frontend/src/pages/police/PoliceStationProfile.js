import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaSyncAlt,
  FaFolderOpen,
  FaLock
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const PoliceStationProfile = () => {
  const [station, setStation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    setError('');
    const token = sessionStorage.getItem('police_token');

    try {
      const res = await axios.get('http://localhost:8000/api/police/station/', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (res.data?.success && res.data?.station) {
        setStation(res.data.station);
      }
    } catch (err) {
      console.error("Error fetching station profile:", err);
      setError("Unable to retrieve station records from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="police-loading-state">
        <FaSyncAlt className="fa-spin" style={{ fontSize: '2rem', marginBottom: '12px' }} />
        <div>Retrieving official police station record...</div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="police-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#f87171' }}>{error || "Station profile not found."}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="police-page-header-row">
        <div className="police-page-title">
          <h2>
            <FaBuilding style={{ color: '#1e3a8a' }} />
            Station Information & Official Profile
          </h2>
          <p>
            Official administrative jurisdiction, precinct coordinates, and verified law enforcement profile.
          </p>
        </div>

        <button
          onClick={fetchProfile}
          className="btn-view-details"
          style={{ padding: '8px 16px' }}
          title="Refresh Profile"
        >
          <FaSyncAlt />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Profile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Official Administrative Info */}
        <div className="police-card" style={{ margin: 0 }}>
          <div className="police-card-header">
            <h3>
              <FaShieldAlt /> Station Identification & Authority
            </h3>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#15803d',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '4px 12px',
              borderRadius: '4px',
              fontWeight: 600
            }}>
              <FaCheckCircle /> Verified Active Duty
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="police-info-item">
              <div className="police-info-label">Police Station Name</div>
              <div className="police-info-value">{station.station_name}</div>
            </div>

            <div className="police-info-item">
              <div className="police-info-label">Station Identifier / Code</div>
              <div className="police-info-value" style={{ fontFamily: 'monospace', color: '#1e3a8a' }}>
                {station.station_code}
              </div>
            </div>

            <div className="police-info-item">
              <div className="police-info-label">Police District</div>
              <div className="police-info-value">{station.police_district}</div>
            </div>

            <div className="police-info-item">
              <div className="police-info-label">Revenue District</div>
              <div className="police-info-value">{station.revenue_district || station.police_district}</div>
            </div>

            <div className="police-info-item">
              <div className="police-info-label">Station Classification</div>
              <div className="police-info-value">{station.station_type || 'General'}</div>
            </div>

            <div className="police-info-item">
              <div className="police-info-label">Portal Username</div>
              <div className="police-info-value" style={{ fontFamily: 'monospace' }}>{station.username}</div>
            </div>

            <div className="police-info-item">
              <div className="police-info-label">State / Region</div>
              <div className="police-info-value">{station.state || 'Kerala'}</div>
            </div>

            <div className="police-info-item">
              <div className="police-info-label">Country</div>
              <div className="police-info-value">{station.country || 'India'}</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaMapMarkerAlt style={{ color: '#1e3a8a' }} /> Location & Address
            </h4>
            <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              {station.address || `${station.location_name || station.station_name}, ${station.police_district}, Kerala, India`}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#64748b' }}>
              <span>Latitude: <strong style={{ color: '#0f172a' }}>{station.latitude || '9.4981° N'}</strong></span>
              <span>Longitude: <strong style={{ color: '#0f172a' }}>{station.longitude || '76.3388° E'}</strong></span>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaPhoneAlt style={{ color: '#1e3a8a' }} /> Contact Channels
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Duty Phone</div>
                <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                  {station.phone || 'Emergency Desk: 112'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Official Email</div>
                <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                  {station.email || `${station.username}@keralapolice.gov.in`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Operational Metrics & Security Notice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Workload Summary Card */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaFolderOpen /> Case Load Summary
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Active Cases Under Investigation</span>
                <strong style={{ color: '#1e3a8a' }}>{station.summary_stats?.active_cases ?? 0}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Crime Reports Logged</span>
                <strong style={{ color: '#0f172a' }}>{station.summary_stats?.total_crimes ?? 0}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Citizen Complaints Received</span>
                <strong style={{ color: '#0f172a' }}>{station.summary_stats?.total_complaints ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* Security & Credentials Protocol */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaLock /> Security Perimeter
              </h3>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              In compliance with Section 8 of the Security Directives, the station secret identification key is strictly encrypted and withheld from client displays.
            </p>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 14px', borderRadius: '6px', fontSize: '0.78rem', color: '#1e3a8a' }}>
              Key rotation and credential renewals are managed exclusively via root terminal or District Police Chief authorization.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceStationProfile;
