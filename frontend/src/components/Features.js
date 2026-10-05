import React from "react";
import {
  FaFileAlt,
  FaClipboardList,
  FaSearch,
  FaFileUpload,
  FaInfoCircle,
  FaCogs
} from "react-icons/fa";
import "../css/LandingPage.css";

const services = [
  {
    icon: <FaFileAlt />,
    colorClass: "icon-blue",
    title: "Online Crime Reporting",
    desc: "Submit an official crime report online with incident location, date, time, and involved parties.",
  },
  {
    icon: <FaClipboardList />,
    colorClass: "icon-slate",
    title: "Complaint Management",
    desc: "Submit and manage general complaints and non-emergency grievances directly with police stations.",
  },
  {
    icon: <FaSearch />,
    colorClass: "icon-emerald",
    title: "Report Tracking",
    desc: "Track the progress of submitted reports from initial review through to case resolution.",
  },
  {
    icon: <FaFileUpload />,
    colorClass: "icon-amber",
    title: "Evidence Submission",
    desc: "Submit supporting evidence including documents, receipts, screenshots, and transaction records.",
  },
  {
    icon: <FaInfoCircle />,
    colorClass: "icon-purple",
    title: "Crime Information",
    desc: "Access verified information on cybercrime types, common fraudulent methods, and citizen safety guidance.",
  },
  {
    icon: <FaCogs />,
    colorClass: "icon-blue",
    title: "AI-Assisted Analysis",
    desc: "Automated natural language analysis assists officers in sorting incident details and extracting relevant entities.",
  },
];

const Features = () => {
  return (
    <section className="landing-section alt-bg" id="services">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-header">
          <div className="landing-pill">Platform Services</div>
          <h2>
            Available <span className="highlight">Services</span>
          </h2>
          <p>
            Public reporting tools designed to connect citizens with law enforcement services online.
          </p>
        </div>

        {/* 6 Core Services Grid */}
        <div className="features-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className={`service-icon-box ${service.colorClass}`}>
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;