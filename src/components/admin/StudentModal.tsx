import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  User,
  Phone,
  Calendar,
  Crown,
  Archive,
  Armchair,
  FileText,
  UserPlus,
  Info,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Clock,
  IndianRupee,
  Edit2,
  Loader2
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatDisplayDate } from '../../utils/dateFormatter';
import { useLibrary } from '../../context/LibraryContext';
import { calculateMultiMonthFee } from '../../utils/discountUtils';
import { useSeatLayout, useCategories, QUERY_KEYS } from '../../services/useLibraryQueries';
import { SeatGridCell } from '../../types/seatManagement';
import { initialSeatCells } from '../../data/mockSeatsLayoutData';
import { StudentStatus } from '../../types/student';

export type StudentType = 'Regular' | 'Demo';
export type SeatCategory = 'Premium' | 'Locker' | 'Normal';

export interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any, studentId?: string) => Promise<any> | void;
  studentToEdit?: any;
  existingStudents?: any[];
}

// Metadata & styling for seat categories
const CATEGORY_METADATA: Record<SeatCategory, { label: string; description: string; icon: any; defaultPrice: number }> = {
  Premium: {
    label: 'Premium',
    description: 'Spacious & comfortable',
    icon: Crown,
    defaultPrice: 800
  },
  Locker: {
    label: 'Locker',
    description: 'With personal locker',
    icon: Archive,
    defaultPrice: 650
  },
  Normal: {
    label: 'Normal',
    description: 'Standard seating',
    icon: Armchair,
    defaultPrice: 600
  }
};

// Helper: Calculate Next Due Date by adding months to start date
export const calculateNextDueDate = (startDateStr: string, monthsToAdd: number = 1): string => {
  if (!startDateStr) return '';
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) return '';
  
  const originalDay = d.getDate();
  d.setMonth(d.getMonth() + Number(monthsToAdd));
  
  // Handle edge cases like 31st of month rolling into shorter months
  if (d.getDate() !== originalDay) {
    d.setDate(0);
  }
  
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Helper: Convert any date representation (e.g. "15 Aug 2026", "2026-08-15") into HTML input format "YYYY-MM-DD"
const toInputDate = (dateVal?: string | Date | null): string => {
  if (!dateVal) return '';
  const str = String(dateVal).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const d = new Date(str);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Helper: Parse months from plan text like "3 Months", "Quarterly", etc.
const parseMonthsFromPlan = (planStr?: string, fallback: number = 1): number => {
  if (!planStr) return fallback;
  const match = planStr.match(/(\d+)\s*Month/i);
  if (match) return parseInt(match[1], 10);
  if (planStr.toLowerCase().includes('quarter')) return 3;
  if (planStr.toLowerCase().includes('half')) return 6;
  if (planStr.toLowerCase().includes('year')) return 12;
  return fallback;
};

// Helper: Get future date in YYYY-MM-DD
const getFutureDateStr = (daysToAdd: number = 2, baseDateStr?: string): string => {
  const d = baseDateStr ? new Date(baseDateStr) : new Date();
  if (isNaN(d.getTime())) {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().slice(0, 10);
  }
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().slice(0, 10);
};

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit = null,
  existingStudents = []
}) => {
  // Today's local date (YYYY-MM-DD)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  // Section 1: Basic Information
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [admissionDate, setAdmissionDate] = useState<string>(getTodayDate());
  const [studentType, setStudentType] = useState<StudentType>('Regular');
  const [status, setStatus] = useState<StudentStatus>('Active');

  // Section 2: Seat & Duration & Fee Details (Regular students only)
  const [category, setCategory] = useState<SeatCategory>('Premium');
  const [seatNo, setSeatNo] = useState<string>('');
  
  // Plan Duration in Months (1, 2, 3, 6, 12, etc.)
  const [durationMonths, setDurationMonths] = useState<number>(1);

  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDueWaived, setIsDueWaived] = useState<boolean>(false);

  // Clear errors and refresh seats whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setIsSubmitting(false);
      setIsDueWaived(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
    }
  }, [isOpen, queryClient]);

  // Live queries for seat layout & categories from Seat Management
  const { data: serverLayout } = useSeatLayout();
  const { data: serverCategories } = useCategories();

  // Dynamic pricing loaded from Seat Management / Database
  const categoryPricing = useMemo<Record<SeatCategory, number>>(() => {
    const cats = serverCategories as Record<string, any> | undefined;
    return {
      Premium: Number(cats?.Premium?.rate) || CATEGORY_METADATA.Premium.defaultPrice,
      Locker: Number(cats?.Locker?.rate) || CATEGORY_METADATA.Locker.defaultPrice,
      Normal: Number(cats?.Normal?.rate) || CATEGORY_METADATA.Normal.defaultPrice
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
    } catch (e) {
      console.error(e);
    }
    return initialSeatCells;
  }, [serverLayout]);

  // Amount student is paying right now (supports partial payment)
  const [paidAmount, setPaidAmount] = useState<number>(800);
  
  // When student promises to pay remaining balance (if any)
  const [balanceDueDate, setBalanceDueDate] = useState<string>(getFutureDateStr(2));

  // Section 3: Notes
  const [notes, setNotes] = useState<string>('');

  // Available seats calculated dynamically from actual Seat Management layout
  const availableSeats = useMemo(() => {
    // 1. Occupied seat numbers from other students in existingStudents
    const occupiedByExistingStudents = new Set(
      existingStudents
        .filter((s) => s.id !== studentToEdit?.id && s.studentId !== studentToEdit?.studentId && s.seatNo && s.seatNo !== '-')
        .map((s) => String(s.seatNo).trim())
    );

    // 2. Filter seat cells in the current category
    const seatsInCategory = layoutCells.filter(
      (c) => c.isSeat && c.seatNumber !== null && c.category === category
    );

    // 3. Filter available seats
    const available = seatsInCategory.filter((cell) => {
      const seatStr = String(cell.seatNumber);
      if (cell.status === 'Maintenance') return false;

      // Allow currently assigned seat for studentToEdit
      if (
        studentToEdit &&
        (String(studentToEdit.seatNo) === seatStr ||
          cell.assignedStudent?.id === studentToEdit.id ||
          cell.assignedStudent?.studentId === studentToEdit.studentId)
      ) {
        return true;
      }

      // If occupied in layout by another student
      if (cell.status === 'Occupied' || (cell.assignedStudent && cell.assignedStudent.name)) {
        return false;
      }

      // If assigned to another student in existingStudents
      if (occupiedByExistingStudents.has(seatStr)) {
        return false;
      }

      return true;
    }).map((c) => String(c.seatNumber));

    // If student currently has a seat in this category and it's not yet in list, ensure it's included
    if (
      studentToEdit?.seatNo &&
      studentToEdit.seatNo !== '-' &&
      !available.includes(String(studentToEdit.seatNo))
    ) {
      const seatCell = seatsInCategory.find((c) => String(c.seatNumber) === String(studentToEdit.seatNo));
      if (seatCell) {
        available.unshift(String(studentToEdit.seatNo));
      }
    }

    // Sort numerically 1, 2, 3...
    return available.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [layoutCells, category, existingStudents, studentToEdit]);

  const { settings } = useLibrary();
  const multiMonthDiscounts = settings?.multiMonthDiscounts || [];

  // Total plan fee based on category monthly rate, duration in months, and any advance discounts
  const monthlyRate = categoryPricing[category] || 600;
  const feeCalculation = useMemo(() => {
    return calculateMultiMonthFee(durationMonths, monthlyRate, multiMonthDiscounts);
  }, [durationMonths, monthlyRate, multiMonthDiscounts]);

  const totalPlanFee = feeCalculation.finalTotal;

  // Remaining due balance
  const remainingDue = Math.max(0, totalPlanFee - (Number(paidAmount) || 0));

  // Dynamic Next Due Date calculated based on Admission Date + Duration Months
  const computedNextDueDate = useMemo(() => {
    return calculateNextDueDate(admissionDate || getTodayDate(), durationMonths);
  }, [admissionDate, durationMonths]);

  // Calculate 3-day trial end date for Demo students
  const trialEndDate = useMemo(() => {
    try {
      const base = new Date(admissionDate || getTodayDate());
      base.setDate(base.getDate() + 3);
      return base.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '18 Oct 2026';
    }
  }, [admissionDate]);

  // Reset or initialize form
  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        setName(studentToEdit.name || '');
        setPhone(studentToEdit.phone || '');
        setStatus((studentToEdit.status as StudentStatus) || 'Active');
        setAdmissionDate(toInputDate(studentToEdit.admissionDate) || getTodayDate());
        setStudentType(studentToEdit.studentType || (studentToEdit.status === 'Demo' ? 'Demo' : 'Regular'));
        
        const rawCat = (studentToEdit.category || studentToEdit.seatCategory || 'Premium') as SeatCategory;
        const validCat = (rawCat in CATEGORY_METADATA) ? rawCat : 'Premium';
        setCategory(validCat);

        setSeatNo(studentToEdit.seatNo === '-' ? '' : String(studentToEdit.seatNo || ''));
        
        const months = Number(studentToEdit.planMonths) || parseMonthsFromPlan(studentToEdit.plan, 1);
        setDurationMonths(months);

        const fee = Number(studentToEdit.planAmount) || ((categoryPricing[validCat] || 800) * months) || 800;
        setPaidAmount(studentToEdit.paidAmount !== undefined ? Number(studentToEdit.paidAmount) : fee);
        setBalanceDueDate(toInputDate(studentToEdit.balanceDueDate) || getFutureDateStr(2));
        setNotes(studentToEdit.notes || '');
      } else {
        setName('');
        setPhone('');
        setStatus('Active');
        const today = getTodayDate();
        setAdmissionDate(today);
        setStudentType('Regular');
        setCategory('Premium');
        setSeatNo('');
        setDurationMonths(1);
        setPaidAmount(categoryPricing.Premium || 800);
        setBalanceDueDate(getFutureDateStr(2, today));
        setNotes('');
      }
    }
  }, [isOpen, studentToEdit, categoryPricing]);

  // When category changes: update monthly rate & default paid amount to full total fee
  const handleCategoryChange = (newCat: SeatCategory) => {
    setCategory(newCat);
    setSeatNo(''); // reset seat selection whenever category changes
    const price = categoryPricing[newCat] || 600;
    const calc = calculateMultiMonthFee(durationMonths, price, multiMonthDiscounts);
    setPaidAmount(calc.finalTotal);
  };

  // When duration months changes: update total plan fee & default paid amount to full fee
  const handleDurationChange = (newMonths: number) => {
    const safeMonths = Math.max(1, Math.min(24, newMonths));
    setDurationMonths(safeMonths);
    const price = categoryPricing[category] || 600;
    const calc = calculateMultiMonthFee(safeMonths, price, multiMonthDiscounts);
    setPaidAmount(calc.finalTotal);
  };

  if (!isOpen) return null;

  // Validation: In edit mode, ONLY name and 10-digit phone are validated/required
  const isPhoneValid = /^\d{10}$/.test(phone.trim());
  const isBasicValid = name.trim().length > 0 && isPhoneValid && Boolean(admissionDate);

  const isFormValid = studentToEdit
    ? name.trim().length > 0 && isPhoneValid
    : studentType === 'Demo'
    ? isBasicValid
    : isBasicValid &&
      Boolean(seatNo) &&
      Number(paidAmount) >= 0 &&
      ((remainingDue > 0 && !isDueWaived) ? Boolean(balanceDueDate) : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // In Edit mode, ONLY Name and Phone can be modified
      if (studentToEdit) {
        await onSave({
          name: name.trim(),
          phone: phone.trim()
        }, studentToEdit.id);
        return;
      }

      const displayAdmissionDate = formatDisplayDate(admissionDate);
      const displayBalanceDueDate = balanceDueDate ? formatDisplayDate(balanceDueDate) : '';

      if (studentType === 'Demo') {
        // Demo payload: no seat or fee properties
        const demoPayload = {
          name: name.trim(),
          phone: phone.trim(),
          admissionDate: displayAdmissionDate,
          studentType: 'Demo' as const,
          trialDurationDays: 3,
          trialEndDate,
          nextDueDate: trialEndDate,
          nextFeeDueDate: trialEndDate,
          password: 'amit2580',
          role: 'student',
          notes: notes.trim() || undefined,
          status: 'Demo' as const,
          seatNo: '-'
        };
        await onSave(demoPayload, studentToEdit?.id);
      } else {
        // Regular payload with duration, partial payment, and calculated next due date
        const finalDue = isDueWaived ? 0 : remainingDue;
        const finalBalanceDueDate = (!isDueWaived && remainingDue > 0) ? displayBalanceDueDate : '';

        const regularPayload = {
          name: name.trim(),
          phone: phone.trim(),
          admissionDate: displayAdmissionDate,
          studentType: 'Regular' as const,
          category,
          seatCategory: category,
          plan: durationMonths === 1
            ? 'Monthly'
            : feeCalculation.hasDiscount
            ? `${durationMonths} Months (${feeCalculation.savingsText})`
            : `${durationMonths} Months`,
          planMonths: durationMonths,
          planAmount: totalPlanFee,
          paidAmount: Number(paidAmount) || 0,
          dueAmount: finalDue,
          balanceDueDate: finalBalanceDueDate,
          nextDueDate: computedNextDueDate,
          nextFeeDueDate: computedNextDueDate,
          feeStatus: finalDue > 0 ? 'DUE_SOON' : 'PAID',
          password: 'amit2580',
          role: 'student',
          notes: isDueWaived && remainingDue > 0
            ? `${notes.trim() ? notes.trim() + ' | ' : ''}Remaining ₹${remainingDue} due waived by admin`
            : notes.trim() || undefined,
          status: status,
          seatNo: status === 'Inactive' ? '-' : (seatNo || studentToEdit?.seatNo || '-'),
          initialPayment: studentToEdit ? undefined : {
            id: `pay_${Date.now()}`,
            receiptNo: `REC-${Date.now().toString().slice(-6)}`,
            date: displayAdmissionDate,
            amount: Number(paidAmount) || 0,
            mode: 'Cash',
            status: 'Paid',
            plan: durationMonths === 1 ? 'Monthly' : `${durationMonths} Months`,
            studentName: name.trim(),
            phone: phone.trim(),
            seatNo: seatNo || '-',
            seatCategory: category,
            newDueDate: computedNextDueDate,
            dueAmount: finalDue,
            balanceDueDate: finalBalanceDueDate
          }
        };
        await onSave(regularPayload, studentToEdit?.id);
      }
    } catch (err: any) {
      console.error('Failed to save student:', err);
      const msg = err?.message || 'Failed to save student. Please verify the details and try again.';
      setSubmitError(msg);
      // Invalidate seats to ensure fresh seat availability in layout
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seats });
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
        className={`w-full ${studentToEdit ? 'max-w-md' : 'max-w-2xl'} bg-white rounded-t-3xl sm:rounded-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] transition-all animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mt-2.5 mb-0.5 sm:hidden shrink-0" />

        {/* Modal Header (Fixed) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              {studentToEdit ? <Edit2 size={17} /> : <UserPlus size={18} />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight m-0 truncate">
                  {studentToEdit ? 'Edit Student Details' : 'Add Student'}
                </h2>
                {studentToEdit && studentToEdit.studentId && (
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {studentToEdit.studentId.startsWith('#') ? studentToEdit.studentId : `#${studentToEdit.studentId}`}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 m-0 font-medium truncate">
                {studentToEdit
                  ? `Update details for ${studentToEdit.name}`
                  : 'Register student, assign seat & schedule fee cycle'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shrink-0 ml-2"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {/* Prominent Conflict / Error Alert Banner */}
            {submitError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-rose-900 font-bold block">
                      Conflict / Enrollment Error
                    </strong>
                    <button
                      type="button"
                      onClick={() => setSubmitError(null)}
                      className="text-rose-400 hover:text-rose-700 text-xs cursor-pointer p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-rose-700 mt-1 font-medium leading-relaxed">
                    {submitError}
                  </p>
                  <p className="text-[11px] text-rose-600 mt-1">
                    💡 <strong>Don't worry:</strong> Your entered details are safe above. Please select another seat or adjust student info and click "Add Student" again.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 1: Basic Information */}
            <div className="space-y-4">
              {!studentToEdit && (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-[#544bec] text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Basic Information</span>
                </div>
              )}

              {/* Row 1: Student Name & Mobile Number */}
              <div className={`grid ${studentToEdit ? 'grid-cols-1 gap-3.5' : 'grid-cols-1 sm:grid-cols-2 gap-4'}`}>
                <div>
                  <label className="text-xs font-bold text-[#192038] block mb-1.5">
                    Student Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
                    />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#192038] block mb-1.5">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPhone(val);
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F7F9FC] border rounded-xl text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:bg-white transition-all ${
                        phone.length > 0 && !isPhoneValid
                          ? 'border-amber-400 focus:border-amber-500'
                          : 'border-[#EDF1F7] focus:border-[#544bec]'
                      }`}
                    />
                  </div>
                  {phone.length > 0 && !isPhoneValid && (
                    <span className="text-[10px] text-amber-600 mt-1 block">
                      Must be exactly 10 digits ({phone.length}/10)
                    </span>
                  )}
                </div>

                {/* Status Selector when Editing Student */}
                {studentToEdit && (
                  <div>
                    <label className="text-xs font-bold text-[#192038] block mb-1.5">
                      Student Status <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { val: 'Active', label: 'Active', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                        { val: 'Inactive', label: 'Inactive', color: 'border-slate-500 bg-slate-100 text-slate-800' },
                        { val: 'Due Soon', label: 'Due Soon', color: 'border-amber-500 bg-amber-50 text-amber-800' },
                        { val: 'Overdue', label: 'Overdue', color: 'border-rose-500 bg-rose-50 text-rose-800' },
                        { val: 'Demo', label: 'Demo', color: 'border-indigo-500 bg-indigo-50 text-indigo-800' }
                      ].map(({ val, label, color }) => {
                        const isSelected = status === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setStatus(val as StudentStatus)}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? `${color} ring-1 shadow-2xs`
                                : 'border-[#EDF1F7] bg-[#F8FAFD] text-[#6B778C] hover:bg-white'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                val === 'Active'
                                  ? 'bg-emerald-500'
                                  : val === 'Inactive'
                                  ? 'bg-slate-400'
                                  : val === 'Due Soon'
                                  ? 'bg-amber-500'
                                  : val === 'Overdue'
                                  ? 'bg-rose-500'
                                  : 'bg-indigo-500'
                              }`}
                            />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {!studentToEdit && (
                <>
                  {/* Row 2: Admission Date & Student Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="text-xs font-bold text-[#192038] block mb-1.5">
                  Admission Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
                  />
                  <input
                    type="date"
                    required
                    value={admissionDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setAdmissionDate(newDate);
                      setBalanceDueDate(getFutureDateStr(2, newDate));
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#192038] block mb-1.5">
                  Student Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Regular Card */}
                  <div
                    onClick={() => setStudentType('Regular')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                      studentType === 'Regular'
                        ? 'border-[#544bec] bg-[#EEF0FD] text-[#544bec] shadow-xs'
                        : 'border-[#EDF1F7] bg-white hover:bg-[#F7F9FC] text-[#6B778C]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        studentType === 'Regular'
                          ? 'border-[#544bec] bg-white'
                          : 'border-[#CED4DA]'
                      }`}
                    >
                      {studentType === 'Regular' && (
                        <div className="w-2 h-2 rounded-full bg-[#544bec]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#192038] leading-tight">
                        Regular
                      </div>
                      <div className="text-[10px] text-[#8F9BB3]">
                        Full Admission
                      </div>
                    </div>
                  </div>

                  {/* Demo Card */}
                  <div
                    onClick={() => setStudentType('Demo')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                      studentType === 'Demo'
                        ? 'border-[#544bec] bg-[#EEF0FD] text-[#544bec] shadow-xs'
                        : 'border-[#EDF1F7] bg-white hover:bg-[#F7F9FC] text-[#6B778C]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        studentType === 'Demo'
                          ? 'border-[#544bec] bg-white'
                          : 'border-[#CED4DA]'
                      }`}
                    >
                      {studentType === 'Demo' && (
                        <div className="w-2 h-2 rounded-full bg-[#544bec]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#192038] leading-tight">
                        Demo
                      </div>
                      <div className="text-[10px] text-[#8F9BB3]">
                        3 Days Trial
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* Demo Student Informational Panel */}
              {studentType === 'Demo' && (
                <div className="p-3.5 bg-[#FFF8EB] border border-[#FFE0A3] rounded-xl flex items-start gap-3 text-xs text-[#8A5800] animate-in fade-in duration-200">
                  <div className="p-1 rounded-full bg-[#FFAA00]/20 text-[#FFAA00] shrink-0 mt-0.5">
                    <Info size={14} />
                  </div>
                  <div>
                    <strong className="font-bold block text-[#192038]">
                      Demo student will get a 3-day free trial. No seat or fee assignment is required.
                    </strong>
                    <span className="text-[11px] text-[#8A5800] mt-0.5 block">
                      Trial end date: <strong>{trialEndDate}</strong> (3 days from admission date)
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* SECTION 2: Seat, Duration & Fee Details (Hidden completely when Demo is selected or in Edit mode) */}
        {!studentToEdit && studentType === 'Regular' && (
          <div className="space-y-5 pt-4 border-t border-[#EDF1F7] animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#192038]">
                <span className="w-5 h-5 rounded-full bg-[#544bec] text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span>Seat, Duration & Fee Details</span>
              </div>

              {/* Seat Category Selection (3 cards) */}
              <div>
                <label className="text-xs font-bold text-[#192038] block mb-1.5">
                  Seat Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(['Premium', 'Locker', 'Normal'] as const).map((catKey) => {
                    const item = CATEGORY_METADATA[catKey];
                    const Icon = item.icon;
                    const price = categoryPricing[catKey] || item.defaultPrice;
                    const isSelected = category === catKey;

                    // Calculate seats count for this category from actual Seat Management layout
                    const categorySeats = layoutCells.filter((c) => c.isSeat && c.category === catKey);

                    return (
                      <div
                        key={catKey}
                        onClick={() => handleCategoryChange(catKey)}
                        className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between text-center sm:text-left ${
                          isSelected
                            ? 'border-[#544bec] bg-gradient-to-b from-[#EEF0FD] to-[#F4FCF8] shadow-xs ring-1 ring-[#544bec]/40'
                            : 'border-[#EDF1F7] bg-white hover:bg-[#F7F9FC]'
                        }`}
                      >
                        {/* Mobile Top Row / Icon */}
                        <div className="flex items-center justify-between w-full">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 mx-auto sm:mx-0 transition-all ${
                              isSelected
                                ? 'bg-[#544bec] text-white shadow-xs'
                                : 'bg-[#F7F9FC] text-[#8F9BB3]'
                            }`}
                          >
                            <Icon size={14} className="sm:w-4 sm:h-4" />
                          </div>

                          <div
                            className={`w-4 h-4 rounded-full border hidden sm:flex items-center justify-center ${
                              isSelected
                                ? 'border-[#544bec] bg-white'
                                : 'border-[#CED4DA]'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[#544bec]" />
                            )}
                          </div>
                        </div>

                        {/* Title, Price, Description */}
                        <div className="mt-1.5 sm:mt-2.5">
                          <div className="text-[11px] sm:text-xs font-black text-[#192038] truncate">
                            {item.label}
                          </div>
                          <div className="text-xs sm:text-sm font-black text-[#544bec] mt-0.5">
                            ₹{price}<span className="text-[9px] sm:text-[10px] font-medium text-[#8F9BB3]">/mo</span>
                          </div>
                          <div className="text-[10px] text-[#8F9BB3] mt-1 leading-tight hidden sm:block">
                            {categorySeats.length > 0 ? `${categorySeats.length} Seats in Layout` : item.description}
                          </div>
                        </div>

                        {/* Mobile Active Selection Check Badge */}
                        {isSelected && (
                          <div className="sm:hidden absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#544bec] text-white flex items-center justify-center text-[9px] font-black shadow-xs">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seat Number Dropdown & Live Preview */}
              <div>
                <label className="text-xs font-bold text-[#192038] block mb-1.5">
                  Seat Number <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8">
                    <div className="relative">
                      <Armchair
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
                      />
                      <select
                        required
                        value={seatNo}
                        onChange={(e) => setSeatNo(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="">
                          {availableSeats.length > 0
                            ? `Select available seat (${availableSeats.length} available)`
                            : `No available seats in ${category}`}
                        </option>
                        {availableSeats.map((seat) => (
                          <option key={seat} value={seat}>
                            Seat {seat} — {category} — ₹{monthlyRate}/month
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[10px] text-[#8F9BB3] mt-1 block">
                      Showing {availableSeats.length} available {category} seats synced from Seat Management.
                    </span>
                  </div>

                  <div className="sm:col-span-4 bg-[#EEF0FD] border border-[#544bec]/30 rounded-xl p-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#544bec] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Armchair size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#8F9BB3] block leading-none">
                        Selected Seat
                      </span>
                      <strong className="text-xs font-extrabold text-[#544bec] block truncate mt-0.5">
                        {seatNo ? `Seat ${seatNo}` : 'Not selected'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* PLAN DURATION SELECTOR WITH INCREMENT (1 Month, 2 Months, 3 Months, etc.) */}
              <div className="p-4 bg-[#F8FAFD] border border-[#EDF1F7] rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-xs font-extrabold text-[#192038] block">
                      Plan Duration <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#8F9BB3]">
                      Select how many months the student is enrolling for
                    </span>
                  </div>

                  {/* Increment / Decrement Counter */}
                  <div className="flex items-center gap-1.5 bg-white border border-[#EDF1F7] p-1 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => handleDurationChange(durationMonths - 1)}
                      disabled={durationMonths <= 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#192038] hover:bg-[#F7F9FC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                      title="Decrease duration"
                    >
                      <Minus size={14} />
                    </button>

                    <div className="px-3 py-1 font-black text-xs text-slate-900 min-w-[75px] text-center">
                      {durationMonths} {durationMonths === 1 ? 'Month' : 'Months'}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDurationChange(durationMonths + 1)}
                      disabled={durationMonths >= 24}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#192038] hover:bg-[#F7F9FC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                      title="Increase duration"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Quick Preset Buttons (1m, 2m, 3m, 6m, 1y) with Discount Badges */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
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
                        className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center relative ${
                          isSelected
                            ? 'bg-[#544bec] text-white shadow-xs ring-1 ring-[#544bec]'
                            : 'bg-white border border-[#EDF1F7] text-[#6B778C] hover:text-[#192038] hover:bg-slate-50'
                        }`}
                      >
                        <div>{label}</div>
                        {pillCalc.hasDiscount && (
                          <div
                            className={`text-[9px] font-extrabold truncate ${
                              isSelected ? 'text-amber-300' : 'text-amber-600'
                            }`}
                          >
                            {pillCalc.discountItem?.discountType === 'percentage'
                              ? `${pillCalc.discountItem.discountValue}% OFF`
                              : `₹${pillCalc.discountItem?.discountValue} OFF`}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Auto Calculated Next Due Date Banner */}
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs mt-2">
                  <div className="flex items-center gap-2 text-[#192038]">
                    <Clock size={16} className="text-slate-500" />
                    <span>
                      Next Fee Due Date: <strong className="text-slate-900 font-extrabold">{computedNextDueDate}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#8F9BB3]">
                    Auto-calculated ({durationMonths} {durationMonths === 1 ? 'month' : 'months'} from admission)
                  </span>
                </div>
              </div>

              {/* FEE PAYMENT & PARTIAL DUES MANAGEMENT */}
              <div className="p-4 bg-white border border-[#EDF1F7] rounded-2xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#192038] m-0">
                      Fee Breakdown & Payment
                    </h4>
                    {feeCalculation.hasDiscount ? (
                      <div className="text-[11px] text-[#8F9BB3] mt-0.5">
                        ₹{monthlyRate}/mo × {durationMonths} mo = <span className="line-through">₹{feeCalculation.originalTotal}</span>{' '}
                        <strong className="text-[#544bec]">₹{feeCalculation.finalTotal} Total</strong>{' '}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 ml-1">
                          🎉 {feeCalculation.savingsText}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#8F9BB3]">
                        ₹{monthlyRate}/month × {durationMonths} {durationMonths === 1 ? 'month' : 'months'} = <strong className="text-[#192038]">₹{totalPlanFee} Total</strong>
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#8F9BB3] block uppercase tracking-wider">
                      {feeCalculation.hasDiscount ? 'Discounted Fee' : 'Total Plan Fee'}
                    </span>
                    <span className="text-base font-black text-[#544bec]">
                      ₹{totalPlanFee}
                    </span>
                  </div>
                </div>

                {/* Amount Paying Now Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="text-xs font-bold text-[#192038] block mb-1.5">
                      Amount Paying Now (₹) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8F9BB3]">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={totalPlanFee}
                        step="1"
                        required
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-extrabold text-[#192038] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all"
                        placeholder="e.g. 500"
                      />
                    </div>
                    <span className="text-[10px] text-[#8F9BB3] mt-1 block">
                      Enter partial amount (e.g. ₹500) if student is not paying in full.
                    </span>
                  </div>

                  {/* Quick Full Pay Button & Status */}
                  <div className="pt-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaidAmount(totalPlanFee)}
                      className="px-3 py-2 bg-[#EEF0FD] text-[#544bec] hover:bg-[#544bec] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Pay Full (₹{totalPlanFee})
                    </button>
                    {remainingDue === 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <Check size={14} /> Full Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                        <AlertCircle size={14} /> Partial Payment
                      </span>
                    )}
                  </div>
                </div>

                {/* PARTIAL PAYMENT / DUE BALANCE NOTICE & DUE DATE PICKER */}
                {remainingDue > 0 && !isDueWaived && (
                  <div className="p-3.5 bg-[#FFF9F2] border border-[#FFE0B2] rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <AlertCircle size={16} className="text-amber-600 shrink-0" />
                        <span>Remaining Balance to be Collected:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-amber-700">
                          ₹{remainingDue}
                        </strong>
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

                    <div className="pt-2 border-t border-[#FFE0B2]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="text-[11px] font-bold text-amber-950 block mb-1">
                          Remaining Balance Due Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={balanceDueDate}
                          onChange={(e) => setBalanceDueDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#FFE0B2] rounded-lg text-xs font-semibold text-[#192038] focus:outline-hidden focus:border-amber-500 transition-all cursor-pointer"
                        />
                      </div>
                      <div className="text-[11px] text-amber-800 leading-tight">
                        Student will pay the remaining <strong>₹{remainingDue}</strong> on or before this date. A pending fee alert will appear in the student list.
                      </div>
                    </div>
                  </div>
                )}

                {/* If Waived/Removed: Show clean confirmation with Restore option (Exactly like CollectFeeModal) */}
                {remainingDue > 0 && isDueWaived && (
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-800 animate-in fade-in duration-150">
                    <span className="text-[11px] font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        Remaining <strong>₹{remainingDue}</strong> due removed (₹0 due balance will be recorded)
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDueWaived(false)}
                      className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 underline cursor-pointer shrink-0 ml-2"
                    >
                      Restore Due
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: Notes (Optional - Hidden in Edit mode) */}
          {!studentToEdit && (
            <div className="space-y-3 pt-4 border-t border-[#EDF1F7]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#192038]">
                  <span className="w-5 h-5 rounded-full bg-[#544bec] text-white text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Notes (Optional)</span>
                </div>
                <span className="text-[10px] text-[#8F9BB3] font-medium">
                  {notes.length}/200
                </span>
              </div>

              <div className="relative">
                <FileText
                  size={16}
                  className="absolute left-3.5 top-3 text-[#8F9BB3]"
                />
                <textarea
                  maxLength={200}
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any remarks or notes about student payment agreement..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          )}

          </div>

          {/* Modal Footer (Fixed, Non-scrolling) */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-400">
              {studentToEdit ? null : studentType === 'Regular' ? (
                <span>
                  Due Date: <strong className="text-slate-800">{computedNextDueDate}</strong>
                  {remainingDue > 0 && !isDueWaived && <span className="text-amber-600 font-bold ml-1.5">(₹{remainingDue} pending)</span>}
                  {remainingDue > 0 && isDueWaived && <span className="text-emerald-600 font-bold ml-1.5">(Due waived)</span>}
                </span>
              ) : null}
            </div>

            <div className={`flex items-center gap-2.5 ${studentToEdit ? 'w-full sm:w-auto justify-end' : ''}`}>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer text-center"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  isFormValid && !isSubmitting
                    ? 'bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Saving Student...</span>
                  </>
                ) : (
                  <>
                    {studentToEdit ? <Edit2 size={15} /> : <UserPlus size={15} />}
                    <span>{studentToEdit ? 'Save Changes' : 'Add Student'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
