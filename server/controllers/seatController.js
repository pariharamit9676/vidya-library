import { SeatModel } from '../models/Seat.js';
import { StudentModel } from '../models/Student.js';

export class SeatController {
  static async getLayout(req, res, next) {
    try {
      const layout = await SeatModel.getLayout();
      const seatCells = layout.cells.filter((c) => c.isSeat);

      const available = seatCells.filter((c) => c.status === 'Available').length;
      const occupied = seatCells.filter((c) => c.status === 'Occupied').length;
      const maintenance = seatCells.filter((c) => c.status === 'Maintenance').length;

      const premium = seatCells.filter((c) => c.category === 'Premium').length;
      const locker = seatCells.filter((c) => c.category === 'Locker').length;
      const normal = seatCells.filter((c) => c.category === 'Normal').length;

      return res.status(200).json({
        success: true,
        data: {
          ...layout,
          summary: {
            totalSeats: seatCells.length,
            available,
            occupied,
            maintenance,
            counts: {
              all: seatCells.length,
              premium,
              locker,
              normal
            }
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async saveLayout(req, res, next) {
    try {
      const { rows, cols, cells } = req.body;
      if (!cells || !Array.isArray(cells)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid layout payload: cells array is required.'
        });
      }

      const saved = await SeatModel.saveLayout({ rows, cols, cells });
      return res.status(200).json({
        success: true,
        message: 'Layout saved successfully.',
        data: saved
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateDimensions(req, res, next) {
    try {
      const { rows, cols } = req.body;
      if (!rows || !cols) {
        return res.status(400).json({
          success: false,
          message: 'Both rows and cols parameters are required.'
        });
      }

      const updated = await SeatModel.updateDimensions(rows, cols);
      return res.status(200).json({
        success: true,
        message: `Layout dimensions updated to ${rows} rows × ${cols} columns.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateSeat(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedCell = await SeatModel.updateCell(id, updates);
      if (!updatedCell) {
        return res.status(404).json({
          success: false,
          message: `Seat cell "${id}" not found.`
        });
      }

      // If seat number or category changed, sync student record if occupied
      if (updatedCell.assignedStudent && (updates.seatNumber || updates.category)) {
        await StudentModel.update(updatedCell.assignedStudent.id, {
          seatNo: String(updatedCell.seatNumber),
          seatCategory: updatedCell.category
        });
      }

      return res.status(200).json({
        success: true,
        message: `Seat ${updatedCell.seatNumber || ''} updated successfully.`,
        data: updatedCell
      });
    } catch (err) {
      next(err);
    }
  }

  static async assignStudent(req, res, next) {
    try {
      const { id } = req.params;
      const { studentId } = req.body;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'studentId is required for seat assignment.'
        });
      }

      const student = await StudentModel.getById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${studentId}" not found.`
        });
      }

      if (student.studentType !== 'Regular') {
        return res.status(400).json({
          success: false,
          message: 'Only Regular students can be assigned seats. Demo students are not eligible.'
        });
      }

      const studentInfo = {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        phone: student.phone,
        email: student.email,
        admissionDate: student.admissionDate,
        nextFeeDueDate: student.nextDueDate,
        avatar: student.avatar,
        plan: student.plan
      };

      const assignedCell = await SeatModel.assignStudent(id, studentInfo);

      // Update student's seatNo in student database
      await StudentModel.update(student.id, {
        seatNo: String(assignedCell.seatNumber),
        seatCategory: assignedCell.category
      });

      return res.status(200).json({
        success: true,
        message: `Seat ${assignedCell.seatNumber} successfully assigned to ${student.name}.`,
        data: assignedCell
      });
    } catch (err) {
      next(err);
    }
  }

  static async unassignStudent(req, res, next) {
    try {
      const { id } = req.params;
      const unassigned = await SeatModel.unassignStudent(id);

      if (unassigned) {
        // Clear seatNo in student database
        await StudentModel.update(unassigned.id, {
          seatNo: null,
          seatCategory: null
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Student unassigned from seat successfully.',
        data: unassigned
      });
    } catch (err) {
      next(err);
    }
  }
}
