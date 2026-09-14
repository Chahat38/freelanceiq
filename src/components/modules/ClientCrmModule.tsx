import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Mail,
  DollarSign,
  Globe,
  Trash2,
  Edit3,
  Sparkles,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Grid,
  List,
  Copy,
  Check,
  X,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { Client, ClientStatus } from '../../types';

export const ClientCrmModule: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, showToast, runAiPrompt, currency } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Add Client Modal / Form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    platform: 'Upwork' as const,
    status: 'Active' as ClientStatus,
    revenue: 1500,
    country: 'United States',
    notes: '',
    followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  // Edit Client Modal state
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // AI Draft Follow-up state
  const [aiDraftClient, setAiDraftClient] = useState<Client | null>(null);
  const [aiDraftText, setAiDraftText] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [hasCopiedDraft, setHasCopiedDraft] = useState(false);

  // Form submit: Add Client
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name.trim()) {
      showToast('Client name is required', 'error');
      return;
    }

    const created: Omit<Client, 'id'> = {
      name: newClient.name.trim(),
      company: newClient.company.trim() || 'Independent Client',
      email: newClient.email.trim() || 'client@example.com',
      platform: newClient.platform,
      status: newClient.status,
      revenue: Number(newClient.revenue) || 0,
      totalBilled: Number(newClient.revenue) || 0,
      country: newClient.country.trim() || 'Global',
      notes: newClient.notes.trim() || `Acquired via ${newClient.platform}`,
      followUpDate: newClient.followUpDate,
      lastContacted: new Date().toISOString().split('T')[0],
    };

    addClient(created);
    setIsAddOpen(false);
    setNewClient({
      name: '',
      company: '',
      email: '',
      platform: 'Upwork',
      status: 'Active',
      revenue: 1500,
      country: 'United States',
      notes: '',
      followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
  };

  // Form submit: Edit Client
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.name.trim()) {
      showToast('Client name is required', 'error');
      return;
    }

    const updated: Client = {
      ...editingClient,
      revenue: Number(editingClient.revenue ?? editingClient.totalBilled ?? 0),
      totalBilled: Number(editingClient.totalBilled ?? editingClient.revenue ?? 0),
    };

    updateClient(updated);
    setEditingClient(null);
  };

  // Generate AI Follow-up Draft
  const handleGenerateFollowUp = async (client: Client) => {
    setAiDraftClient(client);
    setAiDraftText('');
    setIsGeneratingDraft(true);

    const prompt = `Write a friendly, professional, high-converting check-in message for a freelance client.
Client Details:
- Name: ${client.name}
- Company: ${client.company || 'N/A'}
- Platform: ${client.platform || 'Direct'}
- Revenue Billed: $${client.revenue || client.totalBilled || 0}
- Client Notes/Context: ${client.notes || 'Previous project successfully delivered.'}

Requirements:
- Short, polite, and value-driven (around 3 to 4 paragraphs).
- Re-engage them for upcoming work or ask if they need assistance with new features/maintenance.
- Include a clear call-to-action to book a short call or send scope details.
- Provide subject line if email, plus message body.`;

    try {
      const res = await runAiPrompt(
        prompt,
        'You are an expert freelance client relationship manager & copywriter.'
      );
      setAiDraftText(res.text || 'Failed to generate message draft.');
    } catch (err: any) {
      setAiDraftText('Error generating draft. Please try again.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Copy AI Draft
  const handleCopyDraft = () => {
    if (!aiDraftText) return;
    navigator.clipboard.writeText(aiDraftText);
    setHasCopiedDraft(true);
    showToast('Follow-up draft copied to clipboard!');
    setTimeout(() => setHasCopiedDraft(false), 2000);
  };

  // Filtered Client List
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || c.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPlatform =
      platformFilter === 'All' ||
      (c.platform && c.platform.toLowerCase() === platformFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Overview metrics
  const totalRevenue = clients.reduce(
    (sum, c) => sum + Number(c.totalBilled ?? c.revenue ?? 0),
    0
  );
  const activeCount = clients.filter((c) => c.status === 'Active').length;
  const leadCount = clients.filter((c) => c.status === 'Lead').length;
  const avgRevenue = clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0;

  // Status Badge Colors
  const getStatusBadge = (status: ClientStatus | string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Lead':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Completed':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Past':
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Client CRM & Revenue Hub
            </h1>
            <p className="text-xs text-slate-400">
              Track client relationships, lifetime billed revenue, follow-ups, and AI follow-up emails.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Revenue Billed
          </p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Across {clients.length} total client records</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Active Accounts
          </p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-400 mt-1">{activeCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{leadCount} prospective leads</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Avg Value / Client
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1">
            ${avgRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Average client lifetime value</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Directories & Channels
          </p>
          <p className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
            {Array.from(new Set(clients.map((c) => c.platform || 'Direct'))).length} Platforms
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Upwork, Fiverr, Direct, LinkedIn</p>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, company, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0F172A]">All Statuses</option>
              <option value="Active" className="bg-[#0F172A]">Active</option>
              <option value="Lead" className="bg-[#0F172A]">Lead</option>
              <option value="Completed" className="bg-[#0F172A]">Completed</option>
              <option value="Past" className="bg-[#0F172A]">Past</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0F172A]">All Platforms</option>
              <option value="Upwork" className="bg-[#0F172A]">Upwork</option>
              <option value="Fiverr" className="bg-[#0F172A]">Fiverr</option>
              <option value="Direct Client" className="bg-[#0F172A]">Direct Client</option>
              <option value="LinkedIn" className="bg-[#0F172A]">LinkedIn</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Contents */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No client records found</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {searchTerm || statusFilter !== 'All' || platformFilter !== 'All'
              ? 'Try clearing your search filters to view records.'
              : 'Add your first client to start managing revenue and relationships.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setPlatformFilter('All');
              setIsAddOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl transition"
          >
            Add New Client
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const rev = Number(client.totalBilled ?? client.revenue ?? 0);
            return (
              <div
                key={client.id}
                className="p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl backdrop-blur-md transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Header: Avatar & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm font-bold text-white truncate">{client.name}</h3>
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-500 shrink-0" />
                          {client.company || 'Independent Client'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getStatusBadge(
                        client.status
                      )}`}
                    >
                      {client.status}
                    </span>
                  </div>

                  {/* Revenue & Platform Details */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Billed</span>
                      <span className="font-bold text-emerald-400">
                        ${rev.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Platform</span>
                      <span className="font-medium text-slate-200 truncate block">
                        {client.platform || 'Direct'}
                      </span>
                    </div>
                  </div>

                  {/* Notes & Follow Up */}
                  {client.notes && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
                      "{client.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 space-x-2">
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                      <a href={`mailto:${client.email}`} className="hover:underline truncate">
                        {client.email}
                      </a>
                    </span>
                    {client.followUpDate && (
                      <span className="flex items-center gap-1 text-slate-400 shrink-0">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {client.followUpDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleGenerateFollowUp(client)}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Follow-Up</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit Client"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Billed</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Follow Up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredClients.map((client) => {
                const rev = Number(client.totalBilled ?? client.revenue ?? 0);
                return (
                  <tr key={client.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{client.name}</div>
                      <div className="text-[11px] text-slate-400">{client.company || 'Independent'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {client.platform || 'Direct'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      ${rev.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <a href={`mailto:${client.email}`} className="hover:underline">
                        {client.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {client.followUpDate || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleGenerateFollowUp(client)}
                        className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 inline-flex items-center gap-1 transition text-[10px] font-semibold"
                        title="AI Follow-up Draft"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span className="hidden sm:inline">AI Draft</span>
                      </button>
                      <button
                        onClick={() => setEditingClient(client)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">Add New Client Record</h2>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Client Name *</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Company / Studio</label>
                  <input
                    type="text"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    placeholder="e.g. Apex Media"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="e.g. marcus@apex.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Platform</label>
                  <select
                    value={newClient.platform}
                    onChange={(e) => setNewClient({ ...newClient, platform: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Upwork">Upwork</option>
                    <option value="Fiverr">Fiverr</option>
                    <option value="Direct Client">Direct Client</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status</label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({ ...newClient, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Lead">Lead</option>
                    <option value="Completed">Completed</option>
                    <option value="Past">Past</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Revenue ($)</label>
                  <input
                    type="number"
                    value={newClient.revenue}
                    onChange={(e) => setNewClient({ ...newClient, revenue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    value={newClient.country}
                    onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Follow-Up Date</label>
                  <input
                    type="date"
                    value={newClient.followUpDate}
                    onChange={(e) => setNewClient({ ...newClient, followUpDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Notes / Scope Context</label>
                <textarea
                  rows={2}
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="e.g. Loves clean React code, prefers weekly video updates..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg shadow-indigo-600/30"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingClient(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">Edit Client Record</h2>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Client Name</label>
                <input
                  type="text"
                  required
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Company</label>
                  <input
                    type="text"
                    value={editingClient.company || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Platform</label>
                  <select
                    value={editingClient.platform || 'Upwork'}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, platform: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Upwork">Upwork</option>
                    <option value="Fiverr">Fiverr</option>
                    <option value="Direct Client">Direct Client</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status</label>
                  <select
                    value={editingClient.status}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, status: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Lead">Lead</option>
                    <option value="Completed">Completed</option>
                    <option value="Past">Past</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Total Revenue ($)</label>
                  <input
                    type="number"
                    value={editingClient.revenue ?? editingClient.totalBilled ?? 0}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        revenue: Number(e.target.value),
                        totalBilled: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    value={editingClient.country || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Follow-Up Date</label>
                  <input
                    type="date"
                    value={editingClient.followUpDate || ''}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, followUpDate: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Notes</label>
                <textarea
                  rows={2}
                  value={editingClient.notes || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg shadow-indigo-600/30"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Draft Follow-up Modal */}
      {aiDraftClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setAiDraftClient(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">AI Follow-Up Message Draft</h2>
                <p className="text-xs text-slate-400">
                  Custom check-in message for <span className="text-indigo-400 font-semibold">{aiDraftClient.name}</span>
                </p>
              </div>
            </div>

            {isGeneratingDraft ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400 animate-pulse">
                  Crafting personalized follow-up message using Gemini AI...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-sans max-h-72 overflow-y-auto leading-relaxed custom-scrollbar">
                  {aiDraftText}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <a
                    href={`mailto:${aiDraftClient.email}?subject=${encodeURIComponent(
                      `Quick Check-in - ${aiDraftClient.company || 'Project Update'}`
                    )}&body=${encodeURIComponent(aiDraftText)}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Email</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateFollowUp(aiDraftClient)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={handleCopyDraft}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
                    >
                      {hasCopiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{hasCopiedDraft ? 'Copied!' : 'Copy Draft'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
