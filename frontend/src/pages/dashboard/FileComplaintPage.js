import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/dashboard/DashboardPages.css";
import {
  FaFileSignature,
  FaRobot,
  FaUpload,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaExclamationCircle,
  FaShieldAlt,
  FaCheck
} from "react-icons/fa";
import { useCrime } from "../../context/CrimeContext";

const FileComplaintPage = () => {
  const { addComplaint, userProfile } = useCrime();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Financial Scam",
    severity: "High",
    location: userProfile.city || "Metro City",
    incidentDate: new Date().toISOString().split("T")[0],
    description: "",
    suspectDetails: "",
    evidenceFileName: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        evidenceFileName: files[0].name
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = addComplaint({
        title: formData.title,
        category: formData.category,
        severity: formData.severity,
        location: formData.location,
        description: formData.description
      });

      setIsSubmitting(false);
      setSuccessMessage(`Complaint Registered Successfully! Generated FIR ID: ${created.id}`);

      setTimeout(() => {
        navigate("/dashboard/my-complaints");
      }, 1500);
    }, 700);
  };

  return (
    <div className="dash-page-container">
      {/* Page Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2>
            <FaFileSignature style={{ color: "#38bdf8" }} />
            File New Crime / FIR Complaint
          </h2>
          <p>
            Submit incident reports directly to law enforcement authorities with automated AI triage & priority scoring.
          </p>
        </div>
      </div>

      {successMessage && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.2)",
            border: "1px solid #10b981",
            color: "#34d399",
            padding: "16px 20px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "600"
          }}
        >
          <FaCheck /> {successMessage}
        </div>
      )}

      {/* Main Complaint Filing Form */}
      <div className="complaint-form-card">
        {/* AI Assisted Triage Banner */}
        <div className="ai-triage-preview">
          <div className="ai-triage-info">
            <FaRobot className="ai-brain-icon" />
            <div className="ai-triage-text">
              <h5>CrimeAI Real-Time Case Triage</h5>
              <p>
                Our neural classifier assesses case urgency and routes it to the designated specialized cyber cell.
              </p>
            </div>
          </div>
          <div className="ai-risk-tag">
            <FaExclamationCircle style={{ marginRight: "4px" }} />
            Priority: {formData.severity}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Incident Title */}
          <div className="form-group-full">
            <label className="form-label">
              <FaTag /> Incident Title / Brief Summary *
            </label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Unauthorized UPI transfer of $500 via phishing link"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-dual">
            {/* Category */}
            <div>
              <label className="form-label">
                <FaShieldAlt /> Crime Category *
              </label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Financial Scam">Financial Scam / Banking Fraud</option>
                <option value="Phishing">Phishing & Fake URLs</option>
                <option value="Identity Theft">Identity Theft & Account Takeover</option>
                <option value="Cyberbullying">Cyberbullying & Harassment</option>
                <option value="Online Fraud">E-Commerce & Delivery Fraud</option>
                <option value="Social Media Fraud">Social Media Impersonation</option>
                <option value="Ransomware">Malware / Ransomware Attack</option>
                <option value="Other Crime">Other Civil / Cyber Incident</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="form-label">
                <FaExclamationCircle /> Estimated Urgency / Severity
              </label>
              <select
                name="severity"
                className="form-select"
                value={formData.severity}
                onChange={handleChange}
              >
                <option value="High">High (Immediate Financial / Personal Threat)</option>
                <option value="Medium">Medium (Active Scam / Defamation)</option>
                <option value="Low">Low (Spam / General Report)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-dual">
            {/* Date */}
            <div>
              <label className="form-label">
                <FaCalendarAlt /> Date of Incident *
              </label>
              <input
                type="date"
                name="incidentDate"
                className="form-input"
                value={formData.incidentDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="form-label">
                <FaMapMarkerAlt /> Incident Location / Area *
              </label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Metro Downtown, Sector 4"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group-full">
            <label className="form-label">Detailed Description of Incident *</label>
            <textarea
              name="description"
              rows="5"
              className="form-textarea"
              placeholder="Provide exact sequence of events, URLs visited, messages received, transaction IDs, or any witness accounts..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Suspect / Reference Info */}
          <div className="form-group-full">
            <label className="form-label">Suspect Information / Account Handles (Optional)</label>
            <input
              type="text"
              name="suspectDetails"
              className="form-input"
              placeholder="Suspect phone number, email, UPI ID, or social profile handle..."
              value={formData.suspectDetails}
              onChange={handleChange}
            />
          </div>

          {/* File Upload Attachment */}
          <div className="form-group-full">
            <label className="form-label">Upload Evidence / Screenshots / Receipts</label>
            <div className="file-upload-box" onClick={() => document.getElementById("evidenceInput").click()}>
              <input
                type="file"
                id="evidenceInput"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <FaUpload style={{ fontSize: "1.8rem", color: "#38bdf8", marginBottom: "8px" }} />
              <p style={{ color: "#f1f5f9", fontSize: "0.9rem", margin: "0 0 4px" }}>
                {formData.evidenceFileName ? (
                  <span style={{ color: "#38bdf8", fontWeight: "600" }}>📎 {formData.evidenceFileName}</span>
                ) : (
                  "Click here or drag files (PNG, JPG, PDF up to 25MB)"
                )}
              </p>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                Encrypted with SHA-256 for legal evidence integrity
              </span>
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              type="submit"
              className="btn-submit-complaint"
              disabled={isSubmitting}
            >
              <FaShieldAlt />
              {isSubmitting ? "Generating FIR & Filing..." : "Submit Complaint & Generate FIR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileComplaintPage;
