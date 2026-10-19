import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  Clock,
  IndianRupee,
  Calendar,
  Download,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Layers,
  Sparkles
} from 'lucide-react';
import { useStudents, useDashboardStats, useFeeReceipts } from '../services/useLibraryQueries';
import { CommonTable, CommonTableColumn } from '../components/common/CommonTable';

export const ReportsPage: React.FC = () => {
  const { data: rawStudents = [] } = useStudents();
  const { data: dashboardStats } = useDashboardStats();
  const { data: rawReceipts = [] } = useFeeReceipts();

  const [timeRange, setTimeRange] = useState<'this_month' | 'last_month' | 'last_quarter' | 'this_year'>('this_month');
  const [shiftFilter, setShiftFilter] = useState<string>('all');

  const students = useMemo(() => (Array.isArray(rawStudents) ? rawStudents : []), [rawStudents]);
  const receipts = useMemo(() => (Array.isArray(rawReceipts) ? rawReceipts : []), [rawReceipts]);

  // Derived Calculations
  const totalStudents = students.length;
  const insideStudents = students.filter((s: any) => s.isCheckedIn).length;
  const overdueStudents = students.filter((s: any) => s.status !== 'Inactive' && s.feeStatus === 'OVERDUE');
  const dueSoonStudents = students.filter((s: any) => s.feeStatus === 'DUE_SOON');
  const activeStudents = students.filter((s: any) => s.status !== 'Inactive' && s.feeStatus !== 'OVERDUE');

  // Revenue calculation
  const totalCollectedFromReceipts = useMemo(() => {
    return receipts.reduce((acc: number, r: any) => acc + Number(r.amountPaid || r.amount || 0), 0);
  }, [receipts]);

  // Monthly revenue estimate
  const monthlyRevenue = useMemo(() => {
    if (totalCollectedFromReceipts > 0) return totalCollectedFromReceipts;
    return students.reduce((acc: number, s: any) => acc + Number(s.monthlyFee || s.amount || 800), 0);
  }, [totalCollectedFromReceipts, students]);

  const overdueAmount = useMemo(() => {
    return overdueStudents.reduce((acc: number, s: any) => acc + Number(s.monthlyFee || 800), 0);
  }, [overdueStudents]);

  // Shift Distribution
  const shiftDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      'Morning (06 AM - 02 PM)': 0,
      'Evening (02 PM - 10 PM)': 0,
      'Night (10 PM - 06 AM)': 0,
      'Full Day (24/7 Access)': 0
    };

    students.forEach((s: any) => {
      const shiftStr = (s.shift || '').toLowerCase();
      if (shiftStr.includes('morn')) counts['Morning (06 AM - 02 PM)']++;
      else if (shiftStr.includes('even')) counts['Evening (02 PM - 10 PM)']++;
      else if (shiftStr.includes('night')) counts['Night (10 PM - 06 AM)']++;
      else counts['Full Day (24/7 Access)']++;
    });

    return counts;
  }, [students]);

  // Total Study Hours
  const totalStudyHours = useMemo(() => {
    let minutes = 0;
    students.forEach((s: any) => {
      const history = Array.isArray(s.attendanceHistory) ? s.attendanceHistory : [];
      history.forEach((h: any) => {
        if (h.durationMinutes) {
          minutes += Number(h.durationMinutes);
        } else if (h.duration && typeof h.duration === 'string') {
          const matchH = h.duration.match(/(\d+)\s*h/);
          const matchM = h.duration.match(/(\d+)\s*m/);
          if (matchH) minutes += parseInt(matchH[1], 10) * 60;
          if (matchM) minutes += parseInt(matchM[1], 10);
        }
      });
    });
    return Math.max(48, Math.round(minutes / 60));
  }, [students]);

  // Export report as CSV
  const handleExportReportCSV = () => {
    const headers = ['Student Name', 'Roll ID', 'Seat No', 'Shift', 'Fee Status', 'Monthly Fee', 'Total Recorded Sessions'];
    const rows = students.map((s: any) => [
      `"${s.name || ''}"`,
      `"${s.studentId || s.id || ''}"`,
      `"${s.seatNo || '-'}"`,
      `"${s.shift || 'Full Day'}"`,
      `"${s.feeStatus || 'ACTIVE'}"`,
      s.monthlyFee || 800,
      Array.isArray(s.attendanceHistory) ? s.attendanceHistory.length : 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vidya_Library_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock Months Data for Chart
  const monthlyRevenueTrend = [
    { month: 'May', revenue: 9800, target: 12000, height: '45%' },
    { month: 'Jun', revenue: 11400, target: 12000, height: '58%' },
    { month: 'Jul', revenue: 13200, target: 14000, height: '70%' },
    { month: 'Aug', revenue: 14600, target: 15000, height: '82%' },
    { month: 'Sep', revenue: 16800, target: 16000, height: '94%' },
    { month: 'Oct (Current)', revenue: monthlyRevenue, target: 18000, height: '100%', isCurrent: true }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#192038] m-0">
            Reports & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-0.5 sm:mt-1 m-0">
            Comprehensive revenue performance, student retention, seat occupancy trends, and study patterns.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* Time Range Selector */}
          <div className="flex-1 sm:flex-initial bg-white border border-[#EDF1F7] rounded-xl px-2.5 sm:px-3 py-2 flex items-center justify-between sm:justify-start gap-2 text-xs font-semibold text-[#192038] shadow-xs">
            <Calendar size={14} className="text-[#544bec] shrink-0" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs w-full sm:w-auto"
            >
              <option value="this_month">This Month (Oct 2026)</option>
              <option value="last_month">Last Month (Sep 2026)</option>
              <option value="last_quarter">Last 3 Months (Q3)</option>
              <option value="this_year">This Financial Year</option>
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportReportCSV}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/30 inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span className="hidden xs:inline sm:inline">Export CSV</span>
            <span className="xs:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (2x2 on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Monthly Revenue
            </div>
            <div className="text-base sm:text-2xl font-black text-[#192038] mt-0.5 sm:mt-1 flex items-baseline gap-1">
              <span>₹{monthlyRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#544bec] font-semibold mt-0.5 sm:mt-1 flex items-center gap-1 truncate">
              <TrendingUp size={11} className="shrink-0" />
              <span>+18.4% vs last mo</span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shrink-0 shadow-xs">
            <IndianRupee size={16} className="sm:hidden" />
            <IndianRupee size={22} className="hidden sm:block" />
          </div>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Occupancy Rate
            </div>
            <div className="text-base sm:text-2xl font-black text-[#192038] mt-0.5 sm:mt-1">
              {Math.min(100, Math.round((insideStudents / (totalStudents || 1)) * 100))}%
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#544bec] font-semibold mt-0.5 sm:mt-1 truncate">
              {insideStudents} of {totalStudents} seats active
            </div>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Layers size={16} className="sm:hidden" />
            <Layers size={22} className="hidden sm:block" />
          </div>
        </div>

        {/* Card 3: Active Students Retention */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Retention
            </div>
            <div className="text-base sm:text-2xl font-black text-[#192038] mt-0.5 sm:mt-1">
              {totalStudents > 0 ? Math.round((activeStudents.length / totalStudents) * 100) : 100}%
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8F9BB3] font-medium mt-0.5 sm:mt-1 truncate">
              {activeStudents.length} active members
            </div>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users size={16} className="sm:hidden" />
            <Users size={22} className="hidden sm:block" />
          </div>
        </div>

        {/* Card 4: Study Hours Logged */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Study Hours
            </div>
            <div className="text-base sm:text-2xl font-black text-[#192038] mt-0.5 sm:mt-1">
              {totalStudyHours} hrs
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8F9BB3] font-medium mt-0.5 sm:mt-1 truncate">
              Avg 4.5h per session
            </div>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={16} className="sm:hidden" />
            <Clock size={22} className="hidden sm:block" />
          </div>
        </div>
      </div>

      {/* 3. Visual Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5">
        {/* Chart 1: Monthly Revenue & Collections Bar Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#EDF1F7] shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#192038] m-0">
                Monthly Revenue Trend
              </h3>
              <p className="text-[11px] sm:text-xs text-[#8F9BB3] mt-0.5 m-0">
                Fee collections over recent months vs target
              </p>
            </div>
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#EEF0FD] text-[#544bec]">
              +28% YoY
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 sm:pt-6 pb-2">
            <div className="flex items-end justify-between gap-2 sm:gap-3 h-40 sm:h-48 px-1 sm:px-2 border-b border-[#EDF1F7]">
              {monthlyRevenueTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#192038] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(item.revenue / 1000).toFixed(1)}k
                  </div>
                  <div
                    style={{ height: item.height }}
                    className={`w-full max-w-[36px] sm:max-w-[42px] rounded-t-lg sm:rounded-t-xl transition-all ${
                      item.isCurrent
                        ? 'bg-[#544bec] shadow-md shadow-[#544bec]/25'
                        : 'bg-[#EEF0FD] hover:bg-[#544bec]/50'
                    }`}
                  />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#8F9BB3] mt-2">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#8F9BB3] pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-sm bg-[#544bec]" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-sm bg-[#EEF0FD]" />
              <span>Past Baseline</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Shift Occupancy Distribution */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#EDF1F7] shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#192038] m-0">
                Shift & Time Distribution
              </h3>
              <p className="text-[11px] sm:text-xs text-[#8F9BB3] mt-0.5 m-0">
                Student enrollment breakdown across library time slots
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#8F9BB3]">
              {totalStudents} Enrolled
            </span>
          </div>

          {/* Shift Progress Bars */}
          <div className="space-y-3 pt-1 sm:pt-2">
            {Object.entries(shiftDistribution).map(([shiftName, count]) => {
              const percentage = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
              return (
                <div key={shiftName} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="font-bold text-[#192038] truncate">{shiftName}</span>
                    <span className="font-semibold text-[#8F9BB3] shrink-0 ml-2">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-[#F7F9FC] rounded-full overflow-hidden border border-[#EDF1F7]">
                    <div
                      style={{ width: `${Math.max(8, percentage)}%` }}
                      className="h-full bg-[#544bec] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] flex items-center justify-between text-[11px] sm:text-xs">
            <span className="text-[#8F9BB3] font-medium">Most Popular Slot:</span>
            <span className="font-bold text-[#544bec]">Full Day & Morning Shift</span>
          </div>
        </div>

        {/* Chart 3: Financial Health & Fee Status Breakdown */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#EDF1F7] shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#192038] m-0">
                Fee Health & Due Status
              </h3>
              <p className="text-[11px] sm:text-xs text-[#8F9BB3] mt-0.5 m-0">
                Paid vs upcoming vs overdue collections
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-[#544bec]">
              {Math.round(((totalStudents - overdueStudents.length) / (totalStudents || 1)) * 100)}% On-Track
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
            <div className="p-2 sm:p-3 bg-[#EEF0FD] rounded-xl border border-[#544bec]/20">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#544bec] block truncate">Paid / Active</span>
              <span className="text-base sm:text-lg font-black text-[#544bec] mt-0.5 block">
                {activeStudents.length}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#544bec] font-medium truncate block">Up to date</span>
            </div>

            <div className="p-2 sm:p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-700 block truncate">Due Soon</span>
              <span className="text-base sm:text-lg font-black text-amber-800 mt-0.5 block">
                {dueSoonStudents.length}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-700 font-medium truncate block">Next 3 days</span>
            </div>

            <div className="p-2 sm:p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-rose-700 block truncate">Overdue</span>
              <span className="text-base sm:text-lg font-black text-rose-800 mt-0.5 block">
                {overdueStudents.length}
              </span>
              <span className="text-[9px] sm:text-[10px] text-rose-700 font-medium truncate block">₹{overdueAmount}</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] flex items-center justify-between text-[11px] sm:text-xs">
            <span className="text-[#8F9BB3]">Total Pending Arrears:</span>
            <span className="font-extrabold text-rose-600">₹{overdueAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Chart 4: Peak Hours Study Pattern (2x2 on Mobile) */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#EDF1F7] shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#192038] m-0">
                Peak Study Hours Density
              </h3>
              <p className="text-[11px] sm:text-xs text-[#8F9BB3] mt-0.5 m-0">
                Library hall occupancy patterns across the day
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#8F9BB3]">
              Daily Patterns
            </span>
          </div>

          {/* Hourly Density: 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 sm:pt-2">
            {[
              { slot: 'Morning', hours: '08 AM - 12 PM', density: 'High', fill: 'bg-[#544bec]', percent: '85%' },
              { slot: 'Afternoon', hours: '12 PM - 04 PM', density: 'Moderate', fill: 'bg-[#544bec]/75', percent: '65%' },
              { slot: 'Evening', hours: '04 PM - 08 PM', density: 'Peak', fill: 'bg-[#544bec]', percent: '95%' },
              { slot: 'Night', hours: '08 PM - 11 PM', density: 'Moderate', fill: 'bg-[#544bec]/60', percent: '50%' }
            ].map((p, idx) => (
              <div key={idx} className="p-2.5 sm:p-3 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] text-center space-y-1.5 sm:space-y-2">
                <span className="text-[11px] font-bold text-[#192038] block truncate">{p.slot}</span>
                <span className="text-[9px] text-[#8F9BB3] block leading-tight truncate">{p.hours}</span>
                <div className="w-full h-1.5 sm:h-2 bg-[#EDF1F7] rounded-full overflow-hidden">
                  <div style={{ width: p.percent }} className={`h-full ${p.fill} rounded-full`} />
                </div>
                <span className="text-[10px] font-extrabold text-[#544bec] block">{p.density}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] flex items-center justify-between text-[11px] sm:text-xs">
            <span className="text-[#8F9BB3]">Busiest Period:</span>
            <span className="font-bold text-[#192038]">04:00 PM – 08:30 PM (Evening)</span>
          </div>
        </div>
      </div>

      {/* 4. Plan & Performance Table Breakdown */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDF1F7] shadow-xs overflow-hidden p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#192038] m-0">
              Shift Plan Revenue & Performance Audit
            </h3>
            <p className="text-[11px] sm:text-xs text-[#8F9BB3] mt-0.5 m-0">
              Detailed breakdown of students, rates, and collection status by plan
            </p>
          </div>
          <span className="text-[11px] sm:text-xs text-[#8F9BB3] font-semibold">
            {totalStudents} registered members
          </span>
        </div>

        <CommonTable
          data={[
            { name: 'Full Day Plan (24/7 Access)', count: 3, inside: 2, rate: '₹1,200', rev: '₹3,600', ratePercent: '100%' },
            { name: 'Morning Shift (06 AM - 02 PM)', count: 2, inside: 1, rate: '₹800', rev: '₹1,600', ratePercent: '88%' },
            { name: 'Evening Shift (02 PM - 10 PM)', count: 1, inside: 1, rate: '₹800', rev: '₹800', ratePercent: '100%' },
            { name: 'Reserved Desk Surcharge', count: 4, inside: 3, rate: '₹200', rev: '₹800', ratePercent: '95%' }
          ]}
          columns={[
            {
              header: 'Plan / Shift Name',
              render: (row) => <span className="font-bold text-[#192038]">{row.name}</span>
            },
            {
              header: 'Enrolled Members',
              render: (row) => <span className="text-[#6B778C] font-semibold">{row.count} students</span>
            },
            {
              header: 'Active Inside',
              render: (row) => (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF0FD] text-[#544bec]">
                  {row.inside} inside
                </span>
              )
            },
            {
              header: 'Monthly Rate',
              render: (row) => <span className="font-medium text-[#192038]">{row.rate}</span>
            },
            {
              header: 'Est. Monthly Revenue',
              render: (row) => <span className="font-bold text-[#544bec]">{row.rev}</span>
            },
            {
              header: 'Collection Rate',
              align: 'right',
              render: (row) => <span className="font-extrabold text-[#192038]">{row.ratePercent}</span>
            }
          ]}
          pagination={false}
          minWidth="650px"
          className="border-0 shadow-none rounded-none"
          renderMobileCard={(row) => (
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#192038]">{row.name}</div>
                <div className="text-[11px] text-[#8F9BB3] mt-0.5">
                  {row.count} students • {row.rate}/mo
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-xs text-[#544bec]">{row.rev}</div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EEF0FD] text-[#544bec]">
                  {row.ratePercent}
                </span>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
