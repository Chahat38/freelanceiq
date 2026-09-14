import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Mic,
  Bell,
  Sun,
  Moon,
  DollarSign,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  X,
  Menu,
  Check,
  Trash2,
  Calendar,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    user,
    setUser,
    darkMode,
    setDarkMode,
    currency,
    setCurrency,
    setIsCommandPaletteOpen,
    setIsVoiceAssistantOpen,
    showToast,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    clearAllNotifications,
    triggerTestAlarm,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
    showToast('Logged out of FreelanceIQ OS', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex-shrink-0 flex items-center justify-between px-3 sm:px-6 lg:px-8 bg-white/[0.02] border-b border-white/10 backdrop-blur-xl">
      {/* Left: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search & Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition w-36 sm:w-64 md:w-80 lg:w-96 text-xs"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Search AI tools...</span>
          <span className="hidden sm:inline-block ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 font-mono tracking-tighter shrink-0">
            ⌘ K
          </span>
        </button>

        {/* Voice Assistant Trigger */}
        <button
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          title="Voice Assistant"
        >
          <Mic className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
          <span className="hidden md:inline text-xs">Voice AI</span>
        </button>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Currency Selector */}
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-2 sm:px-2.5 py-1">
          <DollarSign className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-transparent text-[11px] sm:text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            <option value="USD" className="bg-[#111827] text-slate-100">USD ($)</option>
            <option value="PKR" className="bg-[#111827] text-slate-100">PKR (Rs)</option>
            <option value="EUR" className="bg-[#111827] text-slate-100">EUR (€)</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0"
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 relative transition shrink-0"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111827]/98 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition"
                        title="Mark all as read"
                      >
                        Mark all read
                      </button>
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-slate-400 hover:text-rose-400 transition"
                        title="Clear all"
                      >
                        Clear
                      </button>
                    </>
                  )}
                  <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-white ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                    <Bell className="w-6 h-6 mx-auto opacity-30 text-slate-400 mb-2" />
                    <p className="font-medium text-slate-400">All caught up!</p>
                    <p className="text-[11px] text-slate-500">No new reminders or notifications.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border text-xs transition relative group ${
                        n.read
                          ? 'bg-white/[0.02] border-white/5 text-slate-400'
                          : 'bg-indigo-500/10 border-indigo-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                          )}
                          <span
                            className={`font-semibold truncate ${
                              n.read ? 'text-slate-300' : 'text-white'
                            }`}
                          >
                            {n.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed mb-2">{n.desc}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        {n.taskId ? (
                          <button
                            onClick={() => {
                              navigate('/app/task-manager');
                              setIsNotifOpen(false);
                            }}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>View Task</span>
                          </button>
                        ) : (
                          <span />
                        )}
                        <div className="flex items-center gap-1.5 ml-auto">
                          {!n.read && (
                            <button
                              onClick={() => markNotificationAsRead(n.id)}
                              className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(n.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
                            title="Remove notification"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Notification Center Quick Footer */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => triggerTestAlarm('Navbar Notification Test')}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition"
                >
                  <Bell className="w-3 h-3" />
                  <span>Test Alarm Chime</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/app/task-manager');
                    setIsNotifOpen(false);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition"
                >
                  Manage Tasks →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full hover:bg-white/5 transition"
          >
            <div className="h-8 w-8 rounded-full border border-indigo-500/50 p-0.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-[#111827]/95 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/app/settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl transition text-left"
              >
                <SettingsIcon className="w-4 h-4 text-indigo-400" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-left mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
