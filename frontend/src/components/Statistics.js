import React from "react";
import "../css/Statistics.css";
import {
  FaFileAlt,
  FaRobot,
  FaUserShield,
  FaClock,
} from "react-icons/fa";

const statistics = [
  {
    icon: <FaFileAlt />,
    number: "1500+",
    title: "Complaints Processed",
  },
  {
    icon: <FaRobot />,
    number: "96%",
    title: "AI Classification Accuracy",
  },
  {
    icon: <FaUserShield />,
    number: "500+",
    title: "Investigations Assisted",
  },
  {
    icon: <FaClock />,
    number: "24/7",
    title: "Online Reporting",
  },
];

const Statistics = () => {
  return (
    <section className="statistics" id="statistics">
      <div className="statistics-container">

        <div className="statistics-header">
          <h2>Platform Statistics</h2>
          <p>
            Leveraging Artificial Intelligence to improve cybercrime
            reporting, investigation, and public safety.
          </p>
        </div>

        <div className="statistics-grid">
          {statistics.map((item, index) => (
            <div className="stat-card" key={index}>

              <div className="stat-icon">
                {item.icon}
              </div>

              <h3>{item.number}</h3>

              <p>{item.title}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Statistics;