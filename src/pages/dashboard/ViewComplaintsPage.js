import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "../../css/dashboard/DashboardPages.css";
import {
  FaListAlt,
  FaSearch,
  FaEye,
  FaTimes,
  FaFilePdf,
  FaBuilding,
  FaUserShield,
  FaPlus
} from "react-icons/fa";
import { useCrime } from "../../context/CrimeContext";

const ViewComplaintsPage = () => {
  const { complaints } = useCrime();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Check URL query parameters if coming from search or quick link
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get("id");
    const searchParam = params.get("search");

    if (idParam) {
      const match = complaints.find((c) => c.id === idParam);
      if (match) setSelectedComplaint(match);
    }

    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search, complaints]);

  // Filter complaints based on tab and search query
  const filteredComplaints = complaints.filter((item) => {
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "Pending"
        ? item.status === "Pending Review"
        : activeTab === "Investigation"
        ? item.status === "Under Investigation"
        : activeTab === "Resolved"
        ? item.status === "Resolved"
        : true;

    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="dash-page-container">
      {/* Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2>
            <FaListAlt style={{ color: "#38bdf8" }} />
            My Complaints & FIR Tracker
          </h2>
          <p>
            Monitor real-time progress, assigned investigation officers, and police status updates for all your filed reports.
          </p>
        </div>
        <Link to="/dashboard/file-complaint" className="btn-file-quick">
          <FaPlus /> File New Complaint
        </Link>
      </div>

      {/* Filter Bar & Search */}
      <div className="complaints-filter-bar">
        {/* Status Tabs */}
        <div className="filter-tabs-group">
          {["All", "Pending", "Investigation", "Resolved"].map((tab) => (
            <button
              key={tab}
              className={`filter-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "All" ? `All (${complaints.length})` : tab}
            </button>
          ))}
        </div>

        {/* Search inside complaints */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <FaSearch
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b"
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "38px", height: "42px", borderRadius: "20px" }}
            placeholder="Filter by FIR, title, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Complaints Table Card */}
      <div className="recent-complaints-card">
        <div className="table-responsive">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>FIR Number</th>
                <th>Incident Details</th>
                <th>Category</th>
                <th>Date Filed</th>
                <th>Station / Officer</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="fir-code-tag">{c.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        📍 {c.location}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                        {c.category}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{c.date}</td>
                    <td>
                      <div style={{ fontSize: "0.82rem", color: "#f1f5f9" }}>
                        {c.officer}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        {c.station}
                      </div>
                    </td>
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
                      <button
                        className="complaint-action-btn"
                        onClick={() => setSelectedComplaint(c)}
                      >
                        <FaEye /> View Case
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No complaints matching your criteria found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details & Investigation Timeline Modal */}
      {selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setSelectedComplaint(null)}>
          <div className="tracking-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSelectedComplaint(null)}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: "18px" }}>
              <span className="fir-code-tag" style={{ fontSize: "0.9rem" }}>
                {selectedComplaint.id}
              </span>
              <h3 style={{ color: "#fff", fontSize: "1.25rem", marginTop: "8px" }}>
                {selectedComplaint.title}
              </h3>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <span className="meta-pill">Category: {selectedComplaint.category}</span>
                <span className="meta-pill">Date: {selectedComplaint.date}</span>
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "0.85rem",
                color: "#cbd5e1",
                marginBottom: "20px",
                lineHeight: "1.5"
              }}
            >
              <strong>Description:</strong> {selectedComplaint.description}
            </div>

            {/* Station & Officer Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px"
              }}
            >
              <div style={{ background: "rgba(56, 189, 248, 0.08)", padding: "12px", borderRadius: "10px" }}>
                <div style={{ fontSize: "0.72rem", color: "#38bdf8", textTransform: "uppercase" }}>
                  <FaUserShield /> Assigned Officer
                </div>
                <div style={{ fontWeight: "600", color: "#fff", marginTop: "2px" }}>
                  {selectedComplaint.officer}
                </div>
              </div>

              <div style={{ background: "rgba(56, 189, 248, 0.08)", padding: "12px", borderRadius: "10px" }}>
                <div style={{ fontSize: "0.72rem", color: "#38bdf8", textTransform: "uppercase" }}>
                  <FaBuilding /> Station Jurisdiction
                </div>
                <div style={{ fontWeight: "600", color: "#fff", marginTop: "2px" }}>
                  {selectedComplaint.station}
                </div>
              </div>
            </div>

            {/* Step-by-Step Investigation Timeline Flow */}
            <h4 style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "12px" }}>
              Case Investigation Timeline
            </h4>
            <div className="case-timeline-flow">
              {selectedComplaint.timeline && selectedComplaint.timeline.length > 0 ? (
                selectedComplaint.timeline.map((step, idx) => (
                  <div key={idx} className="timeline-step-item">
                    <div className="timeline-step-dot" />
                    <div className="timeline-step-title">{step.status}</div>
                    <div className="timeline-step-time">{step.date}</div>
                    <div className="timeline-step-note">{step.note}</div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Timeline initiated.</p>
              )}
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="complaint-action-btn"
                style={{ padding: "10px 18px" }}
                onClick={() => alert(`Downloading official digital FIR copy for ${selectedComplaint.id}...`)}
              >
                <FaFilePdf /> Download FIR Copy (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComplaintsPage;
