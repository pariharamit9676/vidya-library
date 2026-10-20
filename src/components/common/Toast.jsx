import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'danger' || type === 'error';
  const isWarning = type === 'warning';
  const isInfo = type === 'info';

  const badgeConfig = isError
    ? {
        border: 'border-rose-300 dark:border-rose-500/30',
        bg: 'bg-white',
        shadow: 'shadow-lg shadow-rose-500/10',
        icon: <AlertCircle size={20} className="text-rose-600 shrink-0" />,
        text: 'text-rose-950',
        accentBar: 'bg-rose-500'
      }
    : isWarning
    ? {
        border: 'border-amber-300 dark:border-amber-500/30',
        bg: 'bg-white',
        shadow: 'shadow-lg shadow-amber-500/10',
        icon: <AlertTriangle size={20} className="text-amber-600 shrink-0" />,
        text: 'text-amber-950',
        accentBar: 'bg-amber-500'
      }
    : isInfo
    ? {
        border: 'border-indigo-300 dark:border-indigo-500/30',
        bg: 'bg-white',
        shadow: 'shadow-lg shadow-indigo-500/10',
        icon: <Info size={20} className="text-indigo-600 shrink-0" />,
        text: 'text-indigo-950',
        accentBar: 'bg-indigo-500'
      }
    : {
        border: 'border-emerald-300 dark:border-emerald-500/30',
        bg: 'bg-white',
        shadow: 'shadow-lg shadow-emerald-500/10',
        icon: <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />,
        text: 'text-slate-900',
        accentBar: 'bg-emerald-500'
      };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-[999999] ${badgeConfig.bg} border ${badgeConfig.border} ${badgeConfig.shadow} p-3.5 px-4 rounded-2xl sm:rounded-xl flex items-center gap-3 sm:max-w-md animate-in slide-in-from-bottom-4 duration-200 overflow-hidden relative backdrop-blur-md`}
    >
      {badgeConfig.icon}
      <div className={`text-xs sm:text-sm font-bold flex-1 leading-snug ${badgeConfig.text}`}>
        {message}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>

      {/* Subtle bottom animated timeout bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${badgeConfig.accentBar} opacity-40 animate-pulse`} />
    </div>
  );
};
