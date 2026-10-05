import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaShieldAlt,
  FaArrowLeft,
  FaFileUpload,
  FaCheckCircle,
  FaLock,
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
  FaIdCard
} from "react-icons/fa";
import "../css/ReportCrime.css";

// Fix Leaflet default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to handle map click events for pinning
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to programmatically fly/pan the map to a location
function FlyToLocation({ lat, lng, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom || 15, { duration: 1.2 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    incidentDate: "",
    incidentTime: "",
    location: "",
    description: "",
    financialLoss: "",
    suspectInfo: "",
    evidence: null,
    govtIdType: "",
    govtId: null,
  });

  // Map state
  const [pinLat, setPinLat] = useState(null);
  const [pinLng, setPinLng] = useState(null);
  const [flyTarget, setFlyTarget] = useState({ lat: null, lng: null });
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // --- Map location handlers ---
  const handleMapLocationSelect = useCallback((lat, lng) => {
    setPinLat(lat);
    setPinLng(lng);
    // Reverse geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.display_name) {
          setFormData((prev) => ({ ...prev, location: data.display_name }));
        }
      })
      .catch(() => {});
  }, []);

  const handleMapSearch = useCallback((query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data || []);
        setShowResults(true);
      })
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
  }, []);

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setMapSearchQuery(val);
    // Debounce search
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => handleMapSearch(val), 500);
  };

  const handleSearchResultSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPinLat(lat);
    setPinLng(lng);
    setFlyTarget({ lat, lng });
    setFormData((prev) => ({ ...prev, location: result.display_name }));
    setMapSearchQuery(result.display_name);
    setShowResults(false);
    setSearchResults([]);
  };

  const clearMapPin = () => {
    setPinLat(null);
    setPinLng(null);
    setFormData((prev) => ({ ...prev, location: "" }));
    setMapSearchQuery("");
    setFlyTarget({ lat: null, lng: null });
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate real-looking case reference
    setTimeout(() => {
      const generatedId = `CR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedId);
      setSubmitted(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  return (
    <div className="report-page">
      <div className="report-page-container">
        {/* Navigation back */}
        <Link to="/" className="report-nav-back">
          <FaArrowLeft />
          <span>Return to Public Home</span>
        </Link>

        {/* Page Header */}
        <div className="report-header-card">
          <div className="report-header-title">
            <FaShieldAlt style={{ color: "#1e3a8a", fontSize: "1.6rem" }} />
            <h1>Official Crime & Incident Reporting Form</h1>
          </div>
          <p>
            Please complete this structured public service form to report an incident.
            Ensure that information provided is accurate and factual. Your submission will
            be routed to the appropriate jurisdiction police precinct.
          </p>
          <div className="report-notice-box">
            <strong>Important Notice:</strong> For active emergencies requiring immediate response,
            please dial <strong>112</strong> immediately. For immediate cyber financial fraud, call <strong>1930</strong>.
          </div>
        </div>

        {submitted && (
          <div className="submission-success-banner">
            <FaCheckCircle style={{ fontSize: "2rem", color: "#15803d", marginBottom: "8px" }} />
            <h3>Report Successfully Registered</h3>
            <p>
              Your official reference tracking number is: <strong>{referenceId}</strong>
            </p>
            <p style={{ marginTop: "8px", fontSize: "0.85rem" }}>
              Please note down this reference number. You can track investigation progress through the{" "}
              <Link to={`/dashboard/my-complaints?search=${referenceId}`} style={{ color: "#15803d", fontWeight: "bold" }}>
                Status Tracking Tool
              </Link>.
            </p>
          </div>
        )}

        <form className="report-main-form" onSubmit={handleSubmit}>
          {/* Section 1: Incident Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <h2>1. Incident Information</h2>
              <p>Basic details regarding the nature, timing, and location of the incident</p>
            </div>

            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="form-field-label">
                  Crime Category <span className="required-star">*</span>
                </label>
                <select
                  name="category"
                  className="form-control-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Crime Category</option>
                  <option value="Financial Fraud">Online Financial Fraud / UPI Scam</option>
                  <option value="Phishing">Phishing & Credential Theft</option>
                  <option value="Identity Theft">Identity Theft / Aadhaar / PAN Misuse</option>
                  <option value="Cyberbullying">Cyberbullying & Online Harassment</option>
                  <option value="Fake Website">Fake / Cloned Malicious Website</option>
                  <option value="Social Media Fraud">Social Media Impersonation & Blackmail</option>
                  <option value="Email Scam">Email Scam / Advance Fee Fraud</option>
                  <option value="Unauthorized Banking">Unauthorized Card / Bank Withdrawal</option>
                  <option value="Other">Other Cyber Crime Incident</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">
                  Date of Incident <span className="required-star">*</span>
                </label>
                <input
                  type="date"
                  name="incidentDate"
                  className="form-control-input"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">
                  Approximate Time <span className="field-hint">(Optional)</span>
                </label>
                <input
                  type="time"
                  name="incidentTime"
                  className="form-control-input"
                  value={formData.incidentTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Searchable Map Location */}
            <div className="form-field-group" style={{ marginTop: "20px" }}>
              <label className="form-field-label">
                <FaMapMarkerAlt style={{ color: "#1e3a8a" }} />
                Incident Location <span className="required-star">*</span>
              </label>
              <p className="map-helper-text">
                Search for a location below or click directly on the map to pin the exact spot.
              </p>

              {/* Search Bar */}
              <div className="map-search-container" ref={searchContainerRef}>
                <div className="map-search-input-wrap">
                  <FaSearch className="map-search-icon" />
                  <input
                    type="text"
                    className="map-search-input"
                    placeholder="Search location... e.g. Kochi, Marine Drive, Thiruvananthapuram"
                    value={mapSearchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
                  />
                  {mapSearchQuery && (
                    <button
                      type="button"
                      className="map-search-clear"
                      onClick={() => { setMapSearchQuery(""); setSearchResults([]); setShowResults(false); }}
                    >
                      <FaTimes />
                    </button>
                  )}
                  {isSearching && <span className="map-search-spinner" />}
                </div>

                {showResults && searchResults.length > 0 && (
                  <ul className="map-search-results">
                    {searchResults.map((result, idx) => (
                      <li
                        key={idx}
                        className="map-search-result-item"
                        onClick={() => handleSearchResultSelect(result)}
                      >
                        <FaMapMarkerAlt className="result-pin-icon" />
                        <span>{result.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Map */}
              <div className={"report-map-wrapper" + (pinLat ? " pinned" : "")}>
                <MapContainer
                  center={[10.8505, 76.2711]}
                  zoom={8}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onLocationSelect={handleMapLocationSelect} />
                  {flyTarget.lat && flyTarget.lng && (
                    <FlyToLocation lat={flyTarget.lat} lng={flyTarget.lng} zoom={15} />
                  )}
                  {pinLat && pinLng && <Marker position={[pinLat, pinLng]} />}
                </MapContainer>
              </div>

              {/* Pin status */}
              {pinLat && pinLng ? (
                <div className="map-pin-status pinned">
                  <FaCheckCircle />
                  <span>Location pinned: {formData.location || `${pinLat.toFixed(5)}°N, ${pinLng.toFixed(5)}°E`}</span>
                  <button type="button" className="map-clear-pin-btn" onClick={clearMapPin}>
                    <FaTimes /> Clear
                  </button>
                </div>
              ) : (
                <div className="map-pin-status pending">
                  <FaMapMarkerAlt />
                  <span>No location selected — search or click on the map above</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Citizen / Complainant Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <h2>2. Citizen Contact Information</h2>
              <p>Your details for official verification, communication, and updates</p>
            </div>

            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="form-field-label">
                  Full Legal Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">
                  Mobile Phone Number <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control-input"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group" style={{ gridColumn: "span 2" }}>
                <label className="form-field-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control-input"
                  placeholder="name@example.com (for status notifications)"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Incident Description */}
          <div className="form-section-card">
            <div className="form-section-header">
              <h2>3. Incident Description & Suspect Information</h2>
              <p>Provide a factual chronological statement of events</p>
            </div>

            <div className="form-grid-1">
              <div className="form-field-group">
                <label className="form-field-label">
                  Detailed Incident Statement <span className="required-star">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-control-textarea"
                  rows="5"
                  placeholder="Explain what happened in detail, including how contact was initiated, platforms involved (WhatsApp, Email, Website), and what occurred..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label className="form-field-label">
                    Financial Loss Amount (INR) <span className="field-hint">(If applicable)</span>
                  </label>
                  <input
                    type="number"
                    name="financialLoss"
                    className="form-control-input"
                    placeholder="e.g. 25000"
                    value={formData.financialLoss}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">
                    Suspect Identifier <span className="field-hint">(Phone, Handle, Bank Acc, UPI)</span>
                  </label>
                  <input
                    type="text"
                    name="suspectInfo"
                    className="form-control-input"
                    placeholder="e.g. +91 98xxx xxxxx, suspect@upi"
                    value={formData.suspectInfo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Supporting Evidence */}
          <div className="form-section-card">
            <div className="form-section-header">
              <h2>4. Supporting Evidence</h2>
              <p>Attach documents, screenshots, payment receipts, or email headers</p>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">
                Upload Digital Files <span className="field-hint">(PDF, PNG, JPG up to 10MB)</span>
              </label>
              <div className="file-upload-zone" onClick={() => document.getElementById("evidence-upload").click()}>
                <FaFileUpload className="upload-icon" />
                <p>
                  {formData.evidence ? (
                    <strong>Selected: {formData.evidence.name}</strong>
                  ) : (
                    "Click or drag file here to attach supporting evidence"
                  )}
                </p>
                <span>Supported: Screenshots, Bank Slips, Transaction Receipts, Chat Exports</span>
                <input
                  type="file"
                  id="evidence-upload"
                  name="evidence"
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 5: Government ID Upload (Optional) */}
          <div className="form-section-card">
            <div className="form-section-header">
              <h2>5. Government ID Verification <span className="field-hint">(Optional)</span></h2>
              <p>Upload a government-issued ID for identity verification — Aadhaar, Driving Licence, or PAN Card</p>
            </div>

            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="form-field-label">
                  <FaIdCard style={{ color: "#1e3a8a" }} /> ID Type
                </label>
                <select
                  name="govtIdType"
                  className="form-control-select"
                  value={formData.govtIdType}
                  onChange={handleChange}
                >
                  <option value="">Select ID Type (Optional)</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Driving Licence">Driving Licence</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">
                  Upload ID Image <span className="field-hint">(JPG, PNG up to 5MB)</span>
                </label>
                <div
                  className="file-upload-zone govt-id-upload"
                  onClick={() => document.getElementById("govt-id-upload").click()}
                >
                  <FaIdCard className="upload-icon" />
                  <p>
                    {formData.govtId ? (
                      <strong>Selected: {formData.govtId.name}</strong>
                    ) : (
                      "Click to upload your government ID image"
                    )}
                  </p>
                  <span>Accepted: JPG, PNG, PDF</span>
                  <input
                    type="file"
                    id="govt-id-upload"
                    name="govtId"
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.govtId && formData.govtId.type && formData.govtId.type.startsWith("image/") && (
              <div className="govt-id-preview">
                <p className="form-field-label" style={{ marginBottom: "8px" }}>ID Preview:</p>
                <img
                  src={URL.createObjectURL(formData.govtId)}
                  alt="Government ID Preview"
                  className="govt-id-preview-img"
                />
              </div>
            )}

            <div className="govt-id-notice">
              <FaLock style={{ flexShrink: 0 }} />
              <span>
                Your ID details are encrypted and handled per Government of India data protection guidelines.
                This information is only accessible to authorized investigating officers.
              </span>
            </div>
          </div>

          {/* Section 6: Review & Submission */}
          <div className="form-submission-card">
            <div className="submission-disclaimer">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#1e3a8a", fontWeight: "600", marginBottom: "4px" }}>
                <FaLock />
                <span>Declaration & Submission</span>
              </div>
              I hereby declare that the statement and information submitted above are true and accurate to the best of my knowledge.
            </div>

            <button
              type="submit"
              className="btn-submit-report"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Registering Report...</span>
              ) : (
                <span>Submit Official Report</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportCrime;