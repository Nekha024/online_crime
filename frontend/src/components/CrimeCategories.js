import React from "react";
import "../css/CrimeCategories.css";
import "../css/LandingPage.css";
import {
  FaUserSecret,
  FaMoneyCheckAlt,
  FaIdCard,
  FaGlobe,
  FaEnvelope,
  FaComments,
  FaUniversity,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";

const categories = [
  {
    icon: <FaUserSecret />,
    title: "Phishing & Spoofing",
    description:
      "Fraudulent emails, deceptive login portals, and credential theft attempts targeting personal credentials.",
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "Online Financial Scams",
    description:
      "Scams involving unauthorized UPI transactions, bank transfers, fake investment schemes, or shopping fraud.",
  },
  {
    icon: <FaIdCard />,
    title: "Identity Theft",
    description:
      "Unauthorized use or misuse of personal documentation, Aadhaar, PAN, or digital credentials to impersonate you.",
  },
  {
    icon: <FaComments />,
    title: "Cyberstalking & Harassment",
    description:
      "Online threats, abusive digital communications, non-consensual tracking, or continuous cyberbullying.",
  },
  {
    icon: <FaGlobe />,
    title: "Malicious & Fake Websites",
    description:
      "Cloned payment gateways and deceptive web domains designed to steal banking information or inject malware.",
  },
  {
    icon: <FaEnvelope />,
    title: "Lottery & Advance Fee Scams",
    description:
      "Fake reward notifications, business email compromise, and inheritance or recruitment fee deceptions.",
  },
  {
    icon: <FaUniversity />,
    title: "Unauthorized Banking Fraud",
    description:
      "Compromised credit/debit cards, unauthorized OTP usage, or illegal electronic fund withdrawals.",
  },
  {
    icon: <FaExclamationTriangle />,
    title: "Social Media Impersonation",
    description:
      "Fake social profiles, deepfake deceptions, blackmail, extortion, or unauthorized image distribution.",
  },
];

const CrimeCategories = () => {
  return (
    <section className="landing-section" id="categories">
      <div className="landing-container">
        <div className="landing-header">
          <div className="landing-pill">
            <FaInfoCircle /> Crime Information & Awareness
          </div>
          <h2>
            Recognized <span className="highlight">Incident Categories</span>
          </h2>
          <p>
            Citizens can lodge reports for any of the following cybercrime categories.
            Our platform automatically structures the evidence to assist investigating officers.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              <div className="category-icon">{category.icon}</div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CrimeCategories;