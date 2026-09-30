import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/dashboard/DashboardPages.css";
import api from "../../api/api";
import {
  FaFileSignature,
  FaUpload,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaExclamationCircle,
  FaShieldAlt,
  FaCheck,
  FaMicrophone,
  FaStop,
  FaPlay,
  FaBuilding,
  FaExclamationTriangle,
  FaTrash,
  FaSearch,
  FaTimes,
  FaIdCard,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

// Fix Leaflet's default marker icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Crime categories covering both physical and digital crimes
const CRIME_CATEGORIES = [
  { group: "Physical Property", options: ["Burglary / House Break-in", "Vehicle Theft / Robbery", "Vandalism / Property Damage", "Chain Snatching / Mugging", "Mobile Phone Theft"] },
  { group: "Public Safety & Order", options: ["Suspicious Activity", "Noise Complaint", "Illegal Dumping", "Road Rage / Accident", "Public Intoxication / Nuisance"] },
  { group: "Interpersonal / Violence", options: ["Assault / Physical Attack", "Harassment / Stalking", "Domestic Violence", "Threats / Intimidation"] },
  { group: "Cyber / Financial", options: ["Online Financial Fraud / UPI Scam", "Phishing & Credential Theft", "Cyberbullying / Online Harassment", "Identity Theft", "Social Media Impersonation"] },
  { group: "Other", options: ["Missing Person", "Missing / Found Animal", "Other Incident"] },
];

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to programmatically fly the map to a searched location
function FlyToLocation({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom || 15, { duration: 1.2 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

const FileComplaintPage = () => {
  const navigate = useNavigate();

  // Emergency acknowledgement gate
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "Medium",
    location: "",
    incidentDate: new Date().toISOString().split("T")[0],
    description: "",
    suspectDetails: "",
    complainantName: "",
    complainantContact: "",
  });

  // Location pin on map
  const [pinLat, setPinLat] = useState(null);
  const [pinLon, setPinLon] = useState(null);
  const [mapCenter] = useState([10.8505, 76.2711]); // Kerala, India
  const [flyTarget, setFlyTarget] = useState({ lat: null, lng: null });

  // Map search state
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Government ID upload
  const [govtIdType, setGovtIdType] = useState("");
  const [govtIdFile, setGovtIdFile] = useState(null);

  // Evidence file
  const [evidenceFile, setEvidenceFile] = useState(null);

  // Audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Station selection
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState("auto");
  const [loadingStations, setLoadingStations] = useState(false);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch police stations on mount
  useEffect(() => {
    setLoadingStations(true);
    api.get("api/police/stations/")
      .then((res) => {
        if (res.data && res.data.stations) setStations(res.data.stations);
      })
      .catch(() => {})
      .finally(() => setLoadingStations(false));
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Map location select with reverse geocoding ---
  const handleLocationSelect = useCallback((lat, lon) => {
    setPinLat(lat);
    setPinLon(lon);
    // Reverse geocode to fill location text
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.display_name) {
          setFormData((prev) => ({ ...prev, location: data.display_name }));
          setMapSearchQuery(data.display_name);
        }
      })
      .catch(() => {});
  }, []);

  // --- Map search handlers ---
  const handleMapSearch = useCallback((query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    setIsSearchingMap(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data || []);
        setShowSearchResults(true);
      })
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearchingMap(false));
  }, []);

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setMapSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => handleMapSearch(val), 500);
  };

  const handleSearchResultSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPinLat(lat);
    setPinLon(lng);
    setFlyTarget({ lat, lng });
    setFormData((prev) => ({ ...prev, location: result.display_name }));
    setMapSearchQuery(result.display_name);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const clearMapPin = () => {
    setPinLat(null);
    setPinLon(null);
    setFormData((prev) => ({ ...prev, location: "" }));
    setMapSearchQuery("");
    setFlyTarget({ lat: null, lng: null });
  };

  const handleGovtIdFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGovtIdFile(e.target.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  // --- Audio Recording ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied. Please allow microphone access in browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  // --- Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!pinLat || !pinLon) {
      setErrorMessage("Please drop a pin on the map to indicate the incident location.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.category) {
      setErrorMessage("Please select a crime/incident category.");
      setIsSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("complaint_type", formData.category);
      fd.append("priority", formData.priority);
      fd.append("location", formData.location || `${pinLat.toFixed(5)}, ${pinLon.toFixed(5)}`);
      fd.append("description", formData.description);
      fd.append("evidence_info", formData.suspectDetails);
      fd.append("complainant_name", formData.complainantName || "Anonymous");
      fd.append("complainant_contact", formData.complainantContact);
      fd.append("latitude", pinLat);
      fd.append("longitude", pinLon);
      fd.append("station_id", stationId);

      if (evidenceFile) fd.append("evidence_file", evidenceFile);
      if (audioBlob) fd.append("audio_file", audioBlob, "voice_statement.webm");
      if (govtIdType) fd.append("govt_id_type", govtIdType);
      if (govtIdFile) fd.append("govt_id_file", govtIdFile);

      const response = await api.post("api/complaints/submit/", fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201 || response.status === 200) {
        const data = response.data;
        // Save to localStorage so guest users can track their complaints
        const existingIds = JSON.parse(localStorage.getItem('myComplaintIds') || '[]');
        if (!existingIds.includes(data.complaint_id)) {
          existingIds.push(data.complaint_id);
          localStorage.setItem('myComplaintIds', JSON.stringify(existingIds));
        }

        setSuccessMessage(`Complaint Registered! ID: ${data.complaint_id}`);
        // Optionally reload the page to refresh context, or we can just rely on the redirect and tell the user to refresh.
        // The best way without modifying context is a full reload to the complaints page
        setTimeout(() => {
            window.location.href = "/dashboard/my-complaints";
        }, 2000);
      } else {
        setErrorMessage("Submission failed: Unexpected response");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage("Submission failed: " + JSON.stringify(error.response.data));
      } else {
        setErrorMessage("Error connecting to server. Please ensure the backend is running.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Emergency Gate ---
  if (!emergencyAcknowledged) {
    return (
      <div className="dash-page-container">
        <div style={{
          background: "#fff5f5",
          border: "2px solid #ef4444",
          borderRadius: "12px",
          padding: "36px",
          maxWidth: "640px",
          margin: "40px auto",
          textAlign: "center",
        }}>
          <FaExclamationTriangle style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ color: "#7f1d1d", marginBottom: "12px" }}>⚠️ Important Safety Notice</h2>
          <p style={{ color: "#991b1b", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "20px" }}>
            <strong>If this is an active emergency or someone is in immediate danger,
            do NOT use this form.</strong>
          </p>
          <div style={{ background: "#fee2e2", borderRadius: "8px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
            <p style={{ margin: "4px 0", color: "#7f1d1d", fontWeight: 600 }}>📞 Police Emergency: <span style={{ fontSize: "1.2rem" }}>100</span></p>
            <p style={{ margin: "4px 0", color: "#7f1d1d", fontWeight: 600 }}>📞 National Emergency: <span style={{ fontSize: "1.2rem" }}>112</span></p>
            <p style={{ margin: "4px 0", color: "#7f1d1d", fontWeight: 600 }}>📞 Cyber Crime Helpline: <span style={{ fontSize: "1.2rem" }}>1930</span></p>
          </div>
          <p style={{ color: "#374151", marginBottom: "24px", fontSize: "0.92rem" }}>
            This online reporting system is for non-emergency incidents. Reports are reviewed by police officers during regular hours.
          </p>
          <button
            onClick={() => setEmergencyAcknowledged(true)}
            style={{
              background: "#1e3a8a",
              color: "white",
              border: "none",
              padding: "14px 28px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
            }}
          >
            I understand — this is NOT an emergency. Proceed to report.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page-container">
      {/* Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2><FaFileSignature style={{ color: "#1e3a8a" }} /> File New Crime / Incident Report</h2>
          <p>Submit incident reports directly to the nearest or chosen police station.</p>
        </div>
      </div>

      {/* Success */}
      {successMessage && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "16px 20px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600", marginBottom: "16px" }}>
          <FaCheck /> {successMessage}
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "16px 20px", borderRadius: "8px", marginBottom: "16px" }}>
          <FaExclamationCircle style={{ marginRight: "8px" }} /> {errorMessage}
        </div>
      )}

      <div className="complaint-form-card">
        <form onSubmit={handleSubmit}>

          {/* ── Section 1: Basic Info ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "16px" }}>
              1. Incident Details
            </h3>

            <div className="form-group-full" style={{ marginBottom: "16px" }}>
              <label className="form-label"><FaTag /> Incident Title *</label>
              <input type="text" name="title" className="form-input" placeholder="e.g. Motorcycle stolen from parking lot near temple" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-grid-dual" style={{ marginBottom: "16px" }}>
              <div>
                <label className="form-label"><FaShieldAlt /> Crime / Incident Category *</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                  <option value="">— Select Category —</option>
                  {CRIME_CATEGORIES.map((grp) => (
                    <optgroup key={grp.group} label={grp.group}>
                      {grp.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label"><FaExclamationCircle /> Severity / Priority</label>
                <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                  <option value="Critical">Critical (Immediate Threat / Ongoing)</option>
                  <option value="High">High (Recent, Serious Incident)</option>
                  <option value="Medium">Medium (Active Issue, Not Immediate)</option>
                  <option value="Low">Low (Minor / Historical Incident)</option>
                </select>
              </div>
            </div>

            <div className="form-grid-dual">
              <div>
                <label className="form-label"><FaCalendarAlt /> Date of Incident *</label>
                <input type="date" name="incidentDate" className="form-input" value={formData.incidentDate} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label"><FaTag /> Location Description (Optional)</label>
                <input type="text" name="location" className="form-input" placeholder="e.g. Near City Bus Stand, Ernakulam" value={formData.location} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ── Section 2: Searchable Map ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "12px" }}>
              <FaMapMarkerAlt /> 2. Incident Location *
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.87rem", marginBottom: "10px" }}>
              Search for a location below or click directly on the map to pin the exact spot.
            </p>

            {/* Search Bar */}
            <div className="fc-map-search-container" ref={searchContainerRef}>
              <div className="fc-map-search-input-wrap">
                <FaSearch className="fc-map-search-icon" />
                <input
                  type="text"
                  className="fc-map-search-input"
                  placeholder="Search location... e.g. Kochi, Marine Drive, Thiruvananthapuram"
                  value={mapSearchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchResults(true); }}
                />
                {mapSearchQuery && (
                  <button
                    type="button"
                    className="fc-map-search-clear"
                    onClick={() => { setMapSearchQuery(""); setSearchResults([]); setShowSearchResults(false); }}
                  >
                    <FaTimes />
                  </button>
                )}
                {isSearchingMap && <span className="fc-map-search-spinner" />}
              </div>

              {showSearchResults && searchResults.length > 0 && (
                <ul className="fc-map-search-results">
                  {searchResults.map((result, idx) => (
                    <li
                      key={idx}
                      className="fc-map-search-result-item"
                      onClick={() => handleSearchResultSelect(result)}
                    >
                      <FaMapMarkerAlt style={{ color: "#1e3a8a", flexShrink: 0, marginTop: "2px" }} />
                      <span>{result.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Map */}
            <div style={{ height: "360px", borderRadius: "10px", overflow: "hidden", border: "2px solid " + (pinLat ? "#22c55e" : "#e2e8f0"), transition: "border-color 0.3s ease" }}>
              <MapContainer center={mapCenter} zoom={10} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {flyTarget.lat && flyTarget.lng && (
                  <FlyToLocation lat={flyTarget.lat} lng={flyTarget.lng} zoom={15} />
                )}
                {pinLat && pinLon && <Marker position={[pinLat, pinLon]} />}
              </MapContainer>
            </div>

            {/* Pin Status */}
            {pinLat && pinLon ? (
              <div className="fc-map-pin-status pinned">
                <FaCheckCircle />
                <span>Location pinned: {formData.location || `${pinLat.toFixed(5)}°N, ${pinLon.toFixed(5)}°E`}</span>
                <button type="button" className="fc-map-clear-pin" onClick={clearMapPin}>
                  <FaTimes /> Clear
                </button>
              </div>
            ) : (
              <div className="fc-map-pin-status pending">
                <FaMapMarkerAlt />
                <span>No location selected — search or click on the map above</span>
              </div>
            )}
          </div>

          {/* ── Section 3: Description & Suspect ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "16px" }}>
              3. Incident Narrative
            </h3>

            <div className="form-group-full" style={{ marginBottom: "16px" }}>
              <label className="form-label">Detailed Description *</label>
              <textarea name="description" rows="5" className="form-textarea"
                placeholder="Describe the exact sequence of events. For physical crimes include: time, suspect clothing/vehicle/direction of escape, number of persons involved, any witnesses..."
                value={formData.description} onChange={handleChange} required />
            </div>

            <div className="form-group-full">
              <label className="form-label">Suspect / Vehicle Information (Optional)</label>
              <input type="text" name="suspectDetails" className="form-input"
                placeholder="e.g. Male, ~30 yrs, blue shirt, left on black Pulsar bike KL-10 AB 1234"
                value={formData.suspectDetails} onChange={handleChange} />
            </div>
          </div>

          {/* ── Section 4: Audio Recording ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "12px" }}>
              <FaMicrophone /> 4. Voice Statement (Optional)
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.87rem", marginBottom: "12px" }}>
              Record a spoken account of the incident. This will be attached to the report for police review.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {!isRecording && !audioUrl && (
                <button type="button" onClick={startRecording} style={{ background: "#1e3a8a", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                  <FaMicrophone /> Start Recording
                </button>
              )}

              {isRecording && (
                <button type="button" onClick={stopRecording} style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", animation: "pulse 1.5s infinite" }}>
                  <FaStop /> Stop Recording
                </button>
              )}

              {audioUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "10px 16px" }}>
                  <FaPlay style={{ color: "#166534" }} />
                  <audio controls src={audioUrl} style={{ height: "36px" }} />
                  <button type="button" onClick={clearAudio} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem" }}>
                    <FaTrash /> Remove
                  </button>
                </div>
              )}

              {isRecording && (
                <span style={{ color: "#dc2626", fontWeight: "600", fontSize: "0.9rem" }}>
                  🔴 Recording in progress...
                </span>
              )}
            </div>
          </div>

          {/* ── Section 5: Evidence Upload ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "12px" }}>
              <FaUpload /> 5. Evidence Attachment (Optional)
            </h3>
            <div className="file-upload-box" onClick={() => document.getElementById("evidenceInput").click()} style={{ cursor: "pointer" }}>
              <input type="file" id="evidenceInput" style={{ display: "none" }} onChange={handleFileChange} accept="image/*,video/*,.pdf" />
              <FaUpload style={{ fontSize: "1.8rem", color: "#1e3a8a", marginBottom: "8px" }} />
              <p style={{ color: "#0f172a", fontSize: "0.9rem", margin: "0 0 4px" }}>
                {evidenceFile ? (
                  <span style={{ color: "#1e3a8a", fontWeight: "600" }}>📎 {evidenceFile.name}</span>
                ) : (
                  "Click to upload photo, video or PDF"
                )}
              </p>
              <span style={{ color: "#64748b", fontSize: "0.78rem" }}>Supports PNG, JPG, MP4, PDF (max 25MB)</span>
            </div>
          </div>

          {/* ── Section 6: Government ID Upload (Optional) ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "12px" }}>
              <FaIdCard /> 6. Government ID Verification (Optional)
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.87rem", marginBottom: "14px" }}>
              Upload a government-issued ID for identity verification — Aadhaar, Driving Licence, or PAN Card.
            </p>

            <div className="form-grid-dual" style={{ marginBottom: "16px" }}>
              <div>
                <label className="form-label"><FaIdCard /> ID Type</label>
                <select
                  className="form-select"
                  value={govtIdType}
                  onChange={(e) => setGovtIdType(e.target.value)}
                >
                  <option value="">Select ID Type (Optional)</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Driving Licence">Driving Licence</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
              <div>
                <label className="form-label">Upload ID Image <span style={{ fontWeight: "normal", color: "#64748b", fontSize: "0.78rem" }}>(JPG, PNG up to 5MB)</span></label>
                <div
                  className="file-upload-box fc-govt-id-upload"
                  onClick={() => document.getElementById("govtIdInput").click()}
                  style={{ cursor: "pointer", padding: "16px" }}
                >
                  <input type="file" id="govtIdInput" style={{ display: "none" }} onChange={handleGovtIdFileChange} accept="image/*,.pdf" />
                  <FaIdCard style={{ fontSize: "1.5rem", color: "#1e3a8a", marginBottom: "6px" }} />
                  <p style={{ color: "#0f172a", fontSize: "0.88rem", margin: "0 0 4px" }}>
                    {govtIdFile ? (
                      <span style={{ color: "#1e3a8a", fontWeight: "600" }}>📎 {govtIdFile.name}</span>
                    ) : (
                      "Click to upload your government ID"
                    )}
                  </p>
                  <span style={{ color: "#64748b", fontSize: "0.78rem" }}>Accepted: JPG, PNG, PDF</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            {govtIdFile && govtIdFile.type && govtIdFile.type.startsWith("image/") && (
              <div style={{ marginBottom: "14px", padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                <p className="form-label" style={{ marginBottom: "8px" }}>ID Preview:</p>
                <img
                  src={URL.createObjectURL(govtIdFile)}
                  alt="Government ID Preview"
                  style={{ maxWidth: "280px", maxHeight: "180px", objectFit: "contain", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", background: "#eff6ff", borderRadius: "6px", borderLeft: "3px solid #1e3a8a", fontSize: "0.82rem", color: "#1e3a8a", lineHeight: 1.5 }}>
              <FaLock style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                Your ID details are encrypted and handled per Government of India data protection guidelines.
                This information is only accessible to authorized investigating officers.
              </span>
            </div>
          </div>

          {/* ── Section 7: Complainant Details ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "16px" }}>
              7. Your Contact Details
            </h3>
            <div className="form-grid-dual">
              <div>
                <label className="form-label">Your Name</label>
                <input type="text" name="complainantName" className="form-input" placeholder="Full name (or leave blank for anonymous)" value={formData.complainantName} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label">Phone / Email (for updates)</label>
                <input type="text" name="complainantContact" className="form-input" placeholder="e.g. 9876543210 or you@email.com" value={formData.complainantContact} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ── Section 8: Station Routing ── */}
          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "12px" }}>
              <FaBuilding /> 8. Police Station Routing
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.87rem", marginBottom: "12px" }}>
              By default, your complaint will be automatically routed to the <strong>nearest police station</strong> based on your map pin. You can also select a specific station below.
            </p>
            <select
              className="form-select"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
            >
              <option value="auto">🗺️ Auto-assign to Nearest Station (Recommended)</option>
              {loadingStations ? (
                <option disabled>Loading stations...</option>
              ) : (
                stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.station_name} — {s.police_district} ({s.station_code})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* ── Submit ── */}
          <button type="submit" className="btn-submit-complaint" disabled={isSubmitting} style={{ width: "100%" }}>
            <FaShieldAlt />
            {isSubmitting ? "Submitting Report..." : "Submit Incident Report"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default FileComplaintPage;
