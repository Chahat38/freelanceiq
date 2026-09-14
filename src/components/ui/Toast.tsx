import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 animate-slide-up backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-slate-900/90 dark:bg-slate-800/90 text-emerald-400 border-emerald-500/30'
              : toast.type === 'error'
              ? 'bg-slate-900/90 dark:bg-slate-800/90 text-rose-400 border-rose-500/30'
              : 'bg-slate-900/90 dark:bg-slate-800/90 text-indigo-400 border-indigo-500/30'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
          <span className="text-slate-100">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
