import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../api/api";
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
  FaListAlt,
  FaChartBar,
  FaRobot
} from 'react-icons/fa';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import '../../css/PoliceDashboard.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

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
      const res = await api.get("api/police/dashboard/", {
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
    const s = (status || '').toLowerCase().replace(/\\s+/g, '-');
    return `badge-status status-${s}`;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    return `badge-priority priority-${p}`;
  };

  const getAIBadge = (severity) => {
    const s = (severity || 'unknown').toLowerCase();
    let badgeClass = 'badge-priority';
    if (s.includes('critical')) badgeClass += ' priority-critical';
    else if (s.includes('high')) badgeClass += ' priority-high';
    else if (s.includes('medium')) badgeClass += ' priority-medium';
    else if (s.includes('low')) badgeClass += ' priority-low';
    else badgeClass += ' priority-low';
    
    return (
      <span className={badgeClass} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <FaRobot style={{ fontSize: '10px' }} /> {severity || 'Analyzing...'}
      </span>
    );
  };

  const statusData = [
    { name: 'New / Pending', count: stats?.new_reports || 0 },
    { name: 'Under Investigation', count: stats?.under_investigation || 0 },
    { name: 'Resolved / Closed', count: stats?.resolved_cases || 0 }
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Page Title */}
      <div className="police-page-header-row" style={{ background: 'linear-gradient(90deg, #0f172a, #1e3a8a)', padding: '24px', borderRadius: '12px', color: '#fff', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="police-page-title">
          <h2 style={{ color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <FaShieldAlt style={{ color: '#38bdf8' }} />
            Advanced Operational Command
          </h2>
          <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '0.95rem' }}>
            Real-time cybercrime telemetry, investigation pipeline, and AI-triage metrics for <strong style={{color: '#fff'}}>{stationInfo.name || 'Station Unit'}</strong>.
          </p>
        </div>

        <button
          onClick={fetchDashboardStats}
          className="btn-view-details"
          style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          title="Refresh Live Statistics"
        >
          <FaSyncAlt className={isLoading ? "fa-spin" : ""} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {error && (
        <div className="police-error-banner" style={{ marginBottom: '24px' }}>
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="police-loading-state" style={{ height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <FaSyncAlt className="fa-spin" style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#38bdf8' }} />
          <div style={{ fontSize: '1.1rem', color: '#64748b' }}>Synchronizing live operational metrics...</div>
        </div>
      ) : (
        <>
          {/* Advanced Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Total Case Volume</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{stats?.total_reports ?? 0}</span>
                <FaFolderOpen style={{ fontSize: '2rem', color: '#bfdbfe' }} />
              </div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Critical Alerts & New</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{stats?.new_reports ?? 0}</span>
                <FaExclamationCircle style={{ fontSize: '2rem', color: '#fde68a' }} />
              </div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #8b5cf6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Active Investigations</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{stats?.under_investigation ?? 0}</span>
                <FaSearch style={{ fontSize: '2rem', color: '#ddd6fe' }} />
              </div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Resolved & Disposed</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{stats?.resolved_cases ?? 0}</span>
                <FaCheckCircle style={{ fontSize: '2rem', color: '#bbf7d0' }} />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            
            {/* Crime Category Distribution (Pie Chart) */}
            <div className="police-card" style={{ margin: 0 }}>
              <div className="police-card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                  <FaChartPie style={{ color: '#3b82f6' }} /> Crime Type Telemetry
                </h3>
              </div>
              <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
                {crimeTypes.length === 0 ? (
                  <div className="police-empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p>No categorised crime data available.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={crimeTypes}
                        dataKey="count"
                        nameKey="crime_type"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {crimeTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} cases`, 'Volume']} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Case Pipeline Status (Bar Chart) */}
            <div className="police-card" style={{ margin: 0 }}>
              <div className="police-card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                  <FaChartBar style={{ color: '#8b5cf6' }} /> Investigation Pipeline Load
                </h3>
              </div>
              <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="count" name="Case Volume" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : index === 1 ? '#8b5cf6' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Recent Case Intake Table */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                <FaListAlt style={{ color: '#10b981' }} /> Live Dispatch & Intake Stream
              </h3>
              <Link to="/police/crimes" className="btn-view-details" style={{ background: '#0f172a', color: '#fff', border: 'none' }}>
                View All Intelligence
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
                <table className="police-table" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#f8fafc', color: '#475569' }}>Case Tracking ID</th>
                      <th style={{ background: '#f8fafc', color: '#475569' }}>Category / Title</th>
                      <th style={{ background: '#f8fafc', color: '#475569' }}>AI Triaged Severity</th>
                      <th style={{ background: '#f8fafc', color: '#475569' }}>Station Priority</th>
                      <th style={{ background: '#f8fafc', color: '#475569' }}>Lifecycle Status</th>
                      <th style={{ background: '#f8fafc', color: '#475569' }}>Timestamp</th>
                      <th style={{ background: '#f8fafc', color: '#475569' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.case_id} style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <td style={{ borderLeft: '3px solid #3b82f6', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}>
                          <strong style={{ color: '#1e3a8a', fontFamily: '"SFMono-Regular", Consolas, monospace', letterSpacing: '0.05em' }}>
                            {report.case_id}
                          </strong>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{report.title}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{report.type}</div>
                        </td>
                        <td>
                          {getAIBadge(report.ai_severity)}
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
                        <td style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                          {report.date}
                        </td>
                        <td style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>
                          <Link
                            to={report.kind === 'Complaint' ? `/police/complaints/${report.case_id}` : `/police/crimes/${report.case_id}`}
                            className="btn-view-details"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            <FaEye /> Investigate
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PoliceDashboard;
