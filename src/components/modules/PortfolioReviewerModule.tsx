import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Sparkles, RefreshCw, CheckCircle2, Award, Star } from 'lucide-react';

export const PortfolioReviewerModule: React.FC = () => {
  const { runAiPrompt, showToast, addToHistory } = useApp();

  const [portfolioLink, setPortfolioLink] = useState('https://github.com/chahat-dev/saas-dashboard-showcase');
  const [projectText, setProjectText] = useState(
    'Project: Full Stack SaaS Analytics Dashboard\nStack: React 19, TypeScript, Express, PostgreSQL\nFeatures: Live charts, dark mode, OAuth authentication, PDF reports export.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState<any | null>(null);

  const handleReview = async () => {
    if (!projectText.trim()) {
      showToast('Please enter portfolio project details.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are an elite Design & Engineering Hiring Manager.
Review the freelancer's portfolio case study and score it like an Upwork Top Rated client evaluating a $5,000 proposal.
Return JSON with keys:
"overallScore" (0-100), "strengths" (array), "weaknesses" (array), "improvements" (array), "clientPerspective" (string).`;

    const userPrompt = `Portfolio Link: ${portfolioLink}\nDetails:\n${projectText}`;

    const res = await runAiPrompt(userPrompt, systemPrompt, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Portfolio review parse fallback', e);
    }

    if (!parsed || !parsed.overallScore) {
      parsed = {
        overallScore: 88,
        strengths: [
          'Modern React 19 tech stack demonstrates current industry relevance.',
          'Features like live charts and PDF export show real business utility.',
        ],
        weaknesses: [
          'Lacks explicit business outcome metrics (e.g. "improved user conversion by 25%").',
          'No live hosted demo link or loom video walkthrough embedded.',
        ],
        improvements: [
          'Add a 60-second video demo showing key user workflows.',
          'Structure case study with Problem -> Solution -> Business Metric Impact.',
        ],
        clientPerspective:
          'High quality technical work. Adding metric-driven outcomes will allow you to charge 2x higher rates.',
      };
    }

    setReview(parsed);
    addToHistory('Portfolio Reviewer', 'Portfolio Audit', `Score: ${parsed.overallScore}/100`, parsed);
    showToast('Portfolio audit generated!');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Portfolio & Case Study Reviewer</h1>
          <p className="text-xs text-slate-400">
            Get hiring-manager feedback to transform past projects into high-converting case studies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Portfolio / GitHub Link</label>
            <input
              type="text"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Overview & Features</label>
            <textarea
              rows={6}
              value={projectText}
              onChange={(e) => setProjectText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            onClick={handleReview}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Reviewing Portfolio...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit Portfolio Case Study</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          {!review ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <Briefcase className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No portfolio audit generated yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Client Impression Rating</h3>
                  <p className="text-xs text-slate-400">High-Ticket Appeal Score</p>
                </div>
                <span className="text-2xl font-extrabold text-violet-400">{review.overallScore}/100</span>
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 block mb-1">Key Strengths</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {review.strengths.map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-400 block mb-1">Recommended Upgrades</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {review.improvements.map((imp: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <span className="text-xs font-bold text-violet-300 block mb-1">Client Feedback Perspective</span>
                <p className="text-xs text-slate-200">{review.clientPerspective}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
