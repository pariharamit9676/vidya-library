import React, { useState, useEffect } from 'react';
import { X, Crown, Archive, Armchair, CheckCircle2 } from 'lucide-react';
import { CategoryRateConfig, SeatCategory } from '../../types/seatManagement';

interface EditRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: Record<string, CategoryRateConfig>;
  onSaveRates: (newRates: Record<string, number>) => void;
}

export const EditRatesModal: React.FC<EditRatesModalProps> = ({
  isOpen,
  onClose,
  rates,
  onSaveRates
}) => {
  const [premiumRate, setPremiumRate] = useState<number>(rates.Premium?.rate || 800);
  const [lockerRate, setLockerRate] = useState<number>(rates.Locker?.rate || 700);
  const [normalRate, setNormalRate] = useState<number>(rates.Normal?.rate || 600);

  useEffect(() => {
    if (isOpen) {
      setPremiumRate(rates.Premium?.rate || 800);
      setLockerRate(rates.Locker?.rate || 700);
      setNormalRate(rates.Normal?.rate || 600);
    }
  }, [isOpen, rates]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRates({
      Premium: Number(premiumRate),
      Locker: Number(lockerRate),
      Normal: Number(normalRate)
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#EDF1F7] shadow-2xl overflow-hidden animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#EDF1F7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center">
              <Crown size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#192038] m-0">
                Edit Category Monthly Rates
              </h3>
              <span className="text-xs text-[#8F9BB3]">
                Changes apply to all future assignments
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F9BB3] hover:text-[#192038] rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Premium */}
          <div>
            <label className="font-bold text-[#192038] flex items-center gap-2 mb-1.5">
              <Crown size={15} className="text-amber-500" />
              <span>Premium Rate (₹/month)</span>
            </label>
            <input
              type="number"
              min="100"
              step="1"
              required
              value={premiumRate}
              onChange={(e) => setPremiumRate(Number(e.target.value))}
              className="w-full p-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl font-bold text-[#192038] focus:border-[#00A97A] focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Locker */}
          <div>
            <label className="font-bold text-[#192038] flex items-center gap-2 mb-1.5">
              <Archive size={15} className="text-blue-500" />
              <span>Locker Rate (₹/month)</span>
            </label>
            <input
              type="number"
              min="100"
              step="1"
              required
              value={lockerRate}
              onChange={(e) => setLockerRate(Number(e.target.value))}
              className="w-full p-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl font-bold text-[#192038] focus:border-[#00A97A] focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Normal */}
          <div>
            <label className="font-bold text-[#192038] flex items-center gap-2 mb-1.5">
              <Armchair size={15} className="text-[#00A97A]" />
              <span>Normal Rate (₹/month)</span>
            </label>
            <input
              type="number"
              min="100"
              step="1"
              required
              value={normalRate}
              onChange={(e) => setNormalRate(Number(e.target.value))}
              className="w-full p-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl font-bold text-[#192038] focus:border-[#00A97A] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-[#EDF1F7] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EDF1F7] text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#00A97A] hover:bg-[#008f67] text-xs font-extrabold text-white transition-all shadow-xs cursor-pointer"
            >
              Save Rates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
