import React, { useState } from "react";
import "../../css/dashboard/DashboardPages.css";
import {
  FaBuilding,
  FaSearch,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUserShield,
  FaEnvelope,
  FaDirections,
  FaShieldAlt
} from "react-icons/fa";

const stationsData = [
  {
    id: 1,
    name: "Central Cyber Crime Police Station",
    jurisdiction: "Central Zone & Tech Park",
    sho: "Inspector Rajesh Verma",
    phone: "+91 11-2345-6789",
    altPhone: "1930 (Cyber Helpline)",
    email: "cyber.central@police.gov.in",
    address: "Cyber Cell HQ, Block 4, Metro Police Complex, Metro City",
    timing: "24/7 Active Duty",
    distance: "1.8 km",
    specialty: "Cyber Fraud, Data Theft, Phishing, Online Scams"
  },
  {
    id: 2,
    name: "Metro North Division Police Station",
    jurisdiction: "North District & Suburbs",
    sho: "ACP Vikramaditya Roy",
    phone: "+91 11-2871-3344",
    altPhone: "100",
    email: "north.division@police.gov.in",
    address: "Old Secretariat Road, Sector 8, North District",
    timing: "24/7 Active Duty",
    distance: "3.4 km",
    specialty: "General Civil Law, Theft, FIR Registration"
  },
  {
    id: 3,
    name: "Women & Child Safety Special Cell",
    jurisdiction: "Metropolitan Area",
    sho: "Sub-Inspector Priya Sharma",
    phone: "+91 11-2655-9090",
    altPhone: "1091 (Women Helpline)",
    email: "women.safety@police.gov.in",
    address: "Civic Centre Tower, 2nd Floor, Downtown Avenue",
    timing: "24/7 Dedicated Support",
    distance: "2.6 km",
    specialty: "Harassment, Stalking, Cyber Defamation, Child Protection"
  },
  {
    id: 4,
    name: "Financial Crime & Economic Offenses Wing",
    jurisdiction: "Commercial & Banking Hub",
    sho: "DCP Anand Saxena",
    phone: "+91 11-2490-1122",
    altPhone: "+91 11-2490-1123",
    email: "eow.crime@police.gov.in",
    address: "Bank Street, Financial Towers, South Enclave",
    timing: "09:00 AM - 08:00 PM (Emergency Desk 24/7)",
    distance: "4.1 km",
    specialty: "Banking Frauds, Ponzi Schemes, E-commerce scams"
  },
  {
    id: 5,
    name: "South Hills Police Station",
    jurisdiction: "South Zone & University Campus",
    sho: "Inspector Deepa Menon",
    phone: "+91 11-2980-4567",
    altPhone: "112",
    email: "south.hills@police.gov.in",
    address: "Near University Gate 3, South Hills Road",
    timing: "24/7 Active Duty",
    distance: "5.0 km",
    specialty: "Campus Security, Public Safety, Cyber Cell Desk"
  },
  {
    id: 6,
    name: "East Coast Traffic & Crime Precinct",
    jurisdiction: "East Harbor & Coastal Highway",
    sho: "Inspector Tariq Khan",
    phone: "+91 11-2311-8899",
    altPhone: "103 (Traffic Police)",
    email: "east.precinct@police.gov.in",
    address: "Harbor Ring Road, Sector 12",
    timing: "24/7 Active Duty",
    distance: "6.7 km",
    specialty: "Highway Patrol, Emergency Response, Traffic Incidents"
  }
];

const PoliceDirectoryPage = () => {
  const [search, setSearch] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("All");

  const filteredStations = stationsData.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.jurisdiction.toLowerCase().includes(search.toLowerCase()) ||
      st.sho.toLowerCase().includes(search.toLowerCase()) ||
      st.specialty.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      selectedJurisdiction === "All" ||
      st.specialty.toLowerCase().includes(selectedJurisdiction.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dash-page-container">
      {/* Page Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2>
            <FaBuilding style={{ color: "#38bdf8" }} />
            Police Station & Cyber Cell Directory
          </h2>
          <p>
            Find authorized stations, station house officers (SHO), 24/7 contact phone numbers, and jurisdiction details.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="complaints-filter-bar">
        {/* Specialty Filter */}
        <div className="filter-tabs-group">
          {["All", "Cyber", "Women", "Financial", "General"].map((cat) => (
            <button
              key={cat}
              className={`filter-tab-btn ${selectedJurisdiction === cat ? "active" : ""}`}
              onClick={() => setSelectedJurisdiction(cat)}
            >
              {cat === "All" ? "All Stations" : `${cat} Cell`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: "280px" }}>
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
            placeholder="Search by station, officer, or crime type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="directory-grid">
        {filteredStations.map((station) => (
          <div key={station.id} className="station-card">
            <div>
              <div className="station-card-top">
                <span className="station-badge-jurisdiction">
                  📍 {station.distance} away
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "#34d399",
                    background: "rgba(16, 185, 129, 0.15)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontWeight: "600"
                  }}
                >
                  {station.timing}
                </span>
              </div>

              <h3 className="station-card-name">{station.name}</h3>

              <div style={{ marginTop: "14px" }}>
                <div className="station-info-row">
                  <FaUserShield className="station-info-icon" />
                  <span>
                    <strong>SHO / In-Charge:</strong> {station.sho}
                  </span>
                </div>

                <div className="station-info-row">
                  <FaMapMarkerAlt className="station-info-icon" />
                  <span>{station.address}</span>
                </div>

                <div className="station-info-row">
                  <FaShieldAlt className="station-info-icon" />
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    <strong>Specialization:</strong> {station.specialty}
                  </span>
                </div>

                <div className="station-info-row">
                  <FaEnvelope className="station-info-icon" />
                  <span>{station.email}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <a
                href={`tel:${station.phone}`}
                className="btn-station-call"
                style={{ flex: 1 }}
              >
                <FaPhoneAlt /> Call ({station.phone})
              </a>

              <button
                className="complaint-action-btn"
                style={{ padding: "8px 14px" }}
                onClick={() =>
                  alert(`Navigating to ${station.name} via GPS Map (Simulated)...`)
                }
                title="Get Directions"
              >
                <FaDirections /> Route
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoliceDirectoryPage;
