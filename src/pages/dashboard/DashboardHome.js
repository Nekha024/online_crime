import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/dashboard/DashboardHome.css";
import {
  FaFileSignature,
  FaClock,
  FaSearchLocation,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaPhoneAlt,
  FaArrowRight,
  FaPlus,
  FaUserShield,
  FaChartLine,
  FaChartPie,
  FaEye,
  FaShieldAlt
} from "react-icons/fa";
import { useCrime } from "../../context/CrimeContext";

const DashboardHome = () => {
  const { userProfile, complaints } = useCrime();

  // Metrics computation
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === "Pending Review").length;
  const inInvestigation = complaints.filter((c) => c.status === "Under Investigation").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved").length;

  // Monthly trends data for the interactive bar chart
  const monthlyData = [
    { month: "Oct", count: 12, height: "45%" },
    { month: "Nov", count: 19, height: "65%" },
    { month: "Dec", count: 15, height: "55%" },
    { month: "Jan", count: 24, height: "85%" },
    { month: "Feb", count: 28, height: "95%" },
    { month: "Mar", count: 8, height: "35%" }
  ];

  // Category statistics breakdown
  const categoryStats = [
    { name: "Financial & Phishing Scams", percent: 42, color: "#38bdf8" },
    { name: "Identity Theft & Fake Accounts", percent: 28, color: "#818cf8" },
    { name: "Cyberbullying & Harassment", percent: 18, color: "#f43f5e" },
    { name: "E-commerce & Fraud", percent: 12, color: "#fbbf24" }
  ];

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
              <span className="meta-pill verified">✔ Citizen ID: {userProfile.citizenId}</span>
              <span className="meta-pill">📍 {userProfile.city} Jurisdiction</span>
              <span className="meta-pill">🛡 Safety Rating: {userProfile.safetyScore}%</span>
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

      {/* 3. Interactive Data Visualizations & Charts */}
      <section className="charts-dual-grid">
        {/* Crime Reporting Monthly Trends Chart */}
        <div className="chart-card-box">
          <div className="chart-card-header">
            <h3>
              <FaChartLine style={{ color: "#38bdf8" }} />
              Regional Crime Reporting Analytics
            </h3>
            <span className="chart-badge-filter">Trend (Last 6 Months)</span>
          </div>

          <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "0 0 10px" }}>
            Monthly count of cyber and civil offenses reported in your jurisdiction:
          </p>

          <div className="custom-bar-chart">
            {monthlyData.map((item, idx) => (
              <div key={idx} className="bar-column">
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: item.height }}
                  >
                    <span className="bar-tooltip">{item.count} cases</span>
                  </div>
                </div>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Crime Category Distribution */}
        <div className="chart-card-box">
          <div className="chart-card-header">
            <h3>
              <FaChartPie style={{ color: "#818cf8" }} />
              Offense Breakdown
            </h3>
            <span className="chart-badge-filter">By Category</span>
          </div>

          <div className="category-bars-list">
            {categoryStats.map((cat, idx) => (
              <div key={idx} className="cat-item">
                <div className="cat-header">
                  <span>{cat.name}</span>
                  <span>{cat.percent}%</span>
                </div>
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-fill"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom Grid: Recent Activity & Quick Action Widgets */}
      <section className="dashboard-bottom-grid">
        {/* Recent Complaints Activity */}
        <div className="recent-complaints-card">
          <div className="chart-card-header">
            <h3>
              <FaShieldAlt style={{ color: "#38bdf8" }} />
              Recent Filed Complaints
            </h3>
            <Link
              to="/dashboard/my-complaints"
              style={{
                color: "#38bdf8",
                fontSize: "0.82rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              View all ({complaints.length}) <FaArrowRight />
            </Link>
          </div>

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
                {complaints.slice(0, 4).map((c) => (
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
                        style={{
                          color: "#38bdf8",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "600"
                        }}
                      >
                        <FaEye /> Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Widgets: Nearest Police Station & Cyber Tips */}
        <div className="side-widgets-col">
          {/* Nearest Station Widget */}
          <div className="quick-station-card">
            <div className="quick-station-header">
              <FaBuilding className="station-pin-icon" />
              <h4>Nearest Police Station</h4>
            </div>

            <div className="station-details-box">
              <div className="station-name-bold">Cyber Crime Cell - Central</div>
              <div className="station-dist-sub">
                <span>📍 1.8 km away • Open 24/7</span>
                <span style={{ color: "#34d399", fontWeight: "600" }}>Active Duty</span>
              </div>
            </div>

            <a href="tel:01123456789" className="btn-station-call">
              <FaPhoneAlt /> Call Duty Officer (011-23456789)
            </a>
          </div>

          {/* AI Security Tip Widget */}
          <div className="quick-station-card" style={{ borderLeft: "4px solid #38bdf8" }}>
            <div className="quick-station-header">
              <FaShieldAlt style={{ color: "#38bdf8", fontSize: "1.2rem" }} />
              <h4>AI Safety Tip of the Day</h4>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.4", margin: "0" }}>
              Never share OTP or banking passwords with anyone pretending to be a bank official or police investigator. Legitimate authorities never ask for PINs or 2FA codes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
