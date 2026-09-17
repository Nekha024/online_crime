import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/dashboard/DashboardPages.css";
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
    fetch("http://localhost:8000/api/police/stations/")
      .then((res) => res.json())
      .then((data) => {
        if (data.stations) setStations(data.stations);
      })
      .catch(() => {})
      .finally(() => setLoadingStations(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (lat, lon) => {
    setPinLat(lat);
    setPinLon(lon);
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

      const response = await fetch("http://localhost:8000/api/complaints/submit/", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Save to localStorage so guest users can track their complaints
        const existingIds = JSON.parse(localStorage.getItem('myComplaintIds') || '[]');
        if (!existingIds.includes(data.complaint_id)) {
          existingIds.push(data.complaint_id);
          localStorage.setItem('myComplaintIds', JSON.stringify(existingIds));
        }

        setSuccessMessage(`Complaint Registered! ID: ${data.complaint_id}`);
        setTimeout(() => navigate("/dashboard/my-complaints"), 2000);
      } else {
        const err = await response.json();
        setErrorMessage("Submission failed: " + JSON.stringify(err));
      }
    } catch (error) {
      setErrorMessage("Error connecting to server. Please ensure the backend is running.");
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

          {/* ── Section 2: Map ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "12px" }}>
              <FaMapMarkerAlt /> 2. Incident Location (Drop a Pin) *
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.87rem", marginBottom: "10px" }}>
              Click anywhere on the map to mark the exact spot where the incident occurred.
            </p>
            <div style={{ height: "360px", borderRadius: "10px", overflow: "hidden", border: "2px solid " + (pinLat ? "#22c55e" : "#e2e8f0") }}>
              <MapContainer center={mapCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {pinLat && pinLon && <Marker position={[pinLat, pinLon]} />}
              </MapContainer>
            </div>
            {pinLat && pinLon ? (
              <p style={{ color: "#166534", fontWeight: "600", marginTop: "8px", fontSize: "0.85rem" }}>
                ✅ Pin dropped at: {pinLat.toFixed(5)}°N, {pinLon.toFixed(5)}°E
              </p>
            ) : (
              <p style={{ color: "#b45309", marginTop: "8px", fontSize: "0.85rem" }}>
                ⚠️ No location selected yet. Please click on the map.
              </p>
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

          {/* ── Section 6: Complainant Details ── */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "16px" }}>
              6. Your Contact Details
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

          {/* ── Section 7: Station Routing ── */}
          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ color: "#1e3a8a", borderBottom: "2px solid #dbeafe", paddingBottom: "8px", marginBottom: "12px" }}>
              <FaBuilding /> 7. Police Station Routing
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
