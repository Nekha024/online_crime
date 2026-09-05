import React from "react";
import "../css/Testimonials.css";
import { FaQuoteLeft, FaUserShield, FaUserTie } from "react-icons/fa";

const testimonials = [
  {
    icon: <FaUserShield />,
    name: "Cyber Crime Officer",
    role: "Law Enforcement",
    review:
      "The AI-powered classification significantly reduces manual effort and helps us prioritize high-risk cybercrime cases efficiently.",
  },
  {
    icon: <FaUserTie />,
    name: "Digital Security Analyst",
    role: "Cyber Security Expert",
    review:
      "The intelligent entity extraction and severity prediction make investigations faster and more accurate.",
  },
  {
    icon: <FaUserShield />,
    name: "Platform User",
    role: "Citizen",
    review:
      "Reporting online fraud was simple and secure. The complaint status tracking kept me informed throughout the process.",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">

        <div className="section-title">
          <h2>What People Say</h2>
          <p>
            Trusted by citizens and cybercrime professionals for secure
            and intelligent complaint management.
          </p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>

              <FaQuoteLeft className="quote" />

              <p>{item.review}</p>

              <div className="user">
                <div className="icon">
                  {item.icon}
                </div>

                <div>
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;