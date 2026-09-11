import React from "react";
import { FaCheck } from "react-icons/fa";
import "../css/LandingPage.css";

const benefits = [
  {
    title: "Easy Online Reporting",
    desc: "File your complaint in minutes from anywhere. No need to visit the police station initially or stand in long queues.",
  },
  {
    title: "Centralized Complaint Information",
    desc: "All your filed reports, uploaded proofs, official acknowledgments, and history are organized in a single secure account.",
  },
  {
    title: "Transparent Status Tracking",
    desc: "Stay informed at every step. Receive clear chronological updates as officers review, investigate, and resolve your case.",
  },
  {
    title: "Secure Information Handling",
    desc: "Your identity, contact details, and evidence files are protected with role-based access control and modern encryption standards.",
  },
  {
    title: "Convenient 24/7 Access",
    desc: "Access the platform anytime from mobile, tablet, or desktop whenever you need to lodge an urgent complaint or check progress.",
  },
  {
    title: "AI-Assisted Fast-Track",
    desc: "Automated analysis organizes incident details, reducing manual paperwork and helping police officers act faster.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="landing-section" id="benefits">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-header">
          <div className="landing-pill">Why Choose The Platform</div>
          <h2>
            Empowering Citizens with <span className="highlight">Modern Safety</span>
          </h2>
          <p>
            Traditional crime reporting can be stressful and slow. Our digital platform
            ensures your voice is heard quickly, securely, and transparently.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-check-icon">
                <FaCheck />
              </div>
              <div className="benefit-body">
                <h4>{benefit.title}</h4>
                <p>{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
