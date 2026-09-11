import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaClipboardList,
  FaArrowLeft,
  FaHistory,
  FaCheckCircle,
  FaLock,
  FaSave,
  FaClock,
  FaShieldAlt,
  FaUserShield,
  FaFileAlt
} from 'react-icons/fa';
import '../../css/PoliceDashboard.css';

const PoliceComplaintDetail = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
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

  const fetchComplaintDetails = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setIsForbidden(false);
    const token = sessionStorage.getItem('police_token');

    try {
      const res = await axios.get(`http://localhost:8000/api/police/complaints/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (res.data?.success && res.data?.complaint) {
        setComplaint(res.data.complaint);
        setNewStatus(res.data.complaint.status);
        setAssignedOfficer(res.data.complaint.assigned_officer || '');
      }
    } catch (err) {
      console.error("Error fetching complaint detail:", err);
      if (err.response?.status === 404 || err.response?.status === 403) {
        setIsForbidden(true);
        setError("Unauthorized: This complaint belongs to another police station precinct or does not exist.");
      } else {
        setError("Network error: Could not retrieve complaint records from backend.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaintDetails();
  }, [fetchComplaintDetails]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess('');
    setUpdateError('');
    const token = sessionStorage.getItem('police_token');

    try {
      const res = await axios.post(`http://localhost:8000/api/police/complaints/${id}/status/`, {
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
        setUpdateSuccess(`Complaint status successfully updated to '${newStatus}'.`);
        setComplaint(res.data.complaint);
        setRemarks('');
        setInvestigationNotes('');
      }
    } catch (err) {
      console.error("Error updating complaint status:", err);
      setUpdateError(err.response?.data?.message || "Failed to update complaint status.");
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
        <div>Retrieving official citizen complaint record...</div>
      </div>
    );
  }

  if (isForbidden || !complaint) {
    return (
      <div className="police-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ fontSize: '42px', color: '#f87171', marginBottom: '16px' }}>
          <FaLock />
        </div>
        <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Security Perimeter / Access Restricted</h3>
        <p style={{ color: '#94a3b8', lineHeight: 1.5, marginBottom: '24px' }}>
          {error || "Access denied. This complaint is assigned to a different police station."}
        </p>
        <Link to="/police/complaints" className="btn-view-details" style={{ display: 'inline-flex' }}>
          <FaArrowLeft /> Return to Complaints
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/police/complaints" className="btn-view-details" style={{ display: 'inline-flex' }}>
          <FaArrowLeft /> Back to Complaints
        </Link>
      </div>

      {/* Complaint Header */}
      <div className="police-page-header-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
              {complaint.complaint_id}
            </span>
            <span className={getPriorityBadge(complaint.priority)}>
              {complaint.priority} Priority
            </span>
            <span className={getStatusBadge(complaint.status)}>
              {complaint.status}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            {complaint.title}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            {complaint.complaint_type} &bull; Received {complaint.formatted_date || complaint.date}
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Precinct</div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{complaint.station_name}</div>
          <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>{complaint.station_code} ({complaint.police_district})</div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="police-detail-grid">
        {/* Left Column: Complaint Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Complaint Text */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaFileAlt /> Complaint Narrative
              </h3>
            </div>
            <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.92rem', whiteSpace: 'pre-line', margin: 0 }}>
              {complaint.description}
            </p>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Reported Location</div>
              <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>{complaint.location}</div>
            </div>
          </div>

          {/* Evidence Details */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaClipboardList /> Submitted Evidence & Information
              </h3>
            </div>
            {complaint.evidence_info ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', color: '#334155', fontSize: '0.88rem', fontFamily: 'monospace' }}>
                {complaint.evidence_info}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                No supplementary digital evidence provided by complainant.
              </p>
            )}
          </div>

          {/* Complainant Identity */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaUserShield /> Complainant Contact
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>{complaint.complainant_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Phone / Contact</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>{complaint.complainant_contact || 'Unlisted'}</div>
              </div>
            </div>
          </div>

          {/* Investigation Notes */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaShieldAlt /> Station Action & Investigation Notes
              </h3>
            </div>
            <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.9rem', whiteSpace: 'pre-line', margin: 0 }}>
              {complaint.investigation_notes || 'No investigation updates added yet.'}
            </p>
          </div>
        </div>

        {/* Right Column: Status Updater & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaCheckCircle /> Update Complaint Status
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
                  Controlled Status
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
                  Assigned Officer
                </label>
                <input
                  type="text"
                  className="police-form-input"
                  placeholder="e.g. Sub-Inspector Rajesh V."
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>
                  Action / Review Remarks
                </label>
                <textarea
                  rows="3"
                  className="police-form-textarea"
                  placeholder="Reason for status change or action summary..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>
                  Investigation Finding (Optional)
                </label>
                <textarea
                  rows="2"
                  className="police-form-textarea"
                  placeholder="Additional notes..."
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
                <FaSave /> {isUpdating ? 'Updating Status...' : 'Save & Log Transition'}
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="police-card" style={{ margin: 0 }}>
            <div className="police-card-header">
              <h3>
                <FaHistory /> Action Audit Trail
              </h3>
            </div>

            {(!complaint.history || complaint.history.length === 0) ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No status history available.</p>
            ) : (
              <ul className="police-timeline">
                {complaint.history.map((h, i) => (
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
                        Officer: {h.updated_by}
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

export default PoliceComplaintDetail;
