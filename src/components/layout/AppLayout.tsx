import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/Toast';
import { CommandPalette } from './CommandPalette';
import { VoiceAssistantModal } from './VoiceAssistantModal';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Frosted Glass Ambient Lights */}
      <div className="fixed top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar Navigation */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <CommandPalette />
      <VoiceAssistantModal />
    </div>
  );
};

