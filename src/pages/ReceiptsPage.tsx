import React, { useState, useMemo } from 'react';
import { ReceiptStatCards } from '../components/receipts/ReceiptStatCards';
import { ReceiptTableToolbar, ReceiptFilterOptions } from '../components/receipts/ReceiptTableToolbar';
import { ReceiptsTable, ReceiptRecordItem } from '../components/receipts/ReceiptsTable';
import { FeeReceiptModal } from '../components/admin/FeeReceiptModal';
import { useFeeReceipts, useStudents } from '../services/useLibraryQueries';
import { useLibrary } from '../context/LibraryContext';

// Helper to convert any date into standardized "YYYY-MM-DD" for accurate date filtering
const toISODateString = (dateVal?: string | Date | null): string => {
  if (!dateVal) return '';
  const str = String(dateVal).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const normalized = str.replace(/Sept/i, 'Sep');
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const ReceiptsPage: React.FC = () => {
  const { settings, students: contextStudents } = useLibrary();

  // Queries
  const { data: rawReceipts = [] } = useFeeReceipts();
  const { data: rawStudents = [] } = useStudents();

  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Filters state
  const [filters, setFilters] = useState<ReceiptFilterOptions>({
    search: '',
    dateRange: 'All',
    selectedDate: '',
    startDate: '',
    endDate: ''
  });

  // Effective Students list (API + Context)
  const studentsList = useMemo(() => {
    return Array.isArray(rawStudents) && rawStudents.length > 0
      ? rawStudents
      : Array.isArray(contextStudents)
      ? contextStudents
      : [];
  }, [rawStudents, contextStudents]);

  // Unified, Stable, Deduplicated Receipt Records
  const allReceipts: ReceiptRecordItem[] = useMemo(() => {
    const list: ReceiptRecordItem[] = [];
    const seenIds = new Set<string>();
    const seenReceiptNos = new Set<string>();

    // 1. Ingest official receipts from feeService / payments.json
    (Array.isArray(rawReceipts) ? rawReceipts : []).forEach((r: any) => {
      const stableReceiptNo = r.receiptNo || r.id || `REC-${r.id}`;
      if (seenReceiptNos.has(stableReceiptNo)) return;

      // Find matching student to enrich phone, student ID, category if missing
      const matchedStudent = studentsList.find(
        (s: any) => s.id === r.studentId || s.name?.toLowerCase() === r.studentName?.toLowerCase()
      );

      const item: ReceiptRecordItem = {
        id: r.id || stableReceiptNo,
        receiptNo: stableReceiptNo,
        date: r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Oct 2026'),
        studentName: r.studentName || matchedStudent?.name || 'Student',
        studentId: matchedStudent?.studentId || r.studentRefId || r.studentId || '-',
        phone: matchedStudent?.phone || r.phone || '',
        seatNo: r.seatNo !== undefined && r.seatNo !== null ? String(r.seatNo) : (matchedStudent?.seatNo || '-'),
        seatCategory: r.seatCategory || matchedStudent?.seatCategory || matchedStudent?.category || 'Normal',
        mode: r.mode || 'Cash',
        amount: Number(r.amount) || 0,
        plan: r.plan || matchedStudent?.plan || 'Monthly',
        newDueDate: r.newDueDate || matchedStudent?.nextDueDate,
        dueAmount: r.dueAmount !== undefined ? Number(r.dueAmount) : Number(matchedStudent?.dueAmount || 0),
        balanceDueDate: r.balanceDueDate || matchedStudent?.balanceDueDate,
        reference: r.reference,
        notes: r.notes,
        createdAt: r.createdAt || r.date
      };

      seenReceiptNos.add(stableReceiptNo);
      if (r.id) seenIds.add(r.id);
      list.push(item);
    });

    // 2. Ingest payments from student paymentHistory / feeHistory (if not already captured)
    studentsList.forEach((s: any) => {
      // Do not include trial demo records unless an actual payment exists
      if (s.studentType === 'Demo' && (!s.paymentHistory || s.paymentHistory.length === 0)) {
        return;
      }

      const histories = [
        ...(Array.isArray(s.paymentHistory) ? s.paymentHistory : []),
        ...(Array.isArray(s.feeHistory) ? s.feeHistory : [])
      ];

      histories.forEach((p: any) => {
        const receiptNo = p.receiptNo || `REC-2026-${String(s.id).slice(-4)}`;
        if (seenReceiptNos.has(receiptNo)) return;
        if (p.id && seenIds.has(p.id)) return;

        const item: ReceiptRecordItem = {
          id: p.id || receiptNo,
          receiptNo,
          date: p.date ? new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Oct 2026',
          studentName: s.name,
          studentId: s.studentId || '-',
          phone: s.phone || '',
          seatNo: s.seatNo || '-',
          seatCategory: s.seatCategory || s.category || 'Normal',
          mode: p.mode || 'Cash',
          amount: Number(p.amount) || 0,
          plan: p.plan || s.plan || 'Monthly',
          newDueDate: p.newDueDate || s.nextDueDate,
          dueAmount: p.dueAmount !== undefined ? Number(p.dueAmount) : Number(s.dueAmount || 0),
          balanceDueDate: p.balanceDueDate || s.balanceDueDate,
          reference: p.reference,
          notes: p.notes,
          createdAt: p.createdAt || p.date
        };

        seenReceiptNos.add(receiptNo);
        if (p.id) seenIds.add(p.id);
        list.push(item);
      });
    });

    // Sort newest receipts first
    return list.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date).getTime();
      const timeB = new Date(b.createdAt || b.date).getTime();
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
  }, [rawReceipts, studentsList]);

  // Dynamic Summary Calculations
  const summaryMetrics = useMemo(() => {
    const totalReceipts = allReceipts.length;
    const totalAmountReceived = allReceipts.reduce((sum, r) => sum + r.amount, 0);

    const cashReceipts = allReceipts.filter((r) => (r.mode || '').toLowerCase() === 'cash');
    const cashCollections = cashReceipts.reduce((sum, r) => sum + r.amount, 0);

    const upiReceipts = allReceipts.filter((r) => (r.mode || '').toLowerCase() === 'upi');
    const upiCollections = upiReceipts.reduce((sum, r) => sum + r.amount, 0);

    return {
      totalReceipts,
      totalAmountReceived,
      cashCollections,
      cashCount: cashReceipts.length,
      upiCollections,
      upiCount: upiReceipts.length
    };
  }, [allReceipts]);

  // Filtered Receipts Table Records with enhanced date-wise filtering
  const filteredReceipts = useMemo(() => {
    const todayISO = toISODateString(new Date());

    return allReceipts.filter((r) => {
      // 1. Search Query: Receipt Number, Student Name, Mobile Number, or Student ID
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesReceiptNo = r.receiptNo.toLowerCase().includes(query);
        const matchesName = r.studentName.toLowerCase().includes(query);
        const matchesPhone = (r.phone || '').includes(query);
        const matchesStudentId = (r.studentId || '').toLowerCase().includes(query);

        if (!matchesReceiptNo && !matchesName && !matchesPhone && !matchesStudentId) {
          return false;
        }
      }

      // 2. Date-wise Filters
      const receiptISO = toISODateString(r.createdAt || r.date);

      if (filters.dateRange === 'Specific Date') {
        if (filters.selectedDate && receiptISO !== filters.selectedDate) {
          return false;
        }
      } else if (filters.dateRange === 'Date Range') {
        if (filters.startDate && receiptISO < filters.startDate) {
          return false;
        }
        if (filters.endDate && receiptISO > filters.endDate) {
          return false;
        }
      } else if (filters.dateRange === 'Today') {
        if (receiptISO !== todayISO) return false;
      } else if (filters.dateRange === 'This Month') {
        const now = new Date();
        const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (!receiptISO.startsWith(currentMonthPrefix)) return false;
      } else if (filters.dateRange === 'Last 30 Days') {
        const receiptDate = new Date(receiptISO);
        const now = new Date();
        if (!isNaN(receiptDate.getTime())) {
          const diffDays = (now.getTime() - receiptDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays < 0 || diffDays > 30) return false;
        }
      }

      return true;
    });
  }, [allReceipts, filters]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Receipts Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#192038] m-0 truncate">
            Receipts
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-0.5 sm:mt-1 m-0 truncate">
            View, search, and manage student payment vouchers
          </p>
        </div>
      </div>

      {/* 2. Summary KPI Cards */}
      <ReceiptStatCards
        totalReceipts={summaryMetrics.totalReceipts}
        totalAmountReceived={summaryMetrics.totalAmountReceived}
        cashCollections={summaryMetrics.cashCollections}
        cashCount={summaryMetrics.cashCount}
        upiCollections={summaryMetrics.upiCollections}
        upiCount={summaryMetrics.upiCount}
      />

      {/* 3. Search and Date-Wise Dropdown Filter Toolbar */}
      <ReceiptTableToolbar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() =>
          setFilters({
            search: '',
            dateRange: 'All',
            selectedDate: '',
            startDate: '',
            endDate: ''
          })
        }
        totalFilteredCount={filteredReceipts.length}
      />

      {/* 4. Receipts Table */}
      <ReceiptsTable
        receipts={filteredReceipts}
        onViewReceipt={(receipt) => {
          setSelectedReceipt(receipt);
          setIsReceiptModalOpen(true);
        }}
      />

      {/* View Receipt Modal */}
      <FeeReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedReceipt(null);
        }}
        receipt={selectedReceipt}
        settings={settings}
      />
    </div>
  );
};
