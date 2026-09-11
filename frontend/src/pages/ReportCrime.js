import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaArrowLeft,
  FaFileUpload,
  FaCheckCircle,
  FaLock
} from "react-icons/fa";
import "../css/ReportCrime.css";

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
  });

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
                  Incident Location / City <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-control-input"
                  placeholder="e.g. Alappuzha, Kochi, Thiruvananthapuram"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
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

          {/* Section 5: Review & Submission */}
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