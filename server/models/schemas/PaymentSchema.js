import mongoose from 'mongoose';

export const PaymentSchema = new mongoose.Schema({
  receiptNo: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  seatNo: { type: String, default: '-' },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ['Cash', 'UPI', 'Card', 'Net Banking'], default: 'Cash' },
  plan: { type: String, default: 'Monthly' },
  status: { type: String, default: 'Paid' },
  receivedBy: { type: String, default: 'Admin' }
}, {
  timestamps: true
});

export const PaymentMongo = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
