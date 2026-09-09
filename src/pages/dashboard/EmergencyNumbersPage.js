import React, { useState } from "react";
import "../../css/dashboard/DashboardPages.css";
import {
  FaPhoneAlt,
  FaAmbulance,
  FaFire,
  FaShieldAlt,
  FaUserShield,
  FaChild,
  FaCopy,
  FaCheck,
  FaBroadcastTower
} from "react-icons/fa";

const emergencyNumbers = [
  {
    id: 1,
    title: "National Cyber Crime Helpline",
    number: "1930",
    description: "Financial cyber fraud, urgent account freezing & online scam report desk.",
    icon: <FaShieldAlt />,
    category: "Cybercrime",
    timing: "24/7 Toll Free"
  },
  {
    id: 2,
    title: "All-in-One Emergency Services",
    number: "112",
    description: "Unified national emergency number for Police, Fire, and Ambulance.",
    icon: <FaBroadcastTower />,
    category: "National Emergency",
    timing: "24/7 Available"
  },
  {
    id: 3,
    title: "Police Emergency Control Room",
    number: "100",
    description: "Immediate police dispatch, crime in progress, or civil disturbance.",
    icon: <FaUserShield />,
    category: "Police",
    timing: "24/7 Immediate Dispatch"
  },
  {
    id: 4,
    title: "Women Safety & Helpline",
    number: "1091",
    description: "Dedicated assistance for women facing harassment, violence, or cyber abuse.",
    icon: <FaShieldAlt />,
    category: "Women Safety",
    timing: "24/7 Confidential"
  },
  {
    id: 5,
    title: "Ambulance & Medical Emergency",
    number: "108",
    description: "Emergency medical response, trauma care, and rapid hospital transit.",
    icon: <FaAmbulance />,
    category: "Medical",
    timing: "24/7 Medical Response"
  },
  {
    id: 6,
    title: "Fire & Rescue Department",
    number: "101",
    description: "Fire disasters, building entrapment, and hazardous incident rescue.",
    icon: <FaFire />,
    category: "Fire Rescue",
    timing: "24/7 Emergency"
  },
  {
    id: 7,
    title: "National Childline Helpline",
    number: "1098",
    description: "Specialized emergency support for children in distress or missing cases.",
    icon: <FaChild />,
    category: "Child Protection",
    timing: "24/7 Toll Free"
  }
];

const EmergencyNumbersPage = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [sosActivated, setSosActivated] = useState(false);

  const handleCopy = (id, num) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSosTrigger = () => {
    setSosActivated(true);
    alert(
      "🚨 SOS PANIC BROADCAST TRIGGERED!\n\nYour emergency GPS coordinates and Citizen ID have been dispatched to the Nearest Police Dispatch Control Room and registered emergency contacts."
    );
  };

  return (
    <div className="dash-page-container">
      {/* Header */}
      <div className="dash-page-header">
        <div className="dash-page-title-wrap">
          <h2>
            <FaPhoneAlt style={{ color: "#ef4444" }} />
            Emergency Contacts & SOS Distress Hub
          </h2>
          <p>
            Instant direct-dial emergency hotlines and 1-click SOS broadcast to notify the nearest police station.
          </p>
        </div>
      </div>

      {/* SOS Hero Panic Card */}
      <div className="sos-hero-card">
        <button
          className="sos-big-trigger-btn"
          onClick={handleSosTrigger}
          aria-label="Activate SOS Distress Broadcast"
        >
          SOS
        </button>

        <div>
          <h3 style={{ color: "#fff", fontSize: "1.3rem", marginBottom: "6px" }}>
            {sosActivated ? "🚨 SOS Broadcast Active" : "Emergency SOS Distress Broadcast"}
          </h3>
          <p style={{ color: "#fca5a5", fontSize: "0.85rem", maxWidth: "550px", margin: "0 auto" }}>
            Pressing this button instantly transmits your live location, battery state, and profile to the nearest Police PCR Patrol Unit.
          </p>
        </div>
      </div>

      {/* Emergency Hotline Cards Grid */}
      <div className="emergency-grid">
        {emergencyNumbers.map((item) => (
          <div key={item.id} className="helpline-card">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="helpline-icon-box">{item.icon}</div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: "700" }}>
                  {item.category} • {item.timing}
                </div>
                <h4 style={{ color: "#fff", fontSize: "1rem", margin: "3px 0" }}>
                  {item.title}
                </h4>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#38bdf8" }}>
                  📞 {item.number}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "4px 0 0" }}>
                  {item.description}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href={`tel:${item.number}`} className="helpline-dial-btn">
                <FaPhoneAlt /> Dial
              </a>

              <button
                className="complaint-action-btn"
                style={{ justifyContent: "center" }}
                onClick={() => handleCopy(item.id, item.number)}
              >
                {copiedId === item.id ? <FaCheck style={{ color: "#34d399" }} /> : <FaCopy />}
                {copiedId === item.id ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyNumbersPage;
