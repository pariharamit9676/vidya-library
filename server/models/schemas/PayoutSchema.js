import mongoose from 'mongoose';

export const PayoutSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentPhone: { type: String, default: '' },
  upiId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Rejected'], default: 'Pending' },
  utrRef: { type: String, default: '' },
  adminNote: { type: String, default: '' },
  requestedAt: { type: String, default: () => new Date().toISOString() },
  processedAt: { type: String, default: null }
}, {
  timestamps: true
});

export const PayoutMongo = mongoose.models.Payout || mongoose.model('Payout', PayoutSchema);
