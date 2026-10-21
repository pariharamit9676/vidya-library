import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  IndianRupee,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Check,
  Armchair,
  FileText
} from 'lucide-react';
import { formatDisplayDate, addMonthsFormatted, computeStudentStatus } from '../../utils/dateFormatter';
import { useLibrary } from '../../context/LibraryContext';
import { calculateMultiMonthFee } from '../../utils/discountUtils';
import { useSeatLayout, useCategories } from '../../services/useLibraryQueries';
import { SeatGridCell, SeatCategory } from '../../types/seatManagement';
import { initialSeatCells } from '../../data/mockSeatsLayoutData';

export interface CollectFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: any[];
  preSelectedStudent?: any;
  onRecordPayment: (payload: {
    studentId: string;
    studentName: string;
    amount: number;
    mode: string;
    plan: string;
    newDueDate: string;
    dueAmount: number;
    balanceDueDate: string;
    seatNo: string;
    seatCategory: string;
    reference?: string;
    notes?: string;
  }) => Promise<void> | void;
}

const SEAT_RATES: Record<string, number> = {
  Premium: 800,
  Locker: 700,
  Normal: 600
};

const getFutureDateInput = (days: number = 3, baseDate: string = ''): string => {
  const d = baseDate ? new Date(baseDate) : new Date();
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
};

const getTodayInput = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const CollectFeeModal: React.FC<CollectFeeModalProps> = ({
  isOpen,
  onClose,
  students,
  preSelectedStudent,
  onRecordPayment
}) => {
  if (!isOpen) return null;

  const regularStudents = useMemo(() => {
    const list = (Array.isArray(students) ? students : []).filter(
      (s) => s.studentType !== 'Demo' && s.status !== 'Demo'
    );
    if (preSelectedStudent && (preSelectedStudent.studentType === 'Demo' || preSelectedStudent.status === 'Demo')) {
      const alreadyIn = list.some(x => x.id === preSelectedStudent.id || x._id === preSelectedStudent._id);
      if (!alreadyIn) {
        list.unshift(preSelectedStudent);
      }
    }
    return list;
  }, [students, preSelectedStudent]);

  // Selected Student ID
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (preSelectedStudent) {
      return preSelectedStudent.id || preSelectedStudent._id || '';
    }
    return regularStudents[0]?.id || regularStudents[0]?._id || '';
  });

  // Sync selectedStudentId when preSelectedStudent changes
  useEffect(() => {
    if (preSelectedStudent) {
      const targetId = preSelectedStudent.id || preSelectedStudent._id || '';
      if (targetId) {
        setSelectedStudentId(targetId);
      }
    } else if (regularStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(regularStudents[0]?.id || regularStudents[0]?._id || '');
    }
  }, [preSelectedStudent, isOpen, regularStudents]);

  // Current active student
  const currentStudent = useMemo(() => {
    if (preSelectedStudent && (preSelectedStudent.id === selectedStudentId || preSelectedStudent._id === selectedStudentId)) {
      return preSelectedStudent;
    }
    return (
      regularStudents.find((s) => s.id === selectedStudentId || s._id === selectedStudentId) ||
      preSelectedStudent ||
      regularStudents[0] ||
      null
    );
  }, [regularStudents, selectedStudentId, preSelectedStudent]);

  const { settings } = useLibrary();
  const multiMonthDiscounts = settings?.multiMonthDiscounts || [];

  // Live queries for seat layout & categories from Seat Management
  const { data: serverLayout } = useSeatLayout();
  const { data: serverCategories } = useCategories();

  // Dynamic pricing loaded from Seat Management / Database
  const categoryRates = useMemo<Record<string, number>>(() => {
    const cats = serverCategories as Record<string, any> | undefined;
    return {
      Normal: Number(cats?.Normal?.rate) || 600,
      Locker: Number(cats?.Locker?.rate) || 650,
      Premium: Number(cats?.Premium?.rate) || 800
    };
  }, [serverCategories]);

  // Load actual layout cells from server or localStorage or mock
  const layoutCells = useMemo<SeatGridCell[]>(() => {
    const layout = serverLayout as { cells?: SeatGridCell[] } | undefined;
    if (layout && Array.isArray(layout.cells) && layout.cells.length > 0) {
      return layout.cells;
    }
    try {
      const stored = localStorage.getItem('viya_library_seat_layout');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialSeatCells;
  }, [serverLayout]);

  const isInactiveStudent = useMemo(() => {
    if (!currentStudent) return false;
    return currentStudent.status === 'Inactive' || computeStudentStatus(currentStudent) === 'Inactive';
  }, [currentStudent]);

  const studentHasSeat = Boolean(
    !isInactiveStudent &&
    currentStudent?.seatNo &&
    currentStudent.seatNo !== '-' &&
    currentStudent.seatNo !== 'None' &&
    currentStudent.seatNo !== 'Unassigned'
  );

  // Category selection (Normal, Locker, Premium)
  const [selectedCategory, setSelectedCategory] = useState<SeatCategory>(() => {
    const raw = (currentStudent?.seatCategory || currentStudent?.category || 'Normal') as SeatCategory;
    return (raw === 'Normal' || raw === 'Locker' || raw === 'Premium') ? raw : 'Normal';
  });

  // Filter tab for browsing available seats: 'All' | 'Normal' | 'Locker' | 'Premium'
  const [categoryFilter, setCategoryFilter] = useState<'All' | SeatCategory>('Normal');

  // Seat number selection
  const [selectedSeatNo, setSelectedSeatNo] = useState<string>(() => {
    return studentHasSeat && currentStudent?.seatNo ? String(currentStudent.seatNo) : '';
  });

  // Mode for changing/assigning seat
  const [isChangingSeat, setIsChangingSeat] = useState<boolean>(!studentHasSeat);

  // Sync state on student change
  useEffect(() => {
    if (currentStudent) {
      const isInactive = currentStudent.status === 'Inactive' || computeStudentStatus(currentStudent) === 'Inactive';
      const hasSeat = !isInactive && Boolean(currentStudent.seatNo && currentStudent.seatNo !== '-' && currentStudent.seatNo !== 'None');
      const rawCat = (currentStudent.seatCategory || currentStudent.category || 'Normal') as SeatCategory;
      const validCat = (rawCat === 'Normal' || rawCat === 'Locker' || rawCat === 'Premium') ? rawCat : 'Normal';
      setSelectedCategory(validCat);
      setCategoryFilter(validCat);
      setSelectedSeatNo(hasSeat ? String(currentStudent.seatNo) : '');
      setIsChangingSeat(!hasSeat);
    }
  }, [currentStudent]);

  // All unoccupied / available seats across the entire library
  const allAvailableSeats = useMemo(() => {
    const occupiedByOthers = new Set(
      regularStudents
        .filter(
          (s) =>
            (s.id !== currentStudent?.id && s.studentId !== currentStudent?.studentId) &&
            s.seatNo &&
            s.seatNo !== '-' &&
            s.seatNo !== 'None' &&
            s.seatNo !== 'Unassigned'
        )
        .map((s) => String(s.seatNo).trim())
    );

    const list: Array<{ seatNumber: number; category: SeatCategory; rate: number }> = [];

    layoutCells.forEach((cell) => {
      if (!cell.isSeat || cell.seatNumber === null) return;
      if (cell.status === 'Maintenance') return;

      const seatStr = String(cell.seatNumber);
      const isCurrentStudentSeat =
        currentStudent &&
        !isInactiveStudent &&
        (String(currentStudent.seatNo) === seatStr ||
          cell.assignedStudent?.id === currentStudent.id ||
          cell.assignedStudent?.studentId === currentStudent.studentId);

      if (!isCurrentStudentSeat) {
        if (cell.status === 'Occupied' || (cell.assignedStudent && cell.assignedStudent.name)) {
          return;
        }
        if (occupiedByOthers.has(seatStr)) {
          return;
        }
      }

      const cat = (cell.category === 'Locker' || cell.category === 'Premium') ? cell.category : 'Normal';
      const rate = categoryRates[cat] || 600;

      list.push({
        seatNumber: Number(cell.seatNumber),
        category: cat,
        rate
      });
    });

    return list.sort((a, b) => a.seatNumber - b.seatNumber);
  }, [layoutCells, regularStudents, currentStudent, categoryRates, isInactiveStudent]);

  // Count of available seats by category
  const seatCounts = useMemo(() => ({
    All: allAvailableSeats.length,
    Normal: allAvailableSeats.filter((s) => s.category === 'Normal').length,
    Locker: allAvailableSeats.filter((s) => s.category === 'Locker').length,
    Premium: allAvailableSeats.filter((s) => s.category === 'Premium').length
  }), [allAvailableSeats]);

  // Filtered available seats according to active category tab
  const filteredAvailableSeats = useMemo(() => {
    if (categoryFilter === 'All') return allAvailableSeats;
    return allAvailableSeats.filter((s) => s.category === categoryFilter);
  }, [allAvailableSeats, categoryFilter]);

  const monthlyRate = categoryRates[selectedCategory] || 600;
  const existingPendingDue = Number(currentStudent?.dueAmount || 0);

  // Tab: Clear Due vs Renew
  const [activeTab, setActiveTab] = useState<'clear_due' | 'renew'>(
    existingPendingDue > 0 ? 'clear_due' : 'renew'
  );

  const [durationMonths, setDurationMonths] = useState<number>(1);
  const discountCalculation = useMemo(() => {
    return calculateMultiMonthFee(durationMonths, monthlyRate, multiMonthDiscounts);
  }, [durationMonths, monthlyRate, multiMonthDiscounts]);

  const effectivePlanExpected = discountCalculation.finalTotal;

  const [amountReceived, setAmountReceived] = useState<number>(
    existingPendingDue > 0 ? existingPendingDue : effectivePlanExpected
  );
  const [paymentDate, setPaymentDate] = useState<string>(getTodayInput());
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [balanceDueDate, setBalanceDueDate] = useState<string>(() => getFutureDateInput(3));
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDueWaived, setIsDueWaived] = useState<boolean>(false);

  // Sync on student change
  useEffect(() => {
    setIsDueWaived(false);
    if (currentStudent) {
      const isInactive = currentStudent.status === 'Inactive' || computeStudentStatus(currentStudent) === 'Inactive';
      const studentDue = Number(currentStudent.dueAmount || 0);

      // Inactive students start fresh renewal from payment date!
      if (studentDue > 0 && !isInactive) {
        setActiveTab('clear_due');
        setAmountReceived(studentDue);
      } else {
        setActiveTab('renew');
        const defaultRate = categoryRates[selectedCategory] || 600;
        const calc = calculateMultiMonthFee(durationMonths, defaultRate, multiMonthDiscounts);
        setAmountReceived(calc.finalTotal);
      }
    }
  }, [currentStudent, isInactiveStudent, selectedCategory, selectedSeatNo, durationMonths, categoryRates]);

  const handleTabSwitch = (tab: 'clear_due' | 'renew') => {
    setActiveTab(tab);
    setIsDueWaived(false);
    if (tab === 'clear_due') {
      setAmountReceived(existingPendingDue);
    } else {
      const calc = calculateMultiMonthFee(durationMonths, monthlyRate, multiMonthDiscounts);
      setAmountReceived(calc.finalTotal);
    }
  };

  const handleDurationChange = (newMonths: number) => {
    const safe = Math.max(1, Math.min(24, newMonths));
    setDurationMonths(safe);
    setIsDueWaived(false);
    const calc = calculateMultiMonthFee(safe, monthlyRate, multiMonthDiscounts);
    setAmountReceived(calc.finalTotal);
  };

  const [customDueDate, setCustomDueDate] = useState<string>('');
  const [isManualDueDate, setIsManualDueDate] = useState<boolean>(false);

  const autoNextDueDate = useMemo(() => {
    if (!currentStudent) return '';
    const payDate = new Date(paymentDate || Date.now());
    payDate.setHours(0, 0, 0, 0);

    // 1. If student is Inactive, cycle MUST start from payment date (today / date paid)!
    // Because they were not attending/using the seat during their inactive period.
    if (isInactiveStudent) {
      return addMonthsFormatted(payDate, durationMonths);
    }

    // 2. If just clearing pending balance (not advancing subscription cycle)
    if (activeTab === 'clear_due') {
      return formatDisplayDate(currentStudent.nextDueDate || currentStudent.nextFeeDueDate);
    }

    // 3. For Active / Overdue / Due student:
    // ALWAYS preserve their billing cycle! Extend from their existing due date, NOT from today's payment date.
    // E.g. If due on 09 Oct, and paying on 18 Oct, 1 month fee extends to 09 Nov (not 18 Nov).
    const currentDueDate = currentStudent.nextDueDate || currentStudent.nextFeeDueDate;
    let baseDate: Date | string = payDate;

    if (currentDueDate) {
      const parsedDue = new Date(currentDueDate);
      if (!isNaN(parsedDue.getTime())) {
        baseDate = parsedDue;
      }
    } else if (currentStudent.admissionDate) {
      const parsedAdmission = new Date(currentStudent.admissionDate);
      if (!isNaN(parsedAdmission.getTime())) {
        baseDate = parsedAdmission;
      }
    }

    return addMonthsFormatted(baseDate, durationMonths);
  }, [currentStudent, activeTab, durationMonths, paymentDate, isInactiveStudent]);

  // Sync customDueDate with autoNextDueDate unless user explicitly edited it
  useEffect(() => {
    if (!isManualDueDate) {
      setCustomDueDate(autoNextDueDate);
    }
  }, [autoNextDueDate, isManualDueDate]);

  // Reset manual edit flag, waived due, and notes whenever a different student is selected or modal opens
  useEffect(() => {
    setIsManualDueDate(false);
    setIsDueWaived(false);
    setNotes('');
  }, [selectedStudentId, isOpen]);

  const effectiveNextDueDate = isManualDueDate && customDueDate.trim() ? customDueDate.trim() : autoNextDueDate;
  const computedNextDueDate = effectiveNextDueDate;

  const remainingDue = useMemo(() => {
    if (activeTab === 'clear_due') {
      return Math.max(0, existingPendingDue - Number(amountReceived || 0));
    }
    return Math.max(0, effectivePlanExpected - Number(amountReceived || 0));
  }, [activeTab, existingPendingDue, effectivePlanExpected, amountReceived]);

  const isPartialPayment = remainingDue > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || Number(amountReceived) <= 0 || isSubmitting) return;

    if (!selectedSeatNo && (!currentStudent.seatNo || currentStudent.seatNo === '-')) {
      alert('Please select a seat for this student.');
      return;
    }

    setIsSubmitting(true);
    try {
      const planName = activeTab === 'clear_due'
        ? `Balance Settle (₹${amountReceived})`
        : durationMonths === 1
        ? 'Monthly'
        : discountCalculation.hasDiscount
        ? `${durationMonths} Months (${discountCalculation.savingsText})`
        : `${durationMonths} Months`;

      const finalDueAmount = isDueWaived ? 0 : remainingDue;
      const finalBalanceDueDate = (!isDueWaived && isPartialPayment) ? formatDisplayDate(balanceDueDate) : '';

      await onRecordPayment({
        studentId: currentStudent.id || currentStudent._id,
        studentName: currentStudent.name,
        amount: Number(amountReceived),
        mode: paymentMode,
        plan: planName,
        newDueDate: effectiveNextDueDate,
        dueAmount: finalDueAmount,
        balanceDueDate: finalBalanceDueDate,
        seatNo: selectedSeatNo || currentStudent.seatNo || '-',
        seatCategory: selectedCategory,
        reference: transactionRef.trim() || undefined,
        notes: isDueWaived && remainingDue > 0
          ? `${notes.trim() ? notes.trim() + ' | ' : ''}Remaining ₹${remainingDue} due waived by admin`
          : notes.trim() || undefined
      });

      onClose();
    } catch (err) {
      console.error('Error submitting payment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl border border-[#EDF1F7] shadow-2xl overflow-hidden max-w-lg w-full flex flex-col max-h-[92vh] sm:max-h-[86vh] animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle Drag Indicator */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#EDF1F7] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/80 flex items-center justify-center shadow-2xs shrink-0">
              <IndianRupee size={16} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-[#192038] m-0 leading-tight truncate">
                Collect Student Fee
              </h3>
              <p className="text-[11px] text-[#8F9BB3] m-0 truncate">
                Record fee payment & extend renewal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8F9BB3] hover:text-[#192038] hover:bg-[#F7F9FC] transition-all cursor-pointer shrink-0 ml-2"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* 1. Student Info Card */}
          <div className="p-3 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {(currentStudent?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-[#192038] capitalize truncate">
                      {currentStudent?.name || 'Select Student'}
                    </span>
                    {currentStudent?.studentId && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-white border border-[#EDF1F7] text-[#6B778C]">
                        {currentStudent.studentId}
                      </span>
                    )}
                    {isInactiveStudent && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700">
                        Inactive / Returning
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8F9BB3] mt-0.5 truncate">
                    Seat:{' '}
                    <strong className={selectedSeatNo ? 'text-[#192038]' : studentHasSeat ? 'text-[#192038]' : 'text-amber-700'}>
                      {selectedSeatNo ? `#${selectedSeatNo} (${selectedCategory})` : studentHasSeat ? `#${currentStudent?.seatNo} (${selectedCategory})` : 'Unassigned (Assign Below)'}
                    </strong>{' '}
                    • Plan: ₹{monthlyRate}/mo
                  </div>
                </div>
              </div>

              {existingPendingDue > 0 && (
                <div className="px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold shrink-0">
                  Due: ₹{existingPendingDue}
                </div>
              )}
            </div>
          </div>

          {/* 1.1 SEAT & CATEGORY ASSIGNMENT SECTION */}
          <div className="p-3 bg-white border border-[#EDF1F7] rounded-xl space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Armchair size={15} className="text-slate-600" />
                <span className="text-xs font-black text-[#192038]">
                  {studentHasSeat && !isChangingSeat ? 'Assigned Seat' : 'Assign Seat & Category'}
                </span>
                {!studentHasSeat && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 border border-amber-200 text-amber-700">
                    Seat Required
                  </span>
                )}
              </div>

              {studentHasSeat && (
                <button
                  type="button"
                  onClick={() => setIsChangingSeat(!isChangingSeat)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  {isChangingSeat ? 'Keep Current Seat' : 'Change Seat'}
                </button>
              )}
            </div>

            {/* If student already has a seat and not changing: simple summary */}
            {studentHasSeat && !isChangingSeat ? (
              <div className="flex items-center justify-between p-2.5 bg-[#F8FAFD] rounded-lg border border-[#EDF1F7] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-black flex items-center justify-center text-xs">
                    #{currentStudent?.seatNo}
                  </div>
                  <div>
                    <span className="font-extrabold text-[#192038] block leading-tight">
                      Seat #{currentStudent?.seatNo}
                    </span>
                    <span className="text-[11px] text-[#8F9BB3] block leading-tight">
                      {selectedCategory} Category
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-[#192038] text-xs block">
                    ₹{monthlyRate}/month
                  </span>
                </div>
              </div>
            ) : (
              /* If unassigned or changing seat: full interactive seat selection */
              <div className="space-y-2.5">
                {!studentHasSeat && (
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 leading-tight">
                    <strong>Notice:</strong> This student was previously inactive, and their seat was unassigned. Please choose an unoccupied seat below. The monthly fee will adjust automatically according to the selected seat.
                  </div>
                )}

                {/* Category Filter Tabs */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#8F9BB3]">
                      Filter by Seat Category
                    </label>
                    <span className="text-[10px] text-[#8F9BB3] font-semibold">
                      {allAvailableSeats.length} Total Free Seats
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                    {(['All', 'Normal', 'Locker', 'Premium'] as const).map((tab) => {
                      const isSelected = categoryFilter === tab;
                      const count = seatCounts[tab] || 0;
                      const rate = tab !== 'All' ? categoryRates[tab] : null;

                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(tab);
                            if (tab !== 'All') {
                              setSelectedCategory(tab);
                              if (selectedSeatNo) {
                                const currentSeatObj = allAvailableSeats.find((s) => String(s.seatNumber) === selectedSeatNo);
                                if (currentSeatObj && currentSeatObj.category !== tab) {
                                  setSelectedSeatNo('');
                                }
                              }
                              const newRate = categoryRates[tab] || 600;
                              const newCalc = calculateMultiMonthFee(durationMonths, newRate, multiMonthDiscounts);
                              setAmountReceived(newCalc.finalTotal);
                            }
                          }}
                          className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#544bec] bg-[#544bec] text-white shadow-2xs'
                              : 'border-[#EDF1F7] bg-[#F8FAFD] text-[#6B778C] hover:bg-white'
                          }`}
                        >
                          <span className="block text-[11px] font-black truncate">{tab}</span>
                          <span className={`block text-[10px] font-bold ${isSelected ? 'text-emerald-100' : 'text-[#192038]'}`}>
                            {rate ? `₹${rate}` : `${count} free`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seat Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-[#8F9BB3] block mb-1">
                    Available Seats ({filteredAvailableSeats.length} available) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedSeatNo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedSeatNo(val);
                      if (val) {
                        const chosen = allAvailableSeats.find((s) => String(s.seatNumber) === val);
                        if (chosen) {
                          setSelectedCategory(chosen.category);
                          const newRate = categoryRates[chosen.category] || 600;
                          const newCalc = calculateMultiMonthFee(durationMonths, newRate, multiMonthDiscounts);
                          setAmountReceived(newCalc.finalTotal);
                        }
                      }
                    }}
                    className="w-full px-2.5 py-2 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">
                      {filteredAvailableSeats.length > 0
                        ? `-- Select Seat (${filteredAvailableSeats.length} available in ${categoryFilter === 'All' ? 'Library' : categoryFilter}) --`
                        : `No available seats in ${categoryFilter}`}
                    </option>
                    {filteredAvailableSeats.map((s) => (
                      <option key={s.seatNumber} value={s.seatNumber}>
                        Seat #{s.seatNumber} — {s.category} (₹{s.rate}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Seat Confirmation Feedback */}
                {selectedSeatNo && (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={15} className="text-slate-700 shrink-0" />
                      <span className="font-bold text-[#192038]">
                        Assigned Seat <strong className="text-slate-900">#{selectedSeatNo}</strong> ({selectedCategory})
                      </span>
                    </div>
                    <span className="font-black text-[#192038]">₹{monthlyRate}/mo</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Sleek Segmented Switch when Student Has Pending Due */}
          {existingPendingDue > 0 && (
            <div className="grid grid-cols-2 p-1 bg-[#F1F4F9] rounded-xl text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => handleTabSwitch('clear_due')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer ${
                  activeTab === 'clear_due'
                    ? 'bg-white text-amber-800 shadow-xs border border-[#EDF1F7]'
                    : 'text-[#6B778C] hover:text-[#192038]'
                }`}
              >
                <AlertCircle size={13} className="text-amber-600 shrink-0" />
                <span className="truncate">Clear Due (₹{existingPendingDue})</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('renew')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer ${
                  activeTab === 'renew'
                    ? 'bg-white text-slate-900 shadow-xs border border-[#EDF1F7]'
                    : 'text-[#6B778C] hover:text-[#192038]'
                }`}
              >
                <RefreshCw size={12} className="shrink-0 text-slate-700" />
                <span className="truncate">Renew Plan</span>
              </button>
            </div>
          )}

          {/* 3. Duration Selector (When Renewing) */}
          {activeTab === 'renew' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#192038]">Subscription Plan</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" /> Next Due:
                  </span>
                  {isManualDueDate ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={customDueDate}
                        onChange={(e) => setCustomDueDate(e.target.value)}
                        placeholder="DD MMM YYYY"
                        className="px-1.5 py-0.5 text-xs font-black rounded border border-[#544bec] bg-white text-slate-900 w-28 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsManualDueDate(false)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                        title="Reset to auto-calculated date"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-900 font-black">{autoNextDueDate}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomDueDate(autoNextDueDate);
                          setIsManualDueDate(true);
                        }}
                        className="text-[10px] text-[#544bec] hover:underline font-bold cursor-pointer ml-1"
                        title="Click to manually adjust date"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 5 Compact Touch Pills with 1m, 2m, 3m, 6m, 1y */}
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { m: 1, label: '1m' },
                  { m: 2, label: '2m' },
                  { m: 3, label: '3m' },
                  { m: 6, label: '6m' },
                  { m: 12, label: '1y' }
                ].map(({ m, label }) => {
                  const pillCalc = calculateMultiMonthFee(m, monthlyRate, multiMonthDiscounts);
                  const isSelected = durationMonths === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleDurationChange(m)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer text-center relative ${
                        isSelected
                          ? 'bg-[#544bec] text-white shadow-xs ring-1 ring-[#544bec]'
                          : 'bg-[#F8FAFD] border border-[#EDF1F7] text-[#6B778C] hover:bg-white hover:text-emerald-700'
                      }`}
                    >
                      <span>{label}</span>
                      {pillCalc.hasDiscount && (
                        <span
                          className={`block text-[9px] font-extrabold truncate ${
                            isSelected ? 'text-amber-200' : 'text-amber-600'
                          }`}
                        >
                          {pillCalc.discountItem?.discountType === 'percentage'
                            ? `${pillCalc.discountItem.discountValue}% OFF`
                            : `₹${pillCalc.discountItem?.discountValue} OFF`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Amount Received Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#192038]">
                {activeTab === 'clear_due' ? 'Settlement Amount (₹)' : 'Amount Paying Now (₹)'}
              </label>
              {activeTab === 'renew' && (
                <div className="text-right">
                  {discountCalculation.hasDiscount ? (
                    <span className="text-[11px] text-[#8F9BB3]">
                      <span className="line-through mr-1">₹{discountCalculation.originalTotal}</span>
                      <strong className="text-slate-900">₹{discountCalculation.finalTotal}</strong>
                      <span className="ml-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        {discountCalculation.savingsText}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#8F9BB3]">
                      Rate: ₹{monthlyRate} × {durationMonths} mo = <strong className="text-slate-900">₹{effectivePlanExpected}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8F9BB3]">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  required
                  value={amountReceived}
                  onChange={(e) => {
                    setAmountReceived(Number(e.target.value) || 0);
                    setIsDueWaived(false);
                  }}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-sm font-black text-[#192038] focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all"
                />
              </div>

              {activeTab === 'renew' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAmountReceived(effectivePlanExpected);
                    setIsDueWaived(false);
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer shrink-0"
                >
                  Pay Full (₹{effectivePlanExpected})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAmountReceived(existingPendingDue);
                    setIsDueWaived(false);
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs transition-all cursor-pointer shrink-0"
                >
                  Clear All (₹{existingPendingDue})
                </button>
              )}
            </div>

            {/* Partial Dues Alert */}
            {isPartialPayment && !isDueWaived && (
              <div className="p-2.5 bg-[#FFF9F2] border border-[#FFE0B2] rounded-xl space-y-1.5 text-xs text-amber-900 animate-in fade-in duration-150">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-amber-900">Remaining Pending Due:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-700">₹{remainingDue}</span>
                    <button
                      type="button"
                      onClick={() => setIsDueWaived(true)}
                      className="w-5 h-5 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove / Waive remaining due"
                      aria-label="Remove remaining due"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
                  <span className="text-[11px] text-amber-800">Promise Date for Balance:</span>
                  <input
                    type="date"
                    value={balanceDueDate}
                    onChange={(e) => setBalanceDueDate(e.target.value)}
                    className="bg-white border border-amber-300 rounded-lg px-2 py-0.5 text-xs font-bold text-amber-900 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* If Waived/Removed: Show clean confirmation with Restore option */}
            {isPartialPayment && isDueWaived && (
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-800 animate-in fade-in duration-150">
                <span className="text-[11px] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Remaining ₹{remainingDue} due removed (₹0 due will be recorded)
                </span>
                <button
                  type="button"
                  onClick={() => setIsDueWaived(false)}
                  className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  Restore Due
                </button>
              </div>
            )}
          </div>

          {/* 5. Payment Mode Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#192038] block">Payment Mode</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['UPI', 'Cash', 'Bank', 'Other'].map((mode) => {
                const isSelected = paymentMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'border border-[#544bec] bg-[#544bec] text-white shadow-2xs'
                        : 'border border-[#EDF1F7] bg-white text-[#6B778C] hover:bg-[#F8FAFD]'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                    <span>{mode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Date & Optional Reference */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-[#192038] block mb-1">
                Payment Date
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-hidden focus:border-slate-800 transition-all cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#192038] block mb-1">
                Ref / Cheque <span className="text-[#8F9BB3] font-normal">(Opt)</span>
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="UPI / Bank Ref"
                className="w-full px-2.5 py-1.5 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-slate-800 transition-all"
              />
            </div>
          </div>

          {/* 7. Note / Remarks Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#192038] flex items-center gap-1.5">
                <FileText size={13} className="text-[#8F9BB3]" />
                <span>Note / Remarks</span>
                <span className="text-[#8F9BB3] font-normal text-[10px]">(Optional)</span>
              </label>
              {notes && (
                <button
                  type="button"
                  onClick={() => setNotes('')}
                  className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Clear note
                </button>
              )}
            </div>

            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add payment note or remarks (e.g. Paid via father's UPI, cash discount, remaining balance promised on 25th...)"
              className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all resize-none"
            />

            {/* Quick Note Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] font-semibold text-[#8F9BB3]">Suggestions:</span>
              {[
                'Full payment received',
                'Paid via UPI',
                'Cash received',
                'Balance promised soon'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setNotes((prev) => {
                      const trimmed = prev.trim();
                      if (!trimmed) return tag;
                      if (trimmed.includes(tag)) return trimmed;
                      return `${trimmed}, ${tag}`;
                    });
                  }}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white border border-[#EDF1F7] text-[#6B778C] hover:text-[#544bec] hover:border-[#544bec]/40 hover:bg-[#F8FAFD] transition-all cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Sticky Footer (Always in View) */}
        <div className="p-3.5 sm:p-4 border-t border-[#EDF1F7] bg-white shrink-0 flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-[11px] text-[#8F9BB3] block leading-tight">Total Amount</span>
            <strong className="text-base sm:text-lg font-black text-slate-900 leading-tight block">
              ₹{amountReceived}
            </strong>
            {computedNextDueDate && (
              <span className="text-[10px] text-[#6B778C] font-semibold block mt-0.5 truncate">
                Next Due: <strong className="text-[#192038]">{computedNextDueDate}</strong>
                {isInactiveStudent && ` (Starts from ${formatDisplayDate(paymentDate || new Date())})`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 sm:px-4 py-2 rounded-xl border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F8FAFD] font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || Number(amountReceived) <= 0}
              className="px-4 sm:px-5 py-2 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white font-black text-xs inline-flex items-center gap-1.5 transition-all shadow-sm shadow-[#544bec]/30 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle size={14} />
              <span>{isSubmitting ? 'Recording...' : 'Collect Fee'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
