import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ListTodo,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Tag,
  Sparkles,
  Bell,
  BellOff,
  Volume2,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCw,
  BellRing,
  CheckSquare,
  Square,
  ArrowRight,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { Task, Priority, TaskStatus, SubTask } from '../../types';

export const TaskManagerModule: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    toggleSubtask,
    showToast,
    runAiPrompt,
    user,
    notificationPermission,
    requestBrowserNotificationPermission,
    playNotificationSound,
    activeReminderAlert,
    dismissActiveReminder,
    snoozeActiveReminder,
    triggerTestAlarm,
  } = useApp();

  // Natural Language Smart Task Input
  const [naturalInput, setNaturalInput] = useState('');
  const [isParsingNatural, setIsParsingNatural] = useState(false);

  // Standard Task Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState('Client Work');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');

  // Reminder State
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderOffset, setReminderOffset] = useState<'10m' | '30m' | '1h' | '1d' | 'custom'>('1h');
  const [reminderDate, setReminderDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reminderTime, setReminderTime] = useState('16:00');

  // AI Assistant states
  const [isSuggestingPriority, setIsSuggestingPriority] = useState(false);
  const [priorityReason, setPriorityReason] = useState<string | null>(null);

  // Subtask Breakdown Modal/State
  const [breakdownTask, setBreakdownTask] = useState<Task | null>(null);
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
  const [suggestedSubtasks, setSuggestedSubtasks] = useState<{ id: string; title: string; selected: boolean }[]>([]);

  // Daily Plan State
  const [isGeneratingDailyPlan, setIsGeneratingDailyPlan] = useState(false);
  const [dailyPlan, setDailyPlan] = useState<{
    morning: string[];
    afternoon: string[];
    evening: string[];
    proTip: string;
  } | null>(null);
  const [isDailyPlanOpen, setIsDailyPlanOpen] = useState(false);

  // AI Productivity Summary State
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiProductivityInsight, setAiProductivityInsight] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'today' | 'pending' | 'completed' | 'overdue'>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Calculate Productivity Metrics
  const todayStr = new Date().toISOString().split('T')[0];

  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status !== 'completed').length;
    const dueToday = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'completed').length;
    const overdue = tasks.filter((t) => {
      if (t.status === 'completed') return false;
      if (!t.dueDate) return false;
      return t.dueDate < todayStr;
    }).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, dueToday, overdue, completionRate };
  }, [tasks, todayStr]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search query filter
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.clientName && task.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'today') {
        return task.dueDate === todayStr && task.status !== 'completed';
      }
      if (statusFilter === 'pending') {
        return task.status !== 'completed';
      }
      if (statusFilter === 'completed') {
        return task.status === 'completed';
      }
      if (statusFilter === 'overdue') {
        return task.dueDate < todayStr && task.status !== 'completed';
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, todayStr]);

  // Update reminder date/time whenever offset or due date/time changes
  const applyReminderPreset = (offset: '10m' | '30m' | '1h' | '1d' | 'custom') => {
    setReminderOffset(offset);
    if (offset === 'custom') return;

    try {
      const [year, month, day] = dueDate.split('-').map(Number);
      const [hours, minutes] = dueTime.split(':').map(Number);
      const dueDateTime = new Date(year, month - 1, day, hours || 12, minutes || 0);

      let offsetMs = 60 * 60 * 1000; // 1 hour default
      if (offset === '10m') offsetMs = 10 * 60 * 1000;
      if (offset === '30m') offsetMs = 30 * 60 * 1000;
      if (offset === '1d') offsetMs = 24 * 60 * 60 * 1000;

      const reminderDateTime = new Date(dueDateTime.getTime() - offsetMs);
      const remYear = reminderDateTime.getFullYear();
      const remMonth = String(reminderDateTime.getMonth() + 1).padStart(2, '0');
      const remDay = String(reminderDateTime.getDate()).padStart(2, '0');
      const remHours = String(reminderDateTime.getHours()).padStart(2, '0');
      const remMins = String(reminderDateTime.getMinutes()).padStart(2, '0');

      setReminderDate(`${remYear}-${remMonth}-${remDay}`);
      setReminderTime(`${remHours}:${remMins}`);
    } catch {
      // Keep existing reminder
    }
  };

  // 1. SMART TASK CREATION: Parse Natural Language Input with Gemini
  const handleParseNaturalTask = async () => {
    if (!naturalInput.trim()) {
      showToast('Please type a task prompt first.', 'error');
      return;
    }

    setIsParsingNatural(true);

    const todayDate = new Date().toISOString().split('T')[0];
    const systemPrompt = `You are a Smart Freelance Task Assistant for an individual freelancer.
Analyze the user's natural language task request. Extract task details and return strictly valid JSON with these keys:
- "title": string (concise actionable title)
- "clientName": string (client or company name if mentioned, otherwise "General")
- "category": string (e.g. "Proposals", "Development", "Design", "Invoices", "Contracts", "SEO", "Client Work")
- "dueDate": string (YYYY-MM-DD format based on relative timing, today is ${todayDate})
- "dueTime": string (HH:mm 24-hour format, default "17:00" if unspecified)
- "priority": string ("high" | "medium" | "low")
- "description": string (short deliverable context)
- "reminderOffset": string ("10m" | "30m" | "1h" | "1d")`;

    const userPrompt = `Input: "${naturalInput}"`;

    try {
      const res = await runAiPrompt(userPrompt, systemPrompt, true);
      let parsed: any = null;

      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (parsed && parsed.title) {
        setTitle(parsed.title);
        if (parsed.clientName) setClientName(parsed.clientName);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.dueDate) setDueDate(parsed.dueDate);
        if (parsed.dueTime) setDueTime(parsed.dueTime);
        if (['high', 'medium', 'low'].includes(parsed.priority)) setPriority(parsed.priority);
        if (parsed.description) setDescription(parsed.description);

        setEnableReminder(true);
        if (parsed.reminderOffset) {
          applyReminderPreset(parsed.reminderOffset);
        } else {
          applyReminderPreset('1h');
        }

        showToast('Task details extracted with AI! Review and click Add Task.');
      } else {
        // Fallback: use natural input as title directly
        setTitle(naturalInput.trim());
        showToast('Parsed task title. Adjust fields as needed.', 'info');
      }
    } catch {
      setTitle(naturalInput.trim());
      showToast('AI parser unavailable. Loaded prompt as task title.', 'info');
    } finally {
      setIsParsingNatural(false);
    }
  };

  // 2. SMART PRIORITY SUGGESTION
  const handleSuggestPriority = async () => {
    if (!title.trim()) {
      showToast('Please enter a task title first to evaluate priority.', 'error');
      return;
    }

    setIsSuggestingPriority(true);
    setPriorityReason(null);

    const pendingHighCount = tasks.filter((t) => t.status !== 'completed' && t.priority === 'high').length;
    const systemPrompt = `You are an AI Workflow Optimizer for a single freelancer.
Evaluate the task urgency based on the title, client, due date (${dueDate}), and current workload (${pendingHighCount} pending high-priority items).
Return strictly valid JSON with:
- "priority": ("high" | "medium" | "low")
- "reason": string (1 concise sentence explaining the reasoning)`;

    const userPrompt = `Task: ${title}\nClient: ${clientName || 'General'}\nCategory: ${category}\nDue: ${dueDate} ${dueTime}\nNotes: ${description}`;

    try {
      const res = await runAiPrompt(userPrompt, systemPrompt, true);
      let parsed: any = null;
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (parsed && ['high', 'medium', 'low'].includes(parsed.priority)) {
        setPriority(parsed.priority);
        setPriorityReason(parsed.reason || `Recommended ${parsed.priority} based on deadline and client impact.`);
        showToast(`AI suggested ${parsed.priority.toUpperCase()} priority`);
      } else {
        setPriority('high');
        setPriorityReason('Recommended high priority to protect client satisfaction.');
      }
    } catch {
      setPriority('medium');
      setPriorityReason('Evaluated as balanced medium priority.');
    } finally {
      setIsSuggestingPriority(false);
    }
  };

  // Form Submit: Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Task title is required', 'error');
      return;
    }

    const newTask: Omit<Task, 'id'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      clientName: clientName.trim() || 'General',
      category: category || 'Client Work',
      dueDate: dueDate || todayStr,
      dueTime: dueTime || '17:00',
      priority,
      status: 'todo',
      notes: notes.trim() || undefined,
      reminderDate: enableReminder ? reminderDate : undefined,
      reminderTime: enableReminder ? reminderTime : undefined,
      reminderOffset: enableReminder ? reminderOffset : undefined,
      reminderTriggered: false,
      createdAt: new Date().toLocaleDateString(),
      subtasks: [],
    };

    addTask(newTask);

    // Reset Form
    setTitle('');
    setDescription('');
    setClientName('');
    setNotes('');
    setNaturalInput('');
    setEnableReminder(false);
    setPriorityReason(null);
    showToast('Task added to your schedule!');
  };

  // 3. AI TASK BREAKDOWN: Open and generate subtasks
  const handleOpenBreakdown = async (task: Task) => {
    setBreakdownTask(task);
    setIsGeneratingSubtasks(true);
    setSuggestedSubtasks([]);

    const systemPrompt = `You are an elite Engineering & Freelance Project Lead.
Break the freelancer's task into 3 to 5 clear, concrete subtasks.
Return strictly valid JSON with key "subtasks": array of strings (actionable steps).`;

    const userPrompt = `Task: "${task.title}"\nDescription: "${task.description || ''}"\nCategory: "${task.category || 'Client Work'}"`;

    try {
      const res = await runAiPrompt(userPrompt, systemPrompt, true);
      let parsed: any = null;
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (parsed && Array.isArray(parsed.subtasks) && parsed.subtasks.length > 0) {
        setSuggestedSubtasks(
          parsed.subtasks.map((st: string, idx: number) => ({
            id: `st_ai_${Date.now()}_${idx}`,
            title: st,
            selected: true,
          }))
        );
      } else {
        // Fallback subtasks
        setSuggestedSubtasks([
          { id: `st_1_${Date.now()}`, title: 'Review specifications and client requirements', selected: true },
          { id: `st_2_${Date.now()}`, title: 'Draft core deliverables and components', selected: true },
          { id: `st_3_${Date.now()}`, title: 'Conduct QA test and polish final output', selected: true },
          { id: `st_4_${Date.now()}`, title: 'Deliver update and notify client', selected: true },
        ]);
      }
    } catch {
      setSuggestedSubtasks([
        { id: `st_1_${Date.now()}`, title: 'Prepare project assets and review brief', selected: true },
        { id: `st_2_${Date.now()}`, title: 'Execute primary deliverables', selected: true },
        { id: `st_3_${Date.now()}`, title: 'Review quality against client criteria', selected: true },
      ]);
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  const handleApplySubtasks = () => {
    if (!breakdownTask) return;

    const chosen: SubTask[] = suggestedSubtasks
      .filter((st) => st.selected && st.title.trim())
      .map((st) => ({ id: st.id, title: st.title.trim(), completed: false }));

    const existing = breakdownTask.subtasks || [];
    const updated: Task = {
      ...breakdownTask,
      subtasks: [...existing, ...chosen],
    };

    updateTask(updated);
    setBreakdownTask(null);
    setSuggestedSubtasks([]);
    showToast(`Added ${chosen.length} subtasks to "${breakdownTask.title}"`);
  };

  // 4. AI PRODUCTIVITY SUMMARY
  const handleGenerateProductivitySummary = async () => {
    setIsGeneratingSummary(true);

    const pendingList = tasks
      .filter((t) => t.status !== 'completed')
      .map((t) => `${t.title} (${t.priority} priority, due ${t.dueDate})`)
      .slice(0, 8)
      .join('; ');

    const systemPrompt = `You are a high-performance Freelance Operations Coach.
Provide a concise, motivating 2-sentence productivity assessment for this solo freelancer.
Highlight their completion progress and advise on the #1 task to finish next to maintain momentum.
Do not use generic buzzwords. Be direct, professional, and practical.`;

    const userPrompt = `Stats: Total tasks: ${metrics.total}, Completed: ${metrics.completed} (${metrics.completionRate}%), Due today: ${metrics.dueToday}, Overdue: ${metrics.overdue}.\nPending tasks: ${pendingList || 'None'}`;

    try {
      const res = await runAiPrompt(userPrompt, systemPrompt);
      if (res.text) {
        setAiProductivityInsight(res.text.trim());
      } else {
        setAiProductivityInsight(
          `You have finished ${metrics.completed} tasks today (${metrics.completionRate}% completion rate). Prioritize high-urgency client deliverables before end of day.`
        );
      }
    } catch {
      setAiProductivityInsight(
        `You have ${metrics.pending} pending tasks with ${metrics.overdue} overdue items. Focus on finishing your overdue items first to keep clients happy.`
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 5. AI DAILY PLAN
  const handleGenerateDailyPlan = async () => {
    setIsGeneratingDailyPlan(true);
    setIsDailyPlanOpen(true);

    const pendingTasksInfo = tasks
      .filter((t) => t.status !== 'completed')
      .map((t) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        due: t.dueDate,
        client: t.clientName,
      }));

    const systemPrompt = `You are an elite Solo Freelancer Daily Planner.
Organize the freelancer's pending tasks into a realistic 3-block daily schedule.
Return strictly valid JSON with:
- "morning": array of strings (Deep focus tasks, highest leverage)
- "afternoon": array of strings (Client deliverables and active work)
- "evening": array of strings (Wrap-up, invoicing, and comms)
- "proTip": string (1 sentence tactical execution advice)`;

    const userPrompt = `Freelancer Name: ${user.name}\nPending Tasks:\n${JSON.stringify(pendingTasksInfo, null, 2)}`;

    try {
      const res = await runAiPrompt(userPrompt, systemPrompt, true);
      let parsed: any = null;
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (parsed && Array.isArray(parsed.morning)) {
        setDailyPlan(parsed);
      } else {
        setDailyPlan({
          morning: ['Tackle highest-priority proposals and deep coding deliverables', 'Clear client inbox blockers'],
          afternoon: ['Execute core project milestones', 'Review contract terms and QA deliverables'],
          evening: ['Send status updates and invoices', 'Plan tomorrow’s primary goals'],
          proTip: 'Block distractions during your 2-hour morning deep focus window to finish your hardest task first.',
        });
      }
    } catch {
      setDailyPlan({
        morning: ['Tackle high priority items first before checking social media or email'],
        afternoon: ['Complete deliverables due today'],
        evening: ['Send client updates and log project milestones'],
        proTip: 'Focus on one deliverable at a time until completed.',
      });
    } finally {
      setIsGeneratingDailyPlan(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Active In-App Alarm/Reminder Alert Modal with Sound and Snooze */}
      {activeReminderAlert && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/95 via-purple-950/95 to-amber-950/95 border-2 border-rose-500/50 backdrop-blur-2xl shadow-2xl shadow-rose-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0 animate-bounce shadow-lg shadow-rose-500/30">
              <BellRing className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  🚨 Browser Alarm Ringing
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-bold uppercase border border-rose-500/40">
                  {activeReminderAlert.priority}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {activeReminderAlert.title}
              </h4>
              <p className="text-xs text-slate-300">
                Due: {activeReminderAlert.dueDate}{' '}
                {activeReminderAlert.dueTime ? `at ${activeReminderAlert.dueTime}` : ''} • Client:{' '}
                {activeReminderAlert.clientName || 'General Project'}
              </p>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                updateTaskStatus(activeReminderAlert.id, 'completed');
                dismissActiveReminder();
                showToast('Deliverable completed! Great job.', 'success');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Check className="w-4 h-4" />
              <span>Mark Complete</span>
            </button>
            <button
              onClick={() => snoozeActiveReminder(5)}
              className="px-3.5 py-2 bg-amber-600/30 hover:bg-amber-600/40 text-amber-200 border border-amber-500/30 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Snooze 5m</span>
            </button>
            <button
              onClick={dismissActiveReminder}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 rounded-xl text-xs font-semibold transition text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header & Browser Notification Controls */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Smart Task & Browser Alarms</span>
            </h1>
            <p className="text-xs text-slate-400">
              Browser notifications, audio chimes, and AI-driven deliverable scheduling for solo freelancers.
            </p>
          </div>
        </div>

        {/* Right side: Direct Alarm Testing & Notification Controls */}
        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
          {/* Test Browser Alarm Button */}
          <button
            onClick={() => triggerTestAlarm('Apex Digital Milestone Review')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-amber-500/10"
            title="Test the browser notification popup, audio chime, and in-app alarm modal right now"
          >
            <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Test Alarm & Chime Now</span>
          </button>

          {/* Browser Notification Status / Grant */}
          {notificationPermission === 'granted' ? (
            <button
              onClick={() => triggerTestAlarm('Browser Notification Check')}
              className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Browser notifications active. Click to test."
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Browser Alarms: ON</span>
            </button>
          ) : (
            <button
              onClick={requestBrowserNotificationPermission}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 animate-pulse"
              title="Enable browser notifications for audio alarms"
            >
              <Bell className="w-3.5 h-3.5 text-white" />
              <span>Enable Browser Alarms</span>
            </button>
          )}

          <button
            onClick={handleGenerateDailyPlan}
            disabled={isGeneratingDailyPlan}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Daily Plan</span>
          </button>
        </div>
      </div>

      {/* AI Daily Productivity Summary Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Daily Productivity Metrics
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              Today: {todayStr}
            </span>
          </div>

          <button
            onClick={handleGenerateProductivitySummary}
            disabled={isGeneratingSummary}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 self-start sm:self-auto"
          >
            {isGeneratingSummary ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingSummary ? 'Analyzing...' : 'Generate AI Productivity Insight'}</span>
          </button>
        </div>

        {/* 5-Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-1">Due Today</span>
            <span className="text-xl font-bold text-indigo-400">{metrics.dueToday}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-1">Pending</span>
            <span className="text-xl font-bold text-slate-200">{metrics.pending}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-1">Completed</span>
            <span className="text-xl font-bold text-emerald-400">{metrics.completed}</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${metrics.overdue > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/[0.02] border-white/5'}`}>
            <span className="text-[11px] text-slate-400 block mb-1">Overdue</span>
            <span className={`text-xl font-bold ${metrics.overdue > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {metrics.overdue}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block mb-1">Completion Rate</span>
            <span className="text-xl font-bold text-purple-400">{metrics.completionRate}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Overall Progress</span>
            <span>{metrics.completed} of {metrics.total} tasks completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
        </div>

        {/* AI Insight Box */}
        {aiProductivityInsight && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-100 flex items-start gap-3 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{aiProductivityInsight}</p>
          </div>
        )}
      </div>

      {/* Main Content Layout: Task Creator & Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Smart Task Creator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Natural Language Quick Input Bar */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Smart Task Creation with AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Type naturally (e.g. <em>"Submit Upwork proposal tomorrow at 6 PM for Sarah"</em>) and AI will extract deadlines, priority, and reminders automatically.
            </p>
            <div className="space-y-2">
              <textarea
                value={naturalInput}
                onChange={(e) => setNaturalInput(e.target.value)}
                placeholder="e.g. I need to deliver React dashboard revisions to Apex Digital by Friday 5 PM high priority"
                rows={2}
                className="w-full bg-[#0b0f19] border border-white/10 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
              <button
                type="button"
                onClick={handleParseNaturalTask}
                disabled={isParsingNatural}
                className="w-full py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                {isParsingNatural ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Details with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill Task Fields with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Standard Task Form */}
          <form
            onSubmit={handleAddTask}
            className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Task Configuration</span>
              </h2>
              <span className="text-[10px] text-slate-500">Solo Freelancer Mode</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deliver Milestone 2 React Frontend"
                className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Client / Project</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Apex Digital Inc"
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Proposals">Proposals</option>
                  <option value="Client Work">Client Work</option>
                  <option value="Contracts">Contracts</option>
                  <option value="Invoices">Invoices</option>
                  <option value="Revisions">Revisions</option>
                  <option value="SEO">SEO / Marketing</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Due Time</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Priority & AI Priority Evaluator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Priority</label>
                <button
                  type="button"
                  onClick={handleSuggestPriority}
                  disabled={isSuggestingPriority}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isSuggestingPriority ? 'Evaluating...' : 'Smart Priority with AI'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 text-xs font-bold rounded-xl uppercase transition border ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                          : p === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {priorityReason && (
                <p className="text-[11px] text-slate-400 mt-1.5 italic bg-white/[0.02] p-2 rounded-xl border border-white/5">
                  💡 {priorityReason}
                </p>
              )}
            </div>

            {/* Smart Reminder Controls */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200">Set Smart Reminder</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableReminder}
                    onChange={(e) => {
                      setEnableReminder(e.target.checked);
                      if (e.target.checked) applyReminderPreset(reminderOffset);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              {enableReminder && (
                <div className="space-y-2.5 pt-2 border-t border-white/5 animate-in fade-in">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] text-slate-400">Quick Alarm Preset:</span>
                    <div className="flex gap-1">
                      {(['10m', '30m', '1h', '1d'] as const).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => applyReminderPreset(preset)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition ${
                            reminderOffset === preset
                              ? 'bg-indigo-500 text-white border-indigo-400'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {preset} before
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1">Reminder Date</span>
                      <input
                        type="date"
                        value={reminderDate}
                        onChange={(e) => {
                          setReminderDate(e.target.value);
                          setReminderOffset('custom');
                        }}
                        className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1">Reminder Time</span>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => {
                          setReminderTime(e.target.value);
                          setReminderOffset('custom');
                        }}
                        className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description / Notes (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specific instructions, GitHub PR links, or client notes..."
                rows={2}
                className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task to Dashboard</span>
            </button>
          </form>
        </div>

        {/* Right Column: Task List & Filtering */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, clients, categories..."
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'today', label: 'Today' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'overdue', label: 'Overdue' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                      statusFilter === tab.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task Cards List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-dashed border-white/10 space-y-2">
                <ListTodo className="w-8 h-8 text-slate-500 mx-auto opacity-40" />
                <h3 className="text-sm font-bold text-slate-300">No tasks found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? 'No tasks matched your search. Try clearing the filter.'
                    : 'Your task list is clear. Add a task above using natural language or the standard form.'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = task.status !== 'completed' && task.dueDate < todayStr;
                const isDueToday = task.status !== 'completed' && task.dueDate === todayStr;
                const subtasks = task.subtasks || [];
                const completedSubtasksCount = subtasks.filter((st) => st.completed).length;
                const isExpanded = expandedTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition relative ${
                      task.status === 'completed'
                        ? 'bg-white/[0.01] border-white/5 opacity-60'
                        : isOverdue
                        ? 'bg-rose-500/[0.03] border-rose-500/30 shadow-lg shadow-rose-950/20'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Checkbox and Main Task Details */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() =>
                            updateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')
                          }
                          className="mt-0.5 text-slate-400 hover:text-indigo-400 transition shrink-0"
                          title={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 hover:text-indigo-400" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h3
                              className={`text-sm font-bold truncate ${
                                task.status === 'completed'
                                  ? 'line-through text-slate-500'
                                  : 'text-white'
                              }`}
                            >
                              {task.title}
                            </h3>

                            {/* Overdue Badge */}
                            {isOverdue && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>OVERDUE</span>
                              </span>
                            )}

                            {/* Due Today Badge */}
                            {isDueToday && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                DUE TODAY
                              </span>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Task Meta Chips */}
                          <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-400">
                            {task.clientName && (
                              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">
                                Client: <strong>{task.clientName}</strong>
                              </span>
                            )}

                            {task.category && (
                              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1">
                                <Tag className="w-3 h-3 text-indigo-400" />
                                <span>{task.category}</span>
                              </span>
                            )}

                            <span
                              className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium ${
                                isOverdue
                                  ? 'text-rose-400 bg-rose-500/10'
                                  : 'text-slate-400 bg-white/5'
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              <span>
                                {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                              </span>
                            </span>

                            {task.reminderDate && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  Alarm: {task.reminderDate}{' '}
                                  {task.reminderTime ? `at ${task.reminderTime}` : ''}
                                </span>
                              </span>
                            )}
                          </div>

                          {/* Subtasks Progress Bar & Toggle */}
                          {subtasks.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-white/5">
                              <button
                                onClick={() =>
                                  setExpandedTaskId(isExpanded ? null : task.id)
                                }
                                className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white transition"
                              >
                                <span className="font-semibold flex items-center gap-1.5">
                                  <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>
                                    Subtasks ({completedSubtasksCount}/{subtasks.length})
                                  </span>
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                )}
                              </button>

                              {/* Expanded Subtask List */}
                              {isExpanded && (
                                <div className="mt-2.5 space-y-1.5 pl-2 animate-in fade-in">
                                  {subtasks.map((st) => (
                                    <div
                                      key={st.id}
                                      onClick={() => toggleSubtask(task.id, st.id)}
                                      className="flex items-center gap-2.5 py-1 text-xs text-slate-300 cursor-pointer hover:text-white transition"
                                    >
                                      {st.completed ? (
                                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      ) : (
                                        <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                      )}
                                      <span
                                        className={st.completed ? 'line-through text-slate-500' : ''}
                                      >
                                        {st.title}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Controls: Priority Badge & Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                            task.priority === 'high'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : task.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            onClick={() => handleOpenBreakdown(task)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition"
                            title="Break into subtasks with AI"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              triggerTestAlarm(`Alarm: ${task.title}`);
                            }}
                            className={`p-1.5 rounded-lg transition ${
                              task.reminderDate
                                ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                            }`}
                            title={
                              task.reminderDate
                                ? `Alarm scheduled (${task.reminderTime || 'deadline'}) • Click to test alarm now`
                                : 'Trigger Browser Alarm for this deliverable'
                            }
                          >
                            <BellRing className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* AI Task Breakdown Modal */}
      {breakdownTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">AI Task Breakdown</h3>
              </div>
              <button
                onClick={() => setBreakdownTask(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Target Deliverable:</p>
              <p className="text-sm font-bold text-white">{breakdownTask.title}</p>
            </div>

            {isGeneratingSubtasks ? (
              <div className="py-10 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Generating actionable subtasks with Gemini AI...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <p className="text-xs text-slate-400 font-medium">Select subtasks to include:</p>
                {suggestedSubtasks.map((st, index) => (
                  <div
                    key={st.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition"
                  >
                    <input
                      type="checkbox"
                      checked={st.selected}
                      onChange={(e) => {
                        const updated = [...suggestedSubtasks];
                        updated[index].selected = e.target.checked;
                        setSuggestedSubtasks(updated);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                    />
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const updated = [...suggestedSubtasks];
                        updated[index].title = e.target.value;
                        setSuggestedSubtasks(updated);
                      }}
                      className="flex-1 bg-transparent text-xs text-slate-100 focus:outline-none border-b border-transparent focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setBreakdownTask(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplySubtasks}
                disabled={isGeneratingSubtasks || suggestedSubtasks.filter((s) => s.selected).length === 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Add Subtasks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Daily Plan Modal */}
      {isDailyPlanOpen && dailyPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#111827] border border-white/10 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Your AI Daily Schedule</h3>
              </div>
              <button
                onClick={() => setIsDailyPlanOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 text-xs">
              {/* Morning Block */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
                  <span>🌅 Morning Focus (Deep Work)</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  {dailyPlan.morning.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Afternoon Block */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                  <span>☀️ Afternoon Execution (Milestones & Revisions)</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  {dailyPlan.afternoon.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evening Block */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                  <span>🌙 Evening Wrap-up (Comms, Invoices & Plan)</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  {dailyPlan.evening.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tip */}
              {dailyPlan.proTip && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs">
                  💡 <strong>Coach Tip:</strong> {dailyPlan.proTip}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  const fullText = `FREELANCEIQ DAILY PLAN\n\nMorning Focus:\n${dailyPlan.morning.map((m) => `- ${m}`).join('\n')}\n\nAfternoon Execution:\n${dailyPlan.afternoon.map((m) => `- ${m}`).join('\n')}\n\nEvening Wrap-up:\n${dailyPlan.evening.map((m) => `- ${m}`).join('\n')}\n\nPro Tip: ${dailyPlan.proTip}`;
                  navigator.clipboard.writeText(fullText);
                  showToast('Daily plan copied to clipboard!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
              >
                Copy Plan to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
