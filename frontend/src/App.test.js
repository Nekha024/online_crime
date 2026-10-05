import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import ReportingProcess from './components/ReportingProcess';
import TrustSecurity from './components/TrustSecurity';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

// Mock react-router-dom hooks and components
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

describe('Public Citizen Landing Page Components', () => {
  test('Hero renders public service title, CTAs, and quick track tool', () => {
    render(<Hero />);
    expect(screen.getByText(/Stay Informed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Report a Crime/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Track a Report/i })).toBeInTheDocument();
    expect(screen.getByText(/Check the current status of your submitted case/i)).toBeInTheDocument();
  });

  test('HowItWorks renders the 4-step workflow', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/Process Overview/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Report$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Review$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Investigation$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Track$/i })).toBeInTheDocument();
  });

  test('Features displays 6 actual citizen services and no admin dashboard', () => {
    render(<Features />);
    expect(screen.getByText(/Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Online Crime Reporting/i)).toBeInTheDocument();
    expect(screen.getByText(/Complaint Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Report Tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/Evidence Submission/i)).toBeInTheDocument();
    expect(screen.getByText(/Crime Information/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-Assisted Analysis/i)).toBeInTheDocument();
    // Verify NO admin dashboard card
    expect(screen.queryByText(/Admin Dashboard/i)).toBeNull();
  });

  test('TrustSecurity renders honest public trust and data safeguards', () => {
    render(<TrustSecurity />);
    expect(screen.getByText(/Commitment to/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure Submission/i)).toBeInTheDocument();
    expect(screen.getByText(/Controlled Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Responsible Information Handling/i)).toBeInTheDocument();
    expect(screen.getByText(/Station Jurisdiction/i)).toBeInTheDocument();
  });

  test('ReportingProcess renders 7-stage visual lifecycle', () => {
    render(<ReportingProcess />);
    expect(screen.getByText(/Reporting Process/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Report Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Provide Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Evidence/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Receive Reference/i)).toBeInTheDocument();
    expect(screen.getByText(/Track Status/i)).toBeInTheDocument();
  });

  test('CallToAction renders citizen reporting prompt and button', () => {
    render(<CallToAction />);
    expect(screen.getByText(/Need to report an incident\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Report a Crime/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Track a Report/i })).toBeInTheDocument();
  });

  test('Footer contains public links, emergency helplines, and NO police login', () => {
    render(<Footer />);
    expect(screen.getByText(/Crime Reporting Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/All Emergencies: 112/i)).toBeInTheDocument();
    expect(screen.getByText(/Cyber Crime Helpline: 1930/i)).toBeInTheDocument();
    // Critical verification: Strictly NO Police Login on public footer
    expect(screen.queryByText(/Police Login/i)).toBeNull();
    expect(screen.queryByText(/Police Portal/i)).toBeNull();
  });
});


