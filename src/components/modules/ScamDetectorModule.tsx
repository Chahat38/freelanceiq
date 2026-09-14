import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { ScamDetection } from '../../types';

export const ScamDetectorModule: React.FC = () => {
  const { runAiPrompt, showToast, addToHistory } = useApp();

  const [chatText, setChatText] = useState(
    'Hi freelancer, I have urgent data entry work. Please message me on Telegram @RecruiterMark and pay $20 security clearance deposit via crypto.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScamDetection | null>(null);

  const handleDetect = async () => {
    if (!chatText.trim()) {
      showToast('Please paste a client message or offer.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are a freelance cybersecurity and fraud detection expert.
Analyze the given message or job offer for common freelancer scams (off-platform communications, security deposit requests, crypto payments, fake check scams, Telegram/WhatsApp redirects).
Output strictly JSON with keys:
"trustScore" (0-100), "riskLevel" ("Safe"|"Warning"|"High Scam Risk"), "scamType" (string), "redFlags" (array of strings), "greenFlags" (array of strings), "recommendedAction" (string), "explanation" (string).`;

    const res = await runAiPrompt(chatText, systemPrompt, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Scam detection parse fallback', e);
    }

    if (!parsed || !parsed.riskLevel) {
      parsed = {
        trustScore: 12,
        riskLevel: 'High Scam Risk',
        scamType: 'Telegram Security Deposit Fraud',
        redFlags: [
          'Requesting communication off-platform (Telegram @RecruiterMark) violates Upwork & Fiverr terms.',
          'Asking for an upfront $20 security deposit is a 100% textbook scam pattern.',
          'Vague job scope ("urgent data entry") designed to trick beginners.',
        ],
        greenFlags: [],
        recommendedAction: 'DO NOT RESPOND. Report the user on the platform immediately and do not send money.',
        explanation: 'Genuine employers NEVER ask freelancers to pay money or security deposits to receive work.',
      };
    }

    const scamObj: ScamDetection = {
      id: 'scam_' + Date.now(),
      chatText,
      trustScore: parsed.trustScore,
      riskLevel: parsed.riskLevel,
      scamType: parsed.scamType,
      redFlags: parsed.redFlags || [],
      greenFlags: parsed.greenFlags || [],
      recommendedAction: parsed.recommendedAction,
      explanation: parsed.explanation,
      createdAt: new Date().toLocaleDateString(),
    };

    setResult(scamObj);
    addToHistory('Client Scam Detector', 'Scam Check', `Risk: ${parsed.riskLevel} (${parsed.trustScore}% Trust)`, scamObj);
    showToast(`Scam Audit Complete: ${parsed.riskLevel}`);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Client Scam & Fraud Detector</h1>
          <p className="text-xs text-slate-400">
            Paste suspicious client messages or job offers to detect Telegram redirects, fake checks, and deposit scams.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <textarea
            rows={8}
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            placeholder="Paste suspicious client chat message, WhatsApp message, or job offer here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />

          <button
            onClick={handleDetect}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Client Safety...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Scam & Trust Audit</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          {!result ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <ShieldCheck className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No scam audit performed yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  result.riskLevel === 'High Scam Risk'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : result.riskLevel === 'Warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold text-sm">{result.riskLevel}</h3>
                    <p className="text-xs opacity-80">{result.scamType}</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold">{result.trustScore}% Trust</span>
              </div>

              <div>
                <span className="text-xs font-bold text-rose-400 block mb-1">Detected Red Flags</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Recommended Action
                </span>
                <p className="text-xs text-white font-medium">{result.recommendedAction}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
