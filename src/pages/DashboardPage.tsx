import React from 'react';
import { Plus, CalendarCheck } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { StatCards } from '../components/dashboard/StatCards';
import { MonthlyFeeChart } from '../components/dashboard/MonthlyFeeChart';
import { DonutCharts } from '../components/dashboard/DonutCharts';
import { SeatMapCard } from '../components/dashboard/SeatMapCard';
import { UpcomingFeesTable } from '../components/dashboard/UpcomingFeesTable';
import { RecentStudentsTable } from '../components/dashboard/RecentStudentsTable';
import { RecentPaymentsTable } from '../components/dashboard/RecentPaymentsTable';
import { AdminLayoutContextType } from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const outletContext = useOutletContext<AdminLayoutContextType | null>();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddStudent = () => {
    outletContext?.openAddStudent();
  };

  const handleMarkAttendance = () => {
    outletContext?.openQuickPunch();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Greeting & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#192038] m-0">
            {getGreeting()}, {user?.name || 'Admin'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-0.5 sm:mt-1 m-0">
            Here's what's happening in your library today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleMarkAttendance}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F8FAFD] shadow-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Mark Attendance"
          >
            <CalendarCheck size={14} className="text-[#00A97A] shrink-0" />
            <span>Attendance</span>
          </button>

          {/* "+ Add Student" button */}
          <button
            onClick={handleAddStudent}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold bg-[#00A97A] text-white hover:bg-[#008f67] shadow-sm shadow-[#00A97A]/30 inline-flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Stat Cards (2x2 on Mobile) */}
      <StatCards />

      {/* Row 2: Charts Row (Monthly Collection Bar Chart + Donut Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">
        {/* Monthly Fee Collection (Spans 6 cols on desktop) */}
        <div className="lg:col-span-6">
          <MonthlyFeeChart />
        </div>

        {/* Seat Occupancy & Today's Attendance (Each spans 3 cols on desktop) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
          <DonutCharts />
        </div>
      </div>

      {/* Row 3: Seat Map (Desktop only) + Upcoming Fee Due Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">
        <div className="hidden lg:block lg:col-span-6">
          <SeatMapCard />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <UpcomingFeesTable />
        </div>
      </div>

      {/* Row 4: Recent Students (Left) + Recent Payments (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">
        <div className="col-span-12 lg:col-span-6">
          <RecentStudentsTable />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <RecentPaymentsTable />
        </div>
      </div>
    </div>
  );
};
