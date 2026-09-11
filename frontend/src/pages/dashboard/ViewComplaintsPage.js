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
            <FaListAlt style={{ color: "#1e3a8a" }} />
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
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        📍 {c.location}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.84rem", color: "#334155" }}>
                        {c.category}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "#64748b" }}>{c.date}</td>
                    <td>
                      <div style={{ fontSize: "0.84rem", color: "#0f172a", fontWeight: "500" }}>
                        {c.officer}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
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
                        className="btn-view-action"
                        onClick={() => setSelectedComplaint(c)}
                      >
                        <FaEye /> View Case
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
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
        <div className="modal-overlay-custom" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div>
                <span className="fir-code-tag">{selectedComplaint.id}</span>
                <h3 style={{ marginTop: "4px" }}>{selectedComplaint.title}</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedComplaint(null)}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body-custom">
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span className="meta-pill">Category: {selectedComplaint.category}</span>
                <span className="meta-pill">Date: {selectedComplaint.date}</span>
                <span className="meta-pill" style={{ background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" }}>
                  Status: {selectedComplaint.status}
                </span>
              </div>

              {/* Description */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "16px",
                  borderRadius: "6px",
                  fontSize: "0.88rem",
                  color: "#334155",
                  border: "1px solid #e2e8f0",
                  lineHeight: "1.6"
                }}
              >
                <strong style={{ color: "#0f172a" }}>Incident Description:</strong> {selectedComplaint.description}
              </div>

              {/* Station & Officer Info */}
              <div className="modal-info-dual">
                <div style={{ background: "#eff6ff", padding: "12px 14px", borderRadius: "6px", border: "1px solid #bfdbfe" }}>
                  <div style={{ fontSize: "0.72rem", color: "#1e3a8a", textTransform: "uppercase", fontWeight: "700" }}>
                    <FaUserShield style={{ marginRight: "4px" }} /> Assigned Officer
                  </div>
                  <div style={{ fontWeight: "600", color: "#0f172a", marginTop: "2px", fontSize: "0.92rem" }}>
                    {selectedComplaint.officer || "Station Duty Officer"}
                  </div>
                </div>

                <div style={{ background: "#eff6ff", padding: "12px 14px", borderRadius: "6px", border: "1px solid #bfdbfe" }}>
                  <div style={{ fontSize: "0.72rem", color: "#1e3a8a", textTransform: "uppercase", fontWeight: "700" }}>
                    <FaBuilding style={{ marginRight: "4px" }} /> Station Jurisdiction
                  </div>
                  <div style={{ fontWeight: "600", color: "#0f172a", marginTop: "2px", fontSize: "0.92rem" }}>
                    {selectedComplaint.station}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Investigation Timeline Flow */}
              <h4 style={{ color: "#0f172a", fontSize: "0.98rem", margin: "8px 0 0 0", fontWeight: 700 }}>
                Case Investigation Progress
              </h4>
              <div className="case-timeline-flow" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "16px" }}>
                {selectedComplaint.timeline && selectedComplaint.timeline.length > 0 ? (
                  selectedComplaint.timeline.map((step, idx) => (
                    <div key={idx} className="timeline-step-item" style={{ marginBottom: "12px", borderLeft: "2px solid #1e3a8a", paddingLeft: "12px" }}>
                      <div style={{ fontWeight: 600, color: "#1e3a8a", fontSize: "0.85rem" }}>{step.status}</div>
                      <div style={{ fontSize: "0.74rem", color: "#64748b" }}>{step.date}</div>
                      <div style={{ fontSize: "0.84rem", color: "#334155", marginTop: "2px" }}>{step.note}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#64748b", fontSize: "0.84rem", margin: 0 }}>Case timeline initiated.</p>
                )}
              </div>

              <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="btn-dash-primary"
                  onClick={() => alert(`Downloading official digital FIR copy for ${selectedComplaint.id}...`)}
                >
                  <FaFilePdf />
                  <span>Download Acknowledgment (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComplaintsPage;
