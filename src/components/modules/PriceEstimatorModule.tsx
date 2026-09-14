import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, Sparkles, RefreshCw, TrendingUp, Globe2, Calculator } from 'lucide-react';
import { Platform, ExperienceLevel, PriceEstimate } from '../../types';

export const PriceEstimatorModule: React.FC = () => {
  const { runAiPrompt, showToast, addToHistory } = useApp();

  const [projectDesc, setProjectDesc] = useState('Build a multi-vendor E-commerce platform with Stripe & PayPal payment gateways.');
  const [technology, setTechnology] = useState('React, Node.js, Express, PostgreSQL');
  const [experience, setExperience] = useState<ExperienceLevel>('Expert');
  const [platform, setPlatform] = useState<Platform>('Upwork');
  const [country, setCountry] = useState('United States');

  const [isLoading, setIsLoading] = useState(false);
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);

  const handleEstimate = async () => {
    if (!projectDesc.trim()) {
      showToast('Please enter the project description.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are an expert freelance pricing consultant who understands both Pakistani local rates (PKR) and US/European international remote rates (USD).
Calculate realistic project estimates.
Return JSON with keys:
"minPrice" (USD number), "recommendedPrice" (USD number), "premiumPrice" (USD number), "pkrPrice" (PKR number), "intlPrice" (USD number), "negotiationRange" (string), "reasoning" (array of strings).`;

    const userPrompt = `Project: ${projectDesc}
Tech Stack: ${technology}
Experience: ${experience}
Platform: ${platform}
Client Country: ${country}`;

    const res = await runAiPrompt(userPrompt, systemPrompt, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Price estimate parse fallback', e);
    }

    if (!parsed || !parsed.recommendedPrice) {
      parsed = {
        minPrice: 1200,
        recommendedPrice: 2400,
        premiumPrice: 4500,
        pkrPrice: 670000,
        intlPrice: 2400,
        negotiationRange: '$2,200 - $2,800 USD',
        reasoning: [
          'E-commerce architecture requires secure transaction handling and webhooks.',
          'PostgreSQL relational schema and multi-vendor role permissions add complexity.',
          'Pakistani local market rate is approx Rs 650,000 - 800,000 PKR; US direct client value is $2,400+ USD.',
        ],
      };
    }

    const estObj: PriceEstimate = {
      id: 'price_' + Date.now(),
      projectDesc,
      technology,
      experience,
      platform,
      country,
      minPrice: parsed.minPrice,
      recommendedPrice: parsed.recommendedPrice,
      premiumPrice: parsed.premiumPrice,
      pkrPrice: parsed.pkrPrice,
      intlPrice: parsed.intlPrice,
      negotiationRange: parsed.negotiationRange,
      reasoning: parsed.reasoning || [],
      createdAt: new Date().toLocaleDateString(),
    };

    setEstimate(estObj);
    addToHistory('Price Estimator', 'Pricing Estimate', `$${parsed.recommendedPrice} USD / PKR ${parsed.pkrPrice.toLocaleString()}`, estObj);
    showToast('Project rate estimate calculated!');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Project Price & Rate Estimator</h1>
          <p className="text-xs text-slate-400">
            Estimate realistic project pricing for Pakistani (PKR) and International (USD/EUR) remote clients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Description</label>
            <textarea
              rows={4}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Technologies Used</label>
            <input
              type="text"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Upwork">Upwork</option>
                <option value="Fiverr">Fiverr</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Direct Client">Direct Client</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Client Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleEstimate}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Calculating Market Pricing...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>Calculate Price Estimate</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          {!estimate ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <DollarSign className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No price estimate generated yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Price Tier Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Min Floor</span>
                  <p className="text-lg font-bold text-slate-300">${estimate.minPrice}</p>
                </div>

                <div className="p-3.5 bg-gradient-to-b from-emerald-950/50 to-slate-950 rounded-2xl border border-emerald-500/40 text-center shadow-lg">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Recommended</span>
                  <p className="text-2xl font-extrabold text-emerald-400">${estimate.recommendedPrice}</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Premium Agency</span>
                  <p className="text-lg font-bold text-purple-400">${estimate.premiumPrice}</p>
                </div>
              </div>

              {/* PKR vs USD Comparison */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">Pakistani Local Market Value</span>
                  <p className="text-lg font-bold text-white">PKR {estimate.pkrPrice.toLocaleString()}</p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">Negotiation Buffer Range</span>
                  <p className="text-sm font-bold text-indigo-400 mt-1">{estimate.negotiationRange}</p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">Pricing Logic & Breakdown</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {estimate.reasoning.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{r}</span>
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
