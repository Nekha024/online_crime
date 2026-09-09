import React, { useState } from "react";
import "../css/ReportCrime.css";
import {
  FaShieldAlt,
  FaRobot
} from "react-icons/fa";

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    incidentDate: "",
    description: "",
    evidence: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Complaint Submitted Successfully!");

    // Next step:
    // Send data to Django API using Axios
  };

  return (
    <section className="report-page">

      <div className="report-container">

        {/* Left Section */}

        <div className="report-left">

          <h1>
            <span>AI Based</span>
            <br />
            Crime Reporting
          </h1>

          <p>
            Securely report cybercrime incidents.
            Our AI engine will automatically classify the complaint,
            extract important entities, and help investigators prioritize
            critical cases.
          </p>

          <img
            src="/images/report.png"
            alt="Report Crime"
          />

        </div>

        {/* Right Section */}

        <form
          className="report-form"
          onSubmit={handleSubmit}
        >

          <h2>🚨 Report Cyber Crime</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Crime Category</option>

            <option>Phishing</option>

            <option>Online Fraud</option>

            <option>Identity Theft</option>

            <option>Financial Scam</option>

            <option>Cyberbullying</option>

            <option>Fake Website</option>

            <option>Social Media Fraud</option>

            <option>Email Scam</option>

            <option>Others</option>

          </select>

          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
          />

          <textarea
            rows="6"
            name="description"
            placeholder="Describe the cybercrime in detail..."
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <input
            type="file"
            name="evidence"
            onChange={handleChange}
          />

          <div className="ai-card">

            <h3>
              <FaRobot /> AI Analysis
            </h3>

            <p>
              Complaint Status :
              <strong> Waiting for Analysis...</strong>
            </p>

            <p>
              Crime Category :
              <strong> Not Detected</strong>
            </p>

            <p>
              Severity :
              <strong> -- </strong>
            </p>

            <p>
              Risk Score :
              <strong> -- </strong>
            </p>

          </div>

          <button
            className="submit-btn"
            type="submit"
          >
            <FaShieldAlt />
            Submit Complaint
          </button>

        </form>

      </div>

    </section>
  );
};

export default ReportCrime;