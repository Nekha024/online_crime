import React, { createContext, useContext, useState } from "react";

const CrimeContext = createContext();

const initialComplaints = [
  {
    id: "FIR-2026-8901",
    title: "Unauthorized Banking Phishing Transaction",
    category: "Financial Scam",
    date: "2026-03-01",
    status: "Under Investigation",
    severity: "High",
    location: "Metro Financial District",
    officer: "Inspector R. Verma",
    station: "Cyber Crime Cell - Central",
    description: "Received a deceptive link imitating national banking portal. ₹45,000 deducted without OTP authorization.",
    timeline: [
      { status: "FIR Registered", date: "2026-03-01 10:15 AM", note: "Complaint logged and initial FIR acknowledged." },
      { status: "AI Risk Assessment", date: "2026-03-01 10:18 AM", note: "AI categorized severity as High (Financial Cyber Fraud)." },
      { status: "Officer Assigned", date: "2026-03-02 09:30 AM", note: "Assigned to Inspector R. Verma, Cyber Cell." },
      { status: "Under Investigation", date: "2026-03-03 02:00 PM", note: "Bank transaction logs requested from beneficiary payment gateway." }
    ]
  },
  {
    id: "FIR-2026-8742",
    title: "Fake Social Media Profile Impersonation",
    category: "Identity Theft",
    date: "2026-02-24",
    status: "Pending Review",
    severity: "Medium",
    location: "North Suburb Zone",
    officer: "Pending Allocation",
    station: "North Division Police Station",
    description: "Fake Instagram account created using personal photos requesting money from close contacts.",
    timeline: [
      { status: "FIR Registered", date: "2026-02-24 04:45 PM", note: "Complaint submitted with screenshot evidence." },
      { status: "Under Initial Review", date: "2026-02-25 11:00 AM", note: "Queued for verification by nodal officer." }
    ]
  },
  {
    id: "FIR-2026-8619",
    title: "Harassment and Extortion via Instant Messaging",
    category: "Cyberbullying",
    date: "2026-02-18",
    status: "Resolved",
    severity: "High",
    location: "Downtown Boulevard",
    officer: "Sub-Inspector Priya Sharma",
    station: "Women & Child Safety Cell",
    description: "Repeated threatening calls and abusive text messages from unknown international virtual numbers.",
    timeline: [
      { status: "FIR Registered", date: "2026-02-18 11:20 AM", note: "Complaint filed." },
      { status: "Officer Assigned", date: "2026-02-18 01:00 PM", note: "Sub-Inspector Priya Sharma assigned." },
      { status: "Culprit Identified", date: "2026-02-20 03:30 PM", note: "IP traces & SIM tower location tracked." },
      { status: "Resolved", date: "2026-02-22 05:00 PM", note: "Accused summoned, written undertaking taken & SIM blocked." }
    ]
  },
  {
    id: "FIR-2026-8503",
    title: "E-Commerce Counterfeit Goods Scam",
    category: "Online Fraud",
    date: "2026-02-10",
    status: "Resolved",
    severity: "Low",
    location: "Greenwood Avenue",
    officer: "Officer K. Nair",
    station: "East Ward Station",
    description: "Paid for electronics on a sponsored scam store; received duplicate tracking code and no response.",
    timeline: [
      { status: "FIR Registered", date: "2026-02-10 09:00 AM", note: "Registered with domain info and receipt." },
      { status: "Notice Issued", date: "2026-02-12 12:00 PM", note: "Domain registrar notified for takedown." },
      { status: "Resolved", date: "2026-02-15 04:00 PM", note: "Chargeback processed by payment aggregator and website blacklisted." }
    ]
  }
];

export const CrimeProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [userProfile, setUserProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@crimeguard.org",
    phone: "+1 (555) 382-9012",
    citizenId: "CIT-889204-X",
    city: "Metro City",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    joinedDate: "January 2026",
    safetyScore: 94
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: "FIR Update", message: "FIR-2026-8901 moved to Investigation Stage.", time: "10m ago", unread: true },
    { id: 2, title: "Security Alert", message: "New phishing SMS campaign detected in your region.", time: "2h ago", unread: true },
    { id: 3, title: "Complaint Resolved", message: "FIR-2026-8619 marked as Resolved.", time: "2d ago", unread: false }
  ]);

  const addComplaint = (newComplaint) => {
    const complaintObj = {
      ...newComplaint,
      id: `FIR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Pending Review",
      officer: "Assigning Officer...",
      station: "Central Cyber Crime Cell",
      timeline: [
        {
          status: "FIR Registered",
          date: new Date().toLocaleString(),
          note: "Complaint submitted through Citizen Portal and dispatched to triage."
        },
        {
          status: "AI Automated Triage",
          date: new Date().toLocaleString(),
          note: `Severity assessed as ${newComplaint.severity || "Medium"}. Awaiting officer assignment.`
        }
      ]
    };
    setComplaints([complaintObj, ...complaints]);
    setNotifications([
      {
        id: Date.now(),
        title: "Complaint Lodged",
        message: `Your complaint #${complaintObj.id} has been successfully recorded.`,
        time: "Just now",
        unread: true
      },
      ...notifications
    ]);
    return complaintObj;
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <CrimeContext.Provider
      value={{
        complaints,
        userProfile,
        setUserProfile,
        notifications,
        addComplaint,
        markAllNotificationsRead
      }}
    >
      {children}
    </CrimeContext.Provider>
  );
};

export const useCrime = () => useContext(CrimeContext);
