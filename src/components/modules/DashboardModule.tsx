import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  SearchCode,
  GraduationCap,
  Briefcase,
  FileCode,
  ShieldAlert,
  UserCheck,
  ArrowRight,
  Flame,
  Shield,
  Zap,
  Circle,
  AlertTriangle,
  ListTodo,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardModule: React.FC = () => {
  const { user, tasks, history, invoices, updateTaskStatus } = useApp();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  // Analytics mock data
  const monthlyActivityData = [
    { month: 'Jan', Proposals: 12, Won: 8 },
    { month: 'Feb', Proposals: 18, Won: 12 },
    { month: 'Mar', Proposals: 25, Won: 19 },
    { month: 'Apr', Proposals: 30, Won: 22 },
    { month: 'May', Proposals: 28, Won: 21 },
    { month: 'Jun', Proposals: 35, Won: 29 },
    { month: 'Jul', Proposals: 42, Won: 34 },
  ];

  const clientCountriesData = [
    { name: 'United States', value: 45, color: '#6366F1' },
    { name: 'United Kingdom', value: 20, color: '#A855F7' },
    { name: 'UAE / Gulf', value: 15, color: '#10B981' },
    { name: 'Germany & EU', value: 12, color: '#3B82F6' },
    { name: 'Australia', value: 8, color: '#F59E0B' },
  ];

  const quickActions = [
    { name: 'Generate Proposal', desc: 'Write personalized cover letters in seconds.', path: '/app/proposal-generator', icon: FileText, color: 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white' },
    { name: 'Analyze Contract', desc: 'Identify risky clauses and payment traps.', path: '/app/contract-analyzer', icon: ShieldAlert, color: 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' },
    { name: 'Price Estimator', desc: 'Calculate local vs international rates.', path: '/app/price-estimator', icon: DollarSign, color: 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white' },
    { name: 'Client Reply AI', desc: 'Craft professional response messages.', path: '/app/client-reply', icon: MessageSquare, color: 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white' },
    { name: 'Gig SEO', desc: 'Optimize titles, tags & Fiverr rank.', path: '/app/gig-optimizer', icon: SearchCode, color: 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white' },
    { name: 'Invoice Generator', desc: 'Create multi-currency PDF invoices.', path: '/app/invoice-generator', icon: FileCode, color: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' },
  ];

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dashboard Hero Header */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Assalam-o-Alaikum, {user.name} 👋
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Your AI-driven business overview for today. You have <span className="text-indigo-400 font-medium">{pendingTasksCount} pending tasks</span> and a <span className="text-emerald-400 font-medium">{user.streakDays}-day streak</span>.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/app/proposal-generator')}
            className="px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Proposal</span>
          </button>
          <button
            onClick={() => navigate('/app/ai-mentor')}
            className="px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition text-center"
          >
            Ask AI Mentor
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <div className="text-slate-500 text-xs font-semibold uppercase mb-2 tracking-wide">Proposal Win Rate</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white tracking-tighter">84%</span>
            <span className="text-emerald-400 text-xs font-medium mb-1">+12% this month</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <div className="text-slate-500 text-xs font-semibold uppercase mb-2 tracking-wide">Pending Revenue</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white tracking-tighter">
              ${totalInvoiced ? totalInvoiced.toLocaleString() : '2,450'}
            </span>
            <span className="text-indigo-400 text-xs font-medium mb-1">4 Active Jobs</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <div className="text-slate-500 text-xs font-semibold uppercase mb-2 tracking-wide">Profile Score</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white tracking-tighter">98</span>
            <span className="text-slate-400 text-xs font-medium mb-1">/ 100 on Upwork</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <div className="text-slate-500 text-xs font-semibold uppercase mb-2 tracking-wide">AI Tasks Done</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white tracking-tighter">{user.aiTasksCompleted}</span>
            <span className="text-slate-400 text-xs font-medium mb-1">This week</span>
          </div>
        </div>
      </div>

      {/* Main Activity Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Quick Actions & Charts) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <button onClick={() => navigate('/app/history')} className="text-xs text-indigo-400 hover:underline">
                View All Modules
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.name}
                    onClick={() => navigate(act.path)}
                    className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-600/10 hover:border-indigo-500/50 cursor-pointer transition"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition ${act.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-medium text-white text-sm">{act.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{act.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Area Chart: Monthly Win Velocity */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Proposal Win Velocity</h3>
                <p className="text-xs text-slate-400">Monthly bids submitted vs client wins</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                Live Data
              </span>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProposals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="Proposals" stroke="#6366F1" fillOpacity={1} fill="url(#colorProposals)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Won" stroke="#10B981" fillOpacity={1} fill="url(#colorWon)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Smart Tasks & Upcoming Deadlines */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Smart Tasks & Deadlines</h3>
                  <p className="text-[11px] text-slate-400">
                    {pendingTasksCount} pending deliverable{pendingTasksCount === 1 ? '' : 's'} scheduled
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/app/task-manager')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Open Task Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.filter((t) => t.status !== 'completed').length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-2xl">
                  🎉 All tasks completed! Use the Smart Task Manager to plan next week's milestones.
                </div>
              ) : (
                tasks
                  .filter((t) => t.status !== 'completed')
                  .slice(0, 3)
                  .map((task) => {
                    const isOverdue = task.dueDate < todayStr;
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition ${
                          isOverdue
                            ? 'bg-rose-500/[0.04] border-rose-500/30'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="text-slate-400 hover:text-emerald-400 transition shrink-0"
                            title="Mark complete"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{task.title}</div>
                            <div className="text-[10px] text-slate-400">
                              {task.clientName} • Due {task.dueDate}
                              {task.reminderDate ? ' • ⏰ Alarm set' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isOverdue && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              OVERDUE
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                              task.priority === 'high'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                : task.priority === 'medium'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No recent activity logged yet. Generate a proposal or contract analysis to get started.
                </div>
              ) : (
                history.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                      AI
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.module} • {item.createdAt}</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      SAVED
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (AI Mentor & Insights) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Mentor Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Mentor</h3>
                <div className="text-[10px] text-indigo-300">Online • Market Analysis Active</div>
              </div>
            </div>
            <div className="bg-black/20 rounded-2xl p-4 mb-4">
              <p className="text-xs leading-relaxed text-indigo-100">
                "{user.name}, Upwork demand for <strong>Full-Stack & React Developers</strong> in US/UK peak between 6 PM - 10 PM. Prepare 2 proposals today!"
              </p>
            </div>
            <button
              onClick={() => navigate('/app/ai-mentor')}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-500/20"
            >
              Ask for Scaling Roadmap
            </button>
          </div>

          {/* Scam Detector Widget */}
          <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Scam Detector</span>
            </div>
            <div className="text-xs text-slate-300 mb-4 leading-relaxed">
              Analyze client chat logs for Telegram payment red flags or off-platform deposit traps.
            </div>
            <button
              onClick={() => navigate('/app/scam-detector')}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold transition"
            >
              Run Client Chat Audit
            </button>
          </div>

          {/* Geographic Breakdown Widget */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Client Geography</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={clientCountriesData} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                    {clientCountriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
              {clientCountriesData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-300 text-[11px] truncate">{c.name} ({c.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
