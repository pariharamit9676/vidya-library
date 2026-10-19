import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle2, X } from 'lucide-react';

export interface PopupDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isConfirm?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PopupDialog: React.FC<PopupDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  variant = 'info',
  isConfirm = false,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 size={24} className="text-rose-600" />,
          iconBg: 'bg-rose-50 ring-8 ring-rose-50/60 text-rose-600',
          confirmBtn: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/30'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={24} className="text-amber-600" />,
          iconBg: 'bg-amber-50 ring-8 ring-amber-50/60 text-amber-600',
          confirmBtn: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-lg shadow-amber-500/30'
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={24} className="text-[#544bec]" />,
          iconBg: 'bg-[#EEF0FD] ring-8 ring-[#EEF0FD]/60 text-[#544bec]',
          confirmBtn: 'bg-[#544bec] hover:bg-[#4338ca] active:bg-[#007a57] text-white shadow-lg shadow-[#544bec]/30'
        };
      case 'info':
      default:
        return {
          icon: <Info size={24} className="text-blue-600" />,
          iconBg: 'bg-blue-50 ring-8 ring-blue-50/60 text-blue-600',
          confirmBtn: 'bg-[#2F80ED] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-dialog-title"
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-100 shadow-2xl p-5 sm:p-6 pb-8 sm:pb-6 relative flex flex-col gap-4 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe / Drag Indicator Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        {/* Close Button Top Right */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Content Header: Icon + Title + Message */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${vStyles.iconBg}`}>
            {vStyles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="popup-dialog-title" className="text-lg sm:text-xl font-extrabold text-[#192038] tracking-tight m-0">
              {title}
            </h3>
            <div className="text-xs sm:text-sm text-[#6B778C] font-medium leading-relaxed mt-1.5 whitespace-pre-line">
              {message}
            </div>
          </div>
        </div>

        {/* Action Buttons: Stacked on Mobile, Side-by-Side on Desktop */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 mt-3 sm:mt-4 w-full">
          {isConfirm && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#192038] font-bold text-xs sm:text-sm transition-all cursor-pointer text-center"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer text-center ${vStyles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
