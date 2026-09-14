export type Platform = 'Fiverr' | 'Upwork' | 'Freelancer' | 'LinkedIn' | 'Direct Client';
export type Currency = 'USD' | 'PKR' | 'EUR';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Expert';
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type ClientStatus = 'Active' | 'Completed' | 'Pending';
export type RiskLevel = 'Green' | 'Yellow' | 'Red';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  title?: string;
  hourlyRate?: number;
  country: string;
  currency: Currency;
  isLoggedIn: boolean;
  streakDays: number;
  aiTasksCompleted: number;
  productivityScore: number;
}

export interface ProposalOutput {
  id: string;
  title: string;
  clientDesc: string;
  platform: Platform;
  budget: string;
  timeline: string;
  experience: ExperienceLevel;
  skills: string;
  outputs: {
    professional: string;
    friendly: string;
    premium: string;
    short: string;
  };
  score: number;
  suggestions: string[];
  createdAt: string;
  favorite: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail?: string;
  projectName: string;
  items: InvoiceItem[];
  currency: Currency;
  taxRate: number;
  discount: number;
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  total: number;
  notes?: string;
  createdAt: string;
}

export interface ContractAnalysis {
  id: string;
  title: string;
  contractText: string;
  scope: string;
  deliverables: string[];
  paymentTerms: string;
  timeline: string;
  deadlines: string[];
  risks: string[];
  penaltyClauses: string[];
  importantNotes: string[];
  recommendedQuestions: string[];
  riskScore: number;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface ClientReply {
  id: string;
  clientMsg: string;
  replies: {
    professional: string;
    friendly: string;
    negotiation: string;
    priceIncrease: string;
    projectDelay: string;
    meeting: string;
    revision: string;
    followUp: string;
    thankYou: string;
  };
  createdAt: string;
}

export interface GigOptimization {
  id: string;
  title: string;
  description: string;
  keywords: string;
  optimizedTitle: string;
  optimizedDescription: string;
  seoKeywords: string[];
  bestTags: string[];
  buyerPsychologyTips: string[];
  competitionScore: number;
  rankingChance: string;
  difficultyScore: number;
  createdAt: string;
}

export interface ProfileOptimization {
  id: string;
  bio: string;
  skills: string;
  experience: string;
  portfolio: string;
  headline: string;
  optimizedBio: string;
  seoKeywords: string[];
  recommendedSkills: string[];
  trustTips: string[];
  profileScore: number;
  createdAt: string;
}

export interface PriceEstimate {
  id: string;
  projectDesc: string;
  technology: string;
  experience: ExperienceLevel;
  platform: Platform;
  country: string;
  minPrice: number;
  recommendedPrice: number;
  premiumPrice: number;
  pkrPrice: number;
  intlPrice: number;
  negotiationRange: string;
  reasoning: string[];
  createdAt: string;
}

export interface TimeEstimate {
  id: string;
  projectDesc: string;
  hours: number;
  days: number;
  weeks: number;
  milestones: { title: string; duration: string; details: string }[];
  summary: string;
  createdAt: string;
}

export interface ScamDetection {
  id: string;
  chatText?: string;
  conversation?: string;
  scamProbability?: number;
  trustScore: number;
  riskLevel: RiskLevel | string;
  scamType?: string;
  redFlags: string[];
  greenFlags?: string[];
  recommendedAction?: string;
  recommendation?: string;
  explanation?: string;
  createdAt: string;
}

export interface ClientSentiment {
  id: string;
  message: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Urgent' | 'Confused';
  buyingIntent: number;
  recommendedTone: string;
  explanation: string;
  createdAt: string;
}

export interface ProposalScoreResult {
  id: string;
  proposalText: string;
  grammarScore: number;
  professionalismScore: number;
  confidenceScore: number;
  formattingScore: number;
  personalizationScore: number;
  ctaScore: number;
  overallScore: number;
  suggestions: string[];
  createdAt: string;
}

export interface PortfolioReview {
  id: string;
  portfolioText: string;
  designScore: number;
  professionalScore: number;
  hiringChance: string;
  missingSections: string[];
  improvementTips: string[];
  createdAt: string;
}

export interface ResumeReview {
  id: string;
  resumeText: string;
  atsScore: number;
  grammarScore: number;
  missingSkills: string[];
  missingProjects: string[];
  suggestions: string[];
  createdAt: string;
}

export interface LinkedInOptimization {
  id: string;
  input: string;
  headline: string;
  aboutSection: string;
  experienceRewrite: string;
  seoKeywords: string[];
  postingIdeas: string[];
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  tags: string[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  clientName?: string;
  priority: Priority;
  dueDate: string;
  dueTime?: string;
  status: TaskStatus;
  category?: string;
  reminderDate?: string;
  reminderTime?: string;
  reminderOffset?: string;
  reminderTriggered?: boolean;
  notes?: string;
  subtasks?: SubTask[];
  createdAt?: string;
  isAiSuggested?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'overdue' | 'deadline' | 'system' | 'proposal' | 'invoice';
  taskId?: string;
  createdAt: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  platform?: string;
  status: ClientStatus;
  totalBilled?: number;
  revenue?: number;
  notes?: string;
  country?: string;
  lastContacted?: string;
  followUpDate?: string;
}

export type Client = ClientRecord;

export interface Note {
  id: string;
  title: string;
  content: string;
  folder?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface HistoryItem {
  id: string;
  module: string;
  title: string;
  preview?: string;
  previewText?: string;
  output?: any;
  fullData?: any;
  createdAt: string;
  favorite?: boolean;
}
