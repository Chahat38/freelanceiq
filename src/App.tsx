import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layout & Public Pages
import { LandingPage } from './components/layout/LandingPage';
import { AuthPage } from './components/layout/AuthPage';
import { AppLayout } from './components/layout/AppLayout';

// Workspace AI Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { ProposalGeneratorModule } from './components/modules/ProposalGeneratorModule';
import { ClientReplyModule } from './components/modules/ClientReplyModule';
import { GigOptimizerModule } from './components/modules/GigOptimizerModule';
import { ProfileOptimizerModule } from './components/modules/ProfileOptimizerModule';
import { ContractAnalyzerModule } from './components/modules/ContractAnalyzerModule';
import { InvoiceGeneratorModule } from './components/modules/InvoiceGeneratorModule';
import { PriceEstimatorModule } from './components/modules/PriceEstimatorModule';
import { TimeEstimatorModule } from './components/modules/TimeEstimatorModule';
import { ScamDetectorModule } from './components/modules/ScamDetectorModule';
import { PortfolioReviewerModule } from './components/modules/PortfolioReviewerModule';
import { AiMentorModule } from './components/modules/AiMentorModule';
import { TaskManagerModule } from './components/modules/TaskManagerModule';
import { ClientCrmModule } from './components/modules/ClientCrmModule';
import { NotesModule } from './components/modules/NotesModule';
import { HistoryModule } from './components/modules/HistoryModule';
import { SettingsModule } from './components/modules/SettingsModule';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />

      {/* Main Workspace Protected App Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardModule />} />
        <Route path="proposal-generator" element={<ProposalGeneratorModule />} />
        <Route path="proposal-analyzer" element={<ProposalGeneratorModule />} />
        <Route path="client-reply" element={<ClientReplyModule />} />
        <Route path="cold-email" element={<ClientReplyModule />} />
        <Route path="gig-optimizer" element={<GigOptimizerModule />} />
        <Route path="profile-optimizer" element={<ProfileOptimizerModule />} />
        <Route path="linkedin-optimizer" element={<ProfileOptimizerModule />} />
        <Route path="ai-cover-letter" element={<ProposalGeneratorModule />} />
        <Route path="resume-reviewer" element={<PortfolioReviewerModule />} />
        <Route path="contract-analyzer" element={<ContractAnalyzerModule />} />
        <Route path="scam-detector" element={<ScamDetectorModule />} />
        <Route path="client-sentiment" element={<ClientReplyModule />} />
        <Route path="invoice-generator" element={<InvoiceGeneratorModule />} />
        <Route path="price-estimator" element={<PriceEstimatorModule />} />
        <Route path="time-estimator" element={<TimeEstimatorModule />} />
        <Route path="grammar-fixer" element={<ClientReplyModule />} />
        <Route path="portfolio-reviewer" element={<PortfolioReviewerModule />} />
        <Route path="ai-mentor" element={<AiMentorModule />} />
        <Route path="task-manager" element={<TaskManagerModule />} />
        <Route path="client-crm" element={<ClientCrmModule />} />
        <Route path="notes" element={<NotesModule />} />
        <Route path="document-library" element={<NotesModule />} />
        <Route path="history" element={<HistoryModule />} />
        <Route path="settings" element={<SettingsModule />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
