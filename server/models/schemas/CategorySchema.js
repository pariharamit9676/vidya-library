import mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  rate: { type: Number, required: true },
  description: { type: String, default: '' },
  totalSeats: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const CategoryMongo = mongoose.models.Category || mongoose.model('Category', CategorySchema);
