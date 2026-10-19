import { ReferralModel } from '../models/Referral.js';
import { StudentModel } from '../models/Student.js';

export class ReferralController {
  // Get all referrals (Admin)
  static async getAll(req, res, next) {
    try {
      const referrals = await ReferralModel.getAll();
      return res.status(200).json({
        success: true,
        count: referrals.length,
        data: referrals
      });
    } catch (err) {
      next(err);
    }
  }

  // Get referral stats for a student
  static async getStudentStats(req, res, next) {
    try {
      const { studentId } = req.params;
      const { code } = req.query;
      const stats = await ReferralModel.getStatsForStudent(studentId, code);
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }

  // Create a new referral lead
  static async createLead(req, res, next) {
    try {
      const lead = await ReferralModel.createLead(req.body);
      return res.status(201).json({
        success: true,
        data: lead
      });
    } catch (err) {
      next(err);
    }
  }

  // Update referral status (Admin approve/reject)
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await ReferralModel.updateReferralStatus(id, status);
      return res.status(200).json({
        success: true,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  // Request UPI payout
  static async requestPayout(req, res, next) {
    try {
      const payout = await ReferralModel.requestPayout(req.body);
      return res.status(201).json({
        success: true,
        message: `Payout request for ₹${req.body.amount} submitted successfully!`,
        data: payout
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to submit payout request.'
      });
    }
  }

  // Get all payout requests (Admin)
  static async getAllPayouts(req, res, next) {
    try {
      const payouts = await ReferralModel.getAllPayouts();
      return res.status(200).json({
        success: true,
        count: payouts.length,
        data: payouts
      });
    } catch (err) {
      next(err);
    }
  }

  // Update payout status (Admin)
  static async updatePayoutStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, utrRef, adminNote } = req.body;
      const updated = await ReferralModel.updatePayoutStatus(id, status, utrRef, adminNote);
      return res.status(200).json({
        success: true,
        message: `Payout status updated to ${status}.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
