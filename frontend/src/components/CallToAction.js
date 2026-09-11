import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaSearch } from "react-icons/fa";
import "../css/LandingPage.css";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-section" id="cta-section">
      <div className="landing-container">
        <div className="cta-banner-wrapper">
          <div className="cta-banner-content">
            <h2>Need to report an incident?</h2>
            <p>
              Submit your report through the online reporting system. Your submission
              will be routed to the appropriate police station for official verification.
            </p>
            <div className="cta-buttons-row">
              <button
                className="btn-cta-white"
                onClick={() => navigate("/report")}
                id="cta-report-crime-btn"
              >
                <FaFileAlt />
                <span>Report a Crime</span>
              </button>

              <button
                className="btn-cta-outline"
                onClick={() => navigate("/dashboard/my-complaints")}
                id="cta-track-report-btn"
              >
                <FaSearch />
                <span>Track a Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
