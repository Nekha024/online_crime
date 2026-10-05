import React from "react";
import "../css/LandingPage.css";

const steps = [
  {
    number: "01",
    title: "Report",
    desc: "Submit the incident details, timeline, location, and upload any supporting digital evidence.",
  },
  {
    number: "02",
    title: "Review",
    desc: "The report is securely reviewed and routed to the jurisdictional police station.",
  },
  {
    number: "03",
    title: "Investigation",
    desc: "Assigned officers process and investigate the matter according to official procedures.",
  },
  {
    number: "04",
    title: "Track",
    desc: "Citizens can track the status of their report in real time using their reference number.",
  },
];

const HowItWorks = () => {
  return (
    <section className="landing-section" id="how-it-works">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-header">
          <div className="landing-pill">Process Overview</div>
          <h2>
            How It <span className="highlight">Works</span>
          </h2>
          <p>
            A simple, straightforward reporting process designed for ordinary citizens.
          </p>
        </div>

        {/* 4 Clean Steps Grid */}
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <span className="step-number-pill">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;