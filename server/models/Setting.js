import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { isMongoConnected } from '../config/database.js';
import { SettingMongo } from './schemas/SettingSchema.js';
import { UserModel } from './User.js';

const FILE_NAME = 'settings.json';

const DEFAULT_SETTINGS = {
  key: 'general_settings',
  libraryName: 'Vidya Library',
  tagline: 'Your Space to Grow • Premium Study Lounge',
  phone: '9685912333',
  email: 'admin@vidyalibrary.com',
  address: '66W8+4FH, Gayatri Nagar, Gwalior',
  upiId: 'vidyalibrary@upi',
  openingTime: '06:00 AM',
  closingTime: '11:00 PM',
  morningRate: '800',
  eveningRate: '800',
  nightRate: '900',
  fullDayRate: '1200',
  reservedSurcharge: '200',
  wifiSSID: 'Vidya_HighSpeed_5G',
  wifiPassword: 'StudyHard@2026',
  gracePeriodDays: '3',
  totalSeatsCapacity: '164',
  lockerFee: '150',
  adminName: 'Amit',
  adminEmail: 'admin@gmail.com',
  adminPhone: '9685912333',
  multiMonthDiscounts: [
    { id: 'disc_3', months: 3, discountType: 'percentage', discountValue: 5, label: '3 Months Advance (5% OFF)', isActive: true },
    { id: 'disc_6', months: 6, discountType: 'percentage', discountValue: 10, label: '6 Months Advance (10% OFF)', isActive: true },
    { id: 'disc_12', months: 12, discountType: 'percentage', discountValue: 15, label: '12 Months Advance (15% OFF)', isActive: true }
  ],
  geofenceEnabled: false,
  libraryLatitude: 26.2250,
  libraryLongitude: 78.1950,
  geofenceRadius: 100
};

export class SettingModel {
  static async get() {
    if (isMongoConnected()) {
      try {
        let doc = await SettingMongo.findOne({ key: 'general_settings' }).lean();
        if (doc) {
          return {
            ...DEFAULT_SETTINGS,
            ...doc,
            multiMonthDiscounts: Array.isArray(doc.multiMonthDiscounts) && doc.multiMonthDiscounts.length > 0
              ? doc.multiMonthDiscounts
              : DEFAULT_SETTINGS.multiMonthDiscounts,
            id: doc.id || String(doc._id)
          };
        } else {
          // Check if admin.json has customized admin phone
          const admin = await UserModel.getAdmin();
          const initial = {
            ...DEFAULT_SETTINGS,
            phone: admin?.phone || DEFAULT_SETTINGS.phone,
            adminPhone: admin?.phone || DEFAULT_SETTINGS.adminPhone,
            adminName: admin?.name || DEFAULT_SETTINGS.adminName,
            libraryName: admin?.libraryName || DEFAULT_SETTINGS.libraryName
          };
          const created = await SettingMongo.create(initial);
          return { ...initial, id: String(created._id) };
        }
      } catch (err) {
        console.error('Mongo read setting error, fallback to JSON:', err.message);
      }
    }
    return readJsonFile(FILE_NAME, DEFAULT_SETTINGS);
  }

  static async update(updates) {
    const current = await this.get();
    const phoneVal = updates.phone || updates.adminPhone || current.phone || '9685912333';

    const merged = {
      ...current,
      ...updates,
      phone: phoneVal,
      adminPhone: phoneVal
    };

    if (isMongoConnected()) {
      try {
        await SettingMongo.findOneAndUpdate(
          { key: 'general_settings' },
          { $set: merged },
          { upsert: true, returnDocument: 'after' }
        );
      } catch (err) {
        console.error('Mongo update setting error:', err.message);
      }
    }

    writeJsonFile(FILE_NAME, merged);

    // Also update admin profile phone and library branding in User model
    try {
      await UserModel.updateProfile({
        phone: phoneVal,
        name: merged.adminName || current.adminName,
        email: merged.adminEmail || merged.email || current.email,
        libraryName: merged.libraryName || current.libraryName,
        tagline: merged.tagline || current.tagline
      });
    } catch (_err) {}

    return merged;
  }
}
