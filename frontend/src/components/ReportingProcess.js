import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckSquare,
  FaEdit,
  FaMapMarkerAlt,
  FaFileUpload,
  FaPaperPlane,
  FaHashtag,
  FaSearch,
  FaArrowRight,
  FaFileAlt
} from "react-icons/fa";
import "../css/LandingPage.css";

const processSteps = [
  {
    icon: <FaCheckSquare />,
    title: "Select Report Type",
    desc: "Choose crime report or complaint.",
  },
  {
    icon: <FaEdit />,
    title: "Enter Details",
    desc: "Describe what happened.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Provide Location",
    desc: "Specify incident precinct.",
  },
  {
    icon: <FaFileUpload />,
    title: "Upload Evidence",
    desc: "Attach digital proofs.",
  },
  {
    icon: <FaPaperPlane />,
    title: "Submit Report",
    desc: "Send to authorities.",
  },
  {
    icon: <FaHashtag />,
    title: "Receive Reference",
    desc: "Get unique tracking ID.",
  },
  {
    icon: <FaSearch />,
    title: "Track Status",
    desc: "Monitor case progress.",
  },
];

const ReportingProcess = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-section" id="process">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-header">
          <div className="landing-pill">Reporting Process</div>
          <h2>
            How to Submit a <span className="highlight">Report</span>
          </h2>
          <p>
            A step-by-step overview of the online submission and tracking workflow.
          </p>
        </div>

        {/* Horizontal Flow */}
        <div className="process-flow-container">
          {processSteps.map((item, index) => (
            <React.Fragment key={index}>
              <div className="process-step-item">
                <div className="process-icon-circle">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>

              {index < processSteps.length - 1 && (
                <div className="process-arrow">
                  <FaArrowRight />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Clean Callout Box */}
        <div className="process-cta-box">
          <p>Ready to file an incident? The reporting form guides you through each step.</p>
          <button
            className="btn-hero-primary"
            style={{ margin: "0 auto" }}
            onClick={() => navigate("/report")}
          >
            <FaFileAlt />
            <span>Open Crime Reporting Form</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportingProcess;
