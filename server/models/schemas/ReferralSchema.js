import mongoose from 'mongoose';

export const ReferralSchema = new mongoose.Schema({
  referrerId: { type: String, required: true },
  referrerName: { type: String, required: true },
  referrerPhone: { type: String, default: '' },
  referrerCode: { type: String, required: true, uppercase: true },
  refereeId: { type: String, required: true },
  refereeName: { type: String, required: true },
  refereePhone: { type: String, required: true },
  rewardAmount: { type: Number, default: 100 },
  refereeDiscount: { type: Number, default: 50 },
  status: { type: String, enum: ['Pending', 'Approved', 'Redeemed', 'Rejected'], default: 'Pending' },
  seatNo: { type: String, default: '-' },
  admissionDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  approvedAt: { type: String, default: null },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export const ReferralMongo = mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);
