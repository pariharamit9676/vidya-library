import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { ENV } from '../config/env.js';
import { isMongoConnected } from '../config/database.js';
import { UserMongo } from './schemas/UserSchema.js';

const FILE_NAME = 'admin.json';

const DEFAULT_ADMIN = {
  id: 'admin_1',
  name: 'Amit',
  email: 'admin@gmail.com',
  phone: '9685912333',
  password: 'Amit1234',
  role: 'SUPER_ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  libraryName: 'Vidya Library',
  tagline: 'Your Space to Grow'
};

export class UserModel {
  static async getAdmin() {
    if (isMongoConnected()) {
      try {
        let user = await UserMongo.findOne({
          $or: [
            { role: 'SUPER_ADMIN' },
            { email: 'admin@gmail.com' },
            { phone: '9685912333' }
          ]
        }).lean();

        if (user) {
          return {
            id: user.id || String(user._id),
            name: user.name || 'Amit',
            email: user.email || 'admin@gmail.com',
            phone: user.phone || '9685912333',
            password: user.password || 'Amit1234',
            role: user.role || 'SUPER_ADMIN',
            avatar: user.avatar,
            libraryName: user.libraryName || 'Vidya Library',
            tagline: user.tagline || 'Your Space to Grow'
          };
        } else {
          // Create in Mongo if not found
          await UserMongo.create(DEFAULT_ADMIN);
          return DEFAULT_ADMIN;
        }
      } catch (err) {
        console.error('Mongo read admin error, fallback to JSON:', err.message);
      }
    }
    return readJsonFile(FILE_NAME, DEFAULT_ADMIN);
  }

  static async authenticate(identifier, password) {
    if (!identifier || !password) return null;
    const admin = await this.getAdmin();

    const cleanInput = String(identifier).trim().toLowerCase();
    const cleanDigits = cleanInput.replace(/\D/g, '');

    const targetEmail = (admin.email || 'admin@gmail.com').toLowerCase().trim();
    const targetPhoneDigits = (admin.phone || '9685912333').replace(/\D/g, '');

    const isMatch =
      cleanInput === targetEmail ||
      cleanInput === 'admin@gmail.com' ||
      cleanInput === '9685912333' ||
      (cleanDigits && cleanDigits === targetPhoneDigits);

    if (isMatch && String(admin.password).trim() === String(password).trim()) {
      const { password: _, ...safeProfile } = admin;
      return safeProfile;
    }

    return null;
  }

  static async updateProfile(updates) {
    const admin = await this.getAdmin();
    const updated = { ...admin, ...updates };

    if (isMongoConnected()) {
      try {
        await UserMongo.findOneAndUpdate(
          { role: 'SUPER_ADMIN' },
          { $set: updates },
          { upsert: true }
        );
      } catch (err) {
        console.error('Mongo update admin error:', err.message);
      }
    }

    writeJsonFile(FILE_NAME, updated);
    const { password: _, ...safeProfile } = updated;
    return safeProfile;
  }
}
