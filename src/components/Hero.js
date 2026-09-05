import React from "react";
import "../css/Hero.css";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Hero = () => {

  const navigate = useNavigate();

  return (
    <section className="hero" id="home">
      <div className="hero-content">

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