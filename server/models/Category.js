import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { isMongoConnected } from '../config/database.js';
import { CategoryMongo } from './schemas/CategorySchema.js';

const FILE_NAME = 'categories.json';

const DEFAULT_CATEGORIES = {
  Premium: {
    category: 'Premium',
    rate: 800,
    description: 'Ergonomic leather chair, personal charging station, reading light',
    totalSeats: 12
  },
  Locker: {
    category: 'Locker',
    rate: 700,
    description: 'Standard comfortable desk with secure storage locker space',
    totalSeats: 11
  },
  Normal: {
    category: 'Normal',
    rate: 600,
    description: 'Quiet study pod, high speed fiber Wi-Fi, power plug access',
    totalSeats: 25
  }
};

export class CategoryModel {
  static async getAll() {
    if (isMongoConnected()) {
      try {
        const docs = await CategoryMongo.find({}).lean();
        if (docs && docs.length > 0) {
          const catMap = {};
          docs.forEach((d) => {
            catMap[d.category] = {
              category: d.category,
              rate: d.rate,
              description: d.description,
              totalSeats: d.totalSeats
            };
          });
          return catMap;
        }
      } catch (err) {
        console.error('Mongo read categories error:', err.message);
      }
    }
    return readJsonFile(FILE_NAME, DEFAULT_CATEGORIES);
  }

  static async getByCategory(categoryName) {
    const all = await this.getAll();
    return all[categoryName] || null;
  }

  static async updateAll(newRates) {
    const current = await this.getAll();
    const updated = { ...current };

    for (const cat of Object.keys(newRates)) {
      if (updated[cat]) {
        const newRate = Number(newRates[cat].rate !== undefined ? newRates[cat].rate : newRates[cat]);
        updated[cat] = {
          ...updated[cat],
          rate: newRate
        };

        if (isMongoConnected()) {
          try {
            await CategoryMongo.findOneAndUpdate(
              { category: cat },
              { $set: { rate: newRate } },
              { upsert: true }
            );
          } catch (err) {
            console.error(`Mongo update category rate error (${cat}):`, err.message);
          }
        }
      }
    }

    writeJsonFile(FILE_NAME, updated);
    return updated;
  }

  static async updateCategory(categoryName, updates) {
    const all = await this.getAll();
    if (!all[categoryName]) return null;

    all[categoryName] = { ...all[categoryName], ...updates };

    if (isMongoConnected()) {
      try {
        await CategoryMongo.findOneAndUpdate(
          { category: categoryName },
          { $set: updates },
          { upsert: true }
        );
      } catch (err) {
        console.error('Mongo update category error:', err.message);
      }
    }

    writeJsonFile(FILE_NAME, all);
    return all[categoryName];
  }
}
