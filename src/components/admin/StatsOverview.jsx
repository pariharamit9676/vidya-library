import React from 'react';
import { UsersIcon, LogInIcon, IndianRupeeIcon, ClockIcon } from '../Icons';

export const StatsOverview = ({ students = [], totalSeats = 24 }) => {
  const insideStudents = students.filter((s) => s.isCheckedIn);
  const overdueStudents = students.filter((s) => s.feeStatus === 'OVERDUE');
  const dueSoonStudents = students.filter((s) => s.feeStatus === 'DUE_SOON');

  const overdueAmount = overdueStudents.reduce((acc, s) => acc + (s.monthlyFee || 0), 0);

  const currentMonthYear = new Date().toISOString().slice(0, 7);
  let totalCollectedThisMonth = 0;
  students.forEach((s) => {
    if (s.feeHistory && Array.isArray(s.feeHistory)) {
      s.feeHistory.forEach((f) => {
        if (f.date && f.date.startsWith(currentMonthYear)) {
          totalCollectedThisMonth += Number(f.amount || 0);
        }
      });
    }
  });

  const stats = [
    {
      title: "Currently Inside",
      value: insideStudents.length,
      unit: "Students",
      subtitle: `${((insideStudents.length / (students.length || 1)) * 100).toFixed(0)}% of members active now`,
      icon: <LogInIcon size={22} />,
      color: "text-[#01a06e]",
      bg: "bg-[#01a06e]/15",
      border: "border-[#01a06e]/30",
      badge: <span className="w-2 h-2 rounded-full bg-[#01a06e]"></span>
    },
    {
      title: "Total Members",
      value: students.length,
      unit: `/${totalSeats} Seats`,
      subtitle: `${totalSeats - students.length} vacant desks available`,
      icon: <UsersIcon size={22} />,
      color: "text-[#01a06e]",
      bg: "bg-[#01a06e]/15",
      border: "border-[#01a06e]/30"
    },
    {
      title: "Overdue / Pending Fees",
      value: `₹${overdueAmount.toLocaleString('en-IN')}`,
      unit: `${overdueStudents.length} Students`,
      subtitle: dueSoonStudents.length > 0 ? `+ ${dueSoonStudents.length} due in next 3 days` : "No upcoming dues",
      icon: <IndianRupeeIcon size={22} />,
      color: "text-rose-500",
      bg: "bg-rose-500/15",
      border: "border-rose-500/30"
    },
    {
      title: "Fees Collected (This Month)",
      value: `₹${totalCollectedThisMonth.toLocaleString('en-IN')}`,
      unit: "Total",
      subtitle: "Verified payment receipts",
      icon: <ClockIcon size={22} />,
      color: "text-sky-500",
      bg: "bg-sky-500/15",
      border: "border-sky-500/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="glass-card p-5 flex flex-col justify-between gap-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {item.title}
            </span>
            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center border ${item.border}`}>
              {item.icon}
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                {item.value}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-semibold">
                {item.unit}
              </span>
              {item.badge}
            </div>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
