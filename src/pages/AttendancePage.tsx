import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  UserCheck,
  UserX,
  Users,
  Clock,
  Search,
  Filter,
  LogIn,
  LogOut,
  History,
  Calendar,
  X,
  ChevronDown
} from 'lucide-react';
import { useStudents, useToggleCheckIn } from '../services/useLibraryQueries';
import { useLibrary } from '../context/LibraryContext';
import { calculateDuration, formatTimeOnly, formatDateOnly } from '../utils/storage';
import { LiveStayTimer } from '../components/admin/LiveStayTimer';
import { CommonTable, CommonTableColumn } from '../components/common/CommonTable';

export const AttendancePage: React.FC = () => {
  const { data: rawStudents = [], isLoading } = useStudents();
  const toggleCheckInMutation = useToggleCheckIn();
  const { showToast, toggleCheckIn } = useLibrary();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'inside' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Modal states
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<any | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const students = useMemo(() => (Array.isArray(rawStudents) ? rawStudents : []), [rawStudents]);

  // Derived counts
  const insideStudents = useMemo(() => students.filter((s: any) => s.isCheckedIn), [students]);
  const outsideStudents = useMemo(() => students.filter((s: any) => !s.isCheckedIn), [students]);

  // Toggle Check In / Check Out Handler
  const handleToggleCheckIn = async (studentId: string) => {
    setActionLoadingId(studentId);
    try {
      const res: any = await toggleCheckInMutation.mutateAsync({ id: studentId, byAdmin: true });
      toggleCheckIn(studentId, true);
      const studentName = res?.data?.name || 'Student';
      const isNowInside = res?.data?.isCheckedIn;
      const msg =
        res?.message ||
        (isNowInside
          ? `🟢 ${studentName} checked in successfully!`
          : `🔴 ${studentName} checked out successfully!`);
      if (showToast) {
        showToast(msg, 'success');
      }
    } catch (err: any) {
      console.error('Error toggling check in:', err);
      const errMsg = err?.message || 'Failed to update attendance punch';
      if (showToast) {
        showToast(errMsg, 'error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Unified Stay & Logs list combining active sessions and completed past sessions
  const allStayLogs = useMemo(() => {
    const logs: any[] = [];

    // Helper to extract the most accurate timestamp for sorting recent updates first
    const getLogTimestamp = (entry: any, idx: number): number => {
      if (entry.rawTimestamp && !isNaN(Number(entry.rawTimestamp)) && Number(entry.rawTimestamp) > 0) {
        return Number(entry.rawTimestamp);
      }
      if (entry.checkOutTime) {
        const t = new Date(entry.checkOutTime).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      if (entry.checkOut && typeof entry.checkOut === 'string' && entry.checkOut.includes('T')) {
        const t = new Date(entry.checkOut).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      if (entry.timestamp) {
        const t = new Date(entry.timestamp).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      // Check if id has epoch millisecond e.g. att_1792... or att-1792...
      if (typeof entry.id === 'string') {
        const digits = entry.id.replace(/\D/g, '');
        if (digits.length >= 12) {
          const num = Number(digits);
          if (!isNaN(num) && num > 1600000000000) return num;
        }
      }
      // Combine date and time if available (e.g., "18 Oct 2026 09:30 AM")
      if (entry.date && entry.checkOut && entry.checkOut !== '-' && entry.checkOut !== 'In Progress') {
        const parsed = new Date(`${entry.date} ${entry.checkOut}`).getTime();
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      if (entry.date && entry.checkIn && entry.checkIn !== '-') {
        const parsed = new Date(`${entry.date} ${entry.checkIn}`).getTime();
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      if (entry.date) {
        const d = new Date(entry.date).getTime();
        if (!isNaN(d) && d > 0) return d - idx * 1000;
      }
      return Date.now() - (idx + 1) * 60000;
    };

    students.forEach((s: any) => {
      const sId = s.id || s._id || s.studentId;

      // 1. If student is currently inside, add their ongoing active session
      if (s.isCheckedIn && s.currentCheckInTime) {
        const checkInTimeMs = new Date(s.currentCheckInTime).getTime() || Date.now();
        logs.push({
          id: `active_${sId}`,
          isInside: true,
          date: formatDateOnly(s.currentCheckInTime) || 'Today',
          rawTimestamp: checkInTimeMs,
          checkIn: formatTimeOnly(s.currentCheckInTime) || 'Just now',
          checkInTimeRaw: s.currentCheckInTime,
          checkOut: 'In Progress',
          duration: calculateDuration(s.currentCheckInTime),
          status: 'Inside',
          studentName: s.name,
          studentId: s.studentId || sId,
          seatNo: s.seatNo || '-',
          phone: s.phone || '',
          shift: s.shift || 'Full Day',
          rawStudent: s
        });
      }

      // 2. Add past completed attendance history
      const history = Array.isArray(s.attendanceHistory) ? s.attendanceHistory : [];
      history.forEach((h: any, idx: number) => {
        const ts = getLogTimestamp(h, idx);
        const checkInVal = h.checkInTime || h.checkIn;
        const checkOutVal = h.checkOutTime || h.checkOut;
        logs.push({
          id: h.id || `att_${sId}_${idx}`,
          isInside: false,
          date: (checkInVal ? formatDateOnly(checkInVal) : null) || h.date || 'Past Session',
          rawTimestamp: ts,
          checkIn: checkInVal ? formatTimeOnly(checkInVal) : '-',
          checkInTimeRaw: h.checkInTime || null,
          checkOut: checkOutVal ? formatTimeOnly(checkOutVal) : '-',
          duration: h.formattedDuration || h.duration || (h.durationMinutes ? `${h.durationMinutes}m` : '-'),
          status: 'Completed',
          studentName: s.name,
          studentId: s.studentId || sId,
          seatNo: s.seatNo || '-',
          phone: s.phone || '',
          shift: s.shift || 'Full Day',
          rawStudent: s
        });
      });
    });

    // Sort: Most recent updates and active activity strictly first (descending by timestamp)
    return logs.sort((a, b) => {
      const timeDiff = (b.rawTimestamp || 0) - (a.rawTimestamp || 0);
      if (timeDiff !== 0) return timeDiff;
      if (a.isInside && !b.isInside) return -1;
      if (!a.isInside && b.isInside) return 1;
      return 0;
    });
  }, [students]);

  // Filtered Stay Logs
  const filteredStayLogs = useMemo(() => {
    const todayStr = formatDateOnly(new Date());

    return allStayLogs.filter((log) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (log.studentName || '').toLowerCase().includes(q);
        const matchId = (log.studentId || '').toLowerCase().includes(q);
        const matchPhone = (log.phone || '').includes(q);
        const matchSeat = String(log.seatNo).toLowerCase().includes(q);
        if (!matchName && !matchId && !matchPhone && !matchSeat) return false;
      }

      // 2. Status Filter
      if (statusFilter === 'inside' && !log.isInside) return false;
      if (statusFilter === 'completed' && log.isInside) return false;

      // 3. Date Filter
      if (dateFilter === 'today') {
        const isToday = log.date === 'Today' || log.date === todayStr;
        if (!isToday) return false;
      }

      return true;
    });
  }, [allStayLogs, searchQuery, statusFilter, dateFilter]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#192038] m-0 truncate">
            Stay & Logs
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-0.5 sm:mt-1 m-0 truncate">
            Real-time student check-ins, study sessions & daily logs
          </p>
        </div>

      </div>

      {/* 2. Top Summary KPI Cards (2x2 on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Currently Inside */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Currently Inside
            </div>
            <div className="text-base sm:text-2xl font-black text-[#00A97A] mt-0.5 flex items-center gap-1.5">
              <span>{insideStudents.length}</span>
              <span className="w-2 h-2 rounded-full bg-[#00A97A] inline-block" />
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#00A97A] font-semibold mt-0.5 truncate">
              Active sessions
            </div>
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center shadow-2xs shrink-0">
            <UserCheck size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Card 2: Currently Outside */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Currently Outside
            </div>
            <div className="text-base sm:text-2xl font-black text-[#192038] mt-0.5">
              {outsideStudents.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8F9BB3] font-medium mt-0.5 truncate">
              Away from lounge
            </div>
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#F7F9FC] text-[#8F9BB3] flex items-center justify-center border border-[#EDF1F7] shadow-2xs shrink-0">
            <UserX size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Card 3: Total Students */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Total Enrolled
            </div>
            <div className="text-base sm:text-2xl font-black text-[#192038] mt-0.5">
              {students.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#00A97A] font-semibold mt-0.5 truncate">
              {Math.round((insideStudents.length / (students.length || 1)) * 100)}% occupancy
            </div>
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs shrink-0">
            <Users size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Card 4: Total Stay Sessions */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider truncate">
              Total Sessions
            </div>
            <div className="text-base sm:text-2xl font-black text-[#192038] mt-0.5">
              {allStayLogs.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8F9BB3] font-medium mt-0.5 truncate">
              Recorded study logs
            </div>
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs shrink-0">
            <Clock size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Stay & Logs Master Table View */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDF1F7] shadow-xs overflow-hidden space-y-3 sm:space-y-4 p-3.5 sm:p-5">
        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 w-full">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, roll ID, seat, or phone..."
                className="w-full pl-10 pr-4 py-2 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-none focus:border-[#00A97A] focus:bg-white transition-all"
              />
            </div>

            {/* Quick Status Filter Pills on mobile & desktop */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {(['all', 'inside', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                    statusFilter === st
                      ? 'bg-[#00A97A] text-white shadow-2xs'
                      : 'bg-[#F7F9FC] text-[#6B778C] border border-[#EDF1F7] hover:bg-[#EDF1F7]'
                  }`}
                >
                  {st === 'inside' ? `Inside (${insideStudents.length})` : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stay & Logs Table */}
        <CommonTable
          data={filteredStayLogs}
          emptyMessage="No stay session logs found."
          pagination={true}
          initialPageSize={10}
          minWidth="840px"
          columns={[
            {
              header: 'Student',
              render: (log) => (
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                      log.isInside ? 'bg-[#00A97A] text-white' : 'bg-[#E8F8F3] text-[#00A97A]'
                    }`}
                  >
                    {log.studentName ? log.studentName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div className="font-extrabold text-[#192038]">{log.studentName}</div>
                    <div className="text-[11px] text-[#8F9BB3] font-normal">
                      {log.phone || log.shift}
                    </div>
                  </div>
                </div>
              )
            },
            {
              header: 'Roll ID',
              render: (log) => (
                <span className="px-2 py-0.5 rounded-md bg-[#F7F9FC] border border-[#EDF1F7] text-[11px] font-mono text-[#6B778C]">
                  {log.studentId}
                </span>
              )
            },
            {
              header: 'Seat #',
              render: (log) => (
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    log.isInside ? 'bg-[#E8F8F3] text-[#00A97A]' : 'bg-[#F7F9FC] text-[#6B778C]'
                  }`}
                >
                  {log.seatNo && log.seatNo !== '-' ? `Seat ${log.seatNo}` : '-'}
                </span>
              )
            },
            {
              header: 'Date',
              render: (log) => (
                <span className="flex items-center gap-1.5 text-[#192038] font-medium">
                  <Calendar size={13} className="text-[#00A97A]" />
                  {log.date}
                </span>
              )
            },
            {
              header: 'Check-In',
              render: (log) => <span className="font-semibold text-[#192038]">{log.checkIn}</span>
            },
            {
              header: 'Check-Out',
              render: (log) => (
                <span className="text-[#6B778C] font-medium">
                  {log.isInside ? (
                    <span className="text-[#00A97A] font-semibold text-[11px]">Currently In</span>
                  ) : (
                    log.checkOut
                  )}
                </span>
              )
            },
            {
              header: 'Stay Duration',
              render: (log) =>
                log.isInside && log.checkInTimeRaw ? (
                  <LiveStayTimer checkInTime={log.checkInTimeRaw} />
                ) : (
                  <span className="font-bold text-[#192038]">{log.duration}</span>
                )
            },
            {
              header: 'Status',
              render: (log) =>
                log.isInside ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F8F3] text-[#00A97A] border border-[#00A97A]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A97A]" />
                    Inside
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F7F9FC] text-[#6B778C] border border-[#EDF1F7]">
                    Completed
                  </span>
                )
            },
            {
              header: 'Actions',
              align: 'right',
              render: (log) => {
                const sId = log.rawStudent?.id || log.rawStudent?._id || log.rawStudent?.studentId || log.studentId;
                const isActionLoading = actionLoadingId === sId;
                return (
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedStudentForHistory(log.rawStudent)}
                      className="p-1.5 rounded-lg border border-[#EDF1F7] text-[#8F9BB3] hover:text-[#192038] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                      title="View Student History"
                    >
                      <History size={14} />
                    </button>
                    {log.isInside && (
                      <button
                        onClick={() => handleToggleCheckIn(sId)}
                        disabled={isActionLoading}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Punch Out"
                      >
                        <LogOut size={12} />
                        <span>{isActionLoading ? '...' : 'Punch Out'}</span>
                      </button>
                    )}
                  </div>
                );
              }
            }
          ]}
          renderMobileCard={(log) => {
            const sId = log.rawStudent?.id || log.rawStudent?._id || log.rawStudent?.studentId || log.studentId;
            const isActionLoading = actionLoadingId === sId;
            return (
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        log.isInside ? 'bg-[#00A97A] text-white' : 'bg-[#E8F8F3] text-[#00A97A]'
                      }`}
                    >
                      {log.studentName ? log.studentName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#192038]">{log.studentName}</div>
                      <div className="text-[10px] text-[#8F9BB3]">
                        {log.seatNo ? `Seat ${log.seatNo}` : 'Unassigned'} • {log.date}
                      </div>
                    </div>
                  </div>
                  {log.isInside ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F3] text-[#00A97A] border border-[#00A97A]/20">
                      Inside
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F7F9FC] text-[#6B778C]">
                      Completed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 bg-[#F8FAFD] rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#8F9BB3] block">In</span>
                    <span className="font-semibold text-[#192038] text-[11px]">{log.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8F9BB3] block">Out</span>
                    <span className="font-semibold text-[#192038] text-[11px]">{log.checkOut || 'Active'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8F9BB3] block">Duration</span>
                    <span className="font-bold text-[#00A97A] text-[11px]">
                      {log.isInside && log.checkInTimeRaw ? (
                        <LiveStayTimer checkInTime={log.checkInTimeRaw} />
                      ) : (
                        log.duration
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#EDF1F7]">
                  <button
                    onClick={() => setSelectedStudentForHistory(log.rawStudent)}
                    className="px-2.5 py-1 rounded-lg border border-[#EDF1F7] text-xs font-semibold text-[#6B778C] hover:bg-[#F7F9FC] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <History size={13} />
                    <span>History</span>
                  </button>
                  {log.isInside && (
                    <button
                      onClick={() => handleToggleCheckIn(sId)}
                      disabled={isActionLoading}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <LogOut size={13} />
                      <span>{isActionLoading ? '...' : 'Punch Out'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          }}
        />
      </div>


      {/* Individual Student History Modal */}
      {selectedStudentForHistory && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setSelectedStudentForHistory(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl border border-[#EDF1F7] shadow-2xl overflow-hidden my-6 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EDF1F7] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center shadow-xs">
                  <History size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#192038] m-0">
                    Stay History: {selectedStudentForHistory.name}
                  </h3>
                  <p className="text-xs text-[#8F9BB3] m-0 mt-0.5">
                    {selectedStudentForHistory.studentId || selectedStudentForHistory.id} • Seat {selectedStudentForHistory.seatNo || '-'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="w-8 h-8 rounded-xl border border-[#EDF1F7] text-[#8F9BB3] hover:text-[#192038] flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {(!selectedStudentForHistory.attendanceHistory || selectedStudentForHistory.attendanceHistory.length === 0) ? (
                <div className="text-center py-10 text-xs text-[#8F9BB3]">
                  No past attendance history recorded for this student yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedStudentForHistory.attendanceHistory.map((item: any, idx: number) => (
                    <div
                      key={item.id || idx}
                      className="p-3 bg-[#F8FAFD] rounded-xl border border-[#EDF1F7] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#192038]">{item.date || 'Recent Session'}</div>
                        <div className="text-[11px] text-[#8F9BB3] mt-0.5">
                          {formatTimeOnly(item.checkInTime || item.checkIn)} → {formatTimeOnly(item.checkOutTime || item.checkOut)}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E8F8F3] text-[#00A97A]">
                        {item.duration || 'Session'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#EDF1F7] bg-[#F8FAFD] flex justify-end">
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F7F9FC] shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
