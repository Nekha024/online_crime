<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import "../css/Hero.css";
import { FaShieldAlt, FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Hero = () => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("Connecting to backend...");

  useEffect(() => {
    api.get("test/")
      .then(response => {
        setBackendStatus(response.data.message);
      })
      .catch(error => {
        setBackendStatus("Backend disconnected.");
      });
  }, []);
=======
import React from "react";
import "../css/Hero.css";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Hero = () => {

  const navigate = useNavigate();
>>>>>>> 4b66748 (backend added)

  return (
    <section className="hero" id="home">
      <div className="hero-content">

<<<<<<< HEAD
        {/* Connection Status Badge */}
        <span className="badge" style={{ marginBottom: '10px', display: 'inline-block', backgroundColor: backendStatus.includes("successfully") ? '#064e3b' : '#7f1d1d' }}>
          {backendStatus.includes("successfully") ? <FaCheckCircle style={{ color: '#34d399' }} /> : <FaTimesCircle style={{ color: '#f87171' }} />} {backendStatus}
        </span>

=======
>>>>>>> 4b66748 (backend added)
        <span className="badge">
          <FaShieldAlt /> AI Powered Cyber Security Platform
        </span>

        <h1>
          Report Cyber Crimes
          <br />
          <span>Smarter with Artificial Intelligence</span>
        </h1>

        <p>
          Securely report cybercrime incidents, upload digital evidence,
          and let AI automatically classify complaints, extract important
          information, and prioritize investigations.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/report")}
          >
            Report Crime
          </button>

          <button className="secondary-btn">
            Learn More
            <FaArrowRight />
          </button>
        </div>

      </div>

      <div className="hero-image">
        <img
          src="/images/hero.png"
          alt="Cyber Security"
        />
      </div>
    </section>
  );
};

export default Hero;