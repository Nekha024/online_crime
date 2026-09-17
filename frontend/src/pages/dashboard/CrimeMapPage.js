import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/dashboard/DashboardPages.css";
import {
  FaMapMarkedAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCompass,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

// Marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom colored icons based on priority
const createCustomIcon = (color) => {
  const markerHtmlStyles = `
    background-color: ${color};
    width: 24px;
    height: 24px;
    display: block;
    left: -12px;
    top: -12px;
    position: relative;
    border-radius: 50%;
    border: 3px solid #FFFFFF;
    box-shadow: 0 0 4px rgba(0,0,0,0.4);
  `;
  return L.divIcon({
    className: "custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -30],
    html: `<span style="${markerHtmlStyles}" />`
  });
};

const iconCritical = createCustomIcon("#dc2626"); // Red
const iconHigh = createCustomIcon("#ea580c");     // Orange
const iconMedium = createCustomIcon("#eab308");   // Yellow
const iconLow = createCustomIcon("#22c55e");      // Green

const CrimeMapPage = () => {
  const [mapNodes, setMapNodes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/public/map-data/")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMapNodes(data.nodes);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredNodes = mapNodes.filter((node) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "high" && (node.priority === "Critical" || node.priority === "High")) return true;
    if (activeFilter === "medium" && node.priority === "Medium") return true;
    if (activeFilter === "safe" && node.priority === "Low") return true;
    return false;
  });

  const getIconForPriority = (priority) => {
    switch (priority) {
      case "Critical": return iconCritical;
      case "High": return iconHigh;
      case "Medium": return iconMedium;
      case "Low": return iconLow;
      default: return iconMedium;
    }
  };

  return (
    <div className="dash-page-container">
      {/* Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2>
            <FaMapMarkedAlt style={{ color: "#1e3a8a" }} />
            Live Crime & Safety Hotspot Map
          </h2>
          <p>
            Interactive map displaying real reported incidents across the city.
          </p>
        </div>
      </div>

      {/* Main Map Canvas Card */}
      <div className="crime-map-wrapper" style={{ position: "relative" }}>
        
        {/* Floating Map Control Info */}
        <div className="map-control-overlay" style={{ position: "absolute", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <FaCompass style={{ color: "#1e3a8a" }} />
            <strong style={{ color: "#0f172a", fontSize: "0.88rem" }}>
              Filter by Priority
            </strong>
          </div>
          <div className="map-legend-pills" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button onClick={() => setActiveFilter("all")} className={`filter-tab-btn ${activeFilter === "all" ? "active" : ""}`} style={{ fontSize: "0.76rem" }}>
              All Zones ({mapNodes.length})
            </button>
            <button onClick={() => setActiveFilter("high")} className={`filter-tab-btn ${activeFilter === "high" ? "active" : ""}`} style={{ fontSize: "0.76rem" }}>
              <span className="legend-color-dot high" style={{ display: "inline-block", marginRight: "4px", background: "#dc2626", width: "10px", height: "10px", borderRadius: "50%" }} /> High/Critical Alert
            </button>
            <button onClick={() => setActiveFilter("medium")} className={`filter-tab-btn ${activeFilter === "medium" ? "active" : ""}`} style={{ fontSize: "0.76rem" }}>
              <span className="legend-color-dot medium" style={{ display: "inline-block", marginRight: "4px", background: "#eab308", width: "10px", height: "10px", borderRadius: "50%" }} /> Moderate Risk
            </button>
            <button onClick={() => setActiveFilter("safe")} className={`filter-tab-btn ${activeFilter === "safe" ? "active" : ""}`} style={{ fontSize: "0.76rem" }}>
              <span className="legend-color-dot safe" style={{ display: "inline-block", marginRight: "4px", background: "#22c55e", width: "10px", height: "10px", borderRadius: "50%" }} /> Low Risk
            </button>
          </div>
        </div>

        {/* Map Canvas Background */}
        <div style={{ height: "600px", borderRadius: "12px", overflow: "hidden", border: "2px solid #e2e8f0" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#f8fafc" }}>
              Loading map data...
            </div>
          ) : (
            <MapContainer center={[10.8505, 76.2711]} zoom={9} style={{ height: "100%", width: "100%", zIndex: 1 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {filteredNodes.map((node) => (
                <Marker 
                  key={node.id} 
                  position={[node.lat, node.lng]}
                  icon={getIconForPriority(node.priority)}
                >
                  <Popup>
                    <div style={{ padding: "4px" }}>
                      <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        {node.priority} Priority
                      </div>
                      <h4 style={{ margin: "4px 0", color: "#0f172a", fontSize: "0.95rem" }}>
                        {node.title}
                      </h4>
                      <p style={{ margin: "0 0 6px", color: "#334155", fontSize: "0.8rem" }}>
                        {node.category}
                      </p>
                      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "6px", fontSize: "0.75rem", color: "#475569" }}>
                        <strong>Station:</strong> {node.station}<br/>
                        <strong>Status:</strong> {node.status}<br/>
                        <strong>Date:</strong> {node.date}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrimeMapPage;
