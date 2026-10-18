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

  static getCharts(req, res, next) {
    try {
      // Monthly fee collection trend
      const monthlyCollections = [
        { month: 'May', amount: 32000, target: 40000 },
        { month: 'Jun', amount: 38500, target: 40000 },
        { month: 'Jul', amount: 41200, target: 45000 },
        { month: 'Aug', amount: 46800, target: 45000 },
        { month: 'Sep', amount: 49500, target: 50000 },
        { month: 'Oct', amount: 54200, target: 50000 }
      ];

      // Seat occupancy by shift
      const shiftOccupancy = [
        { shift: 'Morning (7AM - 2PM)', seats: 18, capacity: 25 },
        { shift: 'Evening (2PM - 10PM)', seats: 14, capacity: 25 },
        { shift: 'Night (10PM - 6AM)', seats: 8, capacity: 25 },
        { shift: 'Full Day (24/7)', seats: 10, capacity: 15 }
      ];

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
