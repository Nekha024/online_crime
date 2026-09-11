import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/dashboard/DashboardPages.css";
import {
  FaBuilding,
  FaSearch,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUserShield,
  FaEnvelope,
  FaDirections,
  FaShieldAlt,
  FaSyncAlt
} from "react-icons/fa";

const PoliceDirectoryPage = () => {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8000/api/police/stations/");
      if (res.data?.success) {
        setStations(res.data.stations || []);
      }
    } catch (err) {
      console.error("Error fetching police stations from database:", err);
      setError("Unable to load live police stations from database. Please ensure backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const STATIONS_PER_PAGE = 24;

  // Compute unique districts from database results
  const districts = ["All", ...Array.from(new Set(stations.map(s => s.police_district).filter(Boolean))).sort()];

  const filteredStations = stations.filter((st) => {
    const term = search.toLowerCase();
    const matchesSearch =
      st.station_name.toLowerCase().includes(term) ||
      st.police_district.toLowerCase().includes(term) ||
      st.station_code.toLowerCase().includes(term) ||
      (st.station_type && st.station_type.toLowerCase().includes(term)) ||
      (st.location_name && st.location_name.toLowerCase().includes(term));

    const matchesDistrict = selectedDistrict === "All" || st.police_district === selectedDistrict;
    const matchesType = selectedType === "All" || (st.station_type && st.station_type.toLowerCase().includes(selectedType.toLowerCase()));

    return matchesSearch && matchesDistrict && matchesType;
  });

  const totalPages = Math.ceil(filteredStations.length / STATIONS_PER_PAGE) || 1;
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * STATIONS_PER_PAGE,
    currentPage * STATIONS_PER_PAGE
  );

  return (
    <div className="dash-page-container">
      {/* Page Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2>
            <FaBuilding style={{ color: "#1e3a8a" }} />
            Police Station & Cyber Cell Directory
          </h2>
          <p>
            Official Kerala Police Directory synced from the central database. Filter by district, station type, or search by station name.
          </p>
        </div>

        <button 
          onClick={fetchStations} 
          className="complaint-action-btn"
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px" }}
          title="Refresh database records"
        >
          <FaSyncAlt className={isLoading ? "fa-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="complaints-filter-bar" style={{ flexWrap: "wrap", gap: "12px" }}>
        {/* District Selector */}
        <div style={{ minWidth: "180px" }}>
          <select 
            className="form-input" 
            style={{ height: "40px", borderRadius: "6px", padding: "0 12px", background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1" }}
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setCurrentPage(1);
            }}
          >
            {districts.map(d => (
              <option key={d} value={d}>{d === "All" ? "All Districts" : d}</option>
            ))}
          </select>
        </div>

        {/* Type Filter Tabs */}
        <div className="filter-tabs-group">
          {["All", "Cyber", "Traffic", "Women", "Coastal", "General"].map((cat) => (
            <button
              key={cat}
              className={`filter-tab-btn ${selectedType === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedType(cat);
                setCurrentPage(1);
              }}
            >
              {cat === "All" ? "All Types" : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
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
            style={{ paddingLeft: "38px", height: "40px", borderRadius: "6px", width: "100%" }}
            placeholder="Search by station name, district, or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Status Indicators */}
      {error && (
        <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: "12px 16px", borderRadius: "6px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#1e3a8a" }}>
          <FaSyncAlt className="fa-spin" style={{ fontSize: "1.8rem", marginBottom: "12px" }} />
          <div>Loading verified police stations from database...</div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "16px", color: "#64748b", fontSize: "0.88rem" }}>
            Showing <strong>{(currentPage - 1) * STATIONS_PER_PAGE + 1}</strong>–<strong>{Math.min(currentPage * STATIONS_PER_PAGE, filteredStations.length)}</strong> of <strong>{filteredStations.length}</strong> verified police stations in database
          </div>

          {/* Directory Grid */}
          <div className="directory-grid">
            {paginatedStations.map((station) => (
              <div key={station.id} className="station-card">
                <div>
                  <div className="station-card-top">
                    <span className="station-badge-jurisdiction">
                      📍 {station.police_district}
                    </span>
                    <span
                      style={{
                        fontSize: "0.74rem",
                        color: station.station_type === "Cyber" ? "#1e3a8a" : "#166534",
                        background: station.station_type === "Cyber" ? "#eff6ff" : "#f0fdf4",
                        border: station.station_type === "Cyber" ? "1px solid #bfdbfe" : "1px solid #bbf7d0",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontWeight: "600"
                      }}
                    >
                      {station.station_type || "General"}
                    </span>
                  </div>

                  <h3 className="station-card-name">{station.station_name}</h3>

                  <div style={{ marginTop: "14px" }}>
                    <div className="station-info-row">
                      <FaUserShield className="station-info-icon" />
                      <span>
                        <strong>Code:</strong> {station.station_code}
                      </span>
                    </div>

                    <div className="station-info-row">
                      <FaMapMarkerAlt className="station-info-icon" />
                      <span>{station.address || `${station.location_name || station.station_name}, ${station.revenue_district}, ${station.state}`}</span>
                    </div>

                    <div className="station-info-row">
                      <FaShieldAlt className="station-info-icon" />
                      <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
                        <strong>Jurisdiction:</strong> {station.police_district} Division
                      </span>
                    </div>

                    {station.email && (
                      <div className="station-info-row">
                        <FaEnvelope className="station-info-icon" />
                        <span>{station.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                  <a
                    href={`tel:${station.phone || "112"}`}
                    className="btn-station-call"
                    style={{ flex: 1 }}
                  >
                    <FaPhoneAlt /> {station.phone ? `Call (${station.phone})` : "Helpline (112)"}
                  </a>

                  <button
                    className="complaint-action-btn"
                    style={{ padding: "8px 14px" }}
                    onClick={() =>
                      alert(`GPS location for ${station.station_name} (${station.police_district})`)
                    }
                    title="Station Location"
                  >
                    <FaDirections /> Location
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="directory-pagination">
              <div className="page-info-text">
                Showing <strong>{(currentPage - 1) * STATIONS_PER_PAGE + 1}</strong>–<strong>{Math.min(currentPage * STATIONS_PER_PAGE, filteredStations.length)}</strong> of <strong>{filteredStations.length}</strong> stations
              </div>
              <div className="pagination-controls">
                <button
                  className="page-nav-btn"
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span className="page-number-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="page-nav-btn"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PoliceDirectoryPage;
