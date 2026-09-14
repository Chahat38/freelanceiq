import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ProposalOutput,
  Invoice,
  ContractAnalysis,
  ClientReply,
  GigOptimization,
  ProfileOptimization,
  PriceEstimate,
  TimeEstimate,
  ScamDetection,
  ClientSentiment,
  ProposalScoreResult,
  PortfolioReview,
  ResumeReview,
  LinkedInOptimization,
  Task,
  TaskStatus,
  SubTask,
  NotificationItem,
  Client,
  Note,
  HistoryItem,
  PromptTemplate,
  Currency,
} from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: 'English' | 'Roman Urdu';
  setLanguage: (lang: 'English' | 'Roman Urdu') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  
  // Storage Collections
  proposals: ProposalOutput[];
  invoices: Invoice[];
  contracts: ContractAnalysis[];
  tasks: Task[];
  clients: Client[];
  notes: Note[];
  history: HistoryItem[];
  savedPrompts: PromptTemplate[];
  
  // Actions
  addProposal: (p: ProposalOutput) => void;
  addInvoice: (inv: Invoice) => void;
  updateInvoiceStatus: (id: string, status: 'Paid' | 'Pending' | 'Overdue') => void;
  addContract: (c: ContractAnalysis) => void;
  addTask: (t: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  
  // Notifications & Reminders
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (n: Omit<NotificationItem, 'id' | 'createdAt' | 'read' | 'time'> & { time?: string }) => void;
  notificationPermission: NotificationPermission | 'unsupported';
  requestBrowserNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
  activeReminderAlert: Task | null;
  dismissActiveReminder: () => void;
  snoozeActiveReminder: (minutes?: number) => void;
  playNotificationSound: () => void;
  triggerTestAlarm: (customTitle?: string) => void;

  addClient: (c: Omit<Client, 'id'>) => void;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (n: Note) => void;
  deleteNote: (id: string) => void;
  addToHistory: (module: string, title: string, previewText: string, fullData: any) => void;
  toggleFavoriteHistory: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  
  // Toasts & Command Palette
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  
  // AI Proxy Runner
  runAiPrompt: (
    prompt: string,
    systemInstruction?: string,
    isJson?: boolean,
    responseSchema?: any
  ) => Promise<{ success: boolean; text: string; isFallback?: boolean }>;
}

const defaultUser: User = {
  id: 'usr_1',
  name: 'Chahat',
  email: 'chahathassanain@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Full-Stack Developer & Freelancer',
  country: 'Pakistan 🇵🇰',
  currency: 'USD',
  isLoggedIn: true,
  streakDays: 7,
  aiTasksCompleted: 42,
  productivityScore: 94,
};

const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Send Upwork Proposal for Fintech Mobile App',
    description: 'Draft tailored cover letter with Figma wireframe audit and architecture overview.',
    clientName: 'Apex Digital Inc',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    status: 'in_progress',
    category: 'Proposals',
    isAiSuggested: true,
    reminderDate: new Date().toISOString().split('T')[0],
    reminderTime: '17:00',
    reminderOffset: '1h',
    reminderTriggered: false,
    subtasks: [
      { id: 'st1', title: 'Review Figma wireframes & API specs', completed: true },
      { id: 'st2', title: 'Draft tailored 3-paragraph hook with tech stack', completed: true },
      { id: 'st3', title: 'Record 60-second Loom demo walkthrough', completed: false },
    ],
  },
  {
    id: 't2',
    title: 'Review NDA & IP Contract for European Client',
    description: 'Ensure jurisdiction and payment milestone clauses are balanced.',
    clientName: 'SaaSify Studio (UK)',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '14:00',
    status: 'todo',
    category: 'Contracts',
    reminderDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    reminderTime: '13:00',
    reminderOffset: '1h',
    reminderTriggered: false,
    subtasks: [
      { id: 'st4', title: 'Scan with AI Contract Analyzer', completed: false },
      { id: 'st5', title: 'Request indemnity cap adjustment', completed: false },
    ],
  },
  {
    id: 't3',
    title: 'Send Invoice #108 to Digital Studio LLC',
    description: 'Milestone 2 payment for responsive dashboard release.',
    clientName: 'Digital Studio LLC',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00',
    status: 'completed',
    category: 'Invoices',
  },
  {
    id: 't4',
    title: 'Optimize Fiverr Gig SEO Keywords & Tags',
    description: 'Update search tags for React 19 and Next.js full-stack development.',
    priority: 'low',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dueTime: '16:00',
    status: 'todo',
    category: 'SEO',
    isAiSuggested: true,
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Task Reminder',
    desc: 'Upwork Proposal for Fintech Mobile App is due at 6:00 PM today.',
    time: '15m ago',
    read: false,
    type: 'reminder',
    taskId: 't1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Invoice Paid',
    desc: 'Invoice #108 ($1,200) was marked paid by Digital Studio LLC.',
    time: '2h ago',
    read: true,
    type: 'invoice',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Daily Productivity Briefing',
    desc: 'You have 2 pending high-priority tasks scheduled for today.',
    time: '4h ago',
    read: true,
    type: 'system',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

const initialClients: Client[] = [
  { id: 'c1', name: 'Alexander Wright', company: 'Apex Digital Inc (USA)', email: 'alex@apexdigital.com', platform: 'Upwork', status: 'Active', totalBilled: 4500, revenue: 4500, country: 'United States', notes: 'Loves quick turnaround on React & UI tasks.', followUpDate: '2026-07-28', lastContacted: '2026-07-20' },
  { id: 'c2', name: 'Sarah Jenkins', company: 'SaaSify Studio (UK)', email: 'sarah@saasify.co.uk', platform: 'Direct Client', status: 'Active', totalBilled: 3200, revenue: 3200, country: 'United Kingdom', notes: 'Ongoing monthly retainer for frontend support.', followUpDate: '2026-08-01', lastContacted: '2026-07-22' },
  { id: 'c3', name: 'Tariq Al-Mansoor', company: 'Dubai Tech Ventures', email: 'tariq@dtv.ae', platform: 'LinkedIn', status: 'Completed', totalBilled: 2100, revenue: 2100, country: 'UAE', notes: 'Completed MVP for Real Estate Portal.', followUpDate: '2026-08-15', lastContacted: '2026-07-15' },
];

const initialNotes: Note[] = [
  { id: 'n1', title: 'Upwork Top Rated Plus Criteria 2026', content: '# Requirements\n- Over $10k earnings in 12 months\n- Maintain 90%+ Job Success Score\n- Top tier enterprise contract history\n\n### Strategy\nTarget high budget fixed-price projects with explicit milestones.', folder: 'Strategy', createdAt: '2026-07-20', updatedAt: '2026-07-21' },
  { id: 'n2', title: 'Client Negotiation Cheatsheet', content: '### Price Increase Script\n"Based on the expanded scope and new API integrations, our revised investment will be $2,400 to ensure full test coverage and top performance."', folder: 'Templates', createdAt: '2026-07-18', updatedAt: '2026-07-19' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('freelanceiq_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.name || parsed.name.includes('Hamza')) {
          parsed.name = 'Chahat';
          parsed.email = 'chahathassanain@gmail.com';
        }
        return parsed;
      } catch {}
    }
    return defaultUser;
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('freelanceiq_theme');
    return saved ? saved === 'dark' : true; // Default dark
  });

  const [language, setLanguage] = useState<'English' | 'Roman Urdu'>('English');
  const [currency, setCurrencyState] = useState<Currency>('USD');

  const [proposals, setProposals] = useState<ProposalOutput[]>(() => {
    const saved = localStorage.getItem('freelanceiq_proposals');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('freelanceiq_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [contracts, setContracts] = useState<ContractAnalysis[]>(() => {
    const saved = localStorage.getItem('freelanceiq_contracts');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('freelanceiq_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('freelanceiq_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('freelanceiq_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('freelanceiq_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('freelanceiq_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [activeReminderAlert, setActiveReminderAlert] = useState<Task | null>(null);

  const [savedPrompts, setSavedPrompts] = useState<PromptTemplate[]>([]);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('freelanceiq_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const requestBrowserNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Browser notifications are not supported in this environment', 'info');
      return 'unsupported';
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        showToast('Browser notifications enabled!', 'success');
      } else if (perm === 'denied') {
        showToast('Browser notifications blocked. In-app alerts will be used.', 'info');
      }
      return perm;
    } catch {
      return 'unsupported';
    }
  };

  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // 3-tone pleasant alarm chime (C5 -> E5 -> G5)
      const notes = [
        { freq: 523.25, start: 0, dur: 0.18, vol: 0.25 },
        { freq: 659.25, start: 0.14, dur: 0.18, vol: 0.28 },
        { freq: 783.99, start: 0.28, dur: 0.38, vol: 0.32 },
      ];

      notes.forEach(({ freq, start, dur, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(vol, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur);
      });

      // Browser device vibration if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch {
      // Audio playback failed silently
    }
  };

  const addNotification = (n: Omit<NotificationItem, 'id' | 'createdAt' | 'read' | 'time'> & { time?: string }) => {
    const newNotif: NotificationItem = {
      ...n,
      id: 'notif_' + Date.now(),
      read: false,
      time: n.time || 'Just now',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared');
  };

  const updateTask = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    showToast('Task updated');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    showToast(`Task marked as ${status === 'in_progress' ? 'in progress' : status}`);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks };
      })
    );
  };

  const dismissActiveReminder = () => {
    setActiveReminderAlert(null);
  };

  const snoozeActiveReminder = (minutes: number = 5) => {
    if (!activeReminderAlert) return;
    const taskToSnooze = activeReminderAlert;
    setActiveReminderAlert(null);

    const now = new Date();
    const snoozedTime = new Date(now.getTime() + minutes * 60 * 1000);
    const remYear = snoozedTime.getFullYear();
    const remMonth = String(snoozedTime.getMonth() + 1).padStart(2, '0');
    const remDay = String(snoozedTime.getDate()).padStart(2, '0');
    const remHours = String(snoozedTime.getHours()).padStart(2, '0');
    const remMins = String(snoozedTime.getMinutes()).padStart(2, '0');

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskToSnooze.id
          ? {
              ...t,
              reminderDate: `${remYear}-${remMonth}-${remDay}`,
              reminderTime: `${remHours}:${remMins}`,
              reminderTriggered: false,
            }
          : t
      )
    );
    showToast(`Alarm snoozed for ${minutes} min (${remHours}:${remMins})`, 'info');
  };

  const triggerTestAlarm = (customTitle?: string) => {
    playNotificationSound();

    const title = customTitle || 'Upcoming Client Deliverable Deadline';
    const testTask: Task = {
      id: 'test_alarm_' + Date.now(),
      title,
      clientName: 'Apex Digital Inc',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: new Date(Date.now() + 30 * 60 * 1000).toTimeString().slice(0, 5),
      status: 'in_progress',
      category: 'Client Work',
      reminderTriggered: true,
      description: 'Browser notification test alert. Your web alarms and notification audio are working!',
    };

    setActiveReminderAlert(testTask);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(`⏰ FreelanceIQ Alarm: ${title}`, {
            body: `Priority: HIGH | Due today! In-browser alarm and sound are working.`,
            icon: '/favicon.ico',
          });
        } catch {}
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          setNotificationPermission(perm);
          if (perm === 'granted') {
            try {
              new Notification(`⏰ FreelanceIQ Alarm: ${title}`, {
                body: `Priority: HIGH | Browser notifications enabled successfully!`,
                icon: '/favicon.ico',
              });
            } catch {}
          }
        });
      }
    }

    setNotifications((prev) => [
      {
        id: 'notif_test_' + Date.now(),
        title: `⏰ Alarm Triggered: ${title}`,
        desc: 'Browser notification & sound chime fired successfully.',
        time: 'Just now',
        read: false,
        type: 'reminder',
        taskId: testTask.id,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast('Browser alarm & sound chime test active!', 'success');
  };

  // Smart Reminder and Daily Briefing Scheduler
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const nowTime = now.getTime();
      const todayStr = now.toISOString().split('T')[0];

      setTasks((prevTasks) => {
        let changed = false;
        const updated = prevTasks.map((t) => {
          if (t.status === 'completed') return t;
          if (t.reminderDate && t.reminderTime && !t.reminderTriggered) {
            try {
              const reminderDate = new Date(`${t.reminderDate}T${t.reminderTime}`);
              const diffMs = nowTime - reminderDate.getTime();
              // Trigger if within 15 minutes of reminder time
              if (diffMs >= 0 && diffMs <= 15 * 60 * 1000) {
                changed = true;
                playNotificationSound();

                if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                  try {
                    new Notification(`⏰ Reminder: ${t.title}`, {
                      body: `Due: ${t.dueDate}${t.dueTime ? ` at ${t.dueTime}` : ''} | Priority: ${t.priority.toUpperCase()}`,
                      icon: '/favicon.ico',
                    });
                  } catch {}
                }

                setNotifications((prevN) => [
                  {
                    id: 'notif_rem_' + Date.now(),
                    title: `⏰ Task Reminder: ${t.title}`,
                    desc: `Due ${t.dueDate}${t.dueTime ? ` at ${t.dueTime}` : ''} (${t.priority.toUpperCase()} priority).`,
                    time: 'Just now',
                    read: false,
                    type: 'reminder',
                    taskId: t.id,
                    createdAt: new Date().toISOString(),
                  },
                  ...prevN,
                ]);

                setActiveReminderAlert(t);
                return { ...t, reminderTriggered: true };
              }
            } catch {}
          }
          return t;
        });
        return changed ? updated : prevTasks;
      });

      // Daily briefing check
      try {
        const briefedKey = `freelanceiq_briefed_${todayStr}`;
        if (!localStorage.getItem(briefedKey)) {
          const todayTasks = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'completed');
          if (todayTasks.length > 0) {
            localStorage.setItem(briefedKey, 'true');
            setNotifications((prevN) => [
              {
                id: 'notif_brief_' + Date.now(),
                title: '📋 Daily Plan Briefing',
                desc: `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} scheduled for today. Focus on high priority items first!`,
                time: 'Just now',
                read: false,
                type: 'system',
                createdAt: new Date().toISOString(),
              },
              ...prevN,
            ]);
          }
        }
      } catch {}
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 10000);
    return () => clearInterval(interval);
  }, [tasks]);

  const setDarkMode = (val: boolean) => setDarkModeState(val);
  const setCurrency = (c: Currency) => setCurrencyState(c);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const incrementAiTaskCount = () => {
    setUser((prev) => ({
      ...prev,
      aiTasksCompleted: prev.aiTasksCompleted + 1,
      productivityScore: Math.min(100, prev.productivityScore + 1),
    }));
  };

  const addProposal = (p: ProposalOutput) => {
    setProposals((prev) => [p, ...prev]);
    addToHistory('AI Proposal Generator', p.title, p.outputs.professional.slice(0, 100) + '...', p);
    incrementAiTaskCount();
    showToast('Proposal generated & saved!');
  };

  const addInvoice = (inv: Invoice) => {
    setInvoices((prev) => [inv, ...prev]);
    addToHistory('Invoice Generator', `Invoice #${inv.invoiceNumber} - ${inv.clientName}`, `${inv.currency} ${inv.total}`, inv);
    showToast('Invoice generated & saved!');
  };

  const updateInvoiceStatus = (id: string, status: 'Paid' | 'Pending' | 'Overdue') => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    showToast(`Invoice status updated to ${status}`);
  };

  const addContract = (c: ContractAnalysis) => {
    setContracts((prev) => [c, ...prev]);
    addToHistory('Contract Analyzer', c.title, `Risk Score: ${c.riskScore}% (${c.riskLevel})`, c);
    incrementAiTaskCount();
    showToast('Contract analysis complete & saved!');
  };

  const addTask = (t: Omit<Task, 'id'>) => {
    const newTask: Task = { ...t, id: 'task_' + Date.now() };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task deleted', 'info');
  };

  const addClient = (c: Omit<Client, 'id'>) => {
    const newClient: Client = { ...c, id: 'cli_' + Date.now() };
    setClients((prev) => [newClient, ...prev]);
    showToast('Client added to CRM');
  };

  const updateClient = (c: Client) => {
    setClients((prev) => prev.map((item) => (item.id === c.id ? c : item)));
    showToast('Client updated');
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((item) => item.id !== id));
    showToast('Client deleted', 'info');
  };

  const addNote = (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const date = new Date().toISOString().split('T')[0];
    const newNote: Note = {
      ...n,
      id: 'note_' + Date.now(),
      createdAt: date,
      updatedAt: date,
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast('Note created');
  };

  const updateNote = (n: Note) => {
    const date = new Date().toISOString().split('T')[0];
    setNotes((prev) => prev.map((item) => (item.id === n.id ? { ...n, updatedAt: date } : item)));
    showToast('Note saved');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((item) => item.id !== id));
    showToast('Note deleted', 'info');
  };

  const addToHistory = (moduleName: string, title: string, previewText: string, fullData: any) => {
    const newItem: HistoryItem = {
      id: 'hist_' + Date.now(),
      module: moduleName,
      title,
      previewText,
      fullData,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      favorite: false,
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const toggleFavoriteHistory = (id: string) => {
    setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)));
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('History item removed', 'info');
  };

  // Run AI Prompt through backend proxy
  const runAiPrompt = async (
    prompt: string,
    systemInstruction?: string,
    isJson?: boolean,
    responseSchema?: any
  ): Promise<{ success: boolean; text: string; isFallback?: boolean }> => {
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction, isJson, responseSchema }),
      });

      if (!res.ok) {
        let errorMessage = `Server error (${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson && errJson.error) {
            errorMessage = errJson.error;
          }
        } catch (_) {
          // ignore json parse error
        }

        showToast(errorMessage, 'error');

        return {
          success: false,
          text: `Unable to generate AI content: ${errorMessage}`,
          isFallback: true,
        };
      }

      const data = await res.json();
      if (data.isFallback && data.message) {
        showToast(data.message, 'info');
      }
      return {
        success: data.success ?? true,
        text: data.text || '',
        isFallback: data.isFallback ?? false,
      };
    } catch (err: any) {
      const msg = err?.message || 'Network error connecting to AI API';
      showToast(msg, 'error');
      return {
        success: false,
        text: `Network error: ${msg}`,
        isFallback: true,
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        darkMode,
        setDarkMode,
        language,
        setLanguage,
        currency,
        setCurrency,
        proposals,
        invoices,
        contracts,
        tasks,
        clients,
        notes,
        history,
        savedPrompts,
        addProposal,
        addInvoice,
        updateInvoiceStatus,
        addContract,
        addTask,
        updateTask,
        updateTaskStatus,
        toggleTask,
        deleteTask,
        toggleSubtask,
        notifications,
        unreadNotificationsCount: notifications.filter((n) => !n.read).length,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        clearAllNotifications,
        addNotification,
        notificationPermission,
        requestBrowserNotificationPermission,
        activeReminderAlert,
        dismissActiveReminder,
        snoozeActiveReminder,
        playNotificationSound,
        triggerTestAlarm,
        addClient,
        updateClient,
        deleteClient,
        addNote,
        updateNote,
        deleteNote,
        addToHistory,
        toggleFavoriteHistory,
        deleteHistoryItem,
        toasts,
        showToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
        runAiPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
