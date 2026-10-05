import React from "react";
import "../css/AIModules.css";

const modules = [
  {
    title: "Complaint Classification",
    description:
      "Automatically identifies the cybercrime category using NLP.",
  },
  {
    title: "Entity Extraction",
    description:
      "Extracts names, emails, URLs, IP addresses and transaction IDs.",
  },
  {
    title: "Severity Assessment",
    description:
      "Ranks complaints according to financial loss and threat level.",
  },
  {
    title: "Trend Analysis",
    description:
      "Identifies recurring cybercrime patterns and hotspots.",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Visualizes crime statistics for faster decision making.",
  },
  {
    title: "Smart Evidence Processing",
    description:
      "Organizes uploaded digital evidence securely for investigators.",
  },
];

const AIModules = () => {
  return (
    <section className="ai-modules">

      <h2>AI Modules</h2>

      <p>
        Artificial Intelligence powers every stage of complaint analysis.
      </p>

      <div className="module-grid">

        {modules.map((module, index) => (
          <div className="module-card" key={index}>

            <h3>{module.title}</h3>

            <p>{module.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default AIModules;