import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentService, settingsService } from '../services/api';
import { FeeReceiptModal } from '../components/admin/FeeReceiptModal';
import {
  formatDisplayDate,
  formatDisplayTime,
  formatLiveCheckInTime,
  getDaysUntilDue,
  computeFeeStatus
} from '../utils/dateFormatter';
import { calculateDuration } from '../utils/storage';
import {
  BookOpen,
  LogOut,
  LogIn,
  CalendarCheck,
  Armchair,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Sparkles,
  Phone,
  FileText,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  KeyRound,
  Download,
  Eye,
  EyeOff,
  User,
  X,
  Printer,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState<any>(user || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [punchLoading, setPunchLoading] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Admin contact phone fetched from database settings
  const [adminPhone, setAdminPhone] = useState<string>('9685912333');

  // Profile Dropdown state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Change Password Modal state
  const [isChangePassOpen, setIsChangePassOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurPass, setShowCurPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [passError, setPassError] = useState<string>('');
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);

  // Fee Receipt Modal state
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);


  // Payments Pagination state (5 logs per page)
  const [paymentPage, setPaymentPage] = useState<number>(1);
  const PAYMENT_PAGE_SIZE = 5;

  // Auto-dismiss feedback toast after 4 seconds
  useEffect(() => {
    if (!feedbackMsg) return;
    const timer = setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [feedbackMsg]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch full student details
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
      // Keep using auth context state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, [user]);

  // Load database settings to retrieve live admin contact phone
  useEffect(() => {
    settingsService.get()
      .then((res: any) => {
        if (res && res.success && res.data) {
          const data = res.data as Record<string, any>;
          const ph = data.phone || data.adminPhone;
          if (ph) setAdminPhone(ph);
        }
      })
      .catch((err) => {
        console.warn('Could not load settings in dashboard:', err.message);
      });
  }, []);

  const isCheckedIn = Boolean(studentData?.isCheckedIn);
  const checkInTime = studentData?.currentCheckInTime;
  const dueAmt = Number(studentData?.dueAmount) || 0;
  const isDemo = studentData?.studentType === 'Demo' || studentData?.status === 'Demo';

  const dueDate = studentData?.nextDueDate || studentData?.nextFeeDueDate;
  const daysLeft = getDaysUntilDue(dueDate);
  const isInactive = (studentData?.status === 'Inactive') || (daysLeft !== null && daysLeft < -40);
  const calculatedFeeStatus = isDemo ? 'PAID' : (studentData?.feeStatus || computeFeeStatus(dueDate, dueAmt, studentData?.status));
  const isOverdue = !isInactive && !isDemo && (calculatedFeeStatus === 'OVERDUE' || studentData?.status === 'Overdue' || (daysLeft !== null && daysLeft < 0));
  const isDueSoon = !isInactive && !isOverdue && (calculatedFeeStatus === 'DUE_SOON' || (daysLeft !== null && daysLeft >= 0 && daysLeft <= 5));
  
  // Punch is locked ONLY for Inactive accounts, NEVER for Overdue accounts!
  const isPunchBlocked = !isDemo && isInactive;

  const cleanStudentId = useMemo(() => {
    return (studentData?.studentId || 'STU001').replace(/^#+/, '');
  }, [studentData?.studentId]);

  // Maximum 3 check-ins per day per student (computed using IST timezone)
  const todayIST = useMemo(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }), []);
  const todayCheckInCount = useMemo(() => {
    if (!studentData?.attendanceHistory || !Array.isArray(studentData.attendanceHistory)) {
      return 0;
    }
    return studentData.attendanceHistory.filter((item: any) => {
      const itemRaw = item.checkInTime || item.timestamp || item.date;
      if (!itemRaw) return false;
      const itemDate = new Date(itemRaw);
      return (
        !isNaN(itemDate.getTime()) &&
        itemDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) === todayIST
      );
    }).length;
  }, [studentData?.attendanceHistory, todayIST]);

  const isDailyLimitReached = !isCheckedIn && todayCheckInCount >= 3;


  // Today's total study duration for the overview card
  const todayTotalDuration = useMemo(() => {
    if (isCheckedIn && checkInTime) {
      return calculateDuration(checkInTime);
    }
    const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const todayLogs = (studentData?.attendanceHistory || []).filter((item: any) => {
      const rawDate = item.checkInTime || item.timestamp || item.date;
      if (!rawDate) return false;
      const d = new Date(rawDate);
      return !isNaN(d.getTime()) && d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) === todayIST;
    });
    if (todayLogs.length > 0 && todayLogs[0]?.duration) {
      return todayLogs[0].duration;
    }
    const last = studentData?.attendanceHistory?.[0];
    return last?.duration || '0m';
  }, [isCheckedIn, checkInTime, studentData?.attendanceHistory]);

  // Last Punch information for the Dribbble-style card
  const lastPunch = useMemo(() => {
    if (isCheckedIn && checkInTime) {
      return {
        time: formatDisplayTime(checkInTime) || 'Active',
        date: formatDisplayDate(checkInTime) || 'Today',
        action: 'Punched In'
      };
    }
    const last = studentData?.attendanceHistory?.[0];
    if (last) {
      const punchTime = last.checkOutTime || last.checkOut || last.checkInTime || last.checkIn;
      return {
        time: punchTime ? formatDisplayTime(punchTime) : '12:30 PM',
        date: last.date ? formatDisplayDate(last.date) : 'Today',
        action: 'Last Punch'
      };
    }
    return {
      time: 'No recent punch',
      date: 'Today',
      action: 'Ready'
    };
  }, [isCheckedIn, checkInTime, studentData?.attendanceHistory]);

  // Handle Quick Punch In/Out
  const handleTogglePunch = async () => {
    if (isPunchBlocked) {
      setFeedbackMsg({
        type: 'error',
        text: `Locked: Account is inactive • Admin Helpline: ${adminPhone}`
      });
      return;
    }

    if (isDailyLimitReached) {
      setFeedbackMsg({
        type: 'error',
        text: `Daily Limit Reached: Maximum 3 check-ins allowed per day. You have already completed 3 check-ins today.`
      });
      return;
    }

    const sId = studentData?.id || studentData?._id || user?.id;
    if (!sId) return;

    try {
      setPunchLoading(true);
      setFeedbackMsg(null);
      const res: any = await studentService.toggleCheckIn(sId);
      if (res && res.success && res.data) {
        setStudentData(res.data);
        const isNowIn = Boolean(res.data.isCheckedIn);
        setFeedbackMsg({
          type: 'success',
          text: isNowIn
            ? 'Punched In successfully! Have a productive study session.'
            : 'Punched Out successfully! Have a great day.'
        });
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Unable to update attendance punch right now.'
      });
    } finally {
      setPunchLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!newPassword || newPassword.trim().length < 4) {
      setPassError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    const sId = studentData?.id || studentData?._id || user?.id;
    if (!sId) {
      setPassError('Student session expired. Please sign in again.');
      return;
    }

    try {
      setIsChangingPass(true);
      const res = await studentService.changePassword(sId, {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      });

      if (res.success) {
        setIsChangePassOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFeedbackMsg({
          type: 'success',
          text: 'Your password has been changed successfully!'
        });
      } else {
        setPassError(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setPassError(err.message || 'Incorrect current password or server error.');
    } finally {
      setIsChangingPass(false);
    }
  };

  // Open Receipt Modal for viewing/downloading
  const handleOpenReceipt = (payRecord: any) => {
    setSelectedReceipt({
      id: payRecord.id,
      receiptNo: payRecord.receiptNo || `REC-${payRecord.id || Date.now().toString().slice(-4)}`,
      date: payRecord.date,
      studentName: studentData?.name || 'Student',
      studentId: studentData?.studentId || '-',
      studentRefId: studentData?.studentId || '-',
      phone: studentData?.phone || '',
      seatNo: studentData?.seatNo || '-',
      seatCategory: studentData?.seatCategory || 'Normal',
      amount: payRecord.amount,
      mode: payRecord.mode || 'Cash',
      plan: payRecord.plan || studentData?.plan || 'Monthly',
      nextDueDate: studentData?.nextDueDate || '',
      dueAmount: studentData?.dueAmount || 0,
      balanceDueDate: studentData?.balanceDueDate || ''
    });
    setIsReceiptModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  // Process payment records (most recent first)
  const paymentRecords = useMemo(() => {
    if (!studentData?.paymentHistory || !Array.isArray(studentData.paymentHistory)) {
      return [];
    }
    return [...studentData.paymentHistory].reverse();
  }, [studentData?.paymentHistory]);

  const totalPaymentPages = Math.max(1, Math.ceil(paymentRecords.length / PAYMENT_PAGE_SIZE));
  const paginatedPayments = useMemo(() => {
    const start = (paymentPage - 1) * PAYMENT_PAGE_SIZE;
    return paymentRecords.slice(start, start + PAYMENT_PAGE_SIZE);
  }, [paymentRecords, paymentPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#192038] font-sans pb-24 sm:pb-12">
      
      {/* Top Navbar - Clean, Admin-matched design (Desktop only) */}
      <header className="hidden sm:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDF1F7] px-4 sm:px-8 py-2.5 sm:py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#544bec] text-white flex items-center justify-center shadow-md shadow-[#544bec]/25 shrink-0">
              <BookOpen size={19} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#192038] truncate">
                  Vidya Library
                </span>
                <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-[#EEF0FD] text-[#544bec] border border-[#544bec]/20 shrink-0">
                  Student Portal
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#8F9BB3] font-medium hidden md:block">
                66W8+4FH, Gayatri Nagar, Gwalior
              </div>
            </div>
          </div>

          {/* Right: Refresh & Admin-like Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Refresh Icon */}
            <button
              onClick={fetchStudentProfile}
              disabled={isLoading}
              className="w-9 h-9 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-[#6B778C] hover:text-[#192038] hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title="Refresh Profile"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin text-[#544bec]' : ''} />
            </button>

            {/* Admin-like Student Profile Pill with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
                  isProfileMenuOpen
                    ? 'bg-[#EEF0FD] border-[#544bec]/30 shadow-xs'
                    : 'bg-white hover:bg-[#F8FAFD] border-[#EDF1F7] shadow-2xs'
                }`}
                title="Account Menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#544bec] text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                  {(studentData?.name || 'S').charAt(0).toUpperCase()}
                </div>
                
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-black text-[#192038] truncate max-w-[110px]">
                    {studentData?.name || 'Student'}
                  </span>
                  <span className="text-[10px] text-[#544bec] font-mono font-bold">
                    {studentData?.studentId || 'STUDENT'}
                  </span>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-[#8F9BB3] transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180 text-[#544bec]' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EDF1F7] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Student Summary Header */}
                  <div className="px-4 py-3 border-b border-[#EDF1F7] bg-[#F8FAFD]">
                    <div className="text-xs font-black text-[#192038] truncate">
                      {studentData?.name || 'Student'}
                    </div>
                    <div className="text-[11px] text-[#6B778C] flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-bold text-[#544bec]">{studentData?.studentId || 'ID'}</span>
                      <span>•</span>
                      <span>{studentData?.phone || 'No phone'}</span>
                    </div>
                    <div className="text-[10px] text-[#8F9BB3] mt-1">
                      Seat: <strong className="text-[#192038]">{studentData?.seatNo ? `Seat #${studentData.seatNo}` : 'Unassigned'}</strong>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsChangePassOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#192038] hover:bg-[#EEF0FD] hover:text-[#544bec] rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <KeyRound size={15} className="text-[#544bec]" />
                      <span>Change Password</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        fetchStudentProfile();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <RefreshCw size={15} className="text-[#8F9BB3]" />
                      <span>Refresh Profile Data</span>
                    </button>
                  </div>

                  {/* Logout Option */}
                  <div className="border-t border-[#EDF1F7] pt-1 mt-1 p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        
      {/* Floating Toast Notification (Never shifts or disrupts layout) */}
      {feedbackMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto">
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-2xl backdrop-blur-md ${
              feedbackMsg.type === 'success'
                ? 'bg-white/95 border-[#544bec]/30 text-[#544bec] shadow-[#544bec]/20'
                : 'bg-white/95 border-rose-300 text-rose-600 shadow-rose-500/20'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${
                  feedbackMsg.type === 'success'
                    ? 'bg-[#EEF0FD] text-[#544bec]'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {feedbackMsg.type === 'success' ? '✔' : '⚠'}
              </span>
              <span className="truncate sm:whitespace-normal">{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-xs p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-slate-100 cursor-pointer shrink-0 transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}

        {/* ======================================================== */}
        {/* HERO SECTION: Responsive (Distinct Laptop vs Mobile)     */}
        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* HERO SECTION: Responsive (Distinct Laptop vs Mobile)     */}
        {/* ======================================================== */}
        {/* Laptop / Desktop Layout (Hidden on Mobile) */}
        <div className="hidden sm:block bg-white rounded-3xl border border-[#EDF1F7] p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#544bec] to-[#6d64f7] text-white text-3xl font-black flex items-center justify-center shadow-lg shadow-[#544bec]/25 shrink-0">
                  {(studentData?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                    isCheckedIn ? 'bg-[#544bec]' : 'bg-slate-300'
                  }`}
                  title={isCheckedIn ? 'Currently Checked In' : 'Checked Out'}
                >
                  <div className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-black tracking-tight text-[#192038] m-0">
                    {getGreeting()}, {studentData?.name || 'Student'} 👋
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#EEF0FD] border border-[#544bec]/30 text-[#544bec] font-mono font-black text-xs">
                    {studentData?.studentId || 'STU-ID'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      isDemo
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : isInactive
                        ? 'bg-slate-100 text-slate-700 border border-slate-300'
                        : isOverdue
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                        : isDueSoon
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isDemo
                      ? 'Demo Trial'
                      : isInactive
                      ? 'Membership Inactive'
                      : isOverdue
                      ? 'Fee Overdue'
                      : isDueSoon
                      ? 'Due Soon'
                      : 'Active Member'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#8F9BB3] mt-2 flex-wrap font-medium">
                  <span>📱 {studentData?.phone || 'No phone'}</span>
                  <span>•</span>
                  <span>🪑 Seat: <strong className="text-[#192038]">{studentData?.seatNo ? `Seat #${studentData.seatNo}` : 'Unassigned'}</strong></span>
                  <span>•</span>
                  <span>⏰ Shift: <strong className="text-[#192038]">{studentData?.shift || 'Full Day (24/7)'}</strong></span>
                </div>
              </div>
            </div>

            {/* Desktop Punch Action */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={handleTogglePunch}
                disabled={punchLoading}
                className={`py-3.5 px-6 rounded-2xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:-translate-y-0.5 ${
                  isPunchBlocked || isDailyLimitReached
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                    : isCheckedIn
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                    : 'bg-[#544bec] hover:bg-[#4338ca] text-white shadow-[#544bec]/30'
                }`}
              >
                {punchLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing Punch...</span>
                  </>
                ) : isPunchBlocked ? (
                  <>
                    <Lock size={16} className="text-slate-500" />
                    <span>Punch In / Out Locked (Inactive)</span>
                  </>
                ) : isDailyLimitReached ? (
                  <>
                    <Lock size={16} className="text-amber-500" />
                    <span>Daily Limit Reached (3/3 Used)</span>
                  </>
                ) : isCheckedIn ? (
                  <>
                    <LogOut size={16} />
                    <span>Punch Out of Library</span>
                  </>
                ) : (
                  <>
                    <CalendarCheck size={16} />
                    <span>Punch In to Library</span>
                  </>
                )}
              </button>

              <div className="text-[11px] font-medium text-right">
                {isPunchBlocked ? (
                  <span className="text-slate-600 font-bold flex items-center gap-1.5 justify-end">
                    <span>Locked: Account is inactive</span>
                    <span>•</span>
                    <span>Admin Helpline: <a href={`tel:${adminPhone}`} className="underline hover:text-slate-800">{adminPhone}</a></span>
                  </span>
                ) : isDailyLimitReached ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1.5 justify-end">
                    <span>Daily limit reached (Maximum 3 check-ins per day)</span>
                  </span>
                ) : isCheckedIn ? (
                  <span className="text-[#544bec] font-bold flex items-center gap-1.5 justify-end">
                    <span className="w-2 h-2 rounded-full bg-[#544bec] animate-ping" />
                    Checked in {formatLiveCheckInTime(checkInTime)}
                  </span>
                ) : (
                  <span className="text-[#8F9BB3]">Currently checked out</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE SECTION (Dribbble Inspired Native App Experience) */}
        {/* ======================================================== */}
        <div className="sm:hidden space-y-3.5">
          {/* 1. Primary Emerald App Header (Flat bottom, no rounded bottom corners) */}
          <div className="bg-gradient-to-br from-[#544bec] via-[#483ed8] to-[#3730a3] text-white -mx-3.5 -mt-4 px-4 pt-4 pb-10 shadow-md relative overflow-hidden">
            {/* Ambient Background Circles */}
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

            {/* Top Bar: Title + Quick Actions */}
            <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight m-0 leading-tight">
                  Dashboard
                </h2>
                <span className="text-[10px] text-emerald-100 font-semibold tracking-wide">
                  Vidya Library Student Portal
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchStudentProfile}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs border border-white/20"
                  title="Refresh"
                >
                  <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangePassOpen(true)}
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs border border-white/20"
                  title="Change Password"
                >
                  <KeyRound size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-rose-500/80 active:bg-rose-600 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title="Log Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>

            {/* User Greeting Row */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-white/50 bg-white text-[#544bec] font-black text-lg flex items-center justify-center shadow-md shadow-black/20">
                  {(studentData?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#483ed8] flex items-center justify-center ${
                    isCheckedIn ? 'bg-white' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isCheckedIn ? 'bg-[#544bec] animate-pulse' : 'bg-slate-500'}`} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-base font-black text-white m-0 truncate tracking-tight">
                  Hello, {studentData?.name || 'Student'} 👋
                </h1>
                <p className="text-[11px] text-emerald-50 font-medium m-0 mt-0.5 truncate">
                  {getGreeting()} • ID #{cleanStudentId}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Overlapping Floating Overview Card (Dribbble Overview Card) */}
          <div className="-mt-7 bg-white rounded-2xl border border-[#EDF1F7] shadow-xl shadow-slate-900/5 p-3.5 relative z-20">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#EDF1F7]/80">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#192038] tracking-tight">
                  Overview
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#544bec]"></span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/student/attendance')}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#544bec] hover:text-[#4338ca] active:text-[#007454] transition-colors cursor-pointer"
              >
                <span>Attendance Logs</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
              {/* Col 1: Status */}
              <div className="px-1.5">
                <div className="w-7 h-7 mx-auto rounded-full bg-[#EEF0FD] text-[#544bec] flex items-center justify-center mb-1">
                  <CheckCircle2 size={13} />
                </div>
                <div className="text-xs font-black text-[#192038] flex items-center justify-center gap-1 truncate">
                  {isCheckedIn ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#544bec] animate-ping shrink-0" />
                      <span>Inside</span>
                    </>
                  ) : (
                    <span>Outside</span>
                  )}
                </div>
                <div className="text-[10px] text-[#8F9BB3] font-medium mt-0.5">
                  Status
                </div>
              </div>

              {/* Col 2: Total Hours */}
              <div className="px-1.5">
                <div className="w-7 h-7 mx-auto rounded-full bg-[#EEF0FD] text-[#544bec] flex items-center justify-center mb-1">
                  <Clock size={13} />
                </div>
                <div className="text-xs font-black text-[#192038] font-mono truncate">
                  {todayTotalDuration}
                </div>
                <div className="text-[10px] text-[#8F9BB3] font-medium mt-0.5">
                  Total Hours
                </div>
              </div>

              {/* Col 3: Seat No */}
              <div className="px-1.5">
                <div className="w-7 h-7 mx-auto rounded-full bg-[#EEF0FD] text-[#544bec] flex items-center justify-center mb-1">
                  <Armchair size={13} />
                </div>
                <div className="text-xs font-black text-[#192038] truncate">
                  {!isInactive && studentData?.seatNo && studentData.seatNo !== '-'
                    ? `Seat #${studentData.seatNo}`
                    : 'No Seat'}
                </div>
                <div className="text-[10px] text-[#8F9BB3] font-medium mt-0.5">
                  Desk
                </div>
              </div>
            </div>
          </div>

          {/* 3. Highlight Attendance Punch Card (Primary Color Styled) */}
          <div className="bg-gradient-to-br from-[#EEF0FD] via-[#F5F6FE] to-[#FFFFFF] border border-[#544bec]/25 rounded-2xl p-4 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-black tracking-widest text-[#544bec] uppercase">
                  Welcome
                </span>
                <h3 className="text-sm font-black text-[#192038] leading-tight m-0 mt-0.5">
                  Let's Get Start Today
                </h3>
                <p className="text-[11px] text-[#6B778C] font-medium m-0 mt-0.5">
                  Flexible Library Attendance Tracking
                </p>

                <div className="mt-3 space-y-0.5">
                  <div className="text-[11px] font-black text-[#192038]">
                    Last Punch: <span className="text-[#544bec] font-mono">{lastPunch.time}</span>
                  </div>
                  <div className="text-[10px] text-[#8F9BB3] font-medium">
                    {lastPunch.date}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/student/attendance')}
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#544bec] hover:text-[#4338ca] active:text-[#007454] pt-1 cursor-pointer transition-colors"
                  >
                    <span>View Attendance History</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>

              {/* Right Action Button (Squircle thumb-friendly) */}
              <div className="shrink-0 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleTogglePunch}
                  disabled={punchLoading}
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    isPunchBlocked || isDailyLimitReached
                      ? 'bg-slate-200 text-slate-600 border border-slate-300'
                      : isCheckedIn
                      ? 'bg-gradient-to-tr from-rose-500 to-rose-600 text-white shadow-rose-500/30 hover:shadow-rose-500/40'
                      : 'bg-gradient-to-tr from-[#544bec] to-[#6d64f7] text-white shadow-[#544bec]/30 hover:shadow-[#544bec]/40'
                  }`}
                >
                  {punchLoading ? (
                    <>
                      <RefreshCw size={20} className="animate-spin text-white" />
                      <span className="text-[10px] font-bold">Wait...</span>
                    </>
                  ) : isPunchBlocked ? (
                    <>
                      <Lock size={20} className="text-slate-500" />
                      <span className="text-[10px] font-bold">Locked</span>
                    </>
                  ) : isDailyLimitReached ? (
                    <>
                      <Lock size={20} className="text-amber-600" />
                      <span className="text-[9px] font-bold text-center leading-tight">Limit 3/3</span>
                    </>
                  ) : isCheckedIn ? (
                    <>
                      <LogOut size={22} className="text-white" />
                      <span className="text-[10px] font-black tracking-tight">Punch Out</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={22} className="text-white" />
                      <span className="text-[10px] font-black tracking-tight">Punch In</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom status alert / helpline */}
            <div className="mt-3 pt-2.5 border-t border-[#544bec]/20 text-[10px] font-medium">
              {isPunchBlocked ? (
                <span className="text-slate-600 font-bold block text-center">
                  Locked: Account is inactive • Admin Helpline: <a href={`tel:${adminPhone}`} className="underline hover:text-slate-800 text-[#544bec]">{adminPhone}</a>
                </span>
              ) : isDailyLimitReached ? (
                <span className="text-amber-700 font-bold block text-center">
                  Daily limit reached (Maximum 3 check-ins per day)
                </span>
              ) : isCheckedIn ? (
                <span className="text-[#544bec] font-bold flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#544bec] animate-ping" />
                  Live Checked In • Since {formatDisplayTime(checkInTime)}
                </span>
              ) : (
                <span className="text-[#6B778C] block text-center">
                  Tap button to mark arrival in the library
                </span>
              )}
            </div>
          </div>
        </div>



        {/* ======================================================== */}
        {/* PAYMENT HISTORY & RECEIPTS: with 1-click Download Slip   */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EDF1F7] p-4 sm:p-6 shadow-xs">
          
          <div className="flex items-center justify-between mb-3.5 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-[#544bec] flex items-center justify-center shrink-0">
                <CreditCard size={16} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#192038] m-0">
                  Fee Payments & Receipts
                </h2>
                <p className="text-[10px] sm:text-[11px] text-[#8F9BB3] m-0 hidden sm:block">
                  View and download official fee receipts
                </p>
              </div>
            </div>

            <span className="text-[11px] text-[#8F9BB3] font-bold bg-[#F8FAFD] px-2.5 py-1 rounded-lg border border-[#EDF1F7]">
              {paymentRecords.length} Receipts
            </span>
          </div>

          {paymentRecords.length > 0 ? (
            <>
              {/* Desktop Receipts Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EDF1F7] text-[#8F9BB3]">
                      <th className="pb-3 font-bold">Receipt #</th>
                      <th className="pb-3 font-bold">Date</th>
                      <th className="pb-3 font-bold">Plan</th>
                      <th className="pb-3 font-bold">Mode</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold text-right">Receipt Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF1F7]">
                    {paginatedPayments.map((pay: any, idx: number) => (
                      <tr key={pay.id || idx} className="hover:bg-[#F8FAFD] transition-colors">
                        <td className="py-3 font-mono font-bold text-[#544bec]">
                          {pay.receiptNo || `REC-${idx + 1}`}
                        </td>
                        <td className="py-3 text-[#192038] font-semibold">{formatDisplayDate(pay.date)}</td>
                        <td className="py-3 text-[#6B778C]">{pay.plan || 'Monthly Fee'}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md bg-[#F1F4F9] text-[#192038] font-bold text-[10px]">
                            {pay.mode || 'Cash'}
                          </span>
                        </td>
                        <td className="py-3 font-black text-[#192038] text-sm">
                          ₹{pay.amount}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleOpenReceipt(pay)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EEF0FD] text-[#544bec] hover:bg-[#544bec] hover:text-white transition-all cursor-pointer shadow-2xs"
                            title="View & Download Slip"
                          >
                            <Download size={13} />
                            <span>Download Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Receipts Card View */}
              <div className="sm:hidden space-y-2.5">
                {paginatedPayments.map((pay: any, idx: number) => (
                  <div
                    key={pay.id || idx}
                    className="p-3.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-black text-xs text-[#544bec] block">
                          {pay.receiptNo || `REC-${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-[#8F9BB3]">
                          {formatDisplayDate(pay.date)} • {pay.mode || 'Cash'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-[#192038] block">
                          ₹{pay.amount}
                        </span>
                        <span className="text-[10px] text-[#544bec] font-bold">Paid</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenReceipt(pay)}
                      className="w-full py-2 px-3 rounded-lg bg-[#EEF0FD] text-[#544bec] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors active:bg-[#544bec] active:text-white cursor-pointer"
                    >
                      <Download size={13} />
                      <span>View & Download Receipt Slip</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Payments Pagination Controls */}
              {totalPaymentPages > 1 && (
                <div className="mt-4 pt-3 border-t border-[#EDF1F7] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#8F9BB3] font-medium">
                    Page <strong className="text-[#192038]">{paymentPage}</strong> of{' '}
                    <strong className="text-[#192038]">{totalPaymentPages}</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                      disabled={paymentPage <= 1}
                      className="px-2.5 py-1.5 rounded-lg border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={13} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    <button
                      onClick={() => setPaymentPage((p) => Math.min(totalPaymentPages, p + 1))}
                      disabled={paymentPage >= totalPaymentPages}
                      className="px-2.5 py-1.5 rounded-lg border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-7 text-xs text-[#8F9BB3] border border-dashed border-[#EDF1F7] rounded-xl">
              No fee payment records found. Contact administration for receipt queries.
            </div>
          )}
        </div>

        {/* Support & Amenities Card */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#192038] to-[#252E4E] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#6d64f7] text-xs font-black">
              <Sparkles size={15} />
              <span>Vidya Library Facilities & Support</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white m-0">
              Need assistance or locker access?
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 m-0">
              High-Speed Wi-Fi • Silent AC Zone • RO Mineral Water • CCTV Security
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${adminPhone}`}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Phone size={14} />
              <span>Call Admin ({adminPhone})</span>
            </a>
          </div>
        </div>

        {/* Sleek App Footer */}
        <footer className="pt-2 pb-6 text-center space-y-1">
          <div className="text-[11px] font-bold text-[#8F9BB3] flex items-center justify-center gap-1.5 flex-wrap">
            <span className="font-black text-[#192038]">Vidya Library</span>
            <span>•</span>
            <span>Silent AC Study Zone</span>
            <span>•</span>
            <span>Gayatri Nagar, Gwalior</span>
          </div>
          <p className="text-[10px] text-[#A0AEC0] m-0">
            Student Portal • Need help? Call Admin at {adminPhone}
          </p>
        </footer>

      </main>

      {/* Mobile Bottom Navigation Bar (Docked to bottom on mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EDF1F7] px-6 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-[#544bec] font-black cursor-pointer py-1"
        >
          <BookOpen size={18} />
          <span className="text-[10px] font-black">Dashboard</span>
        </button>

        <button
          onClick={() => navigate('/student/attendance')}
          className="flex flex-col items-center gap-1 text-[#8F9BB3] hover:text-[#544bec] cursor-pointer py-1"
        >
          <CalendarCheck size={18} />
          <span className="text-[10px] font-bold">Attendance</span>
        </button>

        <a
          href={`tel:${adminPhone}`}
          className="flex flex-col items-center gap-1 text-[#8F9BB3] hover:text-[#544bec] cursor-pointer py-1"
        >
          <Phone size={18} />
          <span className="text-[10px] font-bold">Call Admin</span>
        </a>
      </nav>

      {/* ======================================================== */}
      {/* MODAL 1: CHANGE PASSWORD MODAL                            */}
      {/* ======================================================== */}
      {isChangePassOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsChangePassOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl border border-[#EDF1F7] shadow-2xl p-6 sm:p-7 relative transition-all animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setIsChangePassOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-[#8F9BB3] hover:text-[#192038] hover:bg-[#F8FAFD] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EEF0FD] text-[#544bec] mb-2.5 border border-[#544bec]/20 shadow-xs">
                <KeyRound size={24} />
              </div>
              <h2 className="text-lg font-black text-[#192038] m-0">
                Change Your Password
              </h2>
              <p className="text-xs text-[#8F9BB3] mt-1 m-0">
                Set a personal password for your student dashboard
              </p>
            </div>

            {/* Error Message */}
            {passError && (
              <div className="bg-rose-50 text-rose-600 border border-rose-200 rounded-xl p-3 mb-4 text-xs flex items-center gap-2 font-semibold">
                <span>⚠</span>
                <span>{passError}</span>
              </div>
            )}

            {/* Change Password Form */}
            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-[#192038] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 pr-10 py-2.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurPass(!showCurPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F9BB3] hover:text-[#192038] cursor-pointer"
                  >
                    {showCurPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#192038] mb-1">
                  New Password (Min 4 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 pr-10 py-2.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F9BB3] hover:text-[#192038] cursor-pointer"
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-[#192038] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePassOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EDF1F7] bg-white text-xs font-bold text-[#6B778C] hover:bg-[#F8FAFD] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="flex-1 py-2.5 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white text-xs font-black shadow-md shadow-[#544bec]/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isChangingPass ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save Password</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: OFFICIAL FEE RECEIPT DOWNLOAD & PRINT MODAL      */}
      {/* ======================================================== */}
      {isReceiptModalOpen && selectedReceipt && (
        <FeeReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
          settings={{
            libraryName: 'Vidya Library',
            address: '66W8+4FH, Gayatri Nagar, Gwalior, Madhya Pradesh 474005',
            phone: adminPhone || '+91 9685912333'
          }}
        />
      )}

    </div>
  );
};
