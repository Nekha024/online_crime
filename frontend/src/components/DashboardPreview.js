import React from "react";
import "../css/DashboardPreview.css";

import {
  FaChartBar,
  FaChartPie,
  FaShieldAlt,
  FaRobot,
} from "react-icons/fa";

const DashboardPreview = () => {
  return (
    <section className="dashboard-preview" id="dashboard">
      <div className="dashboard-container">

        {/* Heading */}
        <div className="dashboard-header">
          <h2>AI Dashboard Preview</h2>

          <p>
            A centralized dashboard that helps investigators monitor
            complaints, visualize cybercrime trends, manage evidence,
            and analyze AI-generated insights in real time.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-grid">

          {/* Complaint Analytics */}
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <FaChartBar />
            </div>

            <h3>Complaint Analytics</h3>

            <img
              src="/images/dashboard1.png"
              alt="Complaint Analytics"
            />

            <p>
              View complaint trends, monthly reports, and AI-based
              statistics through interactive charts.
            </p>
          </div>

          {/* Crime Distribution */}
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <FaChartPie />
            </div>

            <h3>Crime Distribution</h3>

            <img
              src="/images/dashboard2.png"
              alt="Crime Distribution"
            />

            <p>
              Analyze cybercrime categories such as phishing,
              banking fraud, cyberbullying, and identity theft.
            </p>
          </div>

          {/* AI Insights */}
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <FaRobot />
            </div>

            <h3>AI Insights</h3>

            <img
              src="/images/dashboard3.png"
              alt="AI Insights"
            />

            <p>
              AI automatically classifies complaints, extracts entities,
              predicts severity, and recommends investigation priorities.
            </p>
          </div>

          {/* Secure Evidence */}
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <FaShieldAlt />
            </div>

            <h3>Evidence Management</h3>

            <img
              src="/images/dashboard4.png"
              alt="Evidence Management"
            />

            <p>
              Store screenshots, documents, URLs, emails,
              and digital evidence securely for authorized access.
            </p>
          </div>

        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a
            href="/dashboard"
            className="register-btn"
            style={{
              display: "inline-flex",
              textDecoration: "none",
              padding: "14px 32px",
              fontSize: "1rem"
            }}
          >
            <FaShieldAlt style={{ marginRight: "8px" }} />
            Open Citizen Portal Dashboard
          </a>
        </div>

      </div>
    </section>
  );
};

export default DashboardPreview;