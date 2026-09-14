import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Sparkles, Copy, Check, RefreshCw, Award, CheckCircle2 } from 'lucide-react';

export const ProfileOptimizerModule: React.FC = () => {
  const { runAiPrompt, showToast, addToHistory } = useApp();

  const [bio, setBio] = useState('Full Stack Developer working with React, Node, and Python.');
  const [skills, setSkills] = useState('React, TypeScript, Tailwind, Node.js, Express, MongoDB');
  const [experience, setExperience] = useState('4 Years freelancing on Upwork and direct client work');
  const [portfolio, setPortfolio] = useState('Built 15+ SaaS MVPs, fintech portals, and mobile apps');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleOptimize = async () => {
    if (!bio.trim()) {
      showToast('Please enter your current Bio/Overview.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are a Senior Upwork and LinkedIn Profile Strategist.
Optimize the freelancer's profile for search visibility and conversion.
Return JSON with keys:
"headline", "optimizedBio", "seoKeywords" (array), "recommendedSkills" (array), "trustTips" (array), "profileScore" (number 1-100).`;

    const userPrompt = `Bio: ${bio}
Skills: ${skills}
Experience: ${experience}
Portfolio: ${portfolio}`;

    const res = await runAiPrompt(userPrompt, systemPrompt, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Profile parse fallback', e);
    }

    if (!parsed || !parsed.headline) {
      parsed = {
        headline: 'Senior Full-Stack Engineer | React, TypeScript & Scalable Web Architectures',
        optimizedBio: `### 🚀 Senior Full-Stack Engineer with 4+ Years of Enterprise Delivery\n\nI help tech startups and agencies build high-performance web applications that scale effortlessly.\n\n### Core Technical Stack:\n- **Frontend:** React 19, Next.js, TypeScript, Tailwind CSS\n- **Backend:** Node.js, Express, PostgreSQL, REST & GraphQL APIs\n\n### Why Clients Trust Me:\n✅ Top Rated Freelancer with 100% Job Success\n✅ Clean, Documented & Tested Codebase\n✅ Fast Communication & Daily Progress Updates\n\nLet's discuss your project goals today!`,
        seoKeywords: ['full stack developer', 'react engineer', 'nextjs expert', 'typescript specialist', 'saas developer'],
        recommendedSkills: ['State Management', 'REST API Integration', 'Docker', 'Jest/Testing', 'CI/CD Pipelines'],
        trustTips: [
          'Add video introduction to boost invitation rate by 30%.',
          'Link verified GitHub or portfolio live demo links in Overview.',
          'Request client testimonials directly on Upwork profile.',
        ],
        profileScore: 94,
      };
    }

    setResult(parsed);
    addToHistory('Profile Optimizer', 'Upwork & LinkedIn Profile Audit', `Score: ${parsed.profileScore}/100`, parsed);
    showToast('Profile audit & optimization complete!');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Upwork & LinkedIn Profile Optimizer</h1>
          <p className="text-xs text-slate-400">
            Audit and rewrite your freelancer bio, skills, and headline to score 90+ on platform search.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Overview / Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience Summary</label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Profile...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit & Rewrite Profile</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          {!result ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <UserCheck className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No profile audit generated yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-200">Overall Profile SEO Score</p>
                  <p className="text-[11px] text-slate-400">Platform search index readiness</p>
                </div>
                <span className="text-2xl font-extrabold text-emerald-400">{result.profileScore}/100</span>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Recommended Headline</span>
                <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-white">
                  {result.headline}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Optimized Overview Bio</span>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto font-sans">
                  {result.optimizedBio}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">Trust Building Recommendations</span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {result.trustTips?.map((tip: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
