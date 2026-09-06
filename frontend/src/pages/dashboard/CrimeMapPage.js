import React, { useState } from "react";
import "../../css/dashboard/DashboardPages.css";
import {
  FaMapMarkedAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCompass,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

const mapNodes = [
  {
    id: 1,
    name: "Downtown Financial District",
    type: "high",
    risk: "High Alert",
    top: "35%",
    left: "48%",
    incidents: "14 reported this week",
    station: "Cyber Crime Cell - Central",
    note: "High volume of banking phishing & card skimming reports."
  },
  {
    id: 2,
    name: "Tech Park & IT Corridor",
    type: "medium",
    risk: "Moderate Risk",
    top: "22%",
    left: "68%",
    incidents: "6 reported this week",
    station: "East Coast Precinct",
    note: "E-Commerce delivery fraud & scam job offers."
  },
  {
    id: 3,
    name: "Greenwood Residential Suburb",
    type: "safe",
    risk: "Safe Zone",
    top: "65%",
    left: "30%",
    incidents: "1 reported this month",
    station: "Metro North Division",
    note: "Active community policing and low incident density."
  },
  {
    id: 4,
    name: "Central Metro Transit Terminal",
    type: "high",
    risk: "High Alert",
    top: "48%",
    left: "25%",
    incidents: "11 reported this week",
    station: "Central Cyber Crime Police Station",
    note: "Public Wi-Fi packet sniffing & fake QR code scams reported."
  },
  {
    id: 5,
    name: "University Campus Enclave",
    type: "safe",
    risk: "Safe Zone",
    top: "75%",
    left: "72%",
    incidents: "2 reported this month",
    station: "South Hills Police Station",
    note: "Dedicated student safety patrols active 24/7."
  },
  {
    id: 6,
    name: "North Commercial Complex",
    type: "medium",
    risk: "Moderate Risk",
    top: "18%",
    left: "32%",
    incidents: "5 reported this week",
    station: "North Division Station",
    note: "Counterfeit merchant POS devices under investigation."
  }
];

const CrimeMapPage = () => {
  const [selectedNode, setSelectedNode] = useState(mapNodes[0]);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredNodes = mapNodes.filter((node) => {
    if (activeFilter === "all") return true;
    return node.type === activeFilter;
  });

  return (
    <div className="dash-page-container">
      {/* Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2>
            <FaMapMarkedAlt style={{ color: "#38bdf8" }} />
            Live Crime & Safety Hotspot Map
          </h2>
          <p>
            Interactive GIS map visual highlighting regional risk zones, police patrol coverage, and active incident hotspots.
          </p>
        </div>
      </div>

      {/* Main Map Canvas Card */}
      <div className="crime-map-wrapper">
        {/* Floating Map Control Info */}
        <div className="map-control-overlay">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaCompass style={{ color: "#38bdf8" }} />
            <strong style={{ color: "#fff", fontSize: "0.85rem" }}>
              Metro City Crime Index
            </strong>
          </div>

          <div className="map-legend-pills">
            <button
              onClick={() => setActiveFilter("all")}
              className={`filter-tab-btn ${activeFilter === "all" ? "active" : ""}`}
              style={{ padding: "3px 8px", fontSize: "0.72rem" }}
            >
              All Zones
            </button>
            <button
              onClick={() => setActiveFilter("high")}
              className={`filter-tab-btn ${activeFilter === "high" ? "active" : ""}`}
              style={{ padding: "3px 8px", fontSize: "0.72rem" }}
            >
              <span className="legend-color-dot high" style={{ display: "inline-block", marginRight: "4px" }} /> High Alert
            </button>
            <button
              onClick={() => setActiveFilter("medium")}
              className={`filter-tab-btn ${activeFilter === "medium" ? "active" : ""}`}
              style={{ padding: "3px 8px", fontSize: "0.72rem" }}
            >
              <span className="legend-color-dot medium" style={{ display: "inline-block", marginRight: "4px" }} /> Moderate
            </button>
            <button
              onClick={() => setActiveFilter("safe")}
              className={`filter-tab-btn ${activeFilter === "safe" ? "active" : ""}`}
              style={{ padding: "3px 8px", fontSize: "0.72rem" }}
            >
              <span className="legend-color-dot safe" style={{ display: "inline-block", marginRight: "4px" }} /> Safe
            </button>
          </div>
        </div>

        {/* Map Canvas Background */}
        <div className="map-canvas-visual">
          <div className="map-grid-lines" />

          {/* Render Zone Node Pins */}
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              className="map-zone-node"
              style={{ top: node.top, left: node.left }}
              onClick={() => setSelectedNode(node)}
            >
              <div className={`zone-pulse-circle ${node.type}`}>
                {node.type === "high" && <FaExclamationTriangle />}
                {node.type === "medium" && <FaInfoCircle />}
                {node.type === "safe" && <FaCheckCircle />}
              </div>

              {selectedNode && selectedNode.id === node.id && (
                <div className="zone-tooltip-card">
                  <div style={{ fontWeight: "700", color: "#fff", fontSize: "0.85rem" }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#38bdf8" }}>
                    {node.risk} • {node.incidents}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Zone Details & Safety Advisory Box */}
      {selectedNode && (
        <div className="recent-complaints-card">
          <div className="chart-card-header">
            <h3>
              <FaShieldAlt style={{ color: "#38bdf8" }} />
              Zone Safety Analysis: {selectedNode.name}
            </h3>
            <span
              className={`status-pill ${
                selectedNode.type === "high"
                  ? "pending"
                  : selectedNode.type === "medium"
                  ? "investigation"
                  : "resolved"
              }`}
            >
              {selectedNode.risk}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "10px"
            }}
          >
            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "12px" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Recent Incidents:</div>
              <div style={{ fontWeight: "700", color: "#f8fafc", fontSize: "1rem", marginTop: "4px" }}>
                {selectedNode.incidents}
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "12px" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Station In Charge:</div>
              <div style={{ fontWeight: "700", color: "#38bdf8", fontSize: "0.95rem", marginTop: "4px" }}>
                {selectedNode.station}
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "12px" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Advisory / Notes:</div>
              <div style={{ color: "#cbd5e1", fontSize: "0.82rem", marginTop: "4px" }}>
                {selectedNode.note}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrimeMapPage;
