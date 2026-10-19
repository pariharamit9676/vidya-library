import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredStudents,
  saveStudents,
  getStoredSettings,
  saveSettings,
  computeFeeStatus,
  formatTimeOnly,
  exportStudentsToCSV
} from '../utils/storage';
import { INITIAL_STUDENTS } from '../data/initialData';
import { PopupDialog } from '../components/common/PopupDialog';
import { settingsService } from '../services/api';

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [students, setStudents] = useState(() => getStoredStudents());
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [dialog, setDialog] = useState(null);

  // Mobile-first custom Confirm & Alert Popups (Promise based)
  const showConfirm = ({
    title = 'Please Confirm',
    message,
    confirmText = 'Yes, Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
  }) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        variant,
        isConfirm: true,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        }
      });
    });
  };

  const showAlert = ({
    title = 'Notice',
    message,
    confirmText = 'Got It',
    variant = 'warning'
  }) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        confirmText,
        variant,
        isConfirm: false,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        }
      });
    });
  };

  // Ensure clean standard styling without dark mode
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');

    // Fetch live settings from database
    settingsService.get()
      .then((res) => {
        if (res && res.success && res.data) {
          setSettings(res.data);
          saveSettings(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load settings from database:', err.message);
      });
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: 'success' });
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    try {
      const res = await settingsService.update(newSettings);
      if (res && res.success && res.data) {
        setSettings(res.data);
        saveSettings(res.data);
      }
      showToast('Settings saved to database successfully!');
    } catch (err) {
      console.error('Failed to sync settings with database:', err);
      showToast('Settings saved locally, server sync failed.', 'error');
    }
  };

  const updateStudentsList = (updated) => {
    const recalculated = updated.map((s) => ({
      ...s,
      feeStatus: computeFeeStatus(s.nextFeeDueDate)
    }));
    setStudents(recalculated);
    saveStudents(recalculated);
  };

  // Toggle Check-in / Check-out
  const toggleCheckIn = (studentId, suppressToast = false) => {
    const now = new Date();
    const updated = students.map((s) => {
      const isMatch =
        s.id === studentId ||
        s._id === studentId ||
        s.studentId === studentId ||
        String(s.id) === String(studentId);
      if (!isMatch) return s;

      if (!s.isCheckedIn) {
        if (!suppressToast) {
          showToast(`🟢 ${s.name} checked in at ${formatTimeOnly(now.toISOString())}`);
        }
        return {
          ...s,
          isCheckedIn: true,
          currentCheckInTime: now.toISOString()
        };
      } else {
        const start = new Date(s.currentCheckInTime || now);
        const diffMinutes = Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60)));
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        const formattedStay = hours === 0 ? `${mins}m` : `${hours}h ${mins}m`;

        const newStayRecord = {
          id: `att-${Date.now()}`,
          date: now.toISOString().slice(0, 10),
          rawTimestamp: now.getTime(),
          timestamp: now.toISOString(),
          checkIn: s.currentCheckInTime || now.toISOString(),
          checkOut: now.toISOString(),
          checkOutTime: now.toISOString(),
          durationMinutes: diffMinutes,
          formattedDuration: formattedStay
        };

        const existingHistory = s.attendanceHistory || [];
        if (!suppressToast) {
          showToast(`🔴 ${s.name} checked out. Stay duration: ${formattedStay}`);
        }

        return {
          ...s,
          isCheckedIn: false,
          currentCheckInTime: null,
          lastStay: newStayRecord,
          attendanceHistory: [newStayRecord, ...existingHistory]
        };
      }
    });

    updateStudentsList(updated);
  };

  // Save Student (Add / Edit)
  const saveStudent = (formData, studentToEdit = null) => {
    const nextDate = formData.nextDueDate || formData.nextFeeDueDate;
    if (studentToEdit) {
      const updated = students.map((s) => {
        if (s.id === studentToEdit.id) {
          return {
            ...s,
            ...formData,
            nextDueDate: nextDate,
            nextFeeDueDate: nextDate,
            dueAmount: Number(formData.dueAmount) || 0,
            feeStatus: Number(formData.dueAmount) > 0 ? 'DUE_SOON' : computeFeeStatus(nextDate)
          };
        }
        return s;
      });
      updateStudentsList(updated);
      showToast(`Student details for "${formData.name}" updated!`);
    } else {
      const nextIdNum = 100 + students.length + 1;
      const newStudent = {
        id: `VIDYA-${nextIdNum}`,
        ...formData,
        nextDueDate: nextDate,
        nextFeeDueDate: nextDate,
        dueAmount: Number(formData.dueAmount) || 0,
        feeStatus: Number(formData.dueAmount) > 0 ? 'DUE_SOON' : computeFeeStatus(nextDate),
        isCheckedIn: false,
        currentCheckInTime: null,
        lastStay: null,
        attendanceHistory: [],
        feeHistory: []
      };
      updateStudentsList([newStudent, ...students]);
      showToast(`Student "${formData.name}" enrolled at Seat ${formData.seatNo}!`);
    }
  };

  // Record Fee Payment
  const recordFeePayment = ({ studentId, payment, newDueDate, dueAmount }) => {
    const updated = students.map((s) => {
      if (s.id !== studentId && s.studentId !== studentId) return s;

      const history = s.feeHistory || [];
      const remaining = dueAmount !== undefined ? Number(dueAmount) : 0;
      const regularPlan = (payment.plan && !payment.plan.includes('Demo'))
        ? payment.plan
        : (s.plan && !s.plan.includes('Demo') ? s.plan : 'Monthly');

      return {
        ...s,
        status: 'Active',
        studentType: 'Regular',
        plan: regularPlan,
        seatNo: payment.seatNo && payment.seatNo !== '-' ? payment.seatNo : s.seatNo,
        lastFeePaidDate: payment.date,
        nextDueDate: newDueDate,
        nextFeeDueDate: newDueDate,
        dueAmount: remaining,
        feeStatus: remaining > 0 ? 'DUE_SOON' : computeFeeStatus(newDueDate),
        feeHistory: [payment, ...history]
      };
    });

    updateStudentsList(updated);
    showToast(`Payment of ₹${payment.amount} recorded for ${payment.studentName}!`);
  };

  // Delete Student
  const deleteStudent = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const confirmed = await showConfirm({
      title: 'Remove Student',
      message: `Are you sure you want to remove "${student.name}" (Seat ${student.seatNo}) from the records?`,
      confirmText: 'Yes, Remove',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      const updated = students.filter((s) => s.id !== studentId);
      updateStudentsList(updated);
      showToast(`Student "${student.name}" removed from records.`, 'danger');
    }
  };

  // Reset to Demo Data
  const resetDemoData = async () => {
    const confirmed = await showConfirm({
      title: 'Reset to Demo Data',
      message: 'Do you want to reset all records to default demo data? Any unsaved changes will be lost.',
      confirmText: 'Yes, Reset',
      cancelText: 'Cancel',
      variant: 'warning'
    });

    if (confirmed) {
      saveStudents(INITIAL_STUDENTS);
      setStudents(INITIAL_STUDENTS);
      showToast('Demo data reloaded!');
    }
  };

  // Export CSV
  const exportCSV = () => {
    exportStudentsToCSV(students);
    showToast("Downloaded student records CSV!");
  };

  const insideCount = students.filter((s) => s.isCheckedIn).length;
  const overdueCount = students.filter((s) => s.feeStatus === 'OVERDUE').length;
  const dueSoonCount = students.filter((s) => s.feeStatus === 'DUE_SOON').length;

  return (
    <LibraryContext.Provider
      value={{
        students,
        settings,
        updateSettings,
        theme: 'light',
        toggleTheme: () => {},
        toggleCheckIn,
        saveStudent,
        deleteStudent,
        recordFeePayment,
        resetDemoData,
        exportCSV,
        toast,
        showToast,
        clearToast,
        dialog,
        showConfirm,
        showAlert,
        insideCount,
        overdueCount,
        dueSoonCount,
        totalSeats: 24
      }}
    >
      {children}
      {dialog && <PopupDialog {...dialog} />}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
