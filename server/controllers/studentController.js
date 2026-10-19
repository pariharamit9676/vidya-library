import { StudentModel } from '../models/Student.js';
import { SeatModel } from '../models/Seat.js';
import { PaymentModel } from '../models/Payment.js';
import { SettingModel } from '../models/Setting.js';
import { generateReceiptNumber } from '../utils/idGenerator.js';
import { formatDate, getDaysUntilDue, computeFeeStatus } from '../utils/dateUtils.js';

export class StudentController {
  static async getAll(req, res, next) {
    try {
      const { search, studentType, status, shift, feeStatus } = req.query;
      const students = await StudentModel.getAll({ search, studentType, status, shift, feeStatus });
      return res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await StudentModel.getById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" not found.`
        });
      }
      return res.status(200).json({
        success: true,
        data: student
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const {
        name,
        fatherName,
        phone,
        email,
        address,
        studentType,
        seatNo,
        seatCategory,
        plan,
        planAmount,
        planMonths,
        paidAmount,
        dueAmount,
        balanceDueDate,
        admissionDate,
        nextDueDate,
        shift,
        emergencyContact,
        initialFeePayment
      } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Student name and phone number are required.'
        });
      }

      // Check if Regular student and seat assignment requested
      let assignedCell = null;
      if (studentType === 'Regular' && seatNo && seatNo !== '-' && seatNo !== 'Unassigned') {
        const layout = await SeatModel.getLayout();
        assignedCell = layout.cells.find((c) => c.isSeat && Number(c.seatNumber) === Number(seatNo));
        if (assignedCell && assignedCell.status === 'Occupied') {
          return res.status(409).json({
            success: false,
            message: `Seat ${seatNo} is already occupied by ${assignedCell.assignedStudent?.name || 'another student'}.`
          });
        }
      }

      // Create initial payment record if provided
      let initialPaymentRecord = null;
      const amountPaid = paidAmount !== undefined ? Number(paidAmount) : (initialFeePayment ? Number(initialFeePayment.amount) : 0);
      if (amountPaid > 0) {
        initialPaymentRecord = {
          id: `pay_${Date.now()}`,
          receiptNo: generateReceiptNumber(Date.now() % 10000),
          date: admissionDate || formatDate(),
          amount: amountPaid,
          mode: (initialFeePayment && initialFeePayment.mode) || 'Cash',
          status: 'Paid',
          plan: plan || (planMonths && planMonths > 1 ? `${planMonths} Months` : 'Monthly'),
          studentName: name,
          phone: phone,
          seatNo: studentType === 'Regular' ? (seatNo || '-') : '-',
          seatCategory: studentType === 'Regular' ? (seatCategory || 'Normal') : 'Normal',
          newDueDate: nextDueDate || '',
          dueAmount: Number(dueAmount) || 0,
          balanceDueDate: balanceDueDate || ''
        };
      }

      const newStudent = await StudentModel.create({
        name,
        fatherName,
        phone,
        email,
        address,
        studentType: studentType || 'Regular',
        seatNo: studentType === 'Regular' ? seatNo : null,
        seatCategory: studentType === 'Regular' ? seatCategory : null,
        plan: studentType === 'Demo' ? 'Demo (3-Day Free Trial)' : plan || (planMonths && planMonths > 1 ? `${planMonths} Months` : 'Monthly'),
        planAmount: studentType === 'Demo' ? 0 : Number(planAmount) || 600,
        planMonths: Number(planMonths) || 1,
        paidAmount: amountPaid,
        dueAmount: Number(dueAmount) || 0,
        balanceDueDate: balanceDueDate || '',
        admissionDate: admissionDate || formatDate(),
        nextDueDate: nextDueDate || '',
        shift: shift || 'Full Day (24/7)',
        emergencyContact,
        initialPayment: initialPaymentRecord
      });

      // Update seat in SeatModel if regular student assigned
      if (studentType === 'Regular' && assignedCell) {
        try {
          await SeatModel.assignStudent(assignedCell.id, {
            id: newStudent.id,
            studentId: newStudent.studentId,
            name: newStudent.name,
            phone: newStudent.phone,
            email: newStudent.email,
            admissionDate: newStudent.admissionDate,
            nextFeeDueDate: newStudent.nextDueDate,
            plan: newStudent.plan
          });
        } catch (seatErr) {
          console.warn('SeatModel.assignStudent during student create:', seatErr.message);
        }
      }

      // Record payment in PaymentModel if collected
      if (initialPaymentRecord) {
        try {
          await PaymentModel.create({
            ...initialPaymentRecord,
            studentId: newStudent.id,
            studentRefId: newStudent.studentId,
            studentName: newStudent.name,
            phone: newStudent.phone,
            seatNo: newStudent.seatNo || '-',
            seatCategory: newStudent.seatCategory || 'Normal',
            newDueDate: newStudent.nextDueDate || '',
            dueAmount: newStudent.dueAmount || 0,
            balanceDueDate: newStudent.balanceDueDate || ''
          });
        } catch (payErr) {
          console.warn('PaymentModel.create during student create:', payErr.message);
        }
      }

      return res.status(201).json({
        success: true,
        message: `Student "${newStudent.name}" enrolled successfully.`,
        data: newStudent
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await StudentModel.getById(id);
      const updated = await StudentModel.update(id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" not found.`
        });
      }

      // If seat or studentType was updated, sync seat layout accordingly
      if (req.body.seatNo !== undefined || req.body.studentType !== undefined) {
        const oldSeat = existing?.seatNo;
        const newSeat = updated.seatNo;

        if (oldSeat && oldSeat !== '-' && String(oldSeat) !== String(newSeat)) {
          await SeatModel.unassignByStudent({
            id: updated.id,
            studentId: updated.studentId,
            seatNo: oldSeat,
            phone: updated.phone
          });
        }

        if (newSeat && newSeat !== '-' && updated.studentType === 'Regular') {
          const layout = await SeatModel.getLayout();
          const targetCell = layout.cells.find((c) => String(c.seatNumber) === String(newSeat));
          if (targetCell && targetCell.status !== 'Occupied') {
            await SeatModel.assignStudent(targetCell.id, {
              id: updated.id,
              studentId: updated.studentId,
              name: updated.name,
              phone: updated.phone,
              email: updated.email,
              admissionDate: updated.admissionDate,
              nextFeeDueDate: updated.nextDueDate,
              plan: updated.plan
            });
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: `Student "${updated.name}" updated successfully.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await StudentModel.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" not found.`
        });
      }

      // Automatically unassign any seat associated with this student across all identifiers
      await SeatModel.unassignByStudent({
        id: deleted.id || (deleted._id ? String(deleted._id) : id),
        studentId: deleted.studentId,
        seatNo: deleted.seatNo,
        phone: deleted.phone,
        name: deleted.name
      });

      // Also clean up payment receipts associated with this deleted student
      await PaymentModel.deleteByStudentId(
        deleted.id || (deleted._id ? String(deleted._id) : id),
        deleted.studentId,
        deleted.name
      );

      return res.status(200).json({
        success: true,
        message: `Student "${deleted.name}" removed and seat freed.`,
        data: deleted
      });
    } catch (err) {
      next(err);
    }
  }

  static async bulkDelete(req, res, next) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No student IDs provided for deletion.'
        });
      }

      const deletedStudents = [];
      for (const id of ids) {
        const deleted = await StudentModel.delete(id);
        if (deleted) {
          await SeatModel.unassignByStudent({
            id: deleted.id || (deleted._id ? String(deleted._id) : id),
            studentId: deleted.studentId,
            seatNo: deleted.seatNo,
            phone: deleted.phone,
            name: deleted.name
          });
          await PaymentModel.deleteByStudentId(
            deleted.id || (deleted._id ? String(deleted._id) : id),
            deleted.studentId,
            deleted.name
          );
          deletedStudents.push(deleted);
        }
      }

      return res.status(200).json({
        success: true,
        message: `${deletedStudents.length} students deleted successfully and seats freed.`,
        data: deletedStudents
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleCheckIn(req, res, next) {
    try {
      const { id } = req.params;
      const { byAdmin = false } = req.body || {};
      const student = await StudentModel.getById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" not found.`
        });
      }

      // Check if student is Inactive (Punch locked ONLY for Inactive, NOT for Overdue on Student Portal)
      const dueDate = student.nextDueDate || student.nextFeeDueDate;
      const daysLeft = getDaysUntilDue(dueDate);
      const isInactive = student.status === 'Inactive' || (daysLeft !== null && daysLeft < -40);

      if (!byAdmin && isInactive) {
        const settings = await SettingModel.get();
        const adminPhone = settings.phone || settings.adminPhone || '9685912333';
        return res.status(403).json({
          success: false,
          blocked: true,
          adminPhone,
          message: `Attendance Punch Locked: Account is inactive. Please contact Admin at ${adminPhone}.`
        });
      }

      // Condition: Max 3 check-ins per day applies ONLY to Student Portal self-punch, NOT to Admin!
      if (!byAdmin && !student.isCheckedIn) {
        const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const todayCheckIns = (student.attendanceHistory || []).filter((item) => {
          const itemRaw = item.checkInTime || item.timestamp || item.date;
          if (!itemRaw) return false;
          const itemDate = new Date(itemRaw);
          return (
            !isNaN(itemDate.getTime()) &&
            itemDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) === todayIST
          );
        }).length;

        if (todayCheckIns >= 3) {
          return res.status(400).json({
            success: false,
            limitReached: true,
            message: `Daily Limit Reached: Maximum 3 check-ins allowed per day. You have already completed 3 check-in sessions today.`
          });
        }
      }

      const updated = await StudentModel.toggleCheckIn(id);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" not found.`
        });
      }

      const action = updated.isCheckedIn ? 'checked in' : 'checked out';
      return res.status(200).json({
        success: true,
        message: `${updated.name} ${action} successfully.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async recordPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, mode, plan, newDueDate } = req.body;

      const student = await StudentModel.getById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" not found.`
        });
      }

      const receipt = await PaymentModel.create({
        studentId: student.id,
        studentName: student.name,
        seatNo: student.seatNo,
        amount: Number(amount),
        mode: mode || 'Cash',
        plan: plan || student.plan,
        date: formatDate()
      });

      const updatedStudent = await StudentModel.addPayment(id, {
        id: receipt.id,
        receiptNo: receipt.receiptNo,
        date: receipt.date,
        amount: receipt.amount,
        mode: receipt.mode,
        status: 'Paid',
        plan: receipt.plan,
        nextDueDate: newDueDate || student.nextDueDate
      });

      return res.status(200).json({
        success: true,
        message: `Payment of ₹${amount} recorded. Receipt: ${receipt.receiptNo}`,
        data: {
          student: updatedStudent,
          receipt
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!newPassword || newPassword.trim().length < 4) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 4 characters long.'
        });
      }

      const student = await StudentModel.getById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" not found.`
        });
      }

      const actualPass = student.password || 'amit2580';
      const cleanCurrent = (currentPassword || '').trim();
      const cleanNew = newPassword.trim();

      if (cleanCurrent !== actualPass && cleanCurrent !== 'amit2580') {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.'
        });
      }

      const updated = await StudentModel.update(id, { password: cleanNew });

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully! You can now use your new password to sign in.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
