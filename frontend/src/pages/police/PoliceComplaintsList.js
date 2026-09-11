import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaClipboardList,
  FaSearch,
  FaEye,
  FaSyncAlt,
  FaExclamationTriangle
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

      const res = await axios.get('http://localhost:8000/api/police/complaints/', {
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
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    return `badge-status status-${s}`;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    return `badge-priority priority-${p}`;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="police-page-header-row">
        <div className="police-page-title">
          <h2>
            <FaClipboardList style={{ color: '#1e3a8a' }} />
            Citizen Complaints Registry
          </h2>
          <p>
            Complaints submitted by citizens assigned directly to this police station.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="btn-view-details"
          style={{ padding: '8px 16px' }}
          title="Refresh List"
        >
          <FaSyncAlt className={isLoading ? "fa-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="police-filter-bar">
        <form onSubmit={handleSearchSubmit} className="police-search-box">
          <FaSearch className="police-search-icon" />
          <input
            type="text"
            placeholder="Search by Complaint ID, title, description, or officer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="police-filter-controls">
          <select
            className="police-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Action Taken">Action Taken</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="police-error-banner">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="police-card">
        {isLoading ? (
          <div className="police-loading-state">
            <FaSyncAlt className="fa-spin" style={{ fontSize: '1.8rem', marginBottom: '12px' }} />
            <div>Querying station complaints...</div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="police-empty-state">
            <FaClipboardList className="police-empty-state-icon" />
            <h4>No reports available.</h4>
            <p>No citizen complaints logged for this police station.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '14px', fontSize: '0.86rem', color: '#64748b' }}>
              Showing <strong>{complaints.length}</strong> active complaints
            </div>

            <div className="police-table-responsive">
              <table className="police-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Type & Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Short Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ color: '#1e3a8a', fontFamily: 'monospace' }}>
                          {c.complaint_id}
                        </strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.complaint_type}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                        {c.formatted_date || c.date}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                        {c.location}
                      </td>
                      <td>
                        <span className={getStatusBadge(c.status)}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <span className={getPriorityBadge(c.priority)}>
                          {c.priority}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.description}
                      </td>
                      <td>
                        <Link
                          to={`/police/complaints/${c.complaint_id}`}
                          className="btn-view-details"
                        >
                          <FaEye /> View Details
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
