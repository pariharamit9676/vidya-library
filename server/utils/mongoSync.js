import { StudentMongo } from '../models/schemas/StudentSchema.js';
import { SeatLayoutMongo } from '../models/schemas/SeatSchema.js';
import { CategoryMongo } from '../models/schemas/CategorySchema.js';
import { PaymentMongo } from '../models/schemas/PaymentSchema.js';
import { UserMongo } from '../models/schemas/UserSchema.js';

import { readJsonFile } from './fileStorage.js';

export const seedMongoIfEmpty = async () => {
  try {
    // 1. Seed Seats Layout (if layout doesn't exist)
    const layoutCount = await SeatLayoutMongo.countDocuments();
    if (layoutCount === 0) {
      const initialLayout = readJsonFile('seats.json', null);
      if (initialLayout) {
        await SeatLayoutMongo.create({
          layoutId: 'main_layout',
          rows: initialLayout.rows,
          cols: initialLayout.cols,
          cells: initialLayout.cells
        });
        console.log(`🍃 [MongoDB] Seeded seat layout (${initialLayout.rows}x${initialLayout.cols}) into Atlas.`);
      }
    }

    // 3. Seed Categories
    const categoryCount = await CategoryMongo.countDocuments();
    if (categoryCount === 0) {
      const initialCategories = readJsonFile('categories.json', {});
      const catArray = Object.values(initialCategories);
      if (catArray.length > 0) {
        await CategoryMongo.insertMany(catArray);
        console.log(`🍃 [MongoDB] Seeded ${catArray.length} seat categories into Atlas.`);
      }
    }


    // 5. Seed Admin
    const userCount = await UserMongo.countDocuments();
    if (userCount === 0) {
      const initialAdmin = readJsonFile('admin.json', null);
      if (initialAdmin) {
        await UserMongo.create(initialAdmin);
        console.log(`🍃 [MongoDB] Seeded admin credentials into Atlas.`);
      }
    }
  } catch (err) {
    console.error('🍃 [MongoDB Seeding Error]:', err.message);
  }
};
