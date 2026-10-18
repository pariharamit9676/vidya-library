import React from 'react';
import { Crown, Archive, Armchair } from 'lucide-react';
import { SeatCategory } from '../../types/seatManagement';

interface SeatCategoryLegendProps {
  selectedCategory: string; // 'All' | 'Premium' | 'Locker' | 'Normal'
  onSelectCategory: (cat: string) => void;
  counts: {
    all: number;
    premium: number;
    locker: number;
    normal: number;
  };
}

export const SeatCategoryLegend: React.FC<SeatCategoryLegendProps> = ({
  selectedCategory,
  onSelectCategory,
  counts
}) => {
  const categories = [
    { id: 'All', label: 'All Seats', count: counts.all, icon: null },
    { id: 'Normal', label: 'Normal', count: counts.normal, icon: Armchair, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'Premium', label: 'Premium', count: counts.premium, icon: Crown, color: 'text-amber-800 bg-amber-50 border-amber-200' },
    { id: 'Locker', label: 'Locker', count: counts.locker, icon: Archive, color: 'text-sky-800 bg-sky-50 border-sky-200' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 py-1">
      {/* Left: Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 shrink-0">
        {categories.map((c) => {
          const isActive = selectedCategory === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 whitespace-nowrap ${
                isActive
                  ? c.id === 'Premium'
                    ? 'bg-amber-500 text-amber-950 border-amber-600 shadow-sm'
                    : c.id === 'Locker'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                    : c.id === 'Normal'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-[#192038] text-white border-[#192038] shadow-sm'
                  : 'bg-white text-[#6B778C] border-[#EDF1F7] hover:bg-[#F7F9FC] hover:text-[#192038]'
              }`}
            >
              {Icon && <Icon size={13} className={isActive ? 'opacity-100' : 'opacity-70'} />}
              <span>{c.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                isActive
                  ? 'bg-black/15 text-inherit'
                  : 'bg-[#F0F3F8] text-[#6B778C]'
              }`}>
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Visual Color Legend */}
      <div className="flex items-center gap-3.5 text-xs font-semibold text-[#6B778C] flex-wrap bg-white px-3 py-1.5 rounded-xl border border-[#EDF1F7] shadow-xs">
        {/* Normal */}
        <div className="flex items-center gap-1.5" title="Standard normal seat (Mint Green)">
          <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0] border-2 border-[#4ADE80] shadow-xs" />
          <span className="text-[11px] font-bold text-[#14532D]">Normal</span>
        </div>

        {/* Premium */}
        <div className="flex items-center gap-1.5" title="Premium luxury VIP desk (Gold)">
          <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-[#D97706] shadow-xs flex items-center justify-center">
            <Crown size={9} className="text-[#D97706]" strokeWidth={2.5} />
          </span>
          <span className="text-[11px] font-bold text-[#78350F]">Premium</span>
        </div>

        {/* Locker */}
        <div className="flex items-center gap-1.5" title="Locker seat with personal locker (Sky Blue)">
          <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] border-2 border-[#0284C7] shadow-xs flex items-center justify-center">
            <Archive size={9} className="text-[#0284C7]" strokeWidth={2.5} />
          </span>
          <span className="text-[11px] font-bold text-[#075985]">Locker</span>
        </div>

        <div className="h-3 w-px bg-slate-200" />

        {/* Occupied */}
        <div className="flex items-center gap-1.5" title="Occupied seat">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
          <span className="text-[11px] text-[#192038]">Occupied</span>
        </div>

        {/* Maintenance */}
        <div className="flex items-center gap-1.5" title="Under maintenance">
          <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
          <span className="text-[11px] text-[#64748B]">Maintenance</span>
        </div>

        {/* Aisle */}
        <div className="flex items-center gap-1.5" title="Aisle / Walking space">
          <span className="w-3 h-3 rounded border border-dashed border-[#A0AEC0] bg-[#F8FAFC]" />
          <span className="text-[11px] text-[#94A3B8]">Aisle</span>
        </div>
      </div>
    </div>
  );
};

