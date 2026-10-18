import mongoose from 'mongoose';

export const SettingSchema = new mongoose.Schema({
  key: { type: String, default: 'general_settings', unique: true },
  libraryName: { type: String, default: 'Vidya Library' },
  tagline: { type: String, default: 'Your Space to Grow • Premium Study Lounge' },
  phone: { type: String, default: '9685912333' },
  email: { type: String, default: 'admin@vidyalibrary.com' },
  address: { type: String, default: '66W8+4FH, Gayatri Nagar, Gwalior' },
  upiId: { type: String, default: 'vidyalibrary@upi' },

  // Timings & Rates
  openingTime: { type: String, default: '06:00 AM' },
  closingTime: { type: String, default: '11:00 PM' },
  morningRate: { type: String, default: '800' },
  eveningRate: { type: String, default: '800' },
  nightRate: { type: String, default: '900' },
  fullDayRate: { type: String, default: '1200' },
  reservedSurcharge: { type: String, default: '200' },

  // Rules & Amenities
  wifiSSID: { type: String, default: 'Vidya_HighSpeed_5G' },
  wifiPassword: { type: String, default: 'StudyHard@2026' },
  gracePeriodDays: { type: String, default: '3' },
  totalSeatsCapacity: { type: String, default: '164' },
  lockerFee: { type: String, default: '150' },

  // Admin Info
  adminName: { type: String, default: 'Amit' },
  adminEmail: { type: String, default: 'admin@gmail.com' },
  adminPhone: { type: String, default: '9685912333' },

  // Multi-Month Advance Payment Discounts
  multiMonthDiscounts: {
    type: Array,
    default: [
      { id: 'disc_3', months: 3, discountType: 'percentage', discountValue: 5, label: '3 Months Advance (5% OFF)', isActive: true },
      { id: 'disc_6', months: 6, discountType: 'percentage', discountValue: 10, label: '6 Months Advance (10% OFF)', isActive: true },
      { id: 'disc_12', months: 12, discountType: 'percentage', discountValue: 15, label: '12 Months Advance (15% OFF)', isActive: true }
    ]
  }
}, {
  timestamps: true
});

export const SettingMongo = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
