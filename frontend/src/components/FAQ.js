import React, { useState } from "react";
import "../css/FAQ.css";
import "../css/LandingPage.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "How do I report a cybercrime or incident online?",
    answer:
      "Click on 'Report a Crime' from the homepage or navigation bar. Fill in the incident details (location, date, what occurred, suspect information if available), attach any digital evidence or screenshots, and submit. You will immediately receive a unique tracking ID.",
  },
  {
    question: "What types of evidence can I upload?",
    answer:
      "You can upload screenshots, transactional receipts, bank statement excerpts, PDF documents, email headers, chat transcripts, and malicious website links. All uploads are stored securely and encrypted.",
  },
  {
    question: "How does status tracking work?",
    answer:
      "Once you submit a report, an official case code (e.g., CR-ALP-2026-001 or CMP-010) is generated. You can enter this code in the 'Quick Track' box or view it in your citizen dashboard to see live updates from 'Submitted' to 'Under Review', 'Under Investigation', and 'Resolved'.",
  },
  {
    question: "Is my personal information protected?",
    answer:
      "Yes. All citizen submissions are handled under strict confidentiality protocols. Personal identity, contact numbers, and statements are accessible only to verified police station personnel assigned to the case.",
  },
  {
    question: "How does AI assist in the reporting process?",
    answer:
      "Our AI assistant analyzes your incident description using Natural Language Processing (NLP) to extract critical entities (such as suspect phone numbers, URLs, and bank accounts) and categorizes the incident to help officers prioritize and assign the case without administrative delays.",
  },
  {
    question: "What if there is an immediate emergency?",
    answer:
      "If you or someone else is in immediate physical danger, call the National Emergency Helpline at 112 immediately. For direct financial cyber fraud (within 24 hours of unauthorized transaction), dial the National Cyber Crime Helpline at 1930.",
  },
];

const FAQ = () => {
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="landing-section" id="faq">
      <div className="landing-container">
        <div className="landing-header">
          <div className="landing-pill">Frequently Asked Questions</div>
          <h2>
            Common <span className="highlight">Questions</span>
          </h2>
          <p>
            Information about submitting reports, uploading evidence, and tracking your case.
          </p>
        </div>

        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          {faqData.map((item, index) => (
            <div
              className="faq-item"
              key={index}
              onClick={() => toggle(index)}
            >
              <div className="faq-question">
                <h4>{item.question}</h4>
                <div>
                  {active === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {active === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;