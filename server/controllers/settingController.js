import { SettingModel } from '../models/Setting.js';

export class SettingController {
  static async get(req, res, next) {
    try {
      const settings = await SettingModel.get();
      return res.status(200).json({
        success: true,
        data: settings
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const updates = req.body || {};
      const updated = await SettingModel.update(updates);
      return res.status(200).json({
        success: true,
        message: 'Settings saved to database successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
