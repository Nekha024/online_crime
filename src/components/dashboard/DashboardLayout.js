import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import "../../css/dashboard/DashboardLayout.css";

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="dashboard-root">
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${mobileSidebarOpen ? "active" : ""}`}
        onClick={closeMobileSidebar}
      />

      {/* Persistent Sidebar */}
      <div className={`dashboard-sidebar-wrapper ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <DashboardSidebar
          isMobileOpen={mobileSidebarOpen}
          onCloseMobileSidebar={closeMobileSidebar}
        />
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        {/* Top Navbar */}
        <DashboardNavbar onToggleMobileSidebar={toggleMobileSidebar} />

        {/* Dynamic Nested Page Content */}
        <main className="dashboard-content-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
