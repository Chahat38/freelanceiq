import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, Copy, Trash2, Sparkles, Check } from 'lucide-react';

export const HistoryModule: React.FC = () => {
  const { history, clearHistory, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter(
    (h) =>
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, output: any) => {
    const text = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Artifacts & History Log</h1>
            <p className="text-xs text-slate-400">
              Browse all past generated proposals, contract audits, client replies, and estimates.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              showToast('History cleared');
            }}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search generated proposals, modules, keywords..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            <History className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-400">No matching AI history found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                      {item.module}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{item.createdAt}</span>
                    <button
                      onClick={() => handleCopy(item.id, item.output)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center gap-1"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{item.preview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
