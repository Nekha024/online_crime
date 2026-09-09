import React from "react";
import { Link } from "react-router-dom";
import "../../css/dashboard/DashboardHome.css";
import {
  FaFileSignature,
  FaClock,
  FaSearchLocation,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaPlus,
  FaUserShield,
  FaEye,
  FaShieldAlt,
  FaInfoCircle
} from "react-icons/fa";
import { useCrime } from "../../context/CrimeContext";

const DashboardHome = () => {
  const { userProfile, complaints } = useCrime();

  // Metrics computation
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === "Pending Review").length;
  const inInvestigation = complaints.filter((c) => c.status === "Under Investigation").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="dash-home-container">
      {/* 1. Welcome Profile Card */}
      <section className="user-welcome-card">
        <div className="welcome-decor-glow" />

        <div className="welcome-user-info">
          <div className="welcome-avatar-wrapper">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="welcome-avatar-img"
            />
            <div className="verified-badge-icon" title="Identity Verified">
              <FaUserShield />
            </div>
          </div>

          <div className="welcome-headings">
            <h2>Welcome back, {userProfile.name}! 👋</h2>
            <p>Your secure citizen portal is active. Track your filed FIRs and regional security updates.</p>

            <div className="welcome-meta-pills">
              {userProfile.citizenId && <span className="meta-pill verified">✔ Citizen ID: {userProfile.citizenId}</span>}
              <span className="meta-pill">📍 {userProfile.city} Jurisdiction</span>
            </div>
          </div>
        </div>

        <div className="welcome-action-buttons">
          <Link to="/dashboard/file-complaint" className="btn-file-quick">
            <FaPlus /> File New Complaint
          </Link>
          <Link to="/dashboard/emergency" className="btn-sos-quick">
            <FaExclamationTriangle /> SOS Help
          </Link>
        </div>
      </section>

      {/* 2. Key Metrics & Complaint Count Stat Cards */}
      <section className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-card-info">
            <h6>Total Complaints Filed</h6>
            <div className="stat-card-value">{totalComplaints}</div>
            <div className="stat-card-subtext">
              <span>Lifetime citizen reports</span>
            </div>
          </div>
          <div className="stat-icon-badge blue">
            <FaFileSignature />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-info">
            <h6>Pending Review</h6>
            <div className="stat-card-value">{pendingComplaints}</div>
            <div className="stat-card-subtext">
              <span>Awaiting initial triage</span>
            </div>
          </div>
          <div className="stat-icon-badge amber">
            <FaClock />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-info">
            <h6>Under Investigation</h6>
            <div className="stat-card-value">{inInvestigation}</div>
            <div className="stat-card-subtext">
              <span>Assigned to police officers</span>
            </div>
          </div>
          <div className="stat-icon-badge purple">
            <FaSearchLocation />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-info">
            <h6>Resolved Cases</h6>
            <div className="stat-card-value">{resolvedComplaints}</div>
            <div className="stat-card-subtext">
              <span style={{ color: "#34d399" }}>
                ✔ {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0}% resolution rate
              </span>
            </div>
          </div>
          <div className="stat-icon-badge emerald">
            <FaCheckCircle />
          </div>
        </div>
      </section>

      {/* 3. Main Data Area: Complaints List */}
      <section className="dashboard-main-grid">
        <div className="recent-complaints-card">
          <div className="chart-card-header">
            <h3>
              <FaShieldAlt style={{ color: "#38bdf8" }} />
              Recent Filed Complaints
            </h3>
            {totalComplaints > 0 && (
              <Link
                to="/dashboard/my-complaints"
                className="view-all-link"
              >
                View all ({totalComplaints}) <FaArrowRight />
              </Link>
            )}
          </div>

          {totalComplaints === 0 ? (
            <div className="empty-state-container">
              <div className="empty-state-icon">
                <FaInfoCircle />
              </div>
              <h4>No records available yet</h4>
              <p>You haven't filed any complaints through the CrimeAI portal yet.</p>
              <Link to="/dashboard/file-complaint" className="btn-file-empty">
                <FaPlus /> Start a New Complaint
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>FIR Number</th>
                    <th>Incident Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span className="fir-code-tag">{c.id}</span>
                      </td>
                      <td style={{ fontWeight: "600", color: "#f8fafc" }}>
                        {c.title}
                      </td>
                      <td>{c.category}</td>
                      <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{c.date}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            c.status === "Resolved"
                              ? "resolved"
                              : c.status === "Under Investigation"
                              ? "investigation"
                              : "pending"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/dashboard/my-complaints?id=${c.id}`}
                          className="action-track-link"
                        >
                          <FaEye /> Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
