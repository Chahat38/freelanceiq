import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Platform, ExperienceLevel, ProposalOutput } from '../../types';
import { generateTextPDF } from '../../lib/pdfGenerator';
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Star,
  Check,
  RefreshCw,
  Send,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ProposalGeneratorModule: React.FC = () => {
  const { runAiPrompt, addProposal, showToast, user } = useApp();

  const [clientDesc, setClientDesc] = useState('');
  const [platform, setPlatform] = useState<Platform>('Upwork');
  const [budget, setBudget] = useState('$1,500');
  const [timeline, setTimeline] = useState('2 Weeks');
  const [experience, setExperience] = useState<ExperienceLevel>('Expert');
  const [skills, setSkills] = useState('React, TypeScript, Tailwind CSS, REST APIs');

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'professional' | 'friendly' | 'premium' | 'short'>('professional');
  const [output, setOutput] = useState<ProposalOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!clientDesc.trim()) {
      showToast('Please enter the client project description.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are an expert freelance proposal writer helping Pakistani and international freelancers win high-ticket jobs on ${platform}.
Generate 4 distinct proposal variations based on the project description:
1. Professional
2. Friendly
3. Premium High-Ticket
4. Short & Direct

Output strictly valid JSON with keys:
"professional", "friendly", "premium", "short", "score" (number 1-100), "suggestions" (array of string tips).`;

    const userPrompt = `Platform: ${platform}
Budget: ${budget}
Timeline: ${timeline}
Experience Level: ${experience}
Freelancer Skills: ${skills}
Client Job Description:
${clientDesc}`;

    const res = await runAiPrompt(userPrompt, systemPrompt, true);

    let parsedData: any = null;
    try {
      if (res.text) {
        const jsonMatch = res.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.warn('JSON parse fallback for proposal', e);
    }

    // Fallback proposal structure if AI returns plain text or fallback mode
    const senderName = user?.name || 'Chahat';
    if (!parsedData || !parsedData.professional) {
      parsedData = {
        professional: `Hi there,\n\nI reviewed your job posting for "${clientDesc.slice(0, 50)}..." and I am confident I can deliver a high-performance solution tailored to your timeline (${timeline}) and budget (${budget}).\n\nWith extensive expertise in ${skills}, I have successfully built similar web applications with clean architecture and responsive design.\n\n### Proposed Approach:\n1. Requirements & Architecture Blueprint\n2. Iterative Development & Daily Progress Updates\n3. Quality Assurance & Performance Optimization\n\nWould you be open to a brief 5-minute call to discuss your exact milestone priorities?\n\nBest regards,\n${senderName}`,
        friendly: `Hey! 👋\n\nYour project caught my eye right away! I love working with ${skills} and building clean, fast solutions.\n\nI can deliver this project within ${timeline} well within your ${budget} range. I keep communication clear and send frequent updates.\n\nLet's chat about how we can get started right away!\n\nBest,\n${senderName}`,
        premium: `Dear Client,\n\nYour project requires a high-level engineering approach to guarantee speed, reliability, and scale. As an ${experience} specialist in ${skills}, I provide enterprise-grade code quality and end-to-end delivery.\n\n### Deliverables & Guarantee:\n- Clean, scalable codebase\n- Comprehensive documentation & testing\n- Post-launch support\n\nLet's schedule a call to finalize project milestones.\n\nSincerely,\n${senderName}`,
        short: `Hi! Expert in ${skills}. I can start immediately and complete this project in ${timeline} for ${budget}.\n\nCheck my portfolio or reply to discuss details!\n\nBest,\n${senderName}`,
        score: 92,
        suggestions: [
          'Add a specific case study link from a past project.',
          'Offer a 10-minute discovery call link.',
          'Emphasize your post-launch support guarantee.',
        ],
      };
    }

    const newProposal: ProposalOutput = {
      id: 'prop_' + Date.now(),
      title: `Proposal for ${platform} (${budget})`,
      clientDesc,
      platform,
      budget,
      timeline,
      experience,
      skills,
      outputs: {
        professional: parsedData.professional,
        friendly: parsedData.friendly,
        premium: parsedData.premium,
        short: parsedData.short,
      },
      score: parsedData.score || 90,
      suggestions: parsedData.suggestions || [
        'Mention specific metrics from past projects.',
        'Keep the opening sentence focused on client outcomes.',
      ],
      createdAt: new Date().toLocaleDateString(),
      favorite: false,
    };

    setOutput(newProposal);
    addProposal(newProposal);
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (!output) return;
    const textToCopy = output.outputs[activeTab];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Proposal copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!output) return;
    generateTextPDF(`Proposal_${output.platform}_${Date.now()}`, `FreelanceIQ Proposal - ${output.platform}`, output.outputs[activeTab]);
    showToast('Proposal downloaded as PDF!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Proposal Generator</h1>
            <p className="text-xs text-slate-400">
              Generate 4 high-ticket proposal variations tailored to Upwork, Fiverr & LinkedIn jobs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> High-Win Rate Prompting
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM PANEL */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Project Details
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Client Job Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={5}
              value={clientDesc}
              onChange={(e) => setClientDesc(e.target.value)}
              placeholder="Paste the full job post from Upwork, Fiverr, or LinkedIn here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Upwork">Upwork</option>
                <option value="Fiverr">Fiverr Buyer Request</option>
                <option value="Freelancer">Freelancer.com</option>
                <option value="LinkedIn">LinkedIn Outreach</option>
                <option value="Direct Client">Direct Client Email</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Budget</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $1,500 or $50/hr"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 2 Weeks"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert / Top Rated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Highlighted Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, UI/UX, Python"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Winning Proposals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Proposals with Gemini AI</span>
              </>
            )}
          </button>
        </div>

        {/* PROPOSAL OUTPUT PANEL */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Proposal Variations
              </h2>

              {output && (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    Score: {output.score}/100
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs"
                    title="Copy Active Proposal"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1.5 text-xs font-medium"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* Variation Tabs */}
            {output && (
              <div className="flex p-1 bg-slate-950 rounded-2xl mb-4 border border-slate-800 text-xs font-medium overflow-x-auto">
                <button
                  onClick={() => setActiveTab('professional')}
                  className={`flex-1 py-2 px-3 rounded-xl transition whitespace-nowrap ${
                    activeTab === 'professional' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Professional
                </button>
                <button
                  onClick={() => setActiveTab('friendly')}
                  className={`flex-1 py-2 px-3 rounded-xl transition whitespace-nowrap ${
                    activeTab === 'friendly' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Friendly
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className={`flex-1 py-2 px-3 rounded-xl transition whitespace-nowrap ${
                    activeTab === 'premium' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Premium
                </button>
                <button
                  onClick={() => setActiveTab('short')}
                  className={`flex-1 py-2 px-3 rounded-xl transition whitespace-nowrap ${
                    activeTab === 'short' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Short & Direct
                </button>
              </div>
            )}

            {/* Content Display */}
            {!output ? (
              <div className="min-h-[320px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                <FileText className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-400">No proposal generated yet</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Paste client job description on the left and click "Generate Proposals" to get 4 custom variations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[260px] font-mono">
                  {output.outputs[activeTab]}
                </div>

                {/* Improvement Suggestions Box */}
                {output.suggestions.length > 0 && (
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                    <p className="text-xs font-bold text-indigo-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Improvement Suggestions
                    </p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {output.suggestions.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
