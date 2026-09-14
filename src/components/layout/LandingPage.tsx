import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileText,
  DollarSign,
  MessageSquare,
  SearchCode,
  CheckCircle2,
  Star,
  ChevronRight,
  Globe2,
  Briefcase,
  Play,
  Layers,
  Bot,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const aiModules = [
    { title: 'AI Proposal Generator', desc: 'Generate high-winning Upwork & Fiverr proposals tailored to client job descriptions.', icon: FileText, color: 'from-blue-500 to-indigo-600' },
    { title: 'Client Reply Generator', desc: 'Craft professional, friendly, or negotiation replies in seconds.', icon: MessageSquare, color: 'from-purple-500 to-indigo-600' },
    { title: 'AI Gig Optimizer', desc: 'Optimize Fiverr titles, SEO tags, and descriptions for top rankings.', icon: SearchCode, color: 'from-emerald-500 to-teal-600' },
    { title: 'Contract Risk Analyzer', desc: 'Paste contracts to instantly detect penalty clauses, payment risks & deadlines.', icon: ShieldCheck, color: 'from-rose-500 to-red-600' },
    { title: 'Scam & Risk Detector', desc: 'Analyze suspicious client conversations and calculate fraud probability.', icon: Bot, color: 'from-amber-500 to-orange-600' },
    { title: 'Invoice Generator & PDF', desc: 'Generate sleek multi-currency invoices (PKR/USD/EUR) with instant PDF export.', icon: DollarSign, color: 'from-indigo-500 to-purple-600' },
    { title: 'Price & Time Estimator', desc: 'Calculate fair market rates for Pakistani and international remote clients.', icon: Zap, color: 'from-cyan-500 to-blue-600' },
    { title: 'AI Freelance Mentor', desc: '24/7 strategic advisor for scaling your agency, pricing, and client retention.', icon: Sparkles, color: 'from-violet-500 to-fuchsia-600' },
  ];

  const testimonials = [
    { name: 'Usman Ali', role: 'Full-Stack Developer (Lahore, PK)', rate: '$45/hr on Upwork', comment: 'FreelanceIQ transformed my proposal win rate. I went from sending 20 proposals for 1 response to getting 3 interviews a week on Upwork!' },
    { name: 'Ayesha Siddiqui', role: 'UI/UX Designer (Karachi, PK)', rate: 'Fiverr Top Rated Seller', comment: 'The Gig Optimizer alone doubled my impressions in 5 days. The tax calculator and PKR price estimator are lifesavers for Pakistani freelancers.' },
    { name: 'Michael Vance', role: 'Remote Product Manager (USA)', rate: 'Direct Client Retainers', comment: 'Contract Analyzer flagged an unfair payment clause in a $12,000 agreement before I signed. This app paid for itself instantly.' },
  ];

  const faqs = [
    { q: 'Is FreelanceIQ AI OS built for Pakistani freelancers?', a: 'Yes! It includes PKR/USD currency support, Pakistani market rate pricing estimators, Pakistan FBR/PSEB tax calculators, and prompts optimized for local freelancers winning international clients.' },
    { q: 'How does data storage work?', a: 'All your generated proposals, invoices, tasks, and notes are securely stored directly in your browser using Local Storage with 100% privacy.' },
    { q: 'Can I export Invoices and Proposals as PDF?', a: 'Yes! Invoices, proposals, cover letters, and resumes can be downloaded directly as formatted PDF documents with one click.' },
    { q: 'Does it support Gemini AI?', a: 'Yes, FreelanceIQ AI OS connects to Google Gemini 3.6 Flash via server proxy for lightning-fast AI analysis and responses.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">FreelanceIQ AI OS</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                SaaS v2.5
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition">Features</a>
            <a href="#modules" className="hover:text-indigo-400 transition">AI Modules</a>
            <a href="#testimonials" className="hover:text-indigo-400 transition">Testimonials</a>
            <a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a>
            <a href="#faq" className="hover:text-indigo-400 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-xl">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Built for Pakistani & International Remote Freelancers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            AI Workspace for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Modern Freelancers
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            Write better proposals. Win more clients. Analyze contracts, detect scams, generate multi-currency invoices, and manage your freelance business with AI.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
            >
              <span>Launch AI Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-3"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              <span>Explore Live Workspace</span>
            </button>
          </div>

          {/* Hero Floating Card Mockup */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="p-3 bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-slate-500">freelanceiq-os.app</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-mono text-[11px]">Gemini 3.6 Connected</span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Proposal Win Rate</span>
                    <span className="text-xs font-bold text-emerald-400">+28%</span>
                  </div>
                  <p className="text-2xl font-bold text-white">84.2%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Based on 42 generated bids</p>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Monthly Revenue</span>
                    <span className="text-xs font-bold text-indigo-400">USD $4,850</span>
                  </div>
                  <p className="text-2xl font-bold text-white">PKR 1,350,000</p>
                  <p className="text-[11px] text-slate-500 mt-1">Multi-currency invoicing active</p>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Contract Safety Score</span>
                    <span className="text-xs font-bold text-emerald-400">98/100</span>
                  </div>
                  <p className="text-2xl font-bold text-white">0 Risk Clauses</p>
                  <p className="text-[11px] text-slate-500 mt-1">4 Contracts analyzed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" className="py-20 px-6 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Designed for High-Performing Freelancers
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Streamline your entire client workflow from lead acquisition to contract signing and invoicing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Win More Projects</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate tailored proposals for Upwork, Fiverr, LinkedIn, and direct clients that grab attention in 5 seconds.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Protect Your Earnings</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Detect fake client scams, analyze risky contract terms, and negotiate higher project rates with AI guidance.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automate Operations</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Issue clean PDF invoices, organize tasks, maintain client CRM records, and track daily productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 25 AI MODULES SHOWCASE */}
      <section id="modules" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">
              25 Specialized OS Modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              An Entire Freelance Team in One OS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.title}
                  onClick={() => navigate('/login')}
                  className="p-6 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl cursor-pointer group transition duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.color} text-white flex items-center justify-center shadow-lg mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-6 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Trusted by Top Freelancers
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Here is what remote specialists say about FreelanceIQ AI OS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm italic leading-relaxed">"{t.comment}"</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold rounded-full">
                    {t.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-12">
            Start free with Local Storage client persistence. Upgrade as your freelance agency grows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* Free Starter */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter Plan</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-xs text-slate-400">/ forever free</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Perfect for new freelancers exploring AI productivity.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> All 25 AI OS Modules Included</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Local Storage Data Persistence</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Currency Invoice PDF Exporter</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Contract Analyzer & Scam Detector</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Launch Free Workspace
              </button>
            </div>

            {/* Pro Unlimited */}
            <div className="p-8 bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500 rounded-3xl relative shadow-2xl flex flex-col justify-between">
              <span className="absolute -top-3 right-6 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pro Unlimited</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$15</span>
                  <span className="text-xs text-slate-400">/ month (or PKR 4,200)</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">For established freelancers and agency owners.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Priority Gemini 3.6 Flash Server Model</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Unlimited Proposals & Client Replies</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Advanced Command Palette & Voice Assistant</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Pakistan Tax Calculator & Strategy Roadmaps</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <h3 className="font-semibold text-white text-base mb-2">{f.q}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">FreelanceIQ AI OS</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-300 transition">Features</a>
            <a href="#modules" className="hover:text-slate-300 transition">Modules</a>
            <a href="#pricing" className="hover:text-slate-300 transition">Pricing</a>
            <button onClick={() => navigate('/login')} className="hover:text-slate-300 transition">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
