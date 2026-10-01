import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from "../../api/api";
import {
  FaClipboardList,
  FaSearch,
  FaEye,
  FaSyncAlt,
  FaExclamationTriangle,
  FaClock,
  FaRobot,
  FaFilter
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const PoliceComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const token = sessionStorage.getItem('police_token');

    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await api.get("api/police/complaints/", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params,
        withCredentials: true
      });

      if (res.data?.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Unable to load complaints from backend database. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

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
        <FaRobot style={{ fontSize: '12px' }} /> {severity || 'Analyzing...'}
      </span>
    );
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Page Header (Tactical Theme) */}
      <div className="police-page-header-row" style={{ background: 'linear-gradient(90deg, #0f172a, #1e3a8a)', padding: '24px', borderRadius: '12px', color: '#fff', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="police-page-title">
          <h2 style={{ color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <FaClipboardList style={{ color: '#38bdf8' }} />
            Citizen Complaints Registry
          </h2>
          <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '0.95rem' }}>
            Direct citizen intakes and FIR filings assigned to this station. Search, triage, and escalate.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="btn-view-details"
          style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          title="Refresh List"
        >
          <FaSyncAlt className={isLoading ? "fa-spin" : ""} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Advanced Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: '1', minWidth: '300px', display: 'flex', background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', borderRight: '1px solid #cbd5e1' }}>
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search Intelligence: ID, title, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: '1', border: 'none', padding: '12px', fontSize: '0.95rem', outline: 'none' }}
          />
          <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '0 20px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#1e40af'} onMouseOut={e => e.target.style.background = '#1e3a8a'}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <FaFilter style={{ color: '#64748b', marginRight: '8px' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '12px 8px', fontSize: '0.95rem', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
          >
            <option value="All">All Status Pipelines</option>
            <option value="Submitted">Status: Submitted</option>
            <option value="Under Review">Status: Under Review</option>
            <option value="Assigned">Status: Assigned</option>
            <option value="Under Investigation">Status: Under Investigation</option>
            <option value="Action Taken">Status: Action Taken</option>
            <option value="Resolved">Status: Resolved</option>
            <option value="Closed">Status: Closed</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="police-error-banner" style={{ marginBottom: '24px' }}>
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Advanced Table Container */}
      <div className="police-card" style={{ margin: 0, padding: '24px' }}>
        {isLoading ? (
          <div className="police-loading-state" style={{ height: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <FaSyncAlt className="fa-spin" style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#38bdf8' }} />
            <div style={{ fontSize: '1.1rem', color: '#64748b' }}>Querying station complaint stream...</div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="police-empty-state" style={{ height: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <FaClipboardList className="police-empty-state-icon" style={{ fontSize: '3rem', color: '#cbd5e1' }} />
            <h4 style={{ fontSize: '1.2rem', marginTop: '16px' }}>No intelligence available.</h4>
            <p style={{ color: '#64748b' }}>No citizen complaints matched your filters.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.95rem', color: '#475569' }}>
                Displaying <strong style={{ color: '#0f172a' }}>{complaints.length}</strong> active complaints
              </div>
            </div>

            <div className="police-table-responsive" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <table className="police-table" style={{ borderCollapse: 'collapse', width: '100%', margin: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'left' }}>Case Info</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'left' }}>Location & Time</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'center' }}>Status / Priority</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'center' }}>AI Intelligence</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, idx) => (
                    <tr key={c.id} style={{ 
                      background: '#fff', 
                      borderBottom: idx === complaints.length - 1 ? 'none' : '1px solid #f1f5f9',
                      transition: 'background 0.2s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ 
                            minWidth: '44px', height: '44px', borderRadius: '10px', 
                            background: '#eff6ff', color: '#3b82f6', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' 
                          }}>
                            <FaClipboardList />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginBottom: '4px' }}>{c.title}</div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <strong style={{ color: '#6366f1', fontFamily: '"SFMono-Regular", Consolas, monospace', fontSize: '0.75rem', letterSpacing: '0.05em', background: '#e0e7ff', padding: '2px 6px', borderRadius: '4px' }}>
                                #{c.complaint_id}
                              </strong>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{c.complaint_type}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                           {c.location}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          <FaClock style={{ display: 'inline', marginRight: '4px', color: '#94a3b8' }} />
                          {c.formatted_date || c.date}
                        </div>
                      </td>
                      <td style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <span className={getStatusBadge(c.status)} style={{ minWidth: '100px' }}>
                            {c.status}
                          </span>
                          <span className={getPriorityBadge(c.priority)}>
                            {c.priority} Priority
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px', textAlign: 'center' }}>
                        {getAIBadge(c.ai_severity)}
                      </td>
                      <td style={{ padding: '20px', textAlign: 'right' }}>
                        <Link
                          to={`/police/complaints/${c.complaint_id}`}
                          className="btn-view-details"
                          style={{ 
                            padding: '8px 16px', 
                            fontSize: '0.85rem', 
                            background: '#fff', 
                            color: '#0f172a', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '6px',
                            fontWeight: 600,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          <FaEye /> View Case
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PoliceComplaintsList;
