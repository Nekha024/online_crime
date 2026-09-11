import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaFolderOpen,
  FaEye,
  FaSyncAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const LIFECYCLE_STAGES = [
  { key: 'Submitted', label: '1. Submitted / Intake', color: '#475569', bg: '#f1f5f9' },
  { key: 'Under Review', label: '2. Under Triage & Review', color: '#1d4ed8', bg: '#eff6ff' },
  { key: 'Assigned', label: '3. Assigned to Officer', color: '#7e22ce', bg: '#faf5ff' },
  { key: 'Under Investigation', label: '4. Under Active Investigation', color: '#b45309', bg: '#fffbeb' },
  { key: 'Action Taken', label: '5. Action Taken / Freeze Done', color: '#0369a1', bg: '#f0f9ff' },
  { key: 'Resolved', label: '6. Resolved & Disposed', color: '#15803d', bg: '#f0fdf4' },
  { key: 'Closed', label: '7. Formally Closed', color: '#64748b', bg: '#f8fafc' }
];

const PoliceCrimeStatusPage = () => {
  const [crimes, setCrimes] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedStage, setSelectedStage] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    const token = sessionStorage.getItem('police_token');

    try {
      const [crimesRes, complaintsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/police/crimes/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }),
        axios.get('http://localhost:8000/api/police/complaints/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        })
      ]);

      if (crimesRes.data?.success) {
        setCrimes(crimesRes.data.crimes || []);
      }
      if (complaintsRes.data?.success) {
        setComplaints(complaintsRes.data.complaints || []);
      }
    } catch (err) {
      console.error("Status page fetch error:", err);
      setError("Unable to retrieve cases from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Merge all cases for status pipeline
  const allCases = [
    ...crimes.map(c => ({
      id: c.id,
      case_id: c.crime_id,
      title: c.title,
      type: c.crime_type,
      kind: 'Crime',
      status: c.status,
      priority: c.priority,
      location: c.location,
      assigned_officer: c.assigned_officer,
      date: c.formatted_date || c.report_date
    })),
    ...complaints.map(cmp => ({
      id: cmp.id,
      case_id: cmp.complaint_id,
      title: cmp.title,
      type: cmp.complaint_type,
      kind: 'Complaint',
      status: cmp.status,
      priority: cmp.priority,
      location: cmp.location,
      assigned_officer: cmp.assigned_officer,
      date: cmp.formatted_date || cmp.date
    }))
  ];

  const filteredCases = selectedStage === 'All'
    ? allCases
    : allCases.filter(c => c.status === selectedStage);

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    return `badge-priority priority-${p}`;
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    return `badge-status status-${s}`;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="police-page-header-row">
        <div className="police-page-title">
          <h2>
            <FaTasks style={{ color: '#1e3a8a' }} />
            Crime Status Matrix & Investigation Pipeline
          </h2>
          <p>
            Monitor cases moving through the 7-stage statutory lifecycle from intake to court disposition.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="btn-view-details"
          style={{ padding: '8px 16px' }}
          title="Refresh Lifecycle"
        >
          <FaSyncAlt className={isLoading ? "fa-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="police-error-banner">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Stage Flow Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedStage('All')}
          style={{
            background: selectedStage === 'All' ? '#1e3a8a' : '#ffffff',
            border: '1px solid ' + (selectedStage === 'All' ? '#1e3a8a' : '#cbd5e1'),
            color: selectedStage === 'All' ? '#ffffff' : '#0f172a',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: selectedStage === 'All' ? '#bfdbfe' : '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>All Cases</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{allCases.length}</div>
        </button>

        {LIFECYCLE_STAGES.map(stage => {
          const count = allCases.filter(c => c.status === stage.key).length;
          const isSelected = selectedStage === stage.key;
          return (
            <button
              key={stage.key}
              onClick={() => setSelectedStage(stage.key)}
              style={{
                background: isSelected ? stage.bg : '#ffffff',
                border: '1px solid ' + (isSelected ? stage.color : '#cbd5e1'),
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: stage.color, fontWeight: 700 }}>{stage.key}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{count}</div>
            </button>
          );
        })}
      </div>

      {/* Case Table for Stage */}
      <div className="police-card">
        <div className="police-card-header">
          <h3>
            <FaFolderOpen />
            {selectedStage === 'All' ? 'All Active & Concluded Cases' : `Cases in '${selectedStage}' Stage`}
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {filteredCases.length} records found
          </span>
        </div>

        {isLoading ? (
          <div className="police-loading-state">
            <FaClock className="fa-spin" style={{ fontSize: '1.8rem', marginBottom: '12px' }} />
            <div>Loading case lifecycle matrix...</div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="police-empty-state">
            <FaCheckCircle className="police-empty-state-icon" style={{ color: '#34d399' }} />
            <h4>No reports available in this status.</h4>
            <p>There are currently no cases matching stage '{selectedStage}'.</p>
          </div>
        ) : (
          <div className="police-table-responsive">
            <table className="police-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Kind & Title</th>
                  <th>Priority</th>
                  <th>Current Status</th>
                  <th>Assigned Officer</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(c => (
                  <tr key={c.case_id}>
                    <td>
                      <strong style={{ color: '#1e3a8a', fontFamily: 'monospace' }}>
                        {c.case_id}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.title}</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        <span style={{ color: c.kind === 'Crime' ? '#1e3a8a' : '#b45309', fontWeight: 600 }}>
                          [{c.kind}]
                        </span>{' '}
                        {c.type}
                      </div>
                    </td>
                    <td>
                      <span className={getPriorityBadge(c.priority)}>
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(c.status)}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {c.assigned_officer || 'Unassigned'}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {c.location}
                    </td>
                    <td>
                      <Link
                        to={c.kind === 'Complaint' ? `/police/complaints/${c.case_id}` : `/police/crimes/${c.case_id}`}
                        className="btn-view-details"
                      >
                        <FaEye /> Manage Case
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceCrimeStatusPage;
