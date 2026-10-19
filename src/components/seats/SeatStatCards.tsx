import React from 'react';
import { Armchair, Wrench } from 'lucide-react';

interface SeatStatCardsProps {
  totalSeats: number;
  availableCount: number;
  occupiedCount: number;
  maintenanceCount: number;
}

export const SeatStatCards: React.FC<SeatStatCardsProps> = ({
  totalSeats,
  availableCount,
  occupiedCount,
  maintenanceCount
}) => {
  const availablePercent = totalSeats > 0 ? ((availableCount / totalSeats) * 100).toFixed(1) : '0';
  const occupiedPercent = totalSeats > 0 ? ((occupiedCount / totalSeats) * 100).toFixed(1) : '0';
  const maintenancePercent = totalSeats > 0 ? ((maintenanceCount / totalSeats) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Total Seats */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 transition-all hover:shadow-md">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Total Seats</span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5">
            {totalSeats}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-[#8F9BB3] mt-0.5 truncate">
            in layout
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EAF2FF] text-[#3366FF] flex items-center justify-center shrink-0">
          <Armchair size={16} className="sm:hidden" />
          <Armchair size={22} className="hidden sm:block" />
        </div>
      </div>

      {/* 2. Available Seats */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 transition-all hover:shadow-md">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Available</span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5">
            {availableCount}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#544bec] mt-0.5 truncate">
            {availablePercent}% free
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shrink-0">
          <Armchair size={16} className="sm:hidden" />
          <Armchair size={22} className="hidden sm:block" />
        </div>
      </div>

      {/* 3. Occupied Seats */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 transition-all hover:shadow-md">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Occupied</span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5">
            {occupiedCount}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-[#8F9BB3] mt-0.5 truncate">
            {occupiedPercent}% active
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#FFEFF0] text-[#FF3D71] flex items-center justify-center shrink-0">
          <Armchair size={16} className="sm:hidden" />
          <Armchair size={22} className="hidden sm:block" />
        </div>
      </div>

      {/* 4. Under Maintenance */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 transition-all hover:shadow-md">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Maintenance</span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5">
            {maintenanceCount}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-[#8F9BB3] mt-0.5 truncate">
            {maintenancePercent}% off
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#F0F2F5] text-[#6B778C] flex items-center justify-center shrink-0">
          <Wrench size={16} className="sm:hidden" />
          <Wrench size={22} className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
