import mongoose from 'mongoose';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { isMongoConnected } from '../config/database.js';
import { ReferralMongo } from './schemas/ReferralSchema.js';
import { PayoutMongo } from './schemas/PayoutSchema.js';
import { StudentMongo } from './schemas/StudentSchema.js';

const REFERRALS_FILE = 'referrals.json';
const PAYOUTS_FILE = 'payouts.json';

export class ReferralModel {
  /**
   * Get all referral records
   */
  static async getAll() {
    if (isMongoConnected()) {
      try {
        const list = await ReferralMongo.find({}).sort({ createdAt: -1 }).lean();
        return list.map(r => ({ ...r, id: String(r._id) }));
      } catch (err) {
        console.error('Mongo Referral.getAll error:', err.message);
      }
    }
    return readJsonFile(REFERRALS_FILE, []);
  }

  /**
   * Create a new referral lead
   */
  static async createLead(data) {
    const newRecord = {
      referrerId: String(data.referrerId || '').trim(),
      referrerName: String(data.referrerName || '').trim(),
      referrerPhone: String(data.referrerPhone || '').trim(),
      referrerCode: String(data.referrerCode || '').trim().toUpperCase(),
      refereeId: String(data.refereeId || '').trim(),
      refereeName: String(data.refereeName || '').trim(),
      refereePhone: String(data.refereePhone || '').replace(/\D/g, ''),
      rewardAmount: Number(data.rewardAmount) || 100,
      refereeDiscount: Number(data.refereeDiscount) || 50,
      status: data.status || 'Pending',
      seatNo: data.seatNo || '-',
      admissionDate: data.admissionDate || new Date().toISOString().slice(0, 10),
      notes: data.notes || ''
    };

    let saved = null;
    if (isMongoConnected()) {
      try {
        const doc = await ReferralMongo.create(newRecord);
        saved = { ...doc.toObject(), id: String(doc._id) };
      } catch (err) {
        console.error('Mongo Referral.createLead error:', err.message);
      }
    }

    if (!saved) {
      saved = { ...newRecord, id: `ref_${Date.now()}` };
    }

    const localList = readJsonFile(REFERRALS_FILE, []);
    localList.unshift(saved);
    writeJsonFile(REFERRALS_FILE, localList);

    return saved;
  }

  /**
   * Auto-approve referral when referee gets enrolled, assigned a seat, or pays fee
   */
  static async checkAndApproveByReferee(phoneOrId, seatNo = '-') {
    const clean = String(phoneOrId || '').replace(/\D/g, '');
    const cleanId = String(phoneOrId || '').trim();

    const orConditions = [];
    if (clean && clean.length >= 10) {
      orConditions.push({ refereePhone: clean.slice(-10) });
    }
    if (cleanId) {
      orConditions.push({ refereeId: cleanId });
      orConditions.push({ refereeId: `#${cleanId.replace(/^#+/, '')}` });
    }

    if (orConditions.length === 0) return null;

    let updatedDoc = null;
    if (isMongoConnected()) {
      try {
        updatedDoc = await ReferralMongo.findOneAndUpdate(
          {
            $or: orConditions,
            status: { $in: ['Pending', 'Demo'] }
          },
          {
            $set: {
              status: 'Approved',
              seatNo: seatNo || '-',
              approvedAt: new Date().toISOString()
            }
          },
          { returnDocument: 'after' }
        ).lean();

        if (updatedDoc) {
          console.log(`🎉 [Referral Approved] Referee ${updatedDoc.refereeName} enrolled. Referrer: ${updatedDoc.referrerName} (+₹100)`);
        }
      } catch (err) {
        console.error('Mongo Referral.checkAndApprove error:', err.message);
      }
    }

    // Local JSON sync
    const localList = readJsonFile(REFERRALS_FILE, []);
    const matchLocal = localList.find(r => 
      (clean && r.refereePhone && r.refereePhone.endsWith(clean.slice(-10))) ||
      (cleanId && r.refereeId === cleanId)
    );
    if (matchLocal && matchLocal.status !== 'Approved') {
      matchLocal.status = 'Approved';
      matchLocal.seatNo = seatNo || matchLocal.seatNo;
      matchLocal.approvedAt = new Date().toISOString();
      writeJsonFile(REFERRALS_FILE, localList);
      if (!updatedDoc) updatedDoc = matchLocal;
    }

    return updatedDoc;
  }

  /**
   * Get stats & records for a specific student (referrer)
   */
  static async getStatsForStudent(studentId, code = '') {
    const cleanId = String(studentId || '').trim();
    const unhashId = cleanId.replace(/^#+/, '');
    const cleanCode = String(code || '').trim().toUpperCase();

    // 1. Gather all student identifiers by looking up DB student
    let dbStudent = null;
    if (isMongoConnected()) {
      try {
        const studentOrConditions = [
          { studentId: cleanId },
          { studentId: `#${unhashId}` },
          { studentId: unhashId }
        ];
        if (cleanId.length === 24 && mongoose.Types.ObjectId.isValid(cleanId)) {
          studentOrConditions.push({ _id: cleanId });
        }
        if (cleanCode) {
          studentOrConditions.push({ referralCode: cleanCode });
        }
        dbStudent = await StudentMongo.findOne({ $or: studentOrConditions }).lean();
      } catch (err) {
        // ignore
      }
    }

    const resolvedRollId = dbStudent?.studentId || (cleanId.startsWith('#') ? cleanId : `#${unhashId}`);
    const resolvedCode = cleanCode || dbStudent?.referralCode || '';
    const resolvedUnhash = resolvedRollId.replace(/^#+/, '');

    const idFilters = [
      cleanId,
      `#${unhashId}`,
      unhashId,
      resolvedRollId,
      `#${resolvedUnhash}`,
      resolvedUnhash,
      ...(dbStudent?._id ? [String(dbStudent._id)] : []),
      ...(dbStudent?.phone ? [String(dbStudent.phone)] : [])
    ];

    let allReferrals = [];
    let allPayouts = [];

    if (isMongoConnected()) {
      try {
        const query = {
          $or: [
            { referrerId: { $in: idFilters } },
            ...(resolvedCode ? [{ referrerCode: resolvedCode }] : [])
          ]
        };
        allReferrals = await ReferralMongo.find(query).sort({ createdAt: -1 }).lean();
        allPayouts = await PayoutMongo.find({
          $or: [
            { studentId: { $in: idFilters } },
            ...(resolvedCode ? [{ referralCode: resolvedCode }] : [])
          ]
        }).sort({ createdAt: -1 }).lean();
      } catch (err) {
        console.error('Mongo getStatsForStudent error:', err.message);
      }
    }

    if (allReferrals.length === 0) {
      const localRefs = readJsonFile(REFERRALS_FILE, []);
      allReferrals = localRefs.filter(r => 
        idFilters.includes(r.referrerId) || (resolvedCode && r.referrerCode === resolvedCode)
      );
    }
    if (allPayouts.length === 0) {
      const localPays = readJsonFile(PAYOUTS_FILE, []);
      allPayouts = localPays.filter(p => idFilters.includes(p.studentId) || (resolvedCode && p.referralCode === resolvedCode));
    }

    const formattedRefs = allReferrals.map(r => ({ ...r, id: String(r._id || r.id) }));
    const formattedPayouts = allPayouts.map(p => ({ ...p, id: String(p._id || p.id) }));

    const totalCount = formattedRefs.length;
    const approvedCount = formattedRefs.filter(r => r.status === 'Approved' || r.status === 'Redeemed').length;
    const pendingCount = formattedRefs.filter(r => r.status === 'Pending').length;
    const totalEarned = approvedCount * 100;

    const totalWithdrawn = formattedPayouts
      .filter(p => p.status === 'Completed' || p.status === 'Pending')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const availableBalance = Math.max(0, totalEarned - totalWithdrawn);

    return {
      myReferrals: formattedRefs,
      payouts: formattedPayouts,
      totalCount,
      approvedCount,
      pendingCount,
      totalEarned,
      totalWithdrawn,
      availableBalance
    };
  }

  /**
   * Student requests UPI payout
   */
  static async requestPayout(data) {
    const studentId = String(data.studentId || '').trim();
    const upiId = String(data.upiId || '').trim();
    const amount = Number(data.amount) || 0;
    const referralCode = String(data.referralCode || data.studentCode || data.code || '').trim().toUpperCase();

    if (!upiId || !upiId.includes('@')) {
      throw new Error('Please enter a valid UPI ID (e.g. mobile@upi or name@oksbi)');
    }
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be greater than ₹0');
    }

    const stats = await this.getStatsForStudent(studentId, referralCode);
    if (amount > stats.availableBalance) {
      throw new Error(`Insufficient referral balance. Available balance is ₹${stats.availableBalance}`);
    }

    // Resolve standardized student roll ID (e.g. #STU001)
    let standardId = studentId;
    if (isMongoConnected()) {
      try {
        const s = await StudentMongo.findOne({
          $or: [
            { studentId: studentId },
            { studentId: `#${studentId.replace(/^#+/, '')}` },
            { referralCode: referralCode }
          ]
        }).lean();
        if (s?.studentId) standardId = s.studentId;
      } catch {}
    }

    const newPayout = {
      studentId: standardId,
      referralCode: referralCode,
      studentName: data.studentName || 'Student',
      studentPhone: data.studentPhone || '',
      upiId: upiId,
      amount: amount,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };

    let saved = null;
    if (isMongoConnected()) {
      try {
        const doc = await PayoutMongo.create(newPayout);
        saved = { ...doc.toObject(), id: String(doc._id) };
      } catch (err) {
        console.error('Mongo Payout.create error:', err.message);
      }
    }

    if (!saved) {
      saved = { ...newPayout, id: `payout_${Date.now()}` };
    }

    const localList = readJsonFile(PAYOUTS_FILE, []);
    localList.unshift(saved);
    writeJsonFile(PAYOUTS_FILE, localList);

    return saved;
  }

  /**
   * Get all payout requests
   */
  static async getAllPayouts() {
    if (isMongoConnected()) {
      try {
        const list = await PayoutMongo.find({}).sort({ createdAt: -1 }).lean();
        return list.map(p => ({ ...p, id: String(p._id) }));
      } catch (err) {
        console.error('Mongo Payout.getAll error:', err.message);
      }
    }
    return readJsonFile(PAYOUTS_FILE, []);
  }

  /**
   * Admin approves or updates payout status
   */
  static async updatePayoutStatus(payoutId, status, utrRef = '', adminNote = '') {
    let updated = null;
    if (isMongoConnected()) {
      try {
        const orConditions = [];
        if (mongoose.Types.ObjectId.isValid(payoutId)) {
          orConditions.push({ _id: payoutId });
        }
        orConditions.push({ id: payoutId });

        updated = await PayoutMongo.findOneAndUpdate(
          { $or: orConditions },
          {
            $set: {
              status,
              utrRef: utrRef || '',
              adminNote: adminNote || '',
              processedAt: new Date().toISOString()
            }
          },
          { returnDocument: 'after' }
        ).lean();
      } catch (err) {
        console.error('Mongo Payout.update error:', err.message);
      }
    }

    const localList = readJsonFile(PAYOUTS_FILE, []);
    const idx = localList.findIndex(p => p.id === payoutId || String(p._id) === payoutId);
    if (idx !== -1) {
      localList[idx].status = status;
      if (utrRef) localList[idx].utrRef = utrRef;
      if (adminNote) localList[idx].adminNote = adminNote;
      localList[idx].processedAt = new Date().toISOString();
      writeJsonFile(PAYOUTS_FILE, localList);
      if (!updated) updated = localList[idx];
    }

    return updated;
  }

  /**
   * Admin manual approval of referral
   */
  static async updateReferralStatus(referralId, status) {
    let updated = null;
    if (isMongoConnected()) {
      try {
        const orConditions = [];
        if (mongoose.Types.ObjectId.isValid(referralId)) {
          orConditions.push({ _id: referralId });
        }
        orConditions.push({ id: referralId });

        updated = await ReferralMongo.findOneAndUpdate(
          { $or: orConditions },
          {
            $set: {
              status,
              approvedAt: status === 'Approved' ? new Date().toISOString() : null
            }
          },
          { returnDocument: 'after' }
        ).lean();
      } catch (err) {
        console.error('Mongo Referral.update error:', err.message);
      }
    }

    const localList = readJsonFile(REFERRALS_FILE, []);
    const idx = localList.findIndex(r => r.id === referralId || String(r._id) === referralId);
    if (idx !== -1) {
      localList[idx].status = status;
      if (status === 'Approved') localList[idx].approvedAt = new Date().toISOString();
      writeJsonFile(REFERRALS_FILE, localList);
      if (!updated) updated = localList[idx];
    }

    return updated;
  }
}
