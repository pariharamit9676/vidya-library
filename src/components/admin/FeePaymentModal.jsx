import React from 'react';
import { CollectFeeModal } from '../fees/CollectFeeModal';

/**
 * Unified Fee Payment Modal
 * Re-routes to CollectFeeModal to ensure a single, consistent fee collection experience
 * across Students page, Fees page, and Dashboard.
 */
export const FeePaymentModal = ({
  isOpen,
  onClose,
  student,
  students = [],
  onRecordPayment
}) => {
  const studentList = students.length > 0 ? students : (student ? [student] : []);

  const handleRecord = async (payload) => {
    if (onRecordPayment) {
      await onRecordPayment({
        studentId: payload.studentId,
        payment: {
          id: `pay_${Date.now()}`,
          receiptNo: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: payload.amount,
          mode: payload.mode,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          remarks: payload.notes || '',
          studentId: payload.studentId,
          studentName: payload.studentName,
          seatNo: payload.seatNo,
          dueAmount: payload.dueAmount,
          balanceDueDate: payload.balanceDueDate,
          newDueDate: payload.newDueDate,
          plan: payload.plan
        },
        newDueDate: payload.newDueDate,
        dueAmount: payload.dueAmount,
        balanceDueDate: payload.balanceDueDate
      });
    }
  };

  return (
    <CollectFeeModal
      isOpen={isOpen}
      onClose={onClose}
      students={studentList}
      preSelectedStudent={student}
      onRecordPayment={handleRecord}
    />
  );
};
