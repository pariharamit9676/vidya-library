import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { StudentModal } from '../components/admin/StudentModal';
import { CollectFeeModal } from '../components/fees/CollectFeeModal';
import { QuickPunchModal } from '../components/admin/QuickPunchModal';
import { FeeReceiptModal } from '../components/admin/FeeReceiptModal';
import { Toast } from '../components/common/Toast';
import { useCreateStudent, useRecordFeePayment, useStudents, useToggleCheckIn } from '../services/useLibraryQueries';
import { referralService } from '../services/referralService';

export interface AdminLayoutContextType {
  openAddStudent: () => void;
  openCollectFee: (targetStudent?: any) => void;
  openQuickPunch: () => void;
  openReceipt: (receipt: any) => void;
}

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    students,
    settings,
    recordFeePayment,
    toggleCheckIn,
    toast,
    clearToast,
    showToast,
    showConfirm
  } = useLibrary();

  const { data: apiStudents } = useStudents();
  const toggleCheckInMutation = useToggleCheckIn();

  // Prefer the real students from server API, falling back to local state
  const activeStudents = (Array.isArray(apiStudents) && apiStudents.length > 0) ? (apiStudents as any[]) : students;

  const handleToggleCheckIn = async (studentId: string) => {
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
      return res;
    } catch (err: any) {
      console.error('Error toggling check in:', err);
      const errMsg = err?.message || 'Failed to update attendance punch';
      if (showToast) {
        showToast(errMsg, 'error');
      }
      throw err;
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Action Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState<boolean>(false);
  const [selectedFeeStudent, setSelectedFeeStudent] = useState<any>(null);
  const [isQuickPunchOpen, setIsQuickPunchOpen] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  const createStudentMutation = useCreateStudent();
  const recordFeePaymentMutation = useRecordFeePayment();

  const handleLogout = async () => {
    if (showConfirm) {
      const confirmed = await showConfirm({
        title: 'Logout Admin',
        message: 'Are you sure you want to log out of the admin portal?',
        confirmText: 'Yes, Logout',
        cancelText: 'Cancel',
        variant: 'danger'
      });
      if (!confirmed) return;
    }
    logout();
    navigate('/login');
  };

  const contextValue: AdminLayoutContextType = {
    openAddStudent: () => setIsAddStudentOpen(true),
    openCollectFee: (targetStudent?: any) => {
      setSelectedFeeStudent(targetStudent || null);
      setIsCollectFeeOpen(true);
    },
    openQuickPunch: () => setIsQuickPunchOpen(true),
    openReceipt: (receipt: any) => {
      setActiveReceipt(receipt);
      setIsReceiptOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col lg:flex-row font-sans text-[#192038]">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* 2. Main Layout Content Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLogout={handleLogout}
        />

        {/* Dynamic Nested Route Content via React Router <Outlet /> */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-[1600px] w-full mx-auto">
          <Outlet context={contextValue} />
        </main>
      </div>

      {/* Quick Action Modals */}
      <StudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSave={async (data) => {
          // Close modal immediately for snappy UX
          setIsAddStudentOpen(false);
          try {
            await createStudentMutation.mutateAsync({
              name: data.name,
              phone: data.phone,
              admissionDate: data.admissionDate,
              studentType: data.studentType,
              seatNo: data.seatNo || '-',
              seatCategory: data.category || data.seatCategory || 'Normal',
              plan: data.plan,
              planAmount: data.planAmount,
              planMonths: data.planMonths,
              paidAmount: data.paidAmount,
              dueAmount: data.dueAmount,
              balanceDueDate: data.balanceDueDate,
              nextDueDate: data.nextDueDate || data.nextFeeDueDate,
              initialFeePayment: Number(data.paidAmount) > 0 ? {
                amount: Number(data.paidAmount),
                mode: 'Cash'
              } : undefined,
              notes: data.notes
            });
            if (data.studentType !== 'Demo' && data.seatNo && data.seatNo !== '-') {
              try {
                referralService.checkAndApproveByStudent(data.phone, data.seatNo);
              } catch {}
            }
          } catch (e) {
            console.error('Header Add Student error:', e);
          }
        }}
        existingStudents={activeStudents}
      />

      <CollectFeeModal
        isOpen={isCollectFeeOpen}
        onClose={() => {
          setIsCollectFeeOpen(false);
          setSelectedFeeStudent(null);
        }}
        students={activeStudents}
        preSelectedStudent={selectedFeeStudent}
        onRecordPayment={async (payload) => {
          const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const payment = {
            id: `pay_${Date.now()}`,
            receiptNo,
            studentId: payload.studentId,
            studentRefId: selectedFeeStudent?.studentId || selectedFeeStudent?.id || payload.studentId,
            studentName: payload.studentName,
            phone: selectedFeeStudent?.phone || '',
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

          try {
            await recordFeePaymentMutation.mutateAsync({
              studentId: payload.studentId,
              amount: payload.amount,
              mode: payload.mode,
              plan: payload.plan,
              newDueDate: payload.newDueDate,
              dueAmount: payload.dueAmount,
              balanceDueDate: payload.balanceDueDate,
              seatNo: payload.seatNo,
              seatCategory: payload.seatCategory,
              receiptNo
            });
          } catch (e: any) {
            console.error('Error recording payment in backend:', e);
          }

          recordFeePayment({
            studentId: payload.studentId,
            payment,
            newDueDate: payload.newDueDate,
            dueAmount: payload.dueAmount,
            balanceDueDate: payload.balanceDueDate
          });

          // Automatically approve referral if this student was referred as Demo
          try {
            referralService.checkAndApproveByStudent(payload.studentId, payload.seatNo);
            if (selectedFeeStudent?.phone) {
              referralService.checkAndApproveByStudent(selectedFeeStudent.phone, payload.seatNo);
            }
          } catch {}

          setIsCollectFeeOpen(false);
          setSelectedFeeStudent(null);
          setActiveReceipt(payment);
          setIsReceiptOpen(true);

          if (showToast) {
            showToast(`Fee payment of ₹${payload.amount} recorded for ${payload.studentName}!`);
          }
        }}
      />

      <QuickPunchModal
        isOpen={isQuickPunchOpen}
        onClose={() => setIsQuickPunchOpen(false)}
        students={activeStudents}
        onToggleCheckIn={handleToggleCheckIn}
      />

      <FeeReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={activeReceipt}
        settings={settings}
      />
    </div>
  );
};
