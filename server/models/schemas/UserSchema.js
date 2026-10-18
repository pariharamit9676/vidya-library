import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Amit' },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '9685912333' },
  password: { type: String, required: true },
  role: { type: String, default: 'SUPER_ADMIN' },
  avatar: { type: String, default: '' },
  libraryName: { type: String, default: 'Vidya Library' },
  tagline: { type: String, default: 'Your Space to Grow' }
}, {
  timestamps: true
});

export const UserMongo = mongoose.models.User || mongoose.model('User', UserSchema);
