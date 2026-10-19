import React from 'react';
import { Users, Armchair, IndianRupee, Clock } from 'lucide-react';
import { useDashboardStats } from '../../services/useLibraryQueries';

export const StatCards: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const totalStudents = stats?.students?.total ?? 0;
  const regularStudents = stats?.students?.regular ?? 0;
  const demoStudents = stats?.students?.demo ?? 0;

  const totalSeats = stats?.seats?.total ?? 0;
  const occupiedSeats = stats?.seats?.occupied ?? 0;
  const availableSeats = stats?.seats?.available ?? (totalSeats - occupiedSeats);

  const monthlyCollection = stats?.financials?.monthlyCollection ?? 0;
  const totalTransactions = stats?.financials?.totalTransactions ?? 0;

  const pendingDuesCount = stats?.students?.totalWithDues ?? ((stats?.students?.overdue ?? 0) + (stats?.students?.dueSoon ?? 0));
  const pendingDuesAmount = stats?.financials?.pendingDues ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Total Students */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4.5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 hover:shadow-md transition-shadow">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Total Students
          </span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5 min-h-[24px] sm:min-h-[32px] flex items-center">
            {isLoading ? (
              <span className="inline-block h-5 sm:h-7 w-12 bg-slate-200/80 rounded animate-pulse" />
            ) : (
              totalStudents
            )}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#544bec] mt-0.5 truncate">
            {isLoading ? (
              <span className="inline-block h-3 w-20 bg-slate-100 rounded animate-pulse" />
            ) : (
              <><span>{regularStudents} reg</span> • <span>{demoStudents} demo</span></>
            )}
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shrink-0">
          <Users size={16} className="sm:hidden" />
          <Users size={22} className="hidden sm:block" />
        </div>
      </div>

      {/* 2. Total Seats */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4.5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 hover:shadow-md transition-shadow">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Total Seats
          </span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5 min-h-[24px] sm:min-h-[32px] flex items-center">
            {isLoading ? (
              <span className="inline-block h-5 sm:h-7 w-12 bg-slate-200/80 rounded animate-pulse" />
            ) : (
              totalSeats
            )}
          </div>
          <div className="text-[10px] sm:text-[11px] font-medium text-[#8F9BB3] mt-0.5 truncate">
            {isLoading ? (
              <span className="inline-block h-3 w-24 bg-slate-100 rounded animate-pulse" />
            ) : (
              `${occupiedSeats} occ • ${availableSeats} avail`
            )}
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EAF2FE] text-[#2F80ED] flex items-center justify-center shrink-0">
          <Armchair size={16} className="sm:hidden" />
          <Armchair size={22} className="hidden sm:block" />
        </div>
      </div>

      {/* 3. Monthly Collection */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4.5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 hover:shadow-md transition-shadow">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Monthly Collection
          </span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5 truncate min-h-[24px] sm:min-h-[32px] flex items-center">
            {isLoading ? (
              <span className="inline-block h-5 sm:h-7 w-16 bg-slate-200/80 rounded animate-pulse" />
            ) : (
              `₹${monthlyCollection.toLocaleString('en-IN')}`
            )}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#544bec] mt-0.5 truncate">
            {isLoading ? (
              <span className="inline-block h-3 w-16 bg-slate-100 rounded animate-pulse" />
            ) : (
              <span>{totalTransactions} recorded</span>
            )}
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#F3EBF9] text-[#9B51E0] flex items-center justify-center shrink-0">
          <IndianRupee size={16} className="sm:hidden" />
          <IndianRupee size={22} className="hidden sm:block" />
        </div>
      </div>

      {/* 4. Pending Dues */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4.5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0 hover:shadow-md transition-shadow">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Pending Dues
          </span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight mt-0.5 min-h-[24px] sm:min-h-[32px] flex items-center">
            {isLoading ? (
              <span className="inline-block h-5 sm:h-7 w-12 bg-slate-200/80 rounded animate-pulse" />
            ) : (
              pendingDuesCount
            )}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#FA8C16] mt-0.5 truncate">
            {isLoading ? (
              <span className="inline-block h-3 w-20 bg-slate-100 rounded animate-pulse" />
            ) : (
              `₹${pendingDuesAmount.toLocaleString('en-IN')} pending`
            )}
          </div>
        </div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#FFF6E9] text-[#FA8C16] flex items-center justify-center shrink-0">
          <Clock size={16} className="sm:hidden" />
          <Clock size={22} className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
