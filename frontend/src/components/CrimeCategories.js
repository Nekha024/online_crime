import React from "react";
import "../css/CrimeCategories.css";

import {
  FaUserSecret,
  FaMoneyCheckAlt,
  FaIdCard,
  FaGlobe,
  FaEnvelope,
  FaComments,
  FaUniversity,
  FaExclamationTriangle,
} from "react-icons/fa";

const categories = [
  {
    icon: <FaUserSecret />,
    title: "Phishing",
    description:
      "Detect fraudulent emails, fake login pages, and credential theft attempts.",
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "Online Financial Fraud",
    description:
      "Identify scams involving UPI, bank transfers, online shopping, and fake investments.",
  },
  {
    icon: <FaIdCard />,
    title: "Identity Theft",
    description:
      "Report misuse of personal information, Aadhaar, PAN, and stolen identities.",
  },
  {
    icon: <FaComments />,
    title: "Cyberbullying",
    description:
      "Handle online harassment, abusive messages, threats, and bullying incidents.",
  },
  {
    icon: <FaGlobe />,
    title: "Fake Websites",
    description:
      "Detect malicious websites designed to steal sensitive user information.",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Scams",
    description:
      "Identify fake emails, lottery scams, business email compromise, and spam attacks.",
  },
  {
    icon: <FaUniversity />,
    title: "Banking Fraud",
    description:
      "Monitor unauthorized banking activities, card fraud, and account compromise.",
  },
  {
    icon: <FaExclamationTriangle />,
    title: "Social Media Harassment",
    description:
      "Report fake profiles, impersonation, blackmail, and online abuse on social platforms.",
  },
];

const CrimeCategories = () => {
  return (
    <section className="crime-categories" id="crime-categories">
      <div className="container">

        <div className="section-title">
          <h2>Cybercrime Categories</h2>

          <p>
            Our AI-powered system intelligently classifies complaints into
            different cybercrime categories for faster investigation and
            improved case management.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>

              <div className="category-icon">
                {category.icon}
              </div>

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