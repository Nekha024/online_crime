import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaFolderOpen,
  FaExclamationCircle,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaEye,
  FaSyncAlt,
  FaChartPie,
  FaListAlt
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const PoliceDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [stationInfo, setStationInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    setError('');
    const token = sessionStorage.getItem('police_token');

    try {
      const res = await axios.get('http://localhost:8000/api/police/dashboard/', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (res.data?.success) {
        setStats(res.data.statistics);
        setRecentReports(res.data.recent_reports || []);
        setCrimeTypes(res.data.crime_types || []);
        setStationInfo(res.data.station || {});
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Access unauthorized. Please re-authenticate.");
      } else {
        setError("Unable to retrieve live statistics from backend. Please check network connectivity.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    return `badge-status status-${s}`;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    return `badge-priority priority-${p}`;
  };

  return (
    <div>
      {/* Page Title */}
      <div className="police-page-header-row">
        <div className="police-page-title">
          <h2>
            <FaShieldAlt style={{ color: '#1e3a8a' }} />
            Operational Command Dashboard
          </h2>
          <p>
            Real-time cybercrime case intake, investigation pipeline, and complaint triage for {stationInfo.name || 'Station Unit'}.
          </p>
        </div>

        <button
          onClick={fetchDashboardStats}
          className="btn-view-details"
          style={{ padding: '8px 16px' }}
          title="Refresh Live Statistics"
        >
          <FaSyncAlt className={isLoading ? "fa-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="police-error-banner">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="police-loading-state">
          <FaSyncAlt className="fa-spin" style={{ fontSize: '2rem', marginBottom: '12px' }} />
          <div>Synchronizing live operational metrics from database...</div>
        </div>
      ) : (
        <>
          {/* Real Statistics Cards */}
          <div className="police-stats-grid">
            {/* Total Reports */}
            <div className="police-stat-card">
              <div className="police-stat-info">
                <span>Total Reports</span>
                <h3>{stats?.total_reports ?? 0}</h3>
              </div>
              <div className="police-stat-icon-wrap stat-icon-blue">
                <FaFolderOpen />
              </div>
            </div>

            {/* New Reports */}
            <div className="police-stat-card">
              <div className="police-stat-info">
                <span>New Reports</span>
                <h3>{stats?.new_reports ?? 0}</h3>
              </div>
              <div className="police-stat-icon-wrap stat-icon-amber">
                <FaExclamationCircle />
              </div>
            </div>

            {/* Under Investigation */}
            <div className="police-stat-card">
              <div className="police-stat-info">
                <span>Under Investigation</span>
                <h3>{stats?.under_investigation ?? 0}</h3>
              </div>
              <div className="police-stat-icon-wrap stat-icon-purple">
                <FaSearch />
              </div>
            </div>

            {/* Resolved Cases */}
            <div className="police-stat-card">
              <div className="police-stat-info">
                <span>Resolved Cases</span>
                <h3>{stats?.resolved_cases ?? 0}</h3>
              </div>
              <div className="police-stat-icon-wrap stat-icon-green">
                <FaCheckCircle />
              </div>
            </div>

            {/* Pending Complaints */}
            <div className="police-stat-card">
              <div className="police-stat-info">
                <span>Pending Complaints</span>
                <h3>{stats?.pending_complaints ?? 0}</h3>
              </div>
              <div className="police-stat-icon-wrap stat-icon-red">
                <FaClock />
              </div>
            </div>
          </div>

          {/* Secondary Information Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Recent Case Intake Table */}
            <div className="police-card" style={{ margin: 0 }}>
              <div className="police-card-header">
                <h3>
                  <FaListAlt /> Recent Case Intake & Dispatches
                </h3>
                <Link to="/police/crimes" className="btn-view-details">
                  View All Crimes
                </Link>
              </div>

              {recentReports.length === 0 ? (
                <div className="police-empty-state">
                  <FaFolderOpen className="police-empty-state-icon" />
                  <h4>No reports available.</h4>
                  <p>No active crimes or citizen complaints logged for this police station.</p>
                </div>
              ) : (
                <div className="police-table-responsive">
                  <table className="police-table">
                    <thead>
                      <tr>
                        <th>Case ID</th>
                        <th>Category / Title</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((report) => (
                        <tr key={report.case_id}>
                          <td>
                            <strong style={{ color: '#1e3a8a', fontFamily: 'monospace' }}>
                              {report.case_id}
                            </strong>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{report.title}</div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{report.type}</div>
                          </td>
                          <td>
                            <span className={getPriorityBadge(report.priority)}>
                              {report.priority}
                            </span>
                          </td>
                          <td>
                            <span className={getStatusBadge(report.status)}>
                              {report.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {report.date}
                          </td>
                          <td>
                            <Link
                              to={report.kind === 'Complaint' ? `/police/complaints/${report.case_id}` : `/police/crimes/${report.case_id}`}
                              className="btn-view-details"
                            >
                              <FaEye /> View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Crime Category Distribution Card */}
            <div className="police-card" style={{ margin: 0 }}>
              <div className="police-card-header">
                <h3>
                  <FaChartPie /> Crime Type Distribution
                </h3>
              </div>

              {crimeTypes.length === 0 ? (
                <div className="police-empty-state" style={{ padding: '24px 12px' }}>
                  <p>No categorised crime data available.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  {crimeTypes.map((item, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.84rem' }}>
                        <span style={{ color: '#334155', fontWeight: 500 }}>{item.crime_type}</span>
                        <strong style={{ color: '#1e3a8a' }}>{item.count} cases</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(100, (item.count / (stats?.total_crimes || 1)) * 100)}%`,
                            height: '100%',
                            background: '#1e3a8a',
                            borderRadius: '4px'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PoliceDashboard;
