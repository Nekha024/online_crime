import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import ReportingProcess from "./components/ReportingProcess";
import CrimeCategories from "./components/CrimeCategories";
import CallToAction from "./components/CallToAction";
import AboutContact from "./components/AboutContact";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import ReportCrime from "./pages/ReportCrime";

// Citizen Dashboard Architecture
import { CrimeProvider } from "./context/CrimeContext";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import FileComplaintPage from "./pages/dashboard/FileComplaintPage";
import ViewComplaintsPage from "./pages/dashboard/ViewComplaintsPage";
import PoliceDirectoryPage from "./pages/dashboard/PoliceDirectoryPage";
import CrimeMapPage from "./pages/dashboard/CrimeMapPage";
import EmergencyNumbersPage from "./pages/dashboard/EmergencyNumbersPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Isolated Police Command Architecture
import PoliceLogin from "./pages/police/PoliceLogin";
import PoliceProtectedRoute from "./components/police/PoliceProtectedRoute";
import PoliceLayout from "./components/police/PoliceLayout";
import PoliceDashboard from "./pages/police/PoliceDashboard";
import PoliceCrimesList from "./pages/police/PoliceCrimesList";
import PoliceCrimeDetail from "./pages/police/PoliceCrimeDetail";
import PoliceComplaintsList from "./pages/police/PoliceComplaintsList";
import PoliceComplaintDetail from "./pages/police/PoliceComplaintDetail";
import PoliceCrimeStatusPage from "./pages/police/PoliceCrimeStatusPage";
import PoliceStationProfile from "./pages/police/PoliceStationProfile";

import TrustSecurity from "./components/TrustSecurity";

function LandingPage() {
  return (
    <div className="landing-wrapper">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <ReportingProcess />
      <TrustSecurity />
      <CrimeCategories />
      <CallToAction />
      <AboutContact />
      <FAQ />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CrimeProvider>
      <Routes>
        {/* Landing & Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard Section with Nested Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="file-complaint" element={<FileComplaintPage />} />
          <Route path="my-complaints" element={<ViewComplaintsPage />} />
          <Route path="police-stations" element={<PoliceDirectoryPage />} />
          <Route path="map" element={<CrimeMapPage />} />
          <Route path="emergency" element={<EmergencyNumbersPage />} />
        </Route>

        {/* Dedicated Isolated Police Authentication & Protected Command Center Routes */}
        <Route path="/police/login" element={<PoliceLogin />} />
        <Route 
          path="/police" 
          element={
            <PoliceProtectedRoute>
              <PoliceLayout />
            </PoliceProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="/police/dashboard" replace />} />
          <Route path="dashboard" element={<PoliceDashboard />} />
          <Route path="crimes" element={<PoliceCrimesList />} />
          <Route path="crimes/:id" element={<PoliceCrimeDetail />} />
          <Route path="complaints" element={<PoliceComplaintsList />} />
          <Route path="complaints/:id" element={<PoliceComplaintDetail />} />
          <Route path="status" element={<PoliceCrimeStatusPage />} />
          <Route path="station" element={<PoliceStationProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CrimeProvider>
  );
}

export default App;