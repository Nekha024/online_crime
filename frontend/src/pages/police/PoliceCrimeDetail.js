import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaFolderOpen,
  FaArrowLeft,
  FaUserShield,
  FaFileAlt,
  FaHistory,
  FaCheckCircle,
  FaLock,
  FaSave,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const PoliceCrimeDetail = () => {
  const { id } = useParams();

  const [crime, setCrime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isForbidden, setIsForbidden] = useState(false);

  // Status update form states
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  const fetchCrimeDetails = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setIsForbidden(false);
    const token = sessionStorage.getItem('police_token');

    try {
      const res = await axios.get(`http://localhost:8000/api/police/crimes/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (res.data?.success && res.data?.crime) {
        setCrime(res.data.crime);
        setNewStatus(res.data.crime.status);
        setAssignedOfficer(res.data.crime.assigned_officer || '');
      }
    } catch (err) {
      console.error("Error fetching crime detail:", err);
      if (err.response?.status === 404 || err.response?.status === 403) {
        setIsForbidden(true);
        setError("Unauthorized: This case belongs to another police station jurisdiction or does not exist.");
      } else {
        setError("Network error: Could not retrieve case records from backend.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCrimeDetails();
  }, [fetchCrimeDetails]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess('');
    setUpdateError('');
    const token = sessionStorage.getItem('police_token');

    try {
      const res = await axios.post(`http://localhost:8000/api/police/crimes/${id}/status/`, {
        status: newStatus,
        remarks: remarks.trim(),
        assigned_officer: assignedOfficer.trim(),
        investigation_notes: investigationNotes.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (res.data?.success) {
        setUpdateSuccess(`Case status successfully changed to '${newStatus}'. Audit record created.`);
        setCrime(res.data.crime);
        setRemarks('');
        setInvestigationNotes('');
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setUpdateError(err.response?.data?.message || "Failed to update case status on backend.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    return `badge-status status-${s}`;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    return `badge-priority priority-${p}`;
  };

  if (isLoading) {
    return (
      <div className="police-loading-state">
        <FaClock className="fa-spin" style={{ fontSize: '2rem', marginBottom: '12px' }} />
        <div>Decrypting and retrieving verified case records...</div>
      </div>
    );
  }

  if (isForbidden || !crime) {
    return (
      <div className="police-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ fontSize: '42px', color: '#f87171', marginBottom: '16px' }}>
          <FaLock />
        </div>
        <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Security Perimeter / Access Restricted</h3>
        <p style={{ color: '#94a3b8', lineHeight: 1.5, marginBottom: '24px' }}>
          {error || "You are not authorized to view this record. This incident is registered under a different police station precinct."}
        </p>
        <Link to="/police/crimes" className="btn-view-details" style={{ display: 'inline-flex' }}>
          <FaArrowLeft /> Return to Station Registry
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/police/crimes" className="btn-view-details" style={{ display: 'inline-flex' }}>
          <FaArrowLeft /> Back to Reported Crimes
        </Link>
      </div>

      {/* Case Header Banner */}
      <div className="police-page-header-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
              {crime.crime_id}
            </span>
            <span className={getPriorityBadge(crime.priority)}>
              {crime.priority} Priority
            </span>
            <span className={getStatusBadge(crime.status)}>
              {crime.status}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            {crime.title}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            {crime.crime_type} &bull; Reported {crime.formatted_report_date || crime.report_date}
          </p>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Jurisdiction Precinct</div>
          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{crime.station_name}</div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{crime.station_code} ({crime.police_district})</div>
        </div>
      </div>

      {/* Main Grid: Details (Left) + Status Update & History (Right) */}
      <div className="police-detail-grid">
        {/* Left Column: Full Incident & Evidence Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Incident Description */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaFileAlt /> Incident Description & Complaint Details
              </h3>
            </div>
            <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.92rem', whiteSpace: 'pre-line', margin: 0 }}>
              {crime.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Incident Timestamp</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>{crime.formatted_incident_date || crime.incident_date}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Scene / Location</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>{crime.location}</div>
              </div>
            </div>
          </div>

          {/* Evidence Information */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaFolderOpen /> Digital Evidence & Artifact Information
              </h3>
            </div>
            {crime.evidence_info ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', color: '#334155', fontSize: '0.88rem', lineHeight: 1.5, fontFamily: 'monospace' }}>
                {crime.evidence_info}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                No digital evidence artifacts attached to this record.
              </p>
            )}
          </div>

          {/* Complainant Information */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaUserShield /> Complainant Profile (Authorized Officer View)
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Reported By</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>{crime.complainant_name || 'Anonymous Complainant'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Contact Information</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>{crime.complainant_contact || 'Unspecified'}</div>
              </div>
            </div>
          </div>

          {/* Investigation Notes */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaShieldAlt /> Officer Investigation Notes & Findings
              </h3>
            </div>
            <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.9rem', whiteSpace: 'pre-line', margin: 0 }}>
              {crime.investigation_notes || 'No preliminary notes recorded yet. Add notes using the investigation panel.'}
            </p>
          </div>
        </div>

        {/* Right Column: Status Tracking & Chronological Audit Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Update Panel */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaCheckCircle /> Update Case Status
              </h3>
            </div>

            {updateSuccess && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px', fontWeight: 600 }}>
                {updateSuccess}
              </div>
            )}

            {updateError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px' }}>
                {updateError}
              </div>
            )}

            <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>
                  Select Controlled Status
                </label>
                <select
                  className="police-select"
                  style={{ width: '100%' }}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Action Taken">Action Taken</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>
                  Assigned Investigating Officer
                </label>
                <input
                  type="text"
                  className="police-form-input"
                  placeholder="e.g. Inspector Manoj Nair"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>
                  Status Transition Remarks (Audit Log)
                </label>
                <textarea
                  rows="3"
                  className="police-form-textarea"
                  placeholder="Mandatory reason or forensic progress update..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>
                  Add Investigation Finding (Optional)
                </label>
                <textarea
                  rows="2"
                  className="police-form-textarea"
                  placeholder="Append new forensic clue or lead..."
                  value={investigationNotes}
                  onChange={(e) => setInvestigationNotes(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="police-btn-primary"
                style={{ marginTop: '6px' }}
                disabled={isUpdating}
              >
                <FaSave /> {isUpdating ? 'Recording Status Transition...' : 'Update & Log Status'}
              </button>
            </form>
          </div>

          {/* Chronological Status Audit Timeline */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaHistory /> Status History & Audit Trail
              </h3>
            </div>

            {(!crime.history || crime.history.length === 0) ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No status transitions logged yet.</p>
            ) : (
              <ul className="police-timeline">
                {crime.history.map((h, i) => (
                  <li key={h.id || i} className="police-timeline-item">
                    <span className="police-timeline-dot"></span>
                    <div className="police-timeline-content">
                      <div className="police-timeline-header">
                        <span className="police-timeline-title">
                          {h.old_status && h.old_status !== 'N/A' ? `${h.old_status} → ` : ''}
                          <strong style={{ color: '#1e3a8a' }}>{h.new_status}</strong>
                        </span>
                        <span className="police-timeline-date">{h.formatted_date || h.timestamp}</span>
                      </div>
                      <p className="police-timeline-text">{h.remarks || "Status updated."}</p>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                        Updated by: {h.updated_by}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceCrimeDetail;
