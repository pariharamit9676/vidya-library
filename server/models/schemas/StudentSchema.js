import mongoose from 'mongoose';

const PaymentRecordSchema = new mongoose.Schema({
  id: String,
  receiptNo: String,
  date: String,
  amount: Number,
  mode: String,
  status: { type: String, default: 'Paid' },
  plan: String
}, { _id: false });

const AttendanceRecordSchema = new mongoose.Schema({
  id: String,
  date: String,
  checkIn: String,
  checkOut: String,
  duration: String
}, { _id: false });

export const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fatherName: { type: String, default: '' },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  studentType: { type: String, enum: ['Regular', 'Demo'], default: 'Regular' },
  seatNo: { type: String, default: null },
  seatCategory: { type: String, default: null },
  plan: { type: String, default: 'Monthly' },
  planAmount: { type: Number, default: 600 },
  planMonths: { type: Number, default: 1 },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  balanceDueDate: { type: String, default: '' },
  admissionDate: { type: String, default: '' },
  nextDueDate: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  avatar: { type: String, default: '' },
  shift: { type: String, default: 'Full Day (24/7)' },
  emergencyContact: { type: String, default: '' },
  password: { type: String, default: 'amit2580' },
  role: { type: String, default: 'student' },
  isCheckedIn: { type: Boolean, default: false },
  currentCheckInTime: { type: String, default: null },
  paymentHistory: [PaymentRecordSchema],
  attendanceHistory: [AttendanceRecordSchema]
}, {
  timestamps: true
});

export const StudentMongo = mongoose.models.Student || mongoose.model('Student', StudentSchema);
