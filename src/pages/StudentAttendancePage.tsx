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
  ArrowLeft,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Home,
  Phone
} from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState<any>(user || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminPhone, setAdminPhone] = useState<string>('9303961613');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;

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

  const cleanStudentId = (studentData?.studentId || 'STU001').replace(/^#+/, '');

  // Attendance history logs (newest first)
  const allLogs = useMemo(() => {
    if (!studentData?.attendanceHistory || !Array.isArray(studentData.attendanceHistory)) {
      return [];
    }
    return [...studentData.attendanceHistory].reverse();
  }, [studentData?.attendanceHistory]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(allLogs.length / PAGE_SIZE));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allLogs.slice(start, start + PAGE_SIZE);
  }, [allLogs, currentPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#192038] font-sans pb-24 sm:pb-16">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDF1F7] px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back Button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-9 h-9 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-[#192038] hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex items-center gap-2.5">
              <img
                src="/vidya-library-logo.png"
                alt="Vidya Library Logo"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div>
                <h1 className="text-sm sm:text-base font-black text-[#192038] m-0 leading-tight">
                  Attendance Logs
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#8F9BB3] font-medium m-0">
                  {studentData?.name || 'Student'} • ID #{cleanStudentId}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStudentProfile}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-xs font-bold text-[#6B778C] hover:text-[#192038] hover:bg-white flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin text-[#544bec]' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Focused purely on Attendance Logs */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-4">
        
        {/* Attendance List Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-black text-[#192038] m-0">
              Attendance History
            </h2>
            <p className="text-[11px] text-[#8F9BB3] m-0">
              All recorded study punch-in and punch-out sessions
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#544bec] bg-[#EEF0FD] px-2.5 py-1 rounded-lg border border-[#544bec]/20">
            {allLogs.length} Records
          </span>
        </div>

        {/* Attendance Records */}
        {allLogs.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-2xl sm:rounded-3xl border border-[#EDF1F7] p-5 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EDF1F7] text-[#8F9BB3]">
                    <th className="pb-3 font-bold">#</th>
                    <th className="pb-3 font-bold">Date</th>
                    <th className="pb-3 font-bold">Punch In</th>
                    <th className="pb-3 font-bold">Punch Out</th>
                    <th className="pb-3 font-bold">Study Duration</th>
                    <th className="pb-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1F7]">
                  {paginatedLogs.map((record: any, idx: number) => {
                    const rowNum = (currentPage - 1) * PAGE_SIZE + idx + 1;
                    const isCompleted = Boolean(record.checkOutTime || record.checkOut);
                    return (
                      <tr key={record.id || idx} className="hover:bg-[#F8FAFD] transition-colors">
                        <td className="py-3 text-[#8F9BB3] font-mono text-[11px]">
                          {rowNum}
                        </td>
                        <td className="py-3 font-bold text-[#192038] flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#8F9BB3]" />
                          <span>{formatDisplayDate(record.date)}</span>
                        </td>
                        <td className="py-3 text-[#544bec] font-bold font-mono">
                          {record.checkInTime || record.checkIn ? formatDisplayTime(record.checkInTime || record.checkIn) : '—'}
                        </td>
                        <td className="py-3 text-[#6B778C] font-semibold font-mono">
                          {isCompleted ? formatDisplayTime(record.checkOutTime || record.checkOut) : 'Active In Library'}
                        </td>
                        <td className="py-3 font-mono font-bold text-[#192038]">
                          {record.duration || 'Session in progress'}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isCompleted
                                ? 'bg-[#F1F4F9] text-[#6B778C]'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'Currently Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View - Clean, Card-based Attendance Session */}
            <div className="sm:hidden space-y-3">
              {paginatedLogs.map((record: any, idx: number) => {
                const isCompleted = Boolean(record.checkOutTime || record.checkOut);
                const sessionNum = allLogs.length - ((currentPage - 1) * PAGE_SIZE + idx);
                return (
                  <div
                    key={record.id || idx}
                    className="bg-white rounded-2xl border border-[#EDF1F7] p-3.5 shadow-2xs flex flex-col gap-2.5"
                  >
                    {/* Top Date & Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shrink-0">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#192038] block leading-tight">
                            {formatDisplayDate(record.date)}
                          </span>
                          <span className="text-[10px] text-[#8F9BB3] font-medium">
                            Session #{sessionNum}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-[#F1F4F9] text-[#6B778C]'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {!isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                        {isCompleted ? 'Completed' : 'Active'}
                      </span>
                    </div>

                    {/* Middle Punch Times & Duration Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center bg-[#F8FAFD] rounded-xl p-2.5 border border-[#EDF1F7]">
                      {/* Punch In */}
                      <div className="border-r border-[#EDF1F7] pr-1">
                        <span className="text-[9px] font-bold text-[#8F9BB3] uppercase tracking-wider block mb-0.5">
                          Punch In
                        </span>
                        <span className="text-xs font-black text-[#544bec] font-mono block">
                          {record.checkInTime || record.checkIn ? formatDisplayTime(record.checkInTime || record.checkIn) : '—'}
                        </span>
                      </div>

                      {/* Punch Out */}
                      <div className="border-r border-[#EDF1F7] pr-1">
                        <span className="text-[9px] font-bold text-[#8F9BB3] uppercase tracking-wider block mb-0.5">
                          Punch Out
                        </span>
                        <span className="text-xs font-black text-[#192038] font-mono block truncate">
                          {isCompleted ? formatDisplayTime(record.checkOutTime || record.checkOut) : 'Active'}
                        </span>
                      </div>

                      {/* Duration */}
                      <div>
                        <span className="text-[9px] font-bold text-[#8F9BB3] uppercase tracking-wider block mb-0.5">
                          Duration
                        </span>
                        <span className="text-xs font-black text-[#192038] font-mono block">
                          {record.duration || 'Studying...'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 pt-3 border-t border-[#EDF1F7] flex items-center justify-between gap-2 px-1">
                <div className="text-[11px] text-[#8F9BB3] font-medium">
                  Page <strong className="text-[#192038]">{currentPage}</strong> of{' '}
                  <strong className="text-[#192038]">{totalPages}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft size={13} />
                    <span>Prev</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 rounded-lg border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-xs text-[#8F9BB3] bg-white border border-[#EDF1F7] rounded-2xl p-6 shadow-xs">
            <CalendarCheck size={36} className="mx-auto text-slate-300 mb-2" />
            <div className="font-black text-[#192038] text-sm mb-1">
              No Attendance Records Yet
            </div>
            <p className="text-[11px] text-[#8F9BB3] max-w-sm mx-auto">
              Your daily library check-in and check-out records will appear here as soon as you punch in.
            </p>
          </div>
        )}

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
          className="flex flex-col items-center gap-1 text-[#544bec] font-black cursor-pointer py-1"
        >
          <CalendarCheck size={18} />
          <span className="text-[10px] font-black">Attendance</span>
        </button>

        <a
          href={`tel:${adminPhone}`}
          className="flex flex-col items-center gap-1 text-[#8F9BB3] hover:text-[#544bec] cursor-pointer py-1"
        >
          <Phone size={18} />
          <span className="text-[10px] font-bold">Contact</span>
        </a>
      </nav>

    </div>
  );
};
