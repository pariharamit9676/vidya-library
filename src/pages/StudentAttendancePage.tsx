import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentService, settingsService } from '../services/api';
import {
  formatDisplayDate,
  formatDisplayTime
} from '../utils/dateFormatter';
import {
  CalendarCheck,
  Clock,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Armchair,
  Home,
  FileText,
  Phone,
  Sparkles
} from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState<any>(user || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminPhone, setAdminPhone] = useState<string>('9685912333');
  const [searchDate, setSearchDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 8;

  // Fetch full student profile
  const fetchStudentProfile = async () => {
    if (!user) return;
    const lookupId = user.id || user.studentId || (user as any)._id;
    if (!lookupId) return;

    try {
      setIsLoading(true);
      const res = await studentService.getById(lookupId);
      if (res.success && res.data) {
        setStudentData(res.data);
      }
    } catch {
      // Keep existing data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, [user]);

  // Load admin settings
  useEffect(() => {
    settingsService.get()
      .then((res: any) => {
        if (res?.success && res?.data) {
          const ph = res.data.phone || res.data.adminPhone;
          if (ph) setAdminPhone(ph);
        }
      })
      .catch(() => {});
  }, []);

  const isCheckedIn = Boolean(studentData?.isCheckedIn);
  const cleanStudentId = (studentData?.studentId || 'STU001').replace(/^#+/, '');

  // Attendance history logs (newest first)
  const allLogs = useMemo(() => {
    if (!studentData?.attendanceHistory || !Array.isArray(studentData.attendanceHistory)) {
      return [];
    }
    return [...studentData.attendanceHistory].reverse();
  }, [studentData?.attendanceHistory]);

  // Filtered by search query (date or time)
  const filteredLogs = useMemo(() => {
    if (!searchDate.trim()) return allLogs;
    const q = searchDate.toLowerCase().trim();
    return allLogs.filter((log: any) => {
      const d = (log.date || '').toLowerCase();
      const inT = (log.checkInTime || log.checkIn || '').toLowerCase();
      const outT = (log.checkOutTime || log.checkOut || '').toLowerCase();
      return d.includes(q) || inT.includes(q) || outT.includes(q);
    });
  }, [allLogs, searchDate]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, currentPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#192038] font-sans pb-24 sm:pb-16">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDF1F7] px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back Button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-9 h-9 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-[#192038] hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-black text-[#192038] m-0 leading-tight">
                Attendance Logs
              </h1>
              <p className="text-[10px] sm:text-[11px] text-[#8F9BB3] font-medium m-0">
                {studentData?.name || 'Student'} • ID #{cleanStudentId}
              </p>
            </div>
          </div>

          {/* Quick Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStudentProfile}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-xs font-bold text-[#6B778C] hover:text-[#192038] hover:bg-white flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin text-[#00A97A]' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-3.5 sm:px-8 pt-4 sm:pt-6 space-y-4">

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Current Status */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EDF1F7] shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#8F9BB3]">Current Status</span>
              <div className="w-7 h-7 rounded-xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} />
              </div>
            </div>
            <div className="text-sm sm:text-base font-black text-[#192038] flex items-center gap-1.5">
              {isCheckedIn ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#00A97A] animate-ping" />
                  <span className="text-[#00A97A]">Inside Library</span>
                </>
              ) : (
                <span className="text-[#6B778C]">Outside Library</span>
              )}
            </div>
            <div className="text-[10px] text-[#8F9BB3] font-medium mt-0.5">
              {isCheckedIn ? 'Session Active' : 'Currently Checked Out'}
            </div>
          </div>

          {/* Card 2: Total Records */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EDF1F7] shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#8F9BB3]">Total Sessions</span>
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CalendarCheck size={14} />
              </div>
            </div>
            <div className="text-sm sm:text-base font-black text-[#192038]">
              {allLogs.length} Records
            </div>
            <div className="text-[10px] text-[#8F9BB3] font-medium mt-0.5">
              Lifetime Attendance
            </div>
          </div>

          {/* Card 3: Seat Info (hidden on very small screen or 3-col) */}
          <div className="col-span-2 sm:col-span-1 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EDF1F7] shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#8F9BB3]">Assigned Seat</span>
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Armchair size={14} />
              </div>
            </div>
            <div className="text-sm sm:text-base font-black text-[#192038]">
              {studentData?.seatNo ? `Seat #${studentData.seatNo}` : 'No Assigned Seat'}
            </div>
            <div className="text-[10px] text-[#8F9BB3] font-medium mt-0.5">
              Shift: {studentData?.shift || 'Full Day (24/7)'}
            </div>
          </div>

        </div>

        {/* Search & Filter Header */}
        <div className="bg-white rounded-2xl border border-[#EDF1F7] p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
            <input
              type="text"
              value={searchDate}
              onChange={(e) => {
                setSearchDate(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by date (e.g. 19 Oct 2026, Oct, morning...)"
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#00A97A] focus:bg-white transition-all"
            />
            {searchDate && (
              <button
                onClick={() => setSearchDate('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-[#8F9BB3] font-bold">
            <span>
              Showing {filteredLogs.length} of {allLogs.length} records
            </span>
          </div>
        </div>

        {/* Attendance Records List / Table */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EDF1F7] p-4 sm:p-6 shadow-xs">
          
          {filteredLogs.length > 0 ? (
            <>
              {/* Desktop View Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EDF1F7] text-[#8F9BB3]">
                      <th className="pb-3 font-bold">#</th>
                      <th className="pb-3 font-bold">Date</th>
                      <th className="pb-3 font-bold">Punch In</th>
                      <th className="pb-3 font-bold">Punch Out</th>
                      <th className="pb-3 font-bold">Duration</th>
                      <th className="pb-3 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF1F7]">
                    {paginatedLogs.map((record: any, idx: number) => {
                      const rowNum = (currentPage - 1) * PAGE_SIZE + idx + 1;
                      return (
                        <tr key={record.id || idx} className="hover:bg-[#F8FAFD] transition-colors">
                          <td className="py-3 text-[#8F9BB3] font-mono text-[11px]">
                            {rowNum}
                          </td>
                          <td className="py-3 font-bold text-[#192038] flex items-center gap-1.5">
                            <Calendar size={13} className="text-[#8F9BB3]" />
                            <span>{formatDisplayDate(record.date)}</span>
                          </td>
                          <td className="py-3 text-[#00A97A] font-bold font-mono">
                            {record.checkInTime || record.checkIn ? formatDisplayTime(record.checkInTime || record.checkIn) : '—'}
                          </td>
                          <td className="py-3 text-[#6B778C] font-semibold font-mono">
                            {record.checkOutTime || record.checkOut ? formatDisplayTime(record.checkOutTime || record.checkOut) : 'Active In Library'}
                          </td>
                          <td className="py-3 font-mono font-bold text-[#192038]">
                            {record.duration || 'In session'}
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                record.checkOutTime || record.checkOut
                                  ? 'bg-[#F1F4F9] text-[#6B778C]'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {record.checkOutTime || record.checkOut ? 'Completed' : 'Currently Active'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="sm:hidden space-y-2.5">
                {paginatedLogs.map((record: any, idx: number) => {
                  const isCompleted = Boolean(record.checkOutTime || record.checkOut);
                  return (
                    <div
                      key={record.id || idx}
                      className="p-3.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl flex items-center justify-between gap-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-[#192038] flex items-center gap-1.5 truncate">
                          <Calendar size={13} className="text-[#00A97A] shrink-0" />
                          <span>{formatDisplayDate(record.date)}</span>
                        </div>
                        <div className="text-[11px] text-[#6B778C] mt-1.5 flex items-center gap-2 flex-wrap">
                          <span>
                            In: <strong className="text-[#00A97A] font-mono">{record.checkInTime || record.checkIn ? formatDisplayTime(record.checkInTime || record.checkIn) : '—'}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Out: <strong className="font-mono">{isCompleted ? formatDisplayTime(record.checkOutTime || record.checkOut) : 'Active'}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-black text-[#192038] block">
                          {record.duration || 'In Library'}
                        </span>
                        <span
                          className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                            isCompleted ? 'bg-[#EDF1F7] text-[#6B778C]' : 'bg-[#E8F8F3] text-[#00A97A]'
                          }`}
                        >
                          {isCompleted ? 'Done' : 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-5 pt-3.5 border-t border-[#EDF1F7] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#8F9BB3] font-medium">
                    Page <strong className="text-[#192038]">{currentPage}</strong> of{' '}
                    <strong className="text-[#192038]">{totalPages}</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="px-3 py-1.5 rounded-lg border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={13} />
                      <span>Prev</span>
                    </button>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1.5 rounded-lg border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-xs text-[#8F9BB3] border border-dashed border-[#EDF1F7] rounded-2xl p-6">
              <CalendarCheck size={32} className="mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-[#192038] text-sm mb-1">
                {searchDate ? 'No matching attendance records' : 'No attendance logs recorded yet'}
              </div>
              <p className="text-[11px] text-[#8F9BB3] max-w-sm mx-auto">
                {searchDate
                  ? 'Try searching with another date format or clearing the search box.'
                  : 'Your daily check-in and check-out punches will be recorded here automatically.'}
              </p>
              {searchDate && (
                <button
                  onClick={() => setSearchDate('')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-[#E8F8F3] text-[#00A97A] font-bold text-xs cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        </div>

        {/* Footer Support Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#192038] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[#00C992] text-xs font-black">
              <Sparkles size={14} />
              <span>Need help with attendance?</span>
            </div>
            <p className="text-[11px] text-slate-300 m-0">
              Contact Vidya Library administration desk for attendance correction or queries.
            </p>
          </div>

          <a
            href={`tel:${adminPhone}`}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#00A97A] hover:bg-[#008f67] text-white text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Phone size={13} />
            <span>Call Admin ({adminPhone})</span>
          </a>
        </div>

      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EDF1F7] px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex flex-col items-center gap-1 text-[#8F9BB3] hover:text-[#192038] cursor-pointer py-1"
        >
          <Home size={18} />
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center gap-1 text-[#00A97A] font-black cursor-pointer py-1"
        >
          <CalendarCheck size={18} />
          <span className="text-[10px] font-black">Attendance</span>
        </button>

        <a
          href={`tel:${adminPhone}`}
          className="flex flex-col items-center gap-1 text-[#8F9BB3] hover:text-[#00A97A] cursor-pointer py-1"
        >
          <Phone size={18} />
          <span className="text-[10px] font-bold">Contact</span>
        </a>
      </nav>

    </div>
  );
};
