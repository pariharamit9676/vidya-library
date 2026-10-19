import React from 'react';
import { IndianRupee, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface FeeStatCardsProps {
  totalCollected: number;
  pendingFees: number;
  overdueFees: number;
  collectedThisMonth: number;
  pendingCount?: number;
  overdueCount?: number;
  totalTransactions?: number;
}

export const FeeStatCards: React.FC<FeeStatCardsProps> = ({
  totalCollected,
  pendingFees,
  overdueFees,
  collectedThisMonth,
  pendingCount = 0,
  overdueCount = 0,
  totalTransactions = 0
}) => {
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Total Collected */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shrink-0 shadow-2xs">
          <IndianRupee size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Total Collected
          </span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight leading-tight mt-0.5 truncate">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#544bec] truncate mt-0.5">
            {totalTransactions} receipts
          </div>
        </div>
      </div>

      {/* 2. Pending Fees */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#FFF9F2] text-[#FFAA00] flex items-center justify-center shrink-0 shadow-2xs">
          <Clock size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Pending Dues
          </span>
          <div className="text-base sm:text-2xl font-black text-[#FFAA00] tracking-tight leading-tight mt-0.5 truncate">
            ₹{pendingFees.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 truncate mt-0.5">
            {pendingCount} partial student{pendingCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* 3. Overdue Fees */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#FFEFF0] text-[#FF3D71] flex items-center justify-center shrink-0 shadow-2xs">
          <AlertCircle size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Overdue Fees
          </span>
          <div className="text-base sm:text-2xl font-black text-[#FF3D71] tracking-tight leading-tight mt-0.5 truncate">
            ₹{overdueFees.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#FF3D71] truncate mt-0.5">
            {overdueCount} student{overdueCount === 1 ? '' : 's'} overdue
          </div>
        </div>
      </div>

      {/* 4. Collected This Month */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#EAF2FF] text-[#3366FF] flex items-center justify-center shrink-0 shadow-2xs">
          <TrendingUp size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            This Month
          </span>
          <div className="text-base sm:text-2xl font-black text-[#3366FF] tracking-tight leading-tight mt-0.5 truncate">
            ₹{collectedThisMonth.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#3366FF] truncate mt-0.5">
            {currentMonthName} {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};
