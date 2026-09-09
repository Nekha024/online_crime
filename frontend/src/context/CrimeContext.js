import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const CrimeContext = createContext();

const initialComplaints = [];

export const CrimeProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [userProfile, setUserProfile] = useState({
    name: "Loading...", 
    email: "",
    phone: "",
    citizenId: "",
    city: "Metro City",
    avatar: "/images/hero.png", 
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    safetyScore: 100 
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('http://localhost:8000/accounts/me/', {
          withCredentials: true
        });
        if (res.data.success && res.data.user) {
          setUserProfile(prev => ({
            ...prev,
            name: res.data.user.name || res.data.user.username,
            email: res.data.user.email || "",
            phone: res.data.user.phone_number || ""
          }));
        }
      } catch (err) {
        // If not authenticated or error, we can set a guest name or leave as is
        setUserProfile(prev => ({
          ...prev,
          name: "Citizen"
        }));
      }
    };
    fetchUser();
  }, []);

  const addComplaint = (newComplaint) => {
    const complaintObj = {
      ...newComplaint,
      id: `FIR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
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
