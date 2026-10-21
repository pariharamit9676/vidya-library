import { PaymentModel } from '../models/Payment.js';
import { StudentModel } from '../models/Student.js';
import { ReferralModel } from '../models/Referral.js';
import { formatDate } from '../utils/dateUtils.js';

export class FeeController {
  static async getReceipts(req, res, next) {
    try {
      const receipts = await PaymentModel.getAll();
      return res.status(200).json({
        success: true,
        count: receipts.length,
        data: receipts
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDues(req, res, next) {
    try {
      const students = await StudentModel.getAll();
      const dues = students
        .filter((s) => s.studentType === 'Regular' && s.status !== 'Inactive' && s.feeStatus !== 'INACTIVE' && (s.feeStatus === 'OVERDUE' || s.feeStatus === 'DUE_SOON'))
        .map((s) => ({
          studentId: s.id,
          admissionNo: s.studentId,
          name: s.name,
          seatNo: s.seatNo,
          seatCategory: s.seatCategory,
          amount: s.planAmount || 600,
          dueDate: s.nextDueDate,
          status: s.feeStatus
        }));

      return res.status(200).json({
        success: true,
        count: dues.length,
        data: dues
      });
    } catch (err) {
      next(err);
    }
  }

  static async recordPayment(req, res, next) {
    try {
      const { studentId, amount, mode, plan, newDueDate, dueAmount, balanceDueDate, seatNo, seatCategory, notes, reference } = req.body;

      if (!studentId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'studentId and amount are required.'
        });
      }

      const student = await StudentModel.getById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student "${studentId}" not found.`
        });
      }

      const finalSeatNo = (seatNo && seatNo !== '-') ? String(seatNo).trim() : student.seatNo;
      const finalCategory = seatCategory || student.seatCategory || student.category || 'Normal';

      const receipt = await PaymentModel.create({
        studentId: student.id,
        studentName: student.name,
        seatNo: finalSeatNo,
        amount: Number(amount),
        mode: mode || 'Cash',
        plan: plan || student.plan,
        date: formatDate(),
        notes: notes || '',
        reference: reference || ''
      });

      const updatedStudent = await StudentModel.addPayment(student.id, {
        id: receipt.id,
        receiptNo: receipt.receiptNo,
        date: receipt.date,
        amount: receipt.amount,
        mode: receipt.mode,
        status: 'Paid',
        plan: receipt.plan,
        nextDueDate: newDueDate || student.nextDueDate,
        dueAmount: dueAmount !== undefined ? Number(dueAmount) : 0,
        balanceDueDate: balanceDueDate || '',
        seatNo: finalSeatNo,
        seatCategory: finalCategory,
        notes: notes || '',
        reference: reference || ''
      });

      // Auto-approve referral for referrer immediately when referee pays fee
      try {
        await ReferralModel.checkAndApproveByReferee(student.phone || student.studentId, finalSeatNo);
      } catch (refErr) {
        console.error('Auto approve referral on fee payment warning:', refErr.message);
      }

      return res.status(201).json({
        success: true,
        message: `Payment receipt ${receipt.receiptNo} created successfully.`,
        data: {
          receipt,
          student: updatedStudent
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
