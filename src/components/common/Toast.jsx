import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-[9999] bg-[var(--bg-card)] border ${
      type === 'danger' ? 'border-rose-500 shadow-rose-500/10' : 'border-[#01a06e] shadow-emerald-500/10'
    } text-[var(--text-main)] p-3.5 px-4 rounded-2xl sm:rounded-xl shadow-2xl flex items-center gap-3 sm:max-w-md animate-in slide-in-from-bottom-4 duration-200`}>
      <div className={type === 'danger' ? 'text-rose-500' : 'text-[#01a06e]'}>
        <CheckCircle2 size={20} />
      </div>
      <div className="text-xs sm:text-sm font-semibold flex-1 leading-snug">
        {message}
      </div>
      <button
        onClick={onClose}
        className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
