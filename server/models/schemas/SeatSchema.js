import mongoose from 'mongoose';

const AssignedStudentSubSchema = new mongoose.Schema({
  id: String,
  studentId: String,
  name: String,
  phone: String,
  email: String,
  admissionDate: String,
  nextFeeDueDate: String,
  avatar: String,
  plan: String
}, { _id: false });

const SeatGridCellSubSchema = new mongoose.Schema({
  id: { type: String, required: true },
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  isSeat: { type: Boolean, default: true },
  seatNumber: { type: Number, default: null },
  category: { type: String, enum: ['Premium', 'Locker', 'Normal'], default: 'Normal' },
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  monthlyFee: { type: Number, default: 600 },
  addedOn: { type: String, default: '' },
  assignedStudent: { type: AssignedStudentSubSchema, default: null }
}, { _id: false });

export const SeatLayoutSchema = new mongoose.Schema({
  layoutId: { type: String, default: 'main_layout', unique: true },
  rows: { type: Number, required: true, default: 6 },
  cols: { type: Number, required: true, default: 8 },
  cells: [SeatGridCellSubSchema]
}, {
  timestamps: true
});

export const SeatLayoutMongo = mongoose.models.SeatLayout || mongoose.model('SeatLayout', SeatLayoutSchema);
