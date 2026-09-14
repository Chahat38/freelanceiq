import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  MessageSquare,
  SearchCode,
  UserCheck,
  ShieldAlert,
  FileCode,
  DollarSign,
  Clock,
  ShieldCheck,
  Brain,
  CheckCheck,
  Wand2,
  Briefcase,
  FileBadge,
  FileCheck2,
  Linkedin,
  Mail,
  GraduationCap,
  ListTodo,
  Users,
  StickyNote,
  FolderKanban,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useApp();
  const location = useLocation();

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        { name: 'AI Mentor', path: '/app/ai-mentor', icon: GraduationCap, badge: 'Pro' },
      ],
    },
    {
      title: 'AI PROPOSALS & CLIENTS',
      items: [
        { name: 'Proposal Generator', path: '/app/proposal-generator', icon: FileText },
        { name: 'Proposal Analyzer', path: '/app/proposal-analyzer', icon: CheckCheck },
        { name: 'Client Reply Generator', path: '/app/client-reply', icon: MessageSquare },
        { name: 'Cold Email Generator', path: '/app/cold-email', icon: Mail },
      ],
    },
    {
      title: 'PROFILE & SEO',
      items: [
        { name: 'Fiverr / Upwork Gig SEO', path: '/app/gig-optimizer', icon: SearchCode },
        { name: 'Profile Optimizer', path: '/app/profile-optimizer', icon: UserCheck },
        { name: 'LinkedIn Optimizer', path: '/app/linkedin-optimizer', icon: Linkedin },
        { name: 'Portfolio Reviewer', path: '/app/portfolio-reviewer', icon: Briefcase },
        { name: 'AI Cover Letter', path: '/app/ai-cover-letter', icon: FileBadge },
        { name: 'Resume Review', path: '/app/resume-reviewer', icon: FileCheck2 },
      ],
    },
    {
      title: 'SAFETY & CONTRACTS',
      items: [
        { name: 'Contract Risk Analyzer', path: '/app/contract-analyzer', icon: ShieldAlert },
        { name: 'Client Scam Detector', path: '/app/scam-detector', icon: ShieldCheck, badge: 'Safety' },
        { name: 'Sentiment Analyzer', path: '/app/client-sentiment', icon: Brain },
      ],
    },
    {
      title: 'FINANCE & ESTIMATES',
      items: [
        { name: 'Invoice Generator', path: '/app/invoice-generator', icon: FileCode },
        { name: 'Price Estimator', path: '/app/price-estimator', icon: DollarSign },
        { name: 'Time & Milestones', path: '/app/time-estimator', icon: Clock },
        { name: 'Grammar & Text Polish', path: '/app/grammar-fixer', icon: Wand2 },
      ],
    },
    {
      title: 'WORKSPACE OS',
      items: [
        { name: 'Task Manager', path: '/app/task-manager', icon: ListTodo },
        { name: 'Client CRM', path: '/app/client-crm', icon: Users },
        { name: 'Notes & Markdown', path: '/app/notes', icon: StickyNote },
        { name: 'Document Library', path: '/app/document-library', icon: FolderKanban },
        { name: 'History Log', path: '/app/history', icon: History },
        { name: 'Settings & Tax', path: '/app/settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header Logo */}
      <div>
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <span className="font-bold text-white text-base">IQ</span>
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="truncate">
                <h1 className="font-bold text-white text-base tracking-tight truncate">FreelanceIQ</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI OS v2.5</p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition shrink-0"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Pro Plan / Streak Card Widget */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="m-3 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{user.streakDays} Day Streak</span>
              </div>
              <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                PRO PLAN
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mb-2">Productivity Score: {user.productivityScore}/100</div>
            <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-indigo-500 rounded-full" />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="p-3 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title}>
              {(!isCollapsed || isMobileOpen) && (
                <p className="px-3 text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-2">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition duration-150 relative group ${
                        isActive
                          ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                      title={isCollapsed && !isMobileOpen ? item.name : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.name}</span>}

                      {(!isCollapsed || isMobileOpen) && item.badge && (
                        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer User Bar */}
      <div className="p-3 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border border-indigo-500/50 object-cover shrink-0"
          />
          {(!isCollapsed || isMobileOpen) && (
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0F172A] border-r border-white/10 shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex relative z-20 bg-[#111827]/50 border-r border-white/10 backdrop-blur-xl transition-all duration-300 flex-col justify-between shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

