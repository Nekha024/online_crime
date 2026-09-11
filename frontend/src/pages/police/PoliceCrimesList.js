import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaFolderOpen,
  FaSearch,
  FaEye,
  FaSyncAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const PoliceCrimesList = () => {
  const [crimes, setCrimes] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCrimes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const token = sessionStorage.getItem('police_token');

    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (typeFilter !== 'All') params.type = typeFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const res = await axios.get('http://localhost:8000/api/police/crimes/', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params,
        withCredentials: true
      });

      if (res.data?.success) {
        setCrimes(res.data.crimes || []);
      }
    } catch (err) {
      console.error("Error fetching crimes:", err);
      setError("Unable to load crime reports from database. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, typeFilter, priorityFilter]);

  useEffect(() => {
    fetchCrimes();
  }, [fetchCrimes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCrimes();
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    return `badge-status status-${s}`;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    return `badge-priority priority-${p}`;
  };

  // Derive unique crime types for filter
  const uniqueTypes = ["All", ...Array.from(new Set(crimes.map(c => c.crime_type).filter(Boolean)))];

  return (
    <div>
      {/* Page Header */}
      <div className="police-page-header-row">
        <div className="police-page-title">
          <h2>
            <FaFolderOpen style={{ color: '#1e3a8a' }} />
            Reported Crimes Directory
          </h2>
          <p>
            Official case registry scoped exclusively to this police station's active jurisdiction.
          </p>
        </div>

        <button
          onClick={fetchCrimes}
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
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="police-search-box">
          <FaSearch className="police-search-icon" />
          <input
            type="text"
            placeholder="Search by Crime ID, title, officer, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Filter Controls */}
        <div className="police-filter-controls">
          {/* Status Filter */}
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

          {/* Crime Type Filter */}
          {uniqueTypes.length > 2 && (
            <select
              className="police-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {uniqueTypes.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Crime Types' : t}</option>
              ))}
            </select>
          )}

          {/* Priority Filter */}
          <select
            className="police-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
            <div>Querying authorized police station crimes...</div>
          </div>
        ) : crimes.length === 0 ? (
          <div className="police-empty-state">
            <FaFolderOpen className="police-empty-state-icon" />
            <h4>No reports available.</h4>
            <p>No crime reports match your search criteria or are assigned to this station.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '14px', fontSize: '0.86rem', color: '#64748b' }}>
              Showing <strong>{crimes.length}</strong> active police cases
            </div>

            <div className="police-table-responsive">
              <table className="police-table">
                <thead>
                  <tr>
                    <th>Crime ID</th>
                    <th>Crime Type & Title</th>
                    <th>Date Reported</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {crimes.map((crime) => (
                    <tr key={crime.id}>
                      <td>
                        <strong style={{ color: '#1e3a8a', fontFamily: 'monospace' }}>
                          {crime.crime_id}
                        </strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{crime.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{crime.crime_type}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                        {crime.formatted_date || crime.report_date}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                        {crime.location}
                      </td>
                      <td>
                        <span className={getPriorityBadge(crime.priority)}>
                          {crime.priority}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadge(crime.status)}>
                          {crime.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/police/crimes/${crime.crime_id}`}
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

export default PoliceCrimesList;
