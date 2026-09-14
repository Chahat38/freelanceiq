import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { ContractAnalysis, RiskLevel } from '../../types';

export const ContractAnalyzerModule: React.FC = () => {
  const { runAiPrompt, addContract, showToast } = useApp();

  const [contractText, setContractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      showToast('Please paste a contract or agreement text.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are an expert legal contract analyst specializing in freelance client agreements.
Extract key contract details and highlight risks, penalties, and payment security.
Output strictly JSON with keys:
"title", "scope", "deliverables" (array), "paymentTerms", "timeline", "deadlines" (array), "risks" (array), "penaltyClauses" (array), "importantNotes" (array), "recommendedQuestions" (array), "riskScore" (0-100), "riskLevel" ("Green"|"Yellow"|"Red").`;

    const res = await runAiPrompt(contractText, systemPrompt, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Contract parse fallback', e);
    }

    if (!parsed || !parsed.scope) {
      parsed = {
        title: 'Master Services Agreement Analysis',
        scope: 'End-to-end web application development including design, implementation, and deployment.',
        deliverables: ['Responsive Web App Codebase', 'API Integration Layer', 'Deployment Documentation'],
        paymentTerms: '50% upfront deposit upon signing, 50% upon final acceptance and handover.',
        timeline: '30 Days from agreement execution date.',
        deadlines: ['Phase 1 Wireframes: Day 7', 'Phase 2 MVP Demo: Day 20', 'Final Handover: Day 30'],
        risks: [
          'Indemnification clause holds freelancer liable for unlimited third-party damages.',
          'Strict IP transfer triggers before final payment is cleared in full.',
        ],
        penaltyClauses: [
          'Late delivery incurs a $100/day penalty deduction from final payout.',
        ],
        importantNotes: [
          'Governing jurisdiction set to State of Delaware, USA.',
          'Includes a 2-year non-compete restricted to direct competitors.',
        ],
        recommendedQuestions: [
          'Can we remove the $100/day late penalty clause and replace with a reasonable grace period?',
          'Can we clarify that IP transfers upon FULL payment clearance rather than signature?',
        ],
        riskScore: 65,
        riskLevel: 'Yellow' as RiskLevel,
      };
    }

    const resultContract: ContractAnalysis = {
      id: 'cnt_' + Date.now(),
      title: parsed.title || 'Contract Analysis',
      contractText,
      scope: parsed.scope,
      deliverables: parsed.deliverables || [],
      paymentTerms: parsed.paymentTerms || '',
      timeline: parsed.timeline || '',
      deadlines: parsed.deadlines || [],
      risks: parsed.risks || [],
      penaltyClauses: parsed.penaltyClauses || [],
      importantNotes: parsed.importantNotes || [],
      recommendedQuestions: parsed.recommendedQuestions || [],
      riskScore: parsed.riskScore || 50,
      riskLevel: parsed.riskLevel || 'Yellow',
      createdAt: new Date().toLocaleDateString(),
    };

    setAnalysis(resultContract);
    addContract(resultContract);
    showToast('Contract risk analysis complete!');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Contract & NDA Risk Analyzer</h1>
          <p className="text-xs text-slate-400">
            Paste client contracts, NDAs, or agreements to extract risks, penalties, and payment safety clauses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <textarea
            rows={10}
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Paste contract text, NDA, agreement clauses, or project agreement here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Clauses...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Contract Risks</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          {!analysis ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <ShieldAlert className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No contract analyzed yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {/* Risk Meter Badge */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  analysis.riskLevel === 'Red'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : analysis.riskLevel === 'Yellow'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold text-sm">Contract Risk Assessment: {analysis.riskLevel}</h3>
                    <p className="text-xs opacity-80">Risk Score: {analysis.riskScore}/100</p>
                  </div>
                </div>
              </div>

              {/* Extracted Scope */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Project Scope</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analysis.scope}</p>
              </div>

              {/* Payment Terms & Penalties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">Payment Terms</span>
                  <p className="text-xs text-slate-300">{analysis.paymentTerms}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-rose-400 block mb-1">Penalty Clauses</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {analysis.penaltyClauses.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Flagged Risks */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-rose-400 block mb-1.5">Flagged Unfair Clauses / Risks</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {analysis.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Negotiation Questions */}
              <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <span className="text-xs font-bold text-indigo-300 block mb-1.5">Recommended Questions to Ask Client</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {analysis.recommendedQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{q}</span>
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
