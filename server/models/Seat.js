import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { CategoryModel } from './Category.js';
import { isMongoConnected } from '../config/database.js';
import { SeatLayoutMongo } from './schemas/SeatSchema.js';
import { StudentMongo } from './schemas/StudentSchema.js';
import { getDaysUntilDue } from '../utils/dateUtils.js';

const FILE_NAME = 'seats.json';

// Helper to strictly renumber numeric seats sequentially
export const renumberGridCells = (gridList) => {
  let currentNum = 1;
  return gridList.map((cell) => {
    if (!cell.isSeat) {
      return { ...cell, seatNumber: null };
    }
    const num = currentNum++;
    return { ...cell, seatNumber: num };
  });
};

// Generate default 6x8 layout
const generateDefaultLayout = () => {
  const rows = 6;
  const cols = 8;
  const aisleSlots = new Set(['2-5', '4-5']);
  const maintenanceSlots = new Set(['1-8', '4-4', '6-1']);
  const occupiedSlots = new Map([
    ['1-2', { id: '2', studentId: '#STU002', name: 'Priya Verma', phone: '9123456789', admissionDate: '10 Aug 2026', nextFeeDueDate: '20 Oct 2026', plan: 'Monthly' }],
    ['1-4', { id: '3', studentId: '#STU003', name: 'Aman Singh', phone: '9988776655', admissionDate: '01 Sep 2026', nextFeeDueDate: '01 Nov 2026', plan: 'Quarterly' }],
    ['1-7', { id: '4', studentId: '#STU004', name: 'Neha Patel', phone: '9811223344', admissionDate: '25 Jul 2026', nextFeeDueDate: '25 Oct 2026', plan: 'Monthly' }],
    ['2-3', { id: '5', studentId: '#STU005', name: 'Vikram Malhotra', phone: '9765432109', admissionDate: '05 Sep 2026', nextFeeDueDate: '05 Nov 2026', plan: 'Monthly' }],
    ['2-6', { id: '6', studentId: '#STU006', name: 'Ananya Gupta', phone: '9845012345', admissionDate: '12 Sep 2026', nextFeeDueDate: '12 Oct 2026', plan: 'Monthly' }],
    ['3-2', { id: '7', studentId: '#STU007', name: 'Rohan Mehra', phone: '9900112233', admissionDate: '18 Aug 2026', nextFeeDueDate: '18 Oct 2026', plan: 'Monthly' }],
    ['3-5', { id: '8', studentId: '#STU008', name: 'Kavita Joshi', phone: '9871122334', admissionDate: '30 Jun 2026', nextFeeDueDate: '30 Oct 2026', plan: 'Half Yearly' }],
    ['3-8', { id: '9', studentId: '#STU009', name: 'Deepak Rao', phone: '9123001122', admissionDate: '02 Oct 2026', nextFeeDueDate: '02 Nov 2026', plan: 'Monthly' }],
    ['4-3', { id: '10', studentId: '#STU010', name: 'Sneha Roy', phone: '9988112233', admissionDate: '14 Sep 2026', nextFeeDueDate: '14 Oct 2026', plan: 'Monthly' }],
    ['4-7', { id: '1', studentId: '#STU001', name: 'Rahul Sharma', phone: '9876543210', admissionDate: '15 Aug 2026', nextFeeDueDate: '18 Oct 2026', plan: 'Monthly' }]
  ]);

  const cells = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const coord = `${r}-${c}`;
      const isAisle = aisleSlots.has(coord);

      let category = 'Normal';
      let monthlyFee = 600;
      if (r === 1 || r === 3) {
        category = 'Premium';
        monthlyFee = 800;
      } else if (c === 3 || c === 6) {
        category = 'Locker';
        monthlyFee = 700;
      }

      let status = 'Available';
      let assignedStudent = null;

      if (isAisle) {
        status = 'Available';
      } else if (maintenanceSlots.has(coord)) {
        status = 'Maintenance';
      } else if (occupiedSlots.has(coord)) {
        status = 'Occupied';
        assignedStudent = occupiedSlots.get(coord);
      }

      cells.push({
        id: `cell-${r}-${c}`,
        row: r,
        col: c,
        isSeat: !isAisle,
        seatNumber: 1, // dynamically renumbered
        category,
        status,
        monthlyFee,
        addedOn: '12 Aug 2026, 10:30 AM',
        assignedStudent
      });
    }
  }

  return {
    rows,
    cols,
    cells: renumberGridCells(cells)
  };
};

export class SeatModel {
  static async getLayout() {
    let layout = null;
    if (isMongoConnected()) {
      try {
        const doc = await SeatLayoutMongo.findOne({ layoutId: 'main_layout' }).lean();
        if (doc && doc.cells && doc.cells.length > 0) {
          layout = {
            rows: doc.rows,
            cols: doc.cols,
            cells: renumberGridCells(doc.cells)
          };
        }
      } catch (err) {
        console.error('Mongo read layout error, falling back to JSON:', err.message);
      }
    }
    if (!layout) {
      layout = readJsonFile(FILE_NAME, generateDefaultLayout());
    }

    // Auto-reconciliation: sync real-time student assignments and live punch-in status
    try {
      let activeStudents = [];
      if (isMongoConnected()) {
        activeStudents = await StudentMongo.find({}).lean();
      }
      if (!activeStudents || activeStudents.length === 0) {
        activeStudents = readJsonFile('students.json', []);
      }

      // Map active students by numeric seatNumber
      const studentBySeatNumber = new Map();
      activeStudents.forEach((s) => {
        const dueDate = s.nextDueDate || s.nextFeeDueDate;
        const daysLeft = getDaysUntilDue(dueDate);
        const isInactive = s.status === 'Inactive' || (daysLeft !== null && daysLeft < -40);

        // Inactive students should NEVER hold a seat
        if (isInactive) return;

        if (s.seatNo && s.seatNo !== '-') {
          const match = String(s.seatNo).match(/\d+/);
          const seatNum = match ? parseInt(match[0], 10) : parseInt(String(s.seatNo).trim(), 10);
          if (!isNaN(seatNum)) {
            studentBySeatNumber.set(seatNum, s);
          }
        }
      });

      let modified = false;
      const reconciledCells = layout.cells.map((cell) => {
        if (!cell.isSeat) return cell;

        const seatNum = Number(cell.seatNumber);
        const assignedStudentFromDB = studentBySeatNumber.get(seatNum);

        if (assignedStudentFromDB) {
          const newAssigned = {
            id: assignedStudentFromDB.id || (assignedStudentFromDB._id ? String(assignedStudentFromDB._id) : ''),
            _id: assignedStudentFromDB._id ? String(assignedStudentFromDB._id) : undefined,
            studentId: assignedStudentFromDB.studentId || '',
            name: assignedStudentFromDB.name || '',
            phone: assignedStudentFromDB.phone || '',
            avatar: assignedStudentFromDB.avatar,
            admissionDate: assignedStudentFromDB.admissionDate,
            nextFeeDueDate: assignedStudentFromDB.nextDueDate || assignedStudentFromDB.nextFeeDueDate,
            plan: assignedStudentFromDB.plan || 'Monthly',
            isCheckedIn: Boolean(assignedStudentFromDB.isCheckedIn),
            currentCheckInTime: assignedStudentFromDB.currentCheckInTime || null
          };

          const targetStatus = 'Occupied';

          if (
            cell.status !== targetStatus ||
            !cell.assignedStudent ||
            cell.assignedStudent.name !== newAssigned.name ||
            cell.assignedStudent.studentId !== newAssigned.studentId ||
            cell.assignedStudent.isCheckedIn !== newAssigned.isCheckedIn ||
            cell.assignedStudent.currentCheckInTime !== newAssigned.currentCheckInTime
          ) {
            modified = true;
          }

          return {
            ...cell,
            status: targetStatus,
            assignedStudent: newAssigned
          };
        } else if (cell.status === 'Occupied' || cell.assignedStudent) {
          // If marked occupied but no matching student in DB has this seat
          modified = true;
          return {
            ...cell,
            status: 'Available',
            assignedStudent: null
          };
        }

        return cell;
      });

      if (modified) {
        layout.cells = reconciledCells;
        if (isMongoConnected()) {
          await SeatLayoutMongo.findOneAndUpdate(
            { layoutId: 'main_layout' },
            { $set: { cells: layout.cells } }
          );
        }
        writeJsonFile(FILE_NAME, layout);
      }
    } catch (reconcileErr) {
      console.error('Seat layout auto-reconciliation error:', reconcileErr.message);
    }

    return layout;
  }

  static async saveLayout({ rows, cols, cells }) {
    const safeRows = Number(rows) || 6;
    const safeCols = Number(cols) || 8;
    const renumbered = renumberGridCells(cells);
    const layout = {
      rows: safeRows,
      cols: safeCols,
      cells: renumbered,
      updatedAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      try {
        await SeatLayoutMongo.findOneAndUpdate(
          { layoutId: 'main_layout' },
          {
            $set: {
              layoutId: 'main_layout',
              rows: safeRows,
              cols: safeCols,
              cells: renumbered
            }
          },
          { upsert: true, returnDocument: 'after' }
        );
      } catch (err) {
        console.error('Mongo save layout error:', err.message);
      }
    }

    writeJsonFile(FILE_NAME, layout);
    return layout;
  }

  static async updateDimensions(newRows, newCols) {
    const layout = await this.getLayout();
    const safeRows = Math.max(1, Math.min(50, Number(newRows)));
    const safeCols = Math.max(1, Math.min(50, Number(newCols)));

    // Prevent reducing dimensions if any assigned student seat is in truncated area
    const wouldCutAssigned = layout.cells.some(
      (c) => (c.row > safeRows || c.col > safeCols) && c.isSeat && c.status === 'Occupied' && c.assignedStudent
    );

    if (wouldCutAssigned) {
      throw new Error('Cannot reduce layout size because one or more seats in the removed area have assigned students.');
    }

    const categories = await CategoryModel.getAll();
    const existingMap = new Map();
    layout.cells.forEach((c) => {
      existingMap.set(`${c.row}-${c.col}`, c);
    });

    const newCells = [];
    for (let r = 1; r <= safeRows; r++) {
      for (let c = 1; c <= safeCols; c++) {
        const key = `${r}-${c}`;
        const existing = existingMap.get(key);
        if (existing) {
          newCells.push(existing);
        } else {
          newCells.push({
            id: `cell-${r}-${c}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            row: r,
            col: c,
            isSeat: true,
            seatNumber: 1,
            category: 'Normal',
            status: 'Available',
            monthlyFee: categories.Normal?.rate || 600,
            addedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            assignedStudent: null
          });
        }
      }
    }

    return await this.saveLayout({
      rows: safeRows,
      cols: safeCols,
      cells: newCells
    });
  }

  static async updateCell(cellId, updates) {
    const layout = await this.getLayout();
    let updatedCell = null;

    layout.cells = layout.cells.map((cell) => {
      if (cell.id === cellId) {
        updatedCell = { ...cell, ...updates };
        return updatedCell;
      }
      return cell;
    });

    if (updates.isSeat !== undefined) {
      layout.cells = renumberGridCells(layout.cells);
      updatedCell = layout.cells.find((c) => c.id === cellId);
    }

    await this.saveLayout(layout);
    return updatedCell;
  }

  static async assignStudent(cellId, studentData) {
    const layout = await this.getLayout();
    const targetCell = layout.cells.find((c) => c.id === cellId);

    if (!targetCell) {
      throw new Error(`Seat cell with ID ${cellId} not found.`);
    }

    if (!targetCell.isSeat) {
      throw new Error('Cannot assign student to an empty space or aisle.');
    }

    if (targetCell.status === 'Occupied') {
      const isSameStudent =
        targetCell.assignedStudent &&
        ((studentData.id && (String(targetCell.assignedStudent.id) === String(studentData.id) || String(targetCell.assignedStudent._id) === String(studentData.id))) ||
         (studentData.studentId && targetCell.assignedStudent.studentId?.toLowerCase() === studentData.studentId?.toLowerCase()) ||
         (studentData.phone && targetCell.assignedStudent.phone === studentData.phone) ||
         (studentData.name && targetCell.assignedStudent.name?.trim().toLowerCase() === studentData.name?.trim().toLowerCase()));

      if (!isSameStudent) {
        throw new Error(`Seat ${targetCell.seatNumber} is already occupied by ${targetCell.assignedStudent?.name}.`);
      }
    }

    if (targetCell.status === 'Maintenance') {
      throw new Error(`Seat ${targetCell.seatNumber} is currently under maintenance.`);
    }

    layout.cells = layout.cells.map((c) => {
      if (c.id === cellId) {
        return {
          ...c,
          status: 'Occupied',
          assignedStudent: studentData
        };
      }
      // Clear previous seat for this student if on a different cell
      if (
        c.assignedStudent &&
        ((studentData.id && (String(c.assignedStudent.id) === String(studentData.id) || String(c.assignedStudent._id) === String(studentData.id))) ||
         (studentData.studentId && c.assignedStudent.studentId?.toLowerCase() === studentData.studentId?.toLowerCase()))
      ) {
        return {
          ...c,
          status: 'Available',
          assignedStudent: null
        };
      }
      return c;
    });

    const saved = await this.saveLayout(layout);
    return saved.cells.find((c) => c.id === cellId);
  }

  static async assignBySeatNumber(seatNumber, studentData) {
    if (!seatNumber || seatNumber === '-') return null;
    const layout = await this.getLayout();
    const targetSeat = String(seatNumber).trim();
    const cell = layout.cells.find((c) => c.isSeat && String(c.seatNumber).trim() === targetSeat);
    if (!cell) return null;
    return await this.assignStudent(cell.id, studentData);
  }

  static async unassignStudent(cellId) {
    const layout = await this.getLayout();
    let unassigned = null;

    layout.cells = layout.cells.map((c) => {
      if (c.id === cellId) {
        unassigned = c.assignedStudent;
        return {
          ...c,
          status: 'Available',
          assignedStudent: null
        };
      }
      return c;
    });

    await this.saveLayout(layout);
    return unassigned;
  }

  static async unassignByStudent({ id, studentId, seatNo, phone, name }) {
    const layout = await this.getLayout();
    let changed = false;

    const targetSeatNo = seatNo !== undefined && seatNo !== null && String(seatNo).trim() !== '-' && String(seatNo).trim() !== ''
      ? String(seatNo).trim()
      : null;
    const targetStudentId = studentId ? String(studentId).trim().toUpperCase() : null;
    const targetId = id ? String(id) : null;
    const targetPhone = phone ? String(phone).trim() : null;
    const targetName = name ? String(name).trim().toLowerCase() : null;

    layout.cells = layout.cells.map((c) => {
      if (!c.isSeat) return c;

      let shouldUnassign = false;

      // 1. Direct seat number match
      if (targetSeatNo && String(c.seatNumber).trim() === targetSeatNo) {
        shouldUnassign = true;
      }

      // 2. Assigned student metadata match
      if (c.assignedStudent) {
        const a = c.assignedStudent;
        if (targetId && (String(a.id) === targetId || String(a._id) === targetId)) {
          shouldUnassign = true;
        }
        if (targetStudentId && String(a.studentId).trim().toUpperCase() === targetStudentId) {
          shouldUnassign = true;
        }
        if (targetPhone && String(a.phone).trim() === targetPhone) {
          shouldUnassign = true;
        }
        if (targetName && a.name && String(a.name).trim().toLowerCase() === targetName) {
          shouldUnassign = true;
        }
      }

      if (shouldUnassign && (c.status === 'Occupied' || c.assignedStudent)) {
        changed = true;
        return {
          ...c,
          status: 'Available',
          assignedStudent: null
        };
      }
      return c;
    });

    if (changed) {
      await this.saveLayout(layout);
    }
    return changed;
  }
}

