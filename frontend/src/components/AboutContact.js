import React from "react";
import {
  FaInfoCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";
import "../css/LandingPage.css";

const AboutContact = () => {
  return (
    <section className="landing-section alt-bg" id="about">
      <div className="landing-container">
        <div className="about-contact-grid">
          {/* About Platform */}
          <div className="about-card">
            <h3>
              <FaInfoCircle style={{ color: "#1e3a8a" }} />
              About The Platform
            </h3>
            <p>
              The Online Crime Reporting and Analysis System is a public civic technology
              initiative created to connect citizens directly with police stations. We provide
              a structured, accessible way for individuals to report incidents, submit digital evidence,
              and receive updates on case status.
            </p>
            <p>
              By organizing submissions by station jurisdiction and providing transparent tracking,
              the platform supports prompt review and reduces procedural delays for citizens.
            </p>

            <div className="helpline-box">
              <div className="helpline-item">
                <div className="helpline-label">All Emergencies</div>
                <div className="helpline-number">112</div>
              </div>
              <div className="helpline-item">
                <div className="helpline-label">Cyber Helpline</div>
                <div className="helpline-number">1930</div>
              </div>
            </div>
          </div>

          {/* Citizen Support & Contact */}
          <div className="contact-card" id="contact">
            <h3>
              <FaPhoneAlt style={{ color: "#1e3a8a" }} />
              Citizen Support & Inquiries
            </h3>
            <p>
              For non-emergency technical assistance, report tracking inquiries, or
              system guidance, citizen support is available through official channels.
            </p>

            <div className="contact-details-list">
              <div className="contact-row">
                <FaEnvelope />
                <div>
                  <strong>Citizen Support Email</strong>
                  <div>support@onlinecrime.gov.in</div>
                </div>
              </div>

              <div className="contact-row">
                <FaPhoneAlt />
                <div>
                  <strong>Toll-Free Helpline</strong>
                  <div>1800-425-0100 (9:00 AM – 6:00 PM IST)</div>
                </div>
              </div>

              <div className="contact-row">
                <FaClock />
                <div>
                  <strong>Online System Availability</strong>
                  <div>24 hours a day, 7 days a week</div>
                </div>
              </div>

              <div className="contact-row">
                <FaMapMarkerAlt />
                <div>
                  <strong>Coverage</strong>
                  <div>Participating district police stations & cyber cells</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
