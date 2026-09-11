import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaArrowRight,
  FaSearch,
  FaLock,
  FaClock,
  FaCheckCircle,
  FaFileAlt
} from "react-icons/fa";
import "../css/LandingPage.css";

const Hero = () => {
  const navigate = useNavigate();
  const [trackInput, setTrackInput] = useState("");

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/dashboard/my-complaints?search=${encodeURIComponent(trackInput.trim())}`);
    } else {
      navigate("/dashboard/my-complaints");
    }
  };

  return (
    <header className="citizen-hero" id="home">
      <div className="landing-container">
        <div className="hero-layout">
          {/* Left Column: Heading, description, and primary/secondary CTAs */}
          <div className="hero-text-col">
            <div className="landing-pill">
              <FaShieldAlt /> Online Crime Reporting Platform
            </div>

            <h1 className="hero-title">
              Report a Crime. <br />
              <span className="brand-accent">Stay Informed.</span>
            </h1>

            <p className="hero-lead">
              Submit crime reports and complaints securely online and track the progress
              of your report with jurisdictional authorities.
            </p>

            <div className="hero-actions">
              <button
                className="btn-hero-primary"
                onClick={() => navigate("/report")}
                id="hero-report-crime-cta"
              >
                <FaFileAlt />
                <span>Report a Crime</span>
              </button>

              <button
                className="btn-hero-secondary"
                onClick={() => navigate("/dashboard/my-complaints")}
                id="hero-track-report-cta"
              >
                <FaSearch />
                <span>Track a Report</span>
              </button>
            </div>

            {/* Public Service Trust Row */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <FaLock />
                <span>Confidential Submission</span>
              </div>
              <div className="trust-item">
                <FaCheckCircle />
                <span>Official Police Jurisdiction</span>
              </div>
              <div className="trust-item">
                <FaClock />
                <span>24/7 Online Service</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, professional report tracking card */}
          <div className="hero-card-col">
            <div className="quick-track-card">
              <div className="quick-track-header">
                <div className="track-icon-badge">
                  <FaSearch />
                </div>
                <div>
                  <h3>Track a Report</h3>
                  <p>Check the current status of your submitted case</p>
                </div>
              </div>

              <form onSubmit={handleTrackSubmit} className="quick-track-form">
                <div className="quick-track-input-group">
                  <FaSearch className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter Report ID (e.g. CR-ALP-2026-001)"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    aria-label="Report or Complaint Reference ID"
                  />
                </div>

                <button type="submit" className="btn-track-submit">
                  <span>Track Status</span>
                  <FaArrowRight />
                </button>
              </form>

              <div className="quick-track-meta">
                <span>Enter crime or complaint reference number</span>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  How it works →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;