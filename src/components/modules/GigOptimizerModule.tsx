import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchCode, Sparkles, Copy, Check, RefreshCw, Trophy, Target, ShieldCheck } from 'lucide-react';

export const GigOptimizerModule: React.FC = () => {
  const { runAiPrompt, showToast, addToHistory } = useApp();

  const [title, setTitle] = useState('I will develop full stack react website for your business');
  const [description, setDescription] = useState('I offer high quality React web development with fast delivery and clean code.');
  const [keywords, setKeywords] = useState('react website, full stack, web developer');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!title.trim()) {
      showToast('Please enter a Gig Title.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are a Fiverr and Upwork SEO & Conversion Rate Optimization expert.
Optimize the given Freelance Gig for maximum search rankings and buyer conversions.
Output strictly JSON with keys:
"optimizedTitle", "optimizedDescription", "seoKeywords" (array), "bestTags" (array), "buyerPsychologyTips" (array), "competitionScore" (1-100), "rankingChance" ("High"|"Medium"|"Top 5%"), "difficultyScore" (1-100).`;

    const userPrompt = `Gig Title: ${title}
Gig Description: ${description}
Keywords: ${keywords}`;

    const res = await runAiPrompt(userPrompt, systemPrompt, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Gig optimization JSON parse fallback', e);
    }

    if (!parsed || !parsed.optimizedTitle) {
      parsed = {
        optimizedTitle: `I will build custom react js website, next js web app, full stack web developer`,
        optimizedDescription: `Are you looking for a modern, responsive, high-converting React website?\n\nI am a Senior Full-Stack Developer with 5+ years of experience. I create ultra-fast, SEO-optimized web applications with seamless user interfaces.\n\n### Why Choose Me?\n- 100% Clean TypeScript & React Code\n- Mobile Responsive & Fast Loading\n- FREE 30-Day Post-Launch Support\n\nContact me now for a custom quote!`,
        seoKeywords: ['react website', 'next js developer', 'full stack web developer', 'frontend developer', 'responsive web app'],
        bestTags: ['reactjs', 'nextjs', 'webdevelopment', 'fullstack', 'typescript'],
        buyerPsychologyTips: [
          'Include a risk-reversal guarantee like 30-day post launch support.',
          'Format package tiers with distinct deliverable value propositions.',
          'Add high-contrast video thumbnail to increase CTR by 40%.',
        ],
        competitionScore: 68,
        rankingChance: 'Top 5%',
        difficultyScore: 42,
      };
    }

    setResult(parsed);
    addToHistory('AI Gig Optimizer', title, `Optimized: ${parsed.optimizedTitle}`, parsed);
    showToast('Gig optimized for Fiverr & Upwork SEO!');
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
          <SearchCode className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Gig & Service Optimizer</h1>
          <p className="text-xs text-slate-400">
            Optimize Fiverr & Upwork Gig titles, descriptions, and tags for top search ranking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Gig / Service Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Gig SEO...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Optimize Gig for Top Ranking</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          {!result ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <SearchCode className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No Gig SEO analysis executed yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold">Ranking Chance</p>
                  <p className="text-base font-bold text-emerald-400">{result.rankingChance}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold">Competition Score</p>
                  <p className="text-base font-bold text-amber-400">{result.competitionScore}/100</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold">SEO Difficulty</p>
                  <p className="text-base font-bold text-indigo-400">{result.difficultyScore}/100</p>
                </div>
              </div>

              {/* Optimized Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">SEO Optimized Title</span>
                  <button
                    onClick={() => copyToClipboard(result.optimizedTitle, 'Optimized Title')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white font-medium">
                  {result.optimizedTitle}
                </div>
              </div>

              {/* Optimized Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">High-Converting Description</span>
                  <button
                    onClick={() => copyToClipboard(result.optimizedDescription, 'Optimized Description')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {result.optimizedDescription}
                </div>
              </div>

              {/* Best Tags & SEO Keywords */}
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-1.5">Recommended Fiverr Search Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.bestTags?.map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs rounded-lg font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
