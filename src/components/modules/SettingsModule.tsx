import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, User, DollarSign, Shield, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import { Currency } from '../../types';

export const SettingsModule: React.FC = () => {
  const { user, setUser, currency, setCurrency, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [hourlyRate, setHourlyRate] = useState(user.hourlyRate);
  const [country, setCountry] = useState(user.country);
  const [taxPercent, setTaxPercent] = useState(0.25); // FBR Pakistan export tax rate for tech services

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      email,
      title,
      hourlyRate: Number(hourlyRate) || 45,
      country,
    });
    showToast('Settings saved successfully!');
  };

  const handleResetStorage = () => {
    if (confirm('Are you sure you want to reset all local storage data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Freelancer Workspace Settings</h1>
          <p className="text-xs text-slate-400">
            Configure default billing rates, currency preferences, and FBR Pakistan tax parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Freelancer Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Country / Region</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider pt-4 border-t border-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Rates & Currency Defaults
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Default Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="USD">USD ($)</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Export Service Tax % (FBR)</label>
              <input
                type="number"
                step="0.01"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </form>

        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI Engine & Storage</h3>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Gemini AI Connected
                </span>
                <span>Active</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Server-side Express proxy initialized on <code>/api/ai/generate</code> with fallback mode.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">Local Data Persistence</span>
              <p className="text-[11px] text-slate-400">
                Proposals, invoices, tasks, and clients are automatically stored in browser LocalStorage.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetStorage}
            className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-2xl transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Clear All Local Workspace Data
          </button>
        </div>
      </div>
    </div>
  );
};
