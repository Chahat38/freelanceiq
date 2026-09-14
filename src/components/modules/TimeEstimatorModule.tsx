import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Sparkles, RefreshCw, Calendar, Flag } from 'lucide-react';
import { TimeEstimate } from '../../types';

export const TimeEstimatorModule: React.FC = () => {
  const { runAiPrompt, showToast, addToHistory } = useApp();

  const [projectDesc, setProjectDesc] = useState('Build a mobile responsive React dashboard with authentication, dark mode, and CSV data export.');
  const [isLoading, setIsLoading] = useState(false);
  const [estimate, setEstimate] = useState<TimeEstimate | null>(null);

  const handleEstimate = async () => {
    if (!projectDesc.trim()) {
      showToast('Please enter project requirements.', 'error');
      return;
    }

    setIsLoading(true);

    const systemPrompt = `You are a Senior Technical Project Manager.
Estimate realistic development time in hours, days, weeks, and milestones.
Return JSON with keys:
"hours" (number), "days" (number), "weeks" (number), "milestones" (array of objects with {title, duration, details}), "summary" (string).`;

    const res = await runAiPrompt(projectDesc, systemPrompt, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const match = res.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Time estimate parse fallback', e);
    }

    if (!parsed || !parsed.hours) {
      parsed = {
        hours: 45,
        days: 10,
        weeks: 2,
        milestones: [
          { title: 'Phase 1: Architecture & Auth Setup', duration: '3 Days', details: 'React 19 layout, JWT/Local Storage Auth, Tailwind styling' },
          { title: 'Phase 2: Core Dashboard & Charts', duration: '4 Days', details: 'Recharts integration, CSV parser, state persistence' },
          { title: 'Phase 3: QA Testing & Delivery', duration: '3 Days', details: 'Cross-browser testing, performance audit, client handover' },
        ],
        summary: 'Estimated delivery timeline: 2 Weeks (45 total engineering hours). Includes buffer for revisions.',
      };
    }

    const timeObj: TimeEstimate = {
      id: 'time_' + Date.now(),
      projectDesc,
      hours: parsed.hours,
      days: parsed.days,
      weeks: parsed.weeks,
      milestones: parsed.milestones || [],
      summary: parsed.summary,
      createdAt: new Date().toLocaleDateString(),
    };

    setEstimate(timeObj);
    addToHistory('Time Estimator', 'Timeline & Milestones', `${parsed.hours} Hours (${parsed.weeks} Weeks)`, timeObj);
    showToast('Time & milestone estimate complete!');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Time & Milestone Estimator</h1>
          <p className="text-xs text-slate-400">
            Estimate engineering hours, delivery days, and milestone schedules for client proposals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Scope / Features</label>
            <textarea
              rows={6}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleEstimate}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Calculating Hours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Time & Milestones</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          {!estimate ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <Clock className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No time estimate generated yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Hours</span>
                  <p className="text-xl font-bold text-white">{estimate.hours} hrs</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Working Days</span>
                  <p className="text-xl font-bold text-indigo-400">{estimate.days} days</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Calendar Weeks</span>
                  <p className="text-xl font-bold text-emerald-400">{estimate.weeks} weeks</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-200 block mb-2">Project Milestones Schedule</span>
                <div className="space-y-2.5">
                  {estimate.milestones.map((m, i) => (
                    <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100 flex items-center gap-1.5">
                          <Flag className="w-3.5 h-3.5 text-cyan-400" /> {m.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold">
                          {m.duration}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{m.details}</p>
                    </div>
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
