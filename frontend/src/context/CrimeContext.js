import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const CrimeContext = createContext();

export const CrimeProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
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
    const fetchUserAndComplaints = async () => {
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
        setUserProfile(prev => ({
          ...prev,
          name: "Citizen"
        }));
      }

      // Fetch complaints
      try {
        const myIds = JSON.parse(localStorage.getItem('myComplaintIds') || '[]');
        let url = 'http://localhost:8000/api/complaints/my/';
        if (myIds.length > 0) {
           url += `?ids=${myIds.join(',')}`;
        }
        
        const resComplaints = await fetch(url, { credentials: "include" });
        if (resComplaints.ok) {
          const data = await resComplaints.json();
          if (data.success) {
            // Map backend fields to frontend expected fields for DashboardHome
            const mapped = data.complaints.map(c => ({
               id: c.complaint_id,
               title: c.title,
               category: c.complaint_type,
               date: c.formatted_date || c.date,
               status: c.status,
               officer: c.assigned_officer,
               station: c.station_name || c.station_code,
               location: c.location,
               ...c // Keep everything else
            }));
            setComplaints(mapped);
          }
        }
      } catch (e) {
        console.error("Failed to fetch complaints", e);
      }
    };
    fetchUserAndComplaints();
  }, []);

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <CrimeContext.Provider
      value={{
        complaints,
        setComplaints, // allow forcing a refresh if needed
        userProfile,
        setUserProfile,
        notifications,
        markAllNotificationsRead
      }}
    >
      {children}
    </CrimeContext.Provider>
  );
};

export const useCrime = () => useContext(CrimeContext);
