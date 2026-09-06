import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import AIModules from "./components/AIModules";
import Statistics from "./components/Statistics";
import CrimeCategories from "./components/CrimeCategories";
import DashboardPreview from "./components/DashboardPreview";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import ReportCrime from "./pages/ReportCrime";

// Dashboard Architecture
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

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AIModules />
      <Statistics />
      <CrimeCategories />
      <DashboardPreview />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CrimeProvider>
  );
}

export default App;