import React, { useState } from "react";
import "../css/FAQ.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "How do I report a cybercrime?",
    answer:
      "Register an account, fill in the complaint form, upload supporting evidence, and submit your complaint.",
  },
  {
    question: "Can I upload screenshots and documents?",
    answer:
      "Yes. The platform supports screenshots, PDFs, images, emails, chat exports, and website URLs.",
  },
  {
    question: "How does AI classify complaints?",
    answer:
      "AI uses Natural Language Processing (NLP) and Machine Learning models to identify cybercrime categories automatically.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. All complaint information is stored securely with role-based access control and encrypted communication.",
  },
  {
    question: "Can I track my complaint?",
    answer:
      "Yes. Every complaint receives a unique tracking ID for monitoring investigation progress.",
  },
];

const FAQ = () => {
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="faq" id="faq">

      <div className="container">

        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
        </div>

        {faqData.map((item, index) => (
          <div
            className="faq-item"
            key={index}
            onClick={() => toggle(index)}
          >

            <div className="faq-question">
              <h4>{item.question}</h4>

              {active === index ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>

            {active === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}

          </div>
        ))}

      </div>
    </section>
  );
};

export default FAQ;