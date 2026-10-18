import React, { useMemo } from 'react';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { StudentRecord } from '../../types/student';

interface StudentStatCardsProps {
  students?: StudentRecord[];
}

export const StudentStatCards: React.FC<StudentStatCardsProps> = ({ students = [] }) => {
  const metrics = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === 'Active').length;
    const inactive = students.filter((s) => s.status === 'Inactive').length;
    const dueStudents = students.filter((s) => s.status === 'Due Soon' || s.status === 'Overdue');
    const totalDueAmount = dueStudents.reduce(
      (sum, s) => sum + (Number(s.dueAmount) || Number(s.planAmount) || 0),
      0
    );

    return {
      totalStudents: String(total),
      totalGrowth: total > 0 ? '+12% this month' : '0 registered',
      activeStudents: String(active),
      activePercentage: total > 0 ? `${Math.round((active / total) * 100)}% active rate` : '0% active',
      inactiveStudents: String(inactive),
      inactivePercentage: total > 0 ? `${Math.round((inactive / total) * 100)}% over 40d overdue` : '0% inactive',
      dueFeeStudents: String(dueStudents.length),
      dueFeeAmount: `₹${totalDueAmount.toLocaleString('en-IN')} pending`
    };
  }, [students]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
      {/* 1. Total Students */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Users size={18} className="sm:hidden" />
          <Users size={22} className="hidden sm:block" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Total</span>
          <div className="text-lg sm:text-2xl font-black text-[#192038] tracking-tight leading-tight mt-0.5">
            {metrics.totalStudents}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-indigo-600 flex items-center gap-0.5 mt-0.5 truncate">
            <span>↑</span>
            <span className="truncate">{metrics.totalGrowth}</span>
          </div>
        </div>
      </div>

      {/* 2. Active Students */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EAF2FF] text-[#3366FF] flex items-center justify-center shrink-0">
          <UserCheck size={18} className="sm:hidden" />
          <UserCheck size={22} className="hidden sm:block" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Active</span>
          <div className="text-lg sm:text-2xl font-black text-[#192038] tracking-tight leading-tight mt-0.5">
            {metrics.activeStudents}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-[#8F9BB3] mt-0.5 truncate">
            {metrics.activePercentage}
          </div>
        </div>
      </div>

      {/* 3. Inactive/Expired */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#FFEFF0] text-[#FF3D71] flex items-center justify-center shrink-0">
          <UserX size={18} className="sm:hidden" />
          <UserX size={22} className="hidden sm:block" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Inactive</span>
          <div className="text-lg sm:text-2xl font-black text-[#192038] tracking-tight leading-tight mt-0.5">
            {metrics.inactiveStudents}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-[#8F9BB3] mt-0.5 truncate">
            {metrics.inactivePercentage}
          </div>
        </div>
      </div>

      {/* 4. Due Fee Students */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#FFF7E8] text-[#FFAA00] flex items-center justify-center shrink-0">
          <Clock size={18} className="sm:hidden" />
          <Clock size={22} className="hidden sm:block" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">Due Fees</span>
          <div className="text-lg sm:text-2xl font-black text-[#192038] tracking-tight leading-tight mt-0.5">
            {metrics.dueFeeStudents}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#FF3D71] mt-0.5 truncate">
            {metrics.dueFeeAmount}
          </div>
        </div>
      </div>
    </div>
  );
};
