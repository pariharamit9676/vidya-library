import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SeatGridCell, SeatCategory, SeatStatus, CategoryRateConfig } from '../../types/seatManagement';

interface EditSeatModalProps {
  isOpen: boolean;
  cell: SeatGridCell | null;
  categoryRates?: Record<SeatCategory, CategoryRateConfig>;
  onClose: () => void;
  onSaveSeat: (cellId: string, updates: Partial<SeatGridCell>) => void;
}

export const EditSeatModal: React.FC<EditSeatModalProps> = ({
  isOpen,
  cell,
  categoryRates,
  onClose,
  onSaveSeat
}) => {
  const [category, setCategory] = useState<SeatCategory>(cell?.category || 'Normal');
  const [monthlyFee, setMonthlyFee] = useState<number>(cell?.monthlyFee || 600);
  const [status, setStatus] = useState<SeatStatus>(cell?.status || 'Available');

  const getRateForCategory = (cat: SeatCategory) => {
    if (categoryRates && categoryRates[cat]) {
      return categoryRates[cat].rate;
    }
    if (cat === 'Premium') return 800;
    if (cat === 'Locker') return 700;
    return 600;
  };

  React.useEffect(() => {
    if (cell) {
      setCategory(cell.category);
      setMonthlyFee(getRateForCategory(cell.category));
      setStatus(cell.status);
    }
  }, [cell, categoryRates]);

  if (!isOpen || !cell) return null;

  const handleCategorySelect = (cat: SeatCategory) => {
    setCategory(cat);
    setMonthlyFee(getRateForCategory(cat));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSeat(cell.id, {
      category,
      monthlyFee: Number(monthlyFee),
      status
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
            <div className="w-8 h-8 rounded-lg bg-[#EEF0FD] text-[#544bec] flex items-center justify-center font-black text-sm">
              {cell.seatNumber}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#192038] m-0">
                Edit Seat {cell.seatNumber}
              </h3>
              <span className="text-xs text-[#8F9BB3]">
                Row {cell.row}, Col {cell.col}
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
          {/* Category */}
          <div>
            <label className="font-bold text-[#192038] block mb-1.5">Seat Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Premium', 'Locker', 'Normal'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    category === cat
                      ? 'border-[#544bec] bg-[#EEF0FD] text-[#544bec]'
                      : 'border-[#EDF1F7] bg-white text-[#6B778C] hover:bg-[#F7F9FC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Fee (Read-only) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#192038]">Monthly Fee</label>
              <span className="text-[10px] text-[#8F9BB3] font-semibold bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                Read-only
              </span>
            </div>
            <input
              type="text"
              readOnly
              tabIndex={-1}
              value={`₹${monthlyFee} / month`}
              className="w-full p-2.5 bg-[#F4F6F9] border border-[#EDF1F7] rounded-xl font-bold text-[#192038] cursor-not-allowed select-none focus:outline-hidden"
            />
            <p className="text-[10px] text-[#8F9BB3] mt-1">
              Monthly rate is determined by the selected Seat Category.
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="font-bold text-[#192038] block mb-1.5">Status</label>
            <select
              value={status}
              disabled={cell.status === 'Occupied'}
              onChange={(e) => setStatus(e.target.value as SeatStatus)}
              className="w-full p-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl font-semibold text-[#192038] focus:border-[#544bec] focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              {cell.status === 'Occupied' && <option value="Occupied">Occupied (Student Assigned)</option>}
            </select>
            {cell.status === 'Occupied' && (
              <span className="text-[10px] text-amber-600 mt-1 block">
                Cannot change status while a student is assigned. Unassign student first.
              </span>
            )}
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
              className="px-4 py-2 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-xs font-extrabold text-white transition-all shadow-xs cursor-pointer"
            >
              Update Seat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
