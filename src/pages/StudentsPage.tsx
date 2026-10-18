import React, { useState, useMemo } from 'react';
import { Plus, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { StudentStatCards } from '../components/students/StudentStatCards';
import { StudentTableToolbar } from '../components/students/StudentTableToolbar';
import { StudentsTable } from '../components/students/StudentsTable';
import { StudentRecord, StudentFilterOptions } from '../types/student';
import { StudentModal } from '../components/admin/StudentModal';
import { useLibrary } from '../context/LibraryContext';
import { AdminLayoutContextType } from '../layouts/AdminLayout';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, useBulkDeleteStudents } from '../services/useLibraryQueries';
import { computeFeeStatus, computeStudentStatus } from '../utils/dateFormatter';
import { ImportStudentsModal } from '../components/students/ImportStudentsModal';
import { AdminPasswordModal } from '../components/common/AdminPasswordModal';

export const StudentsPage: React.FC = () => {
  const outletContext = useOutletContext<AdminLayoutContextType | null>();
  const { showToast, showConfirm } = useLibrary();

  // TanStack Query
  const { data: apiStudents } = useStudents();
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const bulkDeleteStudentsMutation = useBulkDeleteStudents();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Admin Password Verification Modal state
  const [adminAuthModal, setAdminAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    onAuthorize: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionLabel: '',
    onAuthorize: () => {}
  });

  const requireAdminAuth = (
    options: { title?: string; description?: string; actionLabel?: string },
    action: () => Promise<void> | void
  ) => {
    setAdminAuthModal({
      isOpen: true,
      title: options.title || 'Admin Password Required',
      description:
        options.description || 'Please enter your admin password to confirm deleting this student record.',
      actionLabel: options.actionLabel || 'Authorize & Delete',
      onAuthorize: async () => {
        setAdminAuthModal((prev) => ({ ...prev, isOpen: false }));
        await action();
      }
    });
  };

  const students: StudentRecord[] = useMemo(() => {
    const rawList = Array.isArray(apiStudents) ? apiStudents : [];

    // Dynamically compute student status (Demo, Inactive >40d, Overdue, Due Soon <=5d, Active)
    return rawList.map((s) => {
      const dynamicStatus = computeStudentStatus(s);
      const dueDate = s.nextDueDate || s.nextFeeDueDate;
      const dueAmt = Number(s.dueAmount) || 0;
      const feeStatus = computeFeeStatus(dueDate, dueAmt, dynamicStatus);
      const isInactive = dynamicStatus === 'Inactive';

      return {
        ...s,
        status: dynamicStatus,
        feeStatus: feeStatus,
        seatNo: isInactive ? '-' : (s.seatNo || '-')
      };
    });
  }, [apiStudents]);

  // Filters State
  const [filters, setFilters] = useState<StudentFilterOptions>({
    search: '',
    status: 'All',
    plan: 'All',
    seat: 'All'
  });

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. Search filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matches =
          s.name.toLowerCase().includes(query) ||
          s.studentId.toLowerCase().includes(query) ||
          s.phone.includes(query) ||
          s.seatNo.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // 2. Status filter
      if (filters.status !== 'All') {
        if (s.status !== filters.status) return false;
      }

      // 3. Plan filter
      if (filters.plan !== 'All') {
        if (s.plan !== filters.plan) return false;
      }

      // 4. Seat filter
      if (filters.seat !== 'All') {
        if (filters.seat === 'Assigned' && s.seatNo === '-') return false;
        if (filters.seat === 'Unassigned' && s.seatNo !== '-') return false;
      }

      return true;
    });
  }, [students, filters]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      plan: 'All',
      seat: 'All'
    });
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleEditStudent = (student: StudentRecord) => {
    setEditingStudent(student);
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = async (payload: any, studentId?: string) => {
    const calculatedNextDueDate =
      payload.nextDueDate ||
      payload.nextFeeDueDate ||
      (payload.studentType === 'Demo' ? payload.trialEndDate : '');

    // Close modal immediately for responsive UX — TanStack Query refetches in background
    setIsAddModalOpen(false);
    const targetStudent = editingStudent;
    setEditingStudent(null);

    const isEdit = Boolean(studentId || targetStudent);
    const targetId = studentId || targetStudent?.id;

    try {
      if (isEdit && targetId) {
        await updateStudentMutation.mutateAsync({
          id: targetId,
          updates: {
            name: payload.name,
            phone: payload.phone
          }
        });
        if (showToast) showToast(`Student "${payload.name}" updated successfully!`);
      } else {
        await createStudentMutation.mutateAsync({
          name: payload.name,
          phone: payload.phone,
          admissionDate: payload.admissionDate,
          studentType: payload.studentType,
          seatNo: payload.seatNo || '-',
          seatCategory: payload.category || payload.seatCategory || 'Normal',
          plan: payload.plan || (payload.studentType === 'Demo' ? 'Demo (3-Day Trial)' : 'Monthly'),
          planAmount: payload.planAmount,
          planMonths: payload.planMonths,
          paidAmount: payload.paidAmount,
          dueAmount: payload.dueAmount,
          balanceDueDate: payload.balanceDueDate,
          nextDueDate: calculatedNextDueDate,
          initialFeePayment: Number(payload.paidAmount) > 0 ? {
            amount: Number(payload.paidAmount),
            mode: 'Cash'
          } : undefined,
          notes: payload.notes
        });
        if (showToast) showToast(`Student "${payload.name}" enrolled successfully!`);
      }
    } catch (err: any) {
      console.error('Error saving student:', err);
      if (showToast) showToast(`Failed to save student: ${err.message || 'Error'}`);
    }
  };

  const handleCollectFee = (student: StudentRecord) => {
    outletContext?.openCollectFee(student);
  };

  // Delete single student with Admin Password verification
  const handleDeleteStudent = (student: StudentRecord) => {
    requireAdminAuth(
      {
        title: `Delete Student - ${student.name}`,
        description: `Please enter your admin password to permanently delete student "${student.name}" (${student.studentId || student.id}). Their assigned seat ${student.seatNo && student.seatNo !== '-' ? `#${student.seatNo}` : ''} will be freed automatically.`,
        actionLabel: 'Verify Password & Delete'
      },
      async () => {
        try {
          await deleteStudentMutation.mutateAsync(student.id);
          setSelectedIds((prev) => prev.filter((id) => id !== student.id));
          if (showToast) showToast(`Student "${student.name}" permanently deleted and seat freed!`, 'info');
        } catch (err: any) {
          console.error('Delete student error:', err);
          if (showToast) showToast(`Failed to delete student: ${err.message || 'Error'}`, 'danger');
        }
      }
    );
  };

  // Delete multiple selected students in bulk with Admin Password verification
  const handleBulkDeleteStudents = () => {
    if (selectedIds.length === 0) return;

    requireAdminAuth(
      {
        title: `Delete ${selectedIds.length} Selected Students`,
        description: `Are you sure you want to permanently delete these ${selectedIds.length} selected students? Any assigned seats will be released automatically. Please enter your admin password to proceed.`,
        actionLabel: `Authorize & Delete ${selectedIds.length} Students`
      },
      async () => {
        try {
          await bulkDeleteStudentsMutation.mutateAsync(selectedIds);
          const count = selectedIds.length;
          setSelectedIds([]);
          if (showToast) showToast(`${count} students permanently deleted and seats freed!`, 'info');
        } catch (err: any) {
          console.error('Bulk delete students error:', err);
          if (showToast) showToast(`Failed to delete selected students: ${err.message || 'Error'}`, 'danger');
        }
      }
    );
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#192038] m-0">
            Students
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-0.5 m-0 hidden sm:block">
            Manage all library students, view details, payments, seats and status.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddStudent}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold bg-[#00A97A] text-white hover:bg-[#008f67] shadow-sm shadow-[#00A97A]/25 inline-flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Stat Cards */}
      <StudentStatCards students={students} />

      {/* 3. Search and Dropdown Filter Toolbar */}
      <StudentTableToolbar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* 3.5 Bulk Actions Banner (appears when 1 or more students are selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-red-50/50 to-white border border-rose-200 shadow-sm flex items-center justify-between flex-wrap gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs sm:text-sm font-bold text-rose-950">
              <strong className="text-rose-600 font-black">{selectedIds.length}</strong> student{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-[#EDF1F7] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Deselect All
            </button>
            <button
              type="button"
              onClick={handleBulkDeleteStudents}
              className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-500/25 inline-flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Full-Width Clean Students Table */}
      <div className="w-full">
        <StudentsTable
          students={filteredStudents}
          selectedStudent={null}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onSelectStudent={() => {}}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
          onCollectFee={handleCollectFee}
        />
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={editingStudent}
        existingStudents={students}
      />

      {/* Mobile-First CSV / Excel Bulk Import Modal */}
      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          if (showToast) showToast('Student records spreadsheet imported successfully!');
        }}
      />

      {/* Admin Password Verification Modal */}
      <AdminPasswordModal
        isOpen={adminAuthModal.isOpen}
        title={adminAuthModal.title}
        description={adminAuthModal.description}
        actionLabel={adminAuthModal.actionLabel}
        onConfirm={adminAuthModal.onAuthorize}
        onCancel={() => setAdminAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
