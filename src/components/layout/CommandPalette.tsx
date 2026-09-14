import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Sparkles,
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
  ListTodo,
  Users,
  Settings as SettingsIcon,
  X,
  Zap,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commands = [
    { name: 'Dashboard Overview', path: '/app/dashboard', icon: Sparkles, cat: 'Core' },
    { name: 'AI Proposal Generator', path: '/app/proposal-generator', icon: FileText, cat: 'AI Modules' },
    { name: 'Client Reply Generator', path: '/app/client-reply', icon: MessageSquare, cat: 'AI Modules' },
    { name: 'AI Gig Optimizer (Fiverr/Upwork)', path: '/app/gig-optimizer', icon: SearchCode, cat: 'AI Modules' },
    { name: 'Profile Optimizer', path: '/app/profile-optimizer', icon: UserCheck, cat: 'AI Modules' },
    { name: 'Contract Risk Analyzer', path: '/app/contract-analyzer', icon: ShieldAlert, cat: 'AI Modules' },
    { name: 'Invoice Generator & PDF', path: '/app/invoice-generator', icon: FileCode, cat: 'Tools' },
    { name: 'Price & Rate Estimator (PKR / USD)', path: '/app/price-estimator', icon: DollarSign, cat: 'Tools' },
    { name: 'Time & Milestone Estimator', path: '/app/time-estimator', icon: Clock, cat: 'Tools' },
    { name: 'Client Scam Detector', path: '/app/scam-detector', icon: ShieldCheck, cat: 'AI Safety' },
    { name: 'Client Sentiment Analyzer', path: '/app/client-sentiment', icon: Brain, cat: 'AI Safety' },
    { name: 'AI Freelance Mentor', path: '/app/ai-mentor', icon: Sparkles, cat: 'Growth' },
    { name: 'Task Manager', path: '/app/task-manager', icon: ListTodo, cat: 'Workspace' },
    { name: 'Client CRM', path: '/app/client-crm', icon: Users, cat: 'Workspace' },
    { name: 'Notes & Markdown', path: '/app/notes', icon: FileText, cat: 'Workspace' },
    { name: 'Settings & Tax Calculator', path: '/app/settings', icon: SettingsIcon, cat: 'Config' },
  ];

  const filtered = commands.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.cat.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, module name, or search (e.g. proposal, invoice, scam)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No matching actions found</div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.path + cmd.name}
                  onClick={() => handleSelect(cmd.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-200 group-hover:text-white block">{cmd.name}</span>
                      <span className="text-xs text-slate-500">{cmd.cat}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-indigo-400">
                    <Zap className="w-3 h-3" />
                    <span>Jump</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>
            Use <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">↑</kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">↓</kbd> to navigate
          </span>
          <span>
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
