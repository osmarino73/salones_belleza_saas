import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { BookingPage } from './pages/BookingPage';
import { DashboardPage } from './pages/DashboardPage';
import { StylistPortalPage } from './pages/StylistPortalPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SuperadminDashboardPage } from './pages/SuperadminDashboardPage';
import { PublicProspectSitePage } from './pages/PublicProspectSitePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<OnboardingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/reservas" element={<BookingPage />} />
        <Route path="/reservar" element={<BookingPage />} />
        <Route path="/reservar/:slug" element={<BookingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/colaborador" element={<StylistPortalPage />} />
        <Route path="/colaborador/:stylistId" element={<StylistPortalPage />} />
        <Route path="/superadmin" element={<SuperadminDashboardPage />} />
        <Route path="/sitio/:slug" element={<PublicProspectSitePage />} />
        <Route path="/s/:slug" element={<PublicProspectSitePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
