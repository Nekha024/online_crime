import React from "react";
import "../css/HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Register",
    desc: "Create your secure account.",
  },
  {
    number: "02",
    title: "Submit Complaint",
    desc: "Provide complaint details and upload evidence.",
  },
  {
    number: "03",
    title: "AI Analysis",
    desc: "AI classifies the complaint and predicts severity.",
  },
  {
    number: "04",
    title: "Investigation",
    desc: "Authorities review and process the complaint.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how" id="how-it-works">

      <h2>How It Works</h2>

      <div className="steps">

        {steps.map((step, index) => (
          <div className="step-card" key={index}>

            <div className="step-number">
              {step.number}
            </div>

            <h3>{step.title}</h3>

            <p>{step.desc}</p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default HowItWorks;