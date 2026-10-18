import { CategoryModel } from '../models/Category.js';
import { SeatModel } from '../models/Seat.js';

export class CategoryController {
  static async getAll(req, res, next) {
    try {
      const categories = await CategoryModel.getAll();
      const layout = await SeatModel.getLayout();

      // Recalculate dynamic seat count for each category
      const counts = {
        Premium: 0,
        Locker: 0,
        Normal: 0
      };

      layout.cells.forEach((c) => {
        if (c.isSeat && counts[c.category] !== undefined) {
          counts[c.category]++;
        }
      });

      const response = {};
      Object.keys(categories).forEach((cat) => {
        response[cat] = {
          ...categories[cat],
          totalSeats: counts[cat] || 0
        };
      });

      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateAll(req, res, next) {
    try {
      const newRates = req.body;
      const updated = await CategoryModel.updateAll(newRates);

      // Also sync monthlyFee for seats in layout
      const layout = await SeatModel.getLayout();
      layout.cells = layout.cells.map((cell) => {
        if (cell.isSeat && updated[cell.category]) {
          return {
            ...cell,
            monthlyFee: updated[cell.category].rate
          };
        }
        return cell;
      });
      await SeatModel.saveLayout(layout);

      return res.status(200).json({
        success: true,
        message: 'Category monthly rates updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
