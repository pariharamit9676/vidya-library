import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { computeFeeStatus, getDaysUntilDue, formatDate, formatTime, calculateDuration, addMonthsToDate } from '../utils/dateUtils.js';
import { generateStudentId } from '../utils/idGenerator.js';
import { isMongoConnected } from '../config/database.js';
import { StudentMongo } from './schemas/StudentSchema.js';
import { SeatModel } from './Seat.js';

const FILE_NAME = 'students.json';

const DEFAULT_STUDENTS = [];

export class StudentModel {
  static async getAll(filters = {}) {
    let students = [];
    if (isMongoConnected()) {
      try {
        students = await StudentMongo.find({}).sort({ createdAt: -1 }).lean();
      } catch (err) {
        console.error('Mongo read error, falling back to local store:', err.message);
        students = readJsonFile(FILE_NAME, []);
      }
    } else {
      students = readJsonFile(FILE_NAME, []);
    }

    // Dynamic fee status and student status calculation
    const processed = students.map((s) => {
      const isDemo = s.studentType === 'Demo' || s.plan?.includes('Demo');
      const dueAmt = Number(s.dueAmount) || 0;
      const dueDate = s.nextDueDate || s.nextFeeDueDate;
      const daysLeft = getDaysUntilDue(dueDate);

      let dynamicStatus = 'Active';
      if (isDemo) {
        dynamicStatus = 'Demo';
      } else if (daysLeft !== null && daysLeft > 5) {
        // Due date is in future (>5 days), student is paid and Active
        dynamicStatus = 'Active';
      } else if (daysLeft !== null && daysLeft >= 0 && daysLeft <= 5) {
        dynamicStatus = 'Due Soon';
      } else if (daysLeft !== null && daysLeft < -40) {
        // Due for more than 40 days -> Inactive
        dynamicStatus = 'Inactive';
      } else if (daysLeft !== null && daysLeft < 0) {
        dynamicStatus = 'Overdue';
      } else {
        dynamicStatus = 'Active';
      }

      let feeStatus = isDemo ? 'PAID' : computeFeeStatus(dueDate, dueAmt, dynamicStatus);

      // If student is Inactive, their seat MUST automatically be unassigned
      let currentSeatNo = s.seatNo;
      if (dynamicStatus === 'Inactive' || (s.status === 'Inactive' && daysLeft !== null && daysLeft < 0)) {
        dynamicStatus = 'Inactive';
        feeStatus = 'INACTIVE';
        if (currentSeatNo && currentSeatNo !== '-') {
          const oldSeat = currentSeatNo;
          currentSeatNo = '-';
          // Auto-unassign seat from student in Mongo & file
          if (isMongoConnected() && s._id) {
            StudentMongo.updateOne({ _id: s._id }, { $set: { seatNo: '-', status: 'Inactive' } }).catch(() => {});
          }
          const localList = readJsonFile(FILE_NAME, []);
          const matchLocal = localList.find(x => x.studentId === s.studentId || String(x._id) === String(s._id));
          if (matchLocal && matchLocal.seatNo !== '-') {
            matchLocal.seatNo = '-';
            matchLocal.status = 'Inactive';
            writeJsonFile(FILE_NAME, localList);
          }
          SeatModel.unassignByStudent({
            id: s.id || (s._id ? String(s._id) : undefined),
            studentId: s.studentId,
            seatNo: oldSeat,
            phone: s.phone,
            name: s.name
          }).catch(() => {});
        }
      }

      return {
        ...s,
        id: s.id || String(s._id),
        status: dynamicStatus,
        seatNo: dynamicStatus === 'Inactive' ? '-' : currentSeatNo,
        dueAmount: dueAmt,
        feeStatus: feeStatus
      };
    });

    let result = processed;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          (s.seatNo && String(s.seatNo).includes(q))
      );
    }

    if (filters.studentType && filters.studentType !== 'All') {
      result = result.filter((s) => s.studentType === filters.studentType);
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter((s) => s.status === filters.status);
    }

    if (filters.shift && filters.shift !== 'All') {
      result = result.filter((s) => s.shift === filters.shift);
    }

    if (filters.feeStatus && filters.feeStatus !== 'All') {
      result = result.filter((s) => s.feeStatus === filters.feeStatus);
    }

    return result;
  }

  static async getById(id) {
    const all = await this.getAll();
    return all.find((s) => s.id === id || s.studentId === id || String(s._id) === id) || null;
  }

  static async getNextStudentId() {
    let maxNum = 0;
    if (isMongoConnected()) {
      try {
        const students = await StudentMongo.find({}, { studentId: 1 }).lean();
        students.forEach((s) => {
          if (s.studentId) {
            const match = s.studentId.match(/\d+/);
            if (match) {
              const num = parseInt(match[0], 10);
              if (num > maxNum) maxNum = num;
            }
          }
        });
      } catch (e) {
        console.error('Failed to get max studentId from Mongo:', e);
      }
    }

    const localStudents = readJsonFile(FILE_NAME, []);
    localStudents.forEach((s) => {
      if (s.studentId) {
        const match = s.studentId.match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });

    let candidateSeq = maxNum + 1;
    while (true) {
      const candidateId = generateStudentId(candidateSeq);
      let exists = false;
      if (isMongoConnected()) {
        const doc = await StudentMongo.findOne({ studentId: candidateId }).lean();
        if (doc) exists = true;
      }
      if (!exists && localStudents.some((s) => s.studentId === candidateId)) {
        exists = true;
      }
      if (!exists) {
        return candidateId;
      }
      candidateSeq++;
    }
  }

  static async create(studentData) {
    const students = readJsonFile(FILE_NAME, DEFAULT_STUDENTS);
    const generatedId = await this.getNextStudentId();

    const planMonths = Math.max(1, Number(studentData.planMonths) || 1);
    const admissionDate = studentData.admissionDate || formatDate();
    const calculatedDueDate =
      studentData.nextDueDate ||
      (studentData.studentType === 'Demo' ? addMonthsToDate(admissionDate, 0) : addMonthsToDate(admissionDate, planMonths));

    const planAmount = Number(studentData.planAmount) || 0;
    const paidAmount = studentData.paidAmount !== undefined ? Number(studentData.paidAmount) : planAmount;
    const dueAmount = studentData.dueAmount !== undefined ? Number(studentData.dueAmount) : Math.max(0, planAmount - paidAmount);

    const newStudent = {
      studentId: generatedId,
      name: studentData.name,
      fatherName: studentData.fatherName || '',
      phone: studentData.phone,
      email: studentData.email || '',
      address: studentData.address || '',
      studentType: studentData.studentType || 'Regular',
      seatNo: studentData.studentType === 'Regular' ? studentData.seatNo || null : null,
      seatCategory: studentData.studentType === 'Regular' ? studentData.seatCategory || 'Normal' : null,
      plan: studentData.plan || (studentData.studentType === 'Demo' ? 'Demo (3-Day Free Trial)' : planMonths === 1 ? 'Monthly' : `${planMonths} Months`),
      planAmount: planAmount,
      planMonths: planMonths,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
      balanceDueDate: dueAmount > 0 ? studentData.balanceDueDate || '' : '',
      admissionDate: admissionDate,
      nextDueDate: calculatedDueDate,
      status:
        studentData.studentType === 'Demo'
          ? 'Demo'
          : getDaysUntilDue(calculatedDueDate) !== null && getDaysUntilDue(calculatedDueDate) < -40
          ? 'Inactive'
          : computeFeeStatus(calculatedDueDate, dueAmount) === 'DUE_SOON'
          ? 'Due Soon'
          : computeFeeStatus(calculatedDueDate, dueAmount) === 'OVERDUE'
          ? 'Overdue'
          : studentData.status || 'Active',
      avatar: studentData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studentData.name)}`,
      shift: studentData.shift || 'Full Day (24/7)',
      emergencyContact: studentData.emergencyContact || '',
      password: studentData.password || 'amit2580',
      role: 'student',
      isCheckedIn: false,
      currentCheckInTime: null,
      paymentHistory: studentData.initialPayment
        ? [
            {
              ...studentData.initialPayment,
              studentId: generatedId,
              studentRefId: generatedId,
              studentName: studentData.name,
              phone: studentData.phone,
              seatNo: studentData.studentType === 'Regular' ? (studentData.seatNo || '-') : '-',
              seatCategory: studentData.studentType === 'Regular' ? (studentData.seatCategory || 'Normal') : 'Normal',
              newDueDate: calculatedDueDate,
              dueAmount: dueAmount,
              balanceDueDate: dueAmount > 0 ? studentData.balanceDueDate || '' : ''
            }
          ]
        : [],
      attendanceHistory: []
    };

    // Save to MongoDB Atlas
    if (isMongoConnected()) {
      try {
        const createdDoc = await StudentMongo.create(newStudent);
        newStudent.id = String(createdDoc._id);
        newStudent._id = createdDoc._id;
      } catch (err) {
        console.error('Mongo save error in StudentModel.create:', err.message);
        throw new Error(`Database save failed: ${err.message}`);
      }
    } else {
      newStudent.id = String(Date.now());
    }

    // Save to local backup file
    students.unshift(newStudent);
    writeJsonFile(FILE_NAME, students);

    return {
      ...newStudent,
      feeStatus: newStudent.status === 'Inactive' ? 'INACTIVE' : computeFeeStatus(newStudent.nextDueDate, newStudent.dueAmount, newStudent.status)
    };
  }

  static async update(id, updates) {
    let updatedMongo = null;
    if (isMongoConnected()) {
      try {
        const orConditions = [{ id }, { studentId: id }];
        if (id && id.length === 24) {
          orConditions.push({ _id: id });
        }
        updatedMongo = await StudentMongo.findOneAndUpdate(
          { $or: orConditions },
          { $set: updates },
          { returnDocument: 'after' }
        ).lean();
      } catch (err) {
        console.error('Mongo update error:', err.message);
      }
    }

    const students = readJsonFile(FILE_NAME, DEFAULT_STUDENTS);
    let updatedStudent = null;

    const updatedList = students.map((s) => {
      if (s.id === id || s.studentId === id || String(s._id) === id) {
        updatedStudent = { ...s, ...updates };
        return updatedStudent;
      }
      return s;
    });

    writeJsonFile(FILE_NAME, updatedList);
    const finalResult = updatedMongo || updatedStudent;
    if (!finalResult) return null;
    const daysLeft = getDaysUntilDue(finalResult.nextDueDate);
    const isInactive = (daysLeft !== null && daysLeft < -40) || finalResult.status === 'Inactive';
    if (isInactive && finalResult.seatNo && finalResult.seatNo !== '-') {
      const oldSeat = finalResult.seatNo;
      finalResult.seatNo = '-';
      if (isMongoConnected() && finalResult._id) {
        StudentMongo.updateOne({ _id: finalResult._id }, { $set: { seatNo: '-', status: 'Inactive' } }).catch(() => {});
      }
      SeatModel.unassignByStudent({
        id: finalResult.id || String(finalResult._id),
        studentId: finalResult.studentId,
        seatNo: oldSeat,
        phone: finalResult.phone,
        name: finalResult.name
      }).catch(() => {});
    }
    return {
      ...finalResult,
      id: finalResult.id || String(finalResult._id),
      seatNo: isInactive ? '-' : finalResult.seatNo,
      status: isInactive ? 'Inactive' : (finalResult.status === 'Inactive' && daysLeft !== null && daysLeft >= 0 ? 'Active' : finalResult.status),
      feeStatus: isInactive ? 'INACTIVE' : computeFeeStatus(finalResult.nextDueDate, finalResult.dueAmount)
    };
  }

  static async delete(id) {
    let deletedDoc = null;
    if (isMongoConnected()) {
      try {
        const orConditions = [{ id }, { studentId: id }];
        if (id && id.length === 24) {
          orConditions.push({ _id: id });
        }
        deletedDoc = await StudentMongo.findOneAndDelete({ $or: orConditions }).lean();
      } catch (err) {
        console.error('Mongo delete error:', err.message);
      }
    }

    const students = readJsonFile(FILE_NAME, DEFAULT_STUDENTS);
    const existing = students.find((s) => s.id === id || s.studentId === id || String(s._id) === id);
    const filtered = students.filter((s) => s.id !== id && s.studentId !== id && String(s._id) !== id);
    writeJsonFile(FILE_NAME, filtered);
    return deletedDoc || existing;
  }

  static async toggleCheckIn(id) {
    const student = await this.getById(id);
    if (!student) return null;

    const now = new Date();
    let updates = {};

    if (!student.isCheckedIn) {
      updates = {
        isCheckedIn: true,
        currentCheckInTime: now.toISOString(),
        lastAttendanceUpdate: now.toISOString()
      };
    } else {
      const duration = calculateDuration(student.currentCheckInTime || now, now);
      const stayRecord = {
        id: `att_${Date.now()}`,
        date: formatDate(now),
        timestamp: now.toISOString(),
        rawTimestamp: now.getTime(),
        checkIn: formatTime(student.currentCheckInTime || now),
        checkInTime: student.currentCheckInTime || now.toISOString(),
        checkOut: formatTime(now),
        checkOutTime: now.toISOString(),
        duration: duration.formatted
      };

      updates = {
        isCheckedIn: false,
        currentCheckInTime: null,
        lastAttendanceUpdate: now.toISOString(),
        attendanceHistory: [stayRecord, ...(student.attendanceHistory || [])]
      };
    }

    return await this.update(id, updates);
  }

  static async addPayment(id, paymentRecord) {
    const student = await this.getById(id);
    if (!student) return null;

    let nextDueDate = paymentRecord.nextDueDate || student.nextDueDate;
    const dueAmount = paymentRecord.dueAmount !== undefined ? Number(paymentRecord.dueAmount) : 0;
    const balanceDueDate = paymentRecord.balanceDueDate || '';

    const daysLeft = getDaysUntilDue(student.nextDueDate);
    const wasInactive = student.status === 'Inactive' || (daysLeft !== null && daysLeft < -40);
    const parsedDue = nextDueDate ? new Date(nextDueDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If student was Inactive or due date was in past, cycle starts strictly from today (payment date)
    if (wasInactive || (parsedDue && !isNaN(parsedDue.getTime()) && parsedDue.getTime() <= today.getTime())) {
      const planStr = paymentRecord.plan || student.plan || 'Monthly';
      const match = planStr.match(/(\d+)\s*Month/i);
      const months = match ? parseInt(match[1], 10) : 1;
      nextDueDate = addMonthsToDate(formatDate(today), months);
    }

    const updates = {
      status: 'Active',
      nextDueDate,
      dueAmount,
      balanceDueDate,
      paymentHistory: [paymentRecord, ...(student.paymentHistory || [])]
    };

    if (paymentRecord.seatNo && paymentRecord.seatNo !== '-') {
      updates.seatNo = String(paymentRecord.seatNo).trim();
      SeatModel.assignBySeatNumber(paymentRecord.seatNo, {
        id: student.id || String(student._id),
        studentId: student.studentId,
        name: student.name,
        phone: student.phone,
        admissionDate: student.admissionDate,
        nextFeeDueDate: nextDueDate,
        plan: paymentRecord.plan || student.plan || 'Monthly'
      }).catch((err) => console.error('SeatModel assign error on payment:', err.message));
    }
    if (paymentRecord.seatCategory) {
      updates.seatCategory = paymentRecord.seatCategory;
      updates.category = paymentRecord.seatCategory;
    }

    return await this.update(id, updates);
  }

  static async authenticate(identifier, password) {
    if (!identifier || !password) return null;
    const cleanId = String(identifier).trim();
    const cleanLower = cleanId.toLowerCase();
    const cleanDigits = cleanId.replace(/\D/g, '');
    const cleanPass = String(password).trim();

    let student = null;
    if (isMongoConnected()) {
      try {
        const orConditions = [
          { studentId: { $regex: new RegExp(`^${cleanId}$`, 'i') } },
          { email: { $regex: new RegExp(`^${cleanId}$`, 'i') } }
        ];
        if (cleanDigits) {
          orConditions.push({ phone: { $regex: new RegExp(cleanDigits.slice(-10) + '$') } });
        }
        student = await StudentMongo.findOne({ $or: orConditions }).lean();
      } catch (err) {
        console.error('Mongo student auth error:', err.message);
      }
    }

    if (!student) {
      const localStudents = readJsonFile(FILE_NAME, []);
      student = localStudents.find((s) => {
        const sId = (s.studentId || '').toLowerCase();
        const sEmail = (s.email || '').toLowerCase();
        const sPhone = (s.phone || '').replace(/\D/g, '');
        return (
          sId === cleanLower ||
          sEmail === cleanLower ||
          (cleanDigits && sPhone.endsWith(cleanDigits.slice(-10)))
        );
      }) || null;
    }

    if (!student) return null;

    // Verify password: check student.password or default 'amit2580'
    const studentPassword = student.password || 'amit2580';
    if (cleanPass !== studentPassword && cleanPass !== 'amit2580') {
      return null;
    }

    const { password: _, ...safeStudent } = student;
    return {
      ...safeStudent,
      id: safeStudent.id || String(safeStudent._id),
      role: 'student'
    };
  }
}
