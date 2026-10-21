import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { FeeStatCards } from '../components/fees/FeeStatCards';
import { FeeTableToolbar, FeeFilterOptions } from '../components/fees/FeeTableToolbar';
import { FeeRecordsTable, FeeRecordRow } from '../components/fees/FeeRecordsTable';
import { CollectFeeModal } from '../components/fees/CollectFeeModal';
import { FeeReceiptModal } from '../components/admin/FeeReceiptModal';
import { useStudents, useFeeReceipts, useRecordFeePayment, useCategories } from '../services/useLibraryQueries';
import { useLibrary } from '../context/LibraryContext';
import { getDaysUntilDue } from '../utils/dateFormatter';

export const FeesPage: React.FC = () => {
  const { showToast, settings, recordFeePayment } = useLibrary();

  // TanStack Queries & Mutations
  const { data: rawStudents = [] } = useStudents();
  const { data: rawReceipts = [] } = useFeeReceipts();
  const { data: serverCategories } = useCategories();
  const recordPaymentMutation = useRecordFeePayment();

  // Live dynamic category rates loaded from database / Seat Management
  const categoryRates = useMemo<Record<string, number>>(() => {
    const cats = serverCategories as Record<string, any> | undefined;
    return {
      Normal: Number(cats?.Normal?.rate) || 600,
      Locker: Number(cats?.Locker?.rate) || 650,
      Premium: Number(cats?.Premium?.rate) || 800
    };
  }, [serverCategories]);

  // Modals state
  const [isCollectModalOpen, setIsCollectModalOpen] = useState<boolean>(false);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState<any>(null);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Filters State
  const [filters, setFilters] = useState<FeeFilterOptions>({
    search: '',
    status: 'All',
    dateRange: 'All'
  });

  // Regular Students only for Seat-Fee collection
  const regularStudents = useMemo(() => {
    return (Array.isArray(rawStudents) ? rawStudents : []).filter(
      (s) => s.studentType !== 'Demo' && s.status !== 'Demo'
    );
  }, [rawStudents]);

  // Construct Fee Record Rows
  const feeRecords: FeeRecordRow[] = useMemo(() => {
    return regularStudents.map((s) => {
      const category = s.seatCategory || s.category || 'Normal';
      // Dynamically load monthly fee from student's plan or live category rate
      const monthlyFee = Number(s.planAmount) > 0 ? Number(s.planAmount) : (categoryRates[category] || 650);
      const dueAmount = Number(s.dueAmount || 0);
      const dueDate = s.nextDueDate || s.nextFeeDueDate;
      const daysLeft = getDaysUntilDue(dueDate);

      // Determine Fee Status (Inactive students are never Overdue)
      let feeStatus: 'Paid' | 'Partial' | 'Due' | 'Overdue' | 'Inactive' = 'Paid';
      if (s.status === 'Inactive' || (daysLeft !== null && daysLeft < -40)) {
        feeStatus = 'Inactive';
      } else if (daysLeft !== null && daysLeft < 0) {
        feeStatus = 'Overdue';
      } else if (dueAmount > 0) {
        feeStatus = 'Partial';
      } else if (daysLeft !== null && daysLeft <= 5) {
        feeStatus = 'Due';
      } else {
        feeStatus = 'Paid';
      }

      // Calculate total amount paid from student payment history or receipts
      const studentReceipts = (Array.isArray(rawReceipts) ? rawReceipts : []).filter(
        (r) => r.studentId === s.id || r.studentName?.toLowerCase() === s.name?.toLowerCase()
      );

      const historyPayments = Array.isArray(s.paymentHistory) ? s.paymentHistory : [];
      const totalPaid = studentReceipts.length > 0
        ? studentReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
        : historyPayments.length > 0
        ? historyPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        : Number(s.paidAmount || monthlyFee);

      // Latest receipt for viewing/printing
      const baseReceipt = studentReceipts[0] || historyPayments[0];
      const lastReceipt = baseReceipt
        ? {
            ...baseReceipt,
            id: baseReceipt.id || `pay_${s.id}`,
            receiptNo: baseReceipt.receiptNo || `REC-2026-${String(s.id).slice(-4)}`,
            studentName: baseReceipt.studentName || s.name,
            studentId: s.studentId || s.id || baseReceipt.studentId || '-',
            studentRefId: s.studentId || s.id || baseReceipt.studentRefId || '-',
            phone: s.phone || baseReceipt.phone || '',
            seatNo: (baseReceipt.seatNo && baseReceipt.seatNo !== '-') ? baseReceipt.seatNo : (s.seatNo || '-'),
            seatCategory: baseReceipt.seatCategory || category,
            amount: Number(baseReceipt.amount || totalPaid || monthlyFee),
            mode: baseReceipt.mode || 'Cash',
            plan: baseReceipt.plan || s.plan || 'Monthly',
            date: baseReceipt.date || s.lastFeePaidDate || s.admissionDate || '18 Oct 2026',
            newDueDate: baseReceipt.newDueDate || baseReceipt.nextDueDate || dueDate,
            dueAmount: baseReceipt.dueAmount !== undefined ? Number(baseReceipt.dueAmount) : dueAmount,
            balanceDueDate: baseReceipt.balanceDueDate || s.balanceDueDate || '',
            notes: baseReceipt.notes || baseReceipt.remarks || s.notes || s.remarks || '',
            reference: baseReceipt.reference || s.reference || ''
          }
        : {
            id: `pay_${s.id}`,
            receiptNo: `REC-2026-${String(s.id).slice(-4)}`,
            studentName: s.name,
            studentId: s.studentId || s.id || '-',
            studentRefId: s.studentId || s.id || '-',
            phone: s.phone || '',
            seatNo: s.seatNo || '-',
            seatCategory: category,
            amount: totalPaid > 0 ? totalPaid : monthlyFee,
            mode: 'Cash',
            plan: s.plan || 'Monthly',
            date: s.lastFeePaidDate || s.admissionDate || '18 Oct 2026',
            newDueDate: dueDate,
            dueAmount: dueAmount,
            balanceDueDate: s.balanceDueDate || '',
            notes: s.notes || s.remarks || '',
            reference: s.reference || ''
          };

      return {
        id: s.id,
        studentId: s.studentId || '-',
        name: s.name,
        phone: s.phone || '-',
        avatar: s.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces`,
        seatNo: s.seatNo || '-',
        seatCategory: category,
        monthlyFee,
        amountPaid: totalPaid,
        dueAmount,
        balanceDueDate: s.balanceDueDate,
        nextDueDate: dueDate || '-',
        feeStatus,
        lastPaymentDate: s.lastFeePaidDate,
        notes: baseReceipt?.notes || baseReceipt?.remarks || s.notes || s.remarks || '',
        lastReceipt,
        studentRef: s
      };
    });
  }, [regularStudents, rawReceipts]);

  // Filtered Fee Records
  const filteredRecords = useMemo(() => {
    return feeRecords.filter((row) => {
      // 1. Search Query (student name, mobile number, or numeric seat number)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = row.name.toLowerCase().includes(query);
        const matchesId = row.studentId.toLowerCase().includes(query);
        const matchesPhone = row.phone.includes(query);
        const matchesSeat = row.seatNo.toLowerCase().includes(query);

        if (!matchesName && !matchesId && !matchesPhone && !matchesSeat) {
          return false;
        }
      }

      // 2. Status Filter (Paid, Partial, Due, Overdue)
      if (filters.status !== 'All') {
        if (filters.status === 'Paid' && row.feeStatus !== 'Paid') return false;
        if (filters.status === 'Partial' && row.feeStatus !== 'Partial') return false;
        if (filters.status === 'Due' && row.feeStatus !== 'Due') return false;
        if (filters.status === 'Overdue' && row.feeStatus !== 'Overdue') return false;
      }

      // 3. Date Range Filter
      if (filters.dateRange !== 'All') {
        const now = new Date();
        const rowDue = row.nextDueDate ? new Date(row.nextDueDate) : null;
        if (filters.dateRange === 'Today') {
          if (!rowDue || rowDue.toDateString() !== now.toDateString()) return false;
        } else if (filters.dateRange === 'This Month') {
          if (!rowDue || rowDue.getMonth() !== now.getMonth() || rowDue.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (filters.dateRange === 'Last 30 Days') {
          if (!rowDue) return false;
          const diffDays = Math.abs(now.getTime() - rowDue.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 30) return false;
        }
      }

      return true;
    });
  }, [feeRecords, filters]);

  // Summary Metrics Calculation
  const summaryMetrics = useMemo(() => {
    const receiptsList = Array.isArray(rawReceipts) ? rawReceipts : [];
    const totalCollected = receiptsList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    // Inactive students are strictly excluded from pending & overdue metrics
    const activeRecords = feeRecords.filter((r) => r.feeStatus !== 'Inactive' && r.studentRef?.status !== 'Inactive');
    const pendingFees = activeRecords.reduce((sum, r) => sum + r.dueAmount, 0);
    const pendingCount = activeRecords.filter((r) => r.dueAmount > 0).length;

    const overdueRecords = activeRecords.filter((r) => r.feeStatus === 'Overdue');
    const overdueFees = overdueRecords.reduce((sum, r) => sum + (r.dueAmount || r.monthlyFee), 0);
    const overdueCount = overdueRecords.length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const collectedThisMonth = receiptsList.reduce((sum, r) => {
      const d = r.date ? new Date(r.date) : (r.createdAt ? new Date(r.createdAt) : null);
      if (d && !isNaN(d.getTime())) {
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          return sum + (Number(r.amount) || 0);
        }
        return sum;
      }
      return sum + (Number(r.amount) || 0);
    }, 0);

    return {
      totalCollected,
      pendingFees,
      pendingCount,
      overdueFees,
      overdueCount,
      collectedThisMonth,
      totalTransactions: receiptsList.length
    };
  }, [rawReceipts, feeRecords]);

  // Actions
  const handleOpenCollectFee = (targetStudent?: any) => {
    setSelectedStudentForFee(targetStudent || null);
    setIsCollectModalOpen(true);
  };

  const handleViewReceipt = (student: any, receipt?: any) => {
    const rawReceipt = receipt || {};
    const targetReceipt = {
      ...rawReceipt,
      id: rawReceipt.id || `pay_${student?.id || Date.now()}`,
      receiptNo: rawReceipt.receiptNo || `REC-2026-${(student?.id || '000').slice(-4)}`,
      studentName: rawReceipt.studentName || student?.name || 'Student',
      studentId: student?.studentId || student?.id || rawReceipt.studentId || '-',
      studentRefId: student?.studentId || student?.id || rawReceipt.studentRefId || '-',
      phone: student?.phone || rawReceipt.phone || '',
      seatNo: (rawReceipt.seatNo && rawReceipt.seatNo !== '-') ? rawReceipt.seatNo : (student?.seatNo || '-'),
      seatCategory: rawReceipt.seatCategory || student?.seatCategory || student?.category || 'Normal',
      amount: Number(rawReceipt.amount || student?.paidAmount || student?.planAmount || 600),
      mode: rawReceipt.mode || 'Cash',
      plan: rawReceipt.plan || student?.plan || 'Monthly',
      date: rawReceipt.date || student?.lastFeePaidDate || student?.admissionDate || '18 Oct 2026',
      newDueDate: rawReceipt.newDueDate || rawReceipt.nextDueDate || student?.nextDueDate || student?.nextFeeDueDate || '',
      dueAmount: rawReceipt.dueAmount !== undefined ? Number(rawReceipt.dueAmount) : Number(student?.dueAmount || 0),
      balanceDueDate: rawReceipt.balanceDueDate || student?.balanceDueDate || '',
      notes: rawReceipt.notes || rawReceipt.remarks || student?.notes || student?.remarks || '',
      reference: rawReceipt.reference || student?.reference || ''
    };

    setActiveReceipt(targetReceipt);
    setIsReceiptModalOpen(true);
  };

  // Payment Submission Handler
  const handleRecordPayment = async (payload: {
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
  }) => {
    try {
      const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPayment = {
        id: `pay_${Date.now()}`,
        receiptNo,
        studentId: payload.studentId,
        studentRefId: selectedStudentForFee?.studentId || selectedStudentForFee?.id || payload.studentId,
        studentName: payload.studentName,
        phone: selectedStudentForFee?.phone || '',
        seatNo: payload.seatNo,
        seatCategory: payload.seatCategory,
        amount: payload.amount,
        mode: payload.mode,
        plan: payload.plan,
        newDueDate: payload.newDueDate,
        dueAmount: payload.dueAmount,
        balanceDueDate: payload.balanceDueDate,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        reference: payload.reference,
        notes: payload.notes
      };

      // 1. Sync to server API
      try {
        await recordPaymentMutation.mutateAsync({
          studentId: payload.studentId,
          amount: payload.amount,
          mode: payload.mode,
          plan: payload.plan,
          newDueDate: payload.newDueDate,
          dueAmount: payload.dueAmount,
          balanceDueDate: payload.balanceDueDate,
          seatNo: payload.seatNo,
          seatCategory: payload.seatCategory,
          receiptNo,
          notes: payload.notes,
          reference: payload.reference
        });
      } catch (err) {
        console.warn('API sync payment failed, fallback to local context:', err);
      }

      // 2. Sync to Library Context (localStorage)
      recordFeePayment({
        studentId: payload.studentId,
        payment: newPayment,
        newDueDate: payload.newDueDate,
        dueAmount: payload.dueAmount,
        balanceDueDate: payload.balanceDueDate
      });

      // 3. Open receipt modal immediately for viewing/printing
      setActiveReceipt(newPayment);
      setIsReceiptModalOpen(true);

      if (showToast) {
        showToast(`Fee payment of ₹${payload.amount} recorded for ${payload.studentName}!`, 'success');
      }
    } catch (e: any) {
      console.error('Error recording fee payment:', e);
      if (showToast) {
        showToast(e?.message || 'Failed to record fee payment. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#192038] m-0 truncate">
            Fees & Payments
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-0.5 sm:mt-1 m-0 truncate">
            Manage fee collections, outstanding dues & receipts
          </p>
        </div>

        {/* Collect Fee Button */}
        <button
          onClick={() => handleOpenCollectFee()}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/25 inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Collect Fee</span>
        </button>
      </div>

      {/* 2. Summary KPI Cards */}
      <FeeStatCards
        totalCollected={summaryMetrics.totalCollected}
        pendingFees={summaryMetrics.pendingFees}
        pendingCount={summaryMetrics.pendingCount}
        overdueFees={summaryMetrics.overdueFees}
        overdueCount={summaryMetrics.overdueCount}
        collectedThisMonth={summaryMetrics.collectedThisMonth}
        totalTransactions={summaryMetrics.totalTransactions}
      />

      {/* 3. Search and Dropdown Filter Toolbar */}
      <FeeTableToolbar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({ search: '', status: 'All', dateRange: 'All' })}
        totalFilteredCount={filteredRecords.length}
      />

      {/* 4. Fee Records Table */}
      <FeeRecordsTable
        records={filteredRecords}
        onCollectFee={handleOpenCollectFee}
        onViewReceipt={handleViewReceipt}
      />

      {/* Collect Fee Modal */}
      <CollectFeeModal
        isOpen={isCollectModalOpen}
        onClose={() => {
          setIsCollectModalOpen(false);
          setSelectedStudentForFee(null);
        }}
        students={regularStudents}
        preSelectedStudent={selectedStudentForFee}
        onRecordPayment={handleRecordPayment}
      />

      {/* View & Print Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setActiveReceipt(null);
        }}
        receipt={activeReceipt}
        settings={settings}
      />
    </div>
  );
};
