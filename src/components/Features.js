import React from "react";
import "../css/Features.css";
import {
  FaRobot,
  FaFileUpload,
  FaSearch,
  FaChartLine,
  FaDatabase,
  FaUserShield,
} from "react-icons/fa";

const features = [
  {
    icon: <FaFileUpload />,
    title: "Online Complaint Reporting",
    desc: "Submit cybercrime complaints anytime with screenshots, documents and digital evidence.",
  },
  {
    icon: <FaRobot />,
    title: "AI Crime Classification",
    desc: "Automatically identifies cybercrime categories using NLP and Machine Learning.",
  },
  {
    icon: <FaSearch />,
    title: "Entity Extraction",
    desc: "Extracts emails, URLs, phone numbers, account numbers and IP addresses.",
  },
  {
    icon: <FaChartLine />,
    title: "Severity Prediction",
    desc: "Predicts complaint severity based on financial loss and threat level.",
  },
  {
    icon: <FaDatabase />,
    title: "Evidence Management",
    desc: "Store digital evidence securely for investigation.",
  },
  {
    icon: <FaUserShield />,
    title: "Admin Dashboard",
    desc: "Monitor complaints, investigations and crime statistics.",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">

      <h2>Our Features</h2>

      <p>
        AI-powered tools that simplify cybercrime reporting and investigation.
      </p>

      <div className="feature-grid">

        {features.map((feature, index) => (
          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default Features;