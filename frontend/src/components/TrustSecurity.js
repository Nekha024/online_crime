import React from "react";
import {
  FaLock,
  FaUserShield,
  FaSearch,
  FaFileContract,
  FaBuilding,
  FaShieldAlt
} from "react-icons/fa";
import "../css/LandingPage.css";

const trustItems = [
  {
    icon: <FaLock />,
    title: "Secure Submission",
    desc: "Reports and submitted information are transmitted over secure encrypted connections directly to our backend service.",
  },
  {
    icon: <FaUserShield />,
    title: "Controlled Access",
    desc: "Only authorized personnel and assigned station officers can inspect citizen identity, statements, and case files.",
  },
  {
    icon: <FaSearch />,
    title: "Report Tracking",
    desc: "Each submission receives a reference code, allowing citizens to check the progress of their case transparently.",
  },
  {
    icon: <FaFileContract />,
    title: "Responsible Information Handling",
    desc: "Personal contact details and statements are retained and processed strictly for investigation and verification purposes.",
  },
  {
    icon: <FaBuilding />,
    title: "Station Jurisdiction",
    desc: "Submissions are associated directly with the relevant police station precinct based on incident location.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Appropriate Evidence Handling",
    desc: "Uploaded digital evidence is stored with restricted access and linked to the corresponding case audit record.",
  },
];

const TrustSecurity = () => {
  return (
    <section className="landing-section alt-bg" id="trust">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-header">
          <div className="landing-pill">Trust & Responsibility</div>
          <h2>
            Commitment to <span className="highlight">Citizen Privacy & Integrity</span>
          </h2>
          <p>
            How our online reporting platform handles citizen information, case records, and evidence.
          </p>
        </div>

        {/* 6 Clean Trust Cards */}
        <div className="trust-grid">
          {trustItems.map((item, index) => (
            <div className="trust-card" key={index}>
              <div className="trust-card-header">
                <div className="trust-icon-box">{item.icon}</div>
                <h4>{item.title}</h4>
              </div>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSecurity;
