import { StudentModel } from '../models/Student.js';
import { SeatModel } from '../models/Seat.js';
import { PaymentModel } from '../models/Payment.js';

export class DashboardController {
  static async getStats(req, res, next) {
    try {
      const students = await StudentModel.getAll();
      const layout = await SeatModel.getLayout();
      const payments = await PaymentModel.getAll();

      const seatCells = layout.cells.filter((c) => c.isSeat);
      const totalSeats = seatCells.length;
      const availableSeats = seatCells.filter((c) => c.status === 'Available').length;
      const occupiedSeats = seatCells.filter((c) => c.status === 'Occupied').length;
      const maintenanceSeats = seatCells.filter((c) => c.status === 'Maintenance').length;
      const occupancyPercent = totalSeats > 0 ? Number(((occupiedSeats / totalSeats) * 100).toFixed(1)) : 0;

      const regularCount = students.filter((s) => s.studentType === 'Regular').length;
      const demoCount = students.filter((s) => s.studentType === 'Demo').length;
      const insideCount = students.filter((s) => s.isCheckedIn).length;

      const activeStudents = students.filter((s) => s.status !== 'Inactive' && s.feeStatus !== 'INACTIVE');
      const overdueStudents = activeStudents.filter((s) => s.feeStatus === 'OVERDUE');
      const dueSoonStudents = activeStudents.filter((s) => s.feeStatus === 'DUE_SOON');
      const studentsWithDues = activeStudents.filter(
        (s) => (Number(s.dueAmount) > 0) || s.feeStatus === 'OVERDUE' || s.feeStatus === 'DUE_SOON'
      );

      const pendingDuesAmount = studentsWithDues.reduce((sum, s) => {
        const due = Number(s.dueAmount);
        if (!isNaN(due) && due > 0) return sum + due;
        return sum + (Number(s.planAmount) || 600);
      }, 0);

      const totalCollection = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      return res.status(200).json({
        success: true,
        data: {
          students: {
            total: students.length,
            regular: regularCount,
            demo: demoCount,
            inside: insideCount,
            overdue: overdueStudents.length,
            dueSoon: dueSoonStudents.length,
            totalWithDues: studentsWithDues.length
          },
          seats: {
            total: totalSeats,
            available: availableSeats,
            occupied: occupiedSeats,
            maintenance: maintenanceSeats,
            occupancyRate: occupancyPercent
          },
          financials: {
            monthlyCollection: totalCollection,
            pendingDues: pendingDuesAmount,
            totalTransactions: payments.length
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCharts(req, res, next) {
    try {
      const payments = await PaymentModel.getAll();
      const students = await StudentModel.getAll();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const curMonth = now.getMonth();
      const curYear = now.getFullYear();

      const monthlyCollections = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(curYear, curMonth - i, 1);
        const mIdx = d.getMonth();
        const y = d.getFullYear();
        const mName = months[mIdx];
        const sum = payments.reduce((acc, p) => {
          const pd = p.date ? new Date(p.date) : (p.createdAt ? new Date(p.createdAt) : null);
          if (pd && !isNaN(pd.getTime()) && pd.getMonth() === mIdx && pd.getFullYear() === y) {
            return acc + (Number(p.amount) || 0);
          }
          return acc;
        }, 0);
        monthlyCollections.push({ month: mName, amount: sum, target: 40000 });
      }

      const shifts = [
        'Morning (6 AM - 2 PM)',
        'Evening (2 PM - 10 PM)',
        'Night (10 PM - 6 AM)',
        'Full Day (24/7)'
      ];
      const shiftOccupancy = shifts.map((shiftName) => ({
        shift: shiftName,
        seats: students.filter((s) => s.shift === shiftName && s.seatNo && s.seatNo !== '-').length,
        capacity: 25
      }));

      return res.status(200).json({
        success: true,
        data: {
          monthlyCollections,
          shiftOccupancy
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
