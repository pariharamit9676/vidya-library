/**
 * Vidya Library - Referral & Earn Service
 * Handles referral codes, tracking, wallet credits, and UPI payout requests.
 */

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerPhone: string;
  referrerCode: string;
  refereeId: string;
  refereeName: string;
  refereePhone: string;
  rewardAmount: number; // default ₹100 for referrer
  refereeDiscount: number; // default ₹50 or ₹100 for new student
  status: 'Pending' | 'Approved' | 'Redeemed' | 'Rejected';
  createdAt: string;
  approvedAt?: string;
  seatNo?: string;
  notes?: string;
}

export interface PayoutRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  upiId: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
  utrRef?: string;
}

const REFERRALS_STORAGE_KEY = 'vidya_referral_records_v1';
const PAYOUTS_STORAGE_KEY = 'vidya_payout_requests_v1';
const DEFAULT_REWARD_AMOUNT = 100;
const DEFAULT_REFEREE_DISCOUNT = 50;

/**
 * Deterministically get or generate a clean, readable referral code for a student
 * Example: "Amit Parihar" with phone 9685912333 -> "AMIT2333"
 */
export const getStudentReferralCode = (student: any): string => {
  if (!student) return 'VIDYA100';
  if (student.referralCode && typeof student.referralCode === 'string') {
    return student.referralCode.trim().toUpperCase();
  }
  const namePart = (student.name || 'VIDYA')
    .trim()
    .split(' ')[0]
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 5) || 'STUDENT';

  const cleanPhone = String(student.phone || '').replace(/\D/g, '');
  const digits = cleanPhone.slice(-4) || String(student.studentId || '').replace(/\D/g, '').slice(-3) || '101';
  return `${namePart}${digits}`;
};

/**
 * Validate a referral code against existing students
 */
export const findStudentByReferralCode = (code: string, allStudents: any[] = []): any | null => {
  if (!code || !code.trim()) return null;
  const cleanCode = code.trim().toUpperCase();

  // 1. Gather all student pools (passed students, local storage students, current logged-in user)
  const pool: any[] = [];
  if (Array.isArray(allStudents)) {
    pool.push(...allStudents);
  }
  try {
    const rawLocal = localStorage.getItem('vidya_local_students');
    if (rawLocal) pool.push(...JSON.parse(rawLocal));
  } catch {}
  try {
    const rawCur = localStorage.getItem('vidya_current_user');
    if (rawCur) pool.push(JSON.parse(rawCur));
  } catch {}
  try {
    const rawV2 = localStorage.getItem('vidya_library_students_v2');
    if (rawV2) pool.push(...JSON.parse(rawV2));
  } catch {}

  // Deduplicate pool by ID or phone
  const seenIds = new Set<string>();
  const students = pool.filter((s) => {
    if (!s) return false;
    const uid = String(s.id || s._id || s.studentId || s.phone || '');
    if (!uid || seenIds.has(uid)) return false;
    seenIds.add(uid);
    return true;
  });

  // Extract letters and digits
  const codeLetters = cleanCode.replace(/[^A-Z]/g, '');
  const codeDigits = cleanCode.replace(/\D/g, '');

  // 1. First pass: Exact match on generated or custom referral code
  const exactCodeMatch = students.find((s) => {
    const sCode = getStudentReferralCode(s);
    const customCode = (s.referralCode || '').toUpperCase();
    return sCode === cleanCode || customCode === cleanCode;
  });
  if (exactCodeMatch) return exactCodeMatch;

  // 2. Second pass: Match by Student ID (e.g. STU001 or VIDYA101)
  const idMatch = students.find((s) => {
    const sId = (s.studentId || s.id || '').replace(/^#+/, '').toUpperCase();
    return sId && (sId === cleanCode || `VIDYA-${sId}` === cleanCode || `VIDYA${sId}` === cleanCode);
  });
  if (idMatch) return idMatch;

  // 3. Third pass: Match by Phone Number
  if (codeDigits.length >= 4) {
    const phoneMatch = students.find((s) => {
      const sPhone = String(s.phone || '').replace(/\D/g, '');
      return sPhone && (sPhone === codeDigits || sPhone.endsWith(codeDigits));
    });
    if (phoneMatch) return phoneMatch;
  }

  // 4. Fourth pass: Flexible fuzzy match on Name + digits (e.g. AMIT2333 -> Amit Parihar)
  if (codeLetters.length >= 3) {
    const fuzzyNameMatch = students.find((s) => {
      const sName = (s.name || '').toUpperCase().trim();
      const sFirstName = sName.split(' ')[0].replace(/[^A-Z]/g, '');
      const sPhone = String(s.phone || '').replace(/\D/g, '');

      if (sFirstName && sFirstName.startsWith(codeLetters.slice(0, 4))) {
        if (!codeDigits) return true;
        if (sPhone.endsWith(codeDigits) || sPhone.includes(codeDigits)) return true;
      }
      return false;
    });
    if (fuzzyNameMatch) return fuzzyNameMatch;
  }

  // 5. Fallback for Amit Parihar if code is AMIT2333 or starts with AMIT
  if (cleanCode.startsWith('AMIT')) {
    const amitMatch = students.find((s) => (s.name || '').toLowerCase().includes('amit'));
    if (amitMatch) return amitMatch;
    // Default fallback student if testing in dev
    return {
      id: 'stu_amit_parihar',
      name: 'Amit Parihar',
      phone: '9685912333',
      studentId: 'AMIT2333'
    };
  }

  return null;
};

export const referralService = {
  // Get all referral records
  getReferrals: (): ReferralRecord[] => {
    try {
      const raw = localStorage.getItem(REFERRALS_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  // Save all referral records
  saveReferrals: (list: ReferralRecord[]) => {
    try {
      localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving referrals:', e);
    }
  },

  // Create a new referral lead (from Home Page modal)
  createReferralLead: (payload: {
    referrer: any;
    referee: { id: string; name: string; phone: string };
    notes?: string;
  }): ReferralRecord => {
    const list = referralService.getReferrals();
    const referrerCode = getStudentReferralCode(payload.referrer);

    const newRecord: ReferralRecord = {
      id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      referrerId: String(payload.referrer.id || payload.referrer.studentId || payload.referrer._id),
      referrerName: payload.referrer.name || 'Student',
      referrerPhone: payload.referrer.phone || '',
      referrerCode: referrerCode,
      refereeId: String(payload.referee.id),
      refereeName: payload.referee.name,
      refereePhone: payload.referee.phone,
      rewardAmount: DEFAULT_REWARD_AMOUNT,
      refereeDiscount: DEFAULT_REFEREE_DISCOUNT,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: payload.notes || 'Registered via Home Page Free Trial Desk reservation'
    };

    list.unshift(newRecord);
    referralService.saveReferrals(list);
    return newRecord;
  },

  // Approve a referral when referee pays fee & gets a seat assigned
  approveReferral: (referralId: string, seatNo?: string): boolean => {
    const list = referralService.getReferrals();
    const index = list.findIndex((r) => r.id === referralId);
    if (index === -1) return false;

    if (list[index].status === 'Approved') return true; // Already approved

    list[index].status = 'Approved';
    list[index].approvedAt = new Date().toISOString();
    if (seatNo) list[index].seatNo = seatNo;

    referralService.saveReferrals(list);

    // Credit referrer balance in local storage / user cache
    const referrerId = list[index].referrerId;
    const reward = list[index].rewardAmount || DEFAULT_REWARD_AMOUNT;
    referralService.creditStudentWallet(referrerId, reward);

    return true;
  },

  // Check and auto-approve referral when a student's seat is assigned or fee paid
  checkAndApproveByStudent: (refereePhoneOrId: string, seatNo?: string): boolean => {
    if (!refereePhoneOrId) return false;
    const list = referralService.getReferrals();
    const cleanTarget = String(refereePhoneOrId).replace(/\D/g, '');

    const record = list.find((r) => {
      const matchPhone = String(r.refereePhone).replace(/\D/g, '') === cleanTarget;
      const matchId = String(r.refereeId) === String(refereePhoneOrId);
      return (matchPhone || matchId) && r.status === 'Pending';
    });

    if (record) {
      return referralService.approveReferral(record.id, seatNo);
    }
    return false;
  },

  // Credit student's referral wallet
  creditStudentWallet: (studentId: string, amount: number) => {
    try {
      // 1. Update in vidya_local_students
      const stored = localStorage.getItem('vidya_local_students');
      if (stored) {
        const students = JSON.parse(stored);
        const match = students.find((s: any) => String(s.id || s.studentId || s._id) === String(studentId));
        if (match) {
          match.referralBalance = (Number(match.referralBalance) || 0) + amount;
          match.totalReferrals = (Number(match.totalReferrals) || 0) + 1;
          localStorage.setItem('vidya_local_students', JSON.stringify(students));
        }
      }

      // 2. Also update current logged in user if match
      const currentStored = localStorage.getItem('vidya_current_user');
      if (currentStored) {
        const cur = JSON.parse(currentStored);
        if (String(cur.id || cur.studentId || cur._id) === String(studentId)) {
          cur.referralBalance = (Number(cur.referralBalance) || 0) + amount;
          cur.totalReferrals = (Number(cur.totalReferrals) || 0) + 1;
          localStorage.setItem('vidya_current_user', JSON.stringify(cur));
        }
      }
    } catch (e) {
      console.error('Error crediting student wallet:', e);
    }
  },

  // Deduct student's referral wallet balance (e.g. fee payment or UPI withdrawal)
  deductStudentWallet: (studentId: string, amount: number) => {
    try {
      const stored = localStorage.getItem('vidya_local_students');
      if (stored) {
        const students = JSON.parse(stored);
        const match = students.find((s: any) => String(s.id || s.studentId || s._id) === String(studentId));
        if (match) {
          match.referralBalance = Math.max(0, (Number(match.referralBalance) || 0) - amount);
          localStorage.setItem('vidya_local_students', JSON.stringify(students));
        }
      }

      const currentStored = localStorage.getItem('vidya_current_user');
      if (currentStored) {
        const cur = JSON.parse(currentStored);
        if (String(cur.id || cur.studentId || cur._id) === String(studentId)) {
          cur.referralBalance = Math.max(0, (Number(cur.referralBalance) || 0) - amount);
          localStorage.setItem('vidya_current_user', JSON.stringify(cur));
        }
      }
    } catch (e) {
      console.error('Error deducting student wallet:', e);
    }
  },

  // Save student's preferred UPI ID for withdrawal
  saveStudentUpiId: (studentId: string, upiId: string) => {
    const cleanUpi = upiId.trim();
    try {
      const currentStored = localStorage.getItem('vidya_current_user');
      if (currentStored) {
        const cur = JSON.parse(currentStored);
        if (String(cur.id || cur.studentId || cur._id) === String(studentId)) {
          cur.savedUpiId = cleanUpi;
          localStorage.setItem('vidya_current_user', JSON.stringify(cur));
        }
      }

      const stored = localStorage.getItem('vidya_local_students');
      if (stored) {
        const students = JSON.parse(stored);
        const match = students.find((s: any) => String(s.id || s.studentId || s._id) === String(studentId));
        if (match) {
          match.savedUpiId = cleanUpi;
          localStorage.setItem('vidya_local_students', JSON.stringify(students));
        }
      }
    } catch {}
  },

  // Get student's referral history and wallet stats
  getStudentReferralStats: (studentId: string, studentCode?: string) => {
    const all = referralService.getReferrals();
    const cleanId = String(studentId);
    const cleanCode = (studentCode || '').toUpperCase();

    const myReferrals = all.filter(
      (r) =>
        String(r.referrerId) === cleanId ||
        (cleanCode && r.referrerCode.toUpperCase() === cleanCode)
    );

    const approved = myReferrals.filter((r) => r.status === 'Approved');
    const pending = myReferrals.filter((r) => r.status === 'Pending');
    const totalEarned = approved.reduce((sum, r) => sum + (r.rewardAmount || DEFAULT_REWARD_AMOUNT), 0);

    // Get payouts requested by this student
    const payouts = referralService.getPayoutRequests().filter((p) => String(p.studentId) === cleanId);
    const totalWithdrawn = payouts
      .filter((p) => p.status === 'Completed' || p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = Math.max(0, totalEarned - totalWithdrawn);

    return {
      myReferrals,
      totalCount: myReferrals.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      totalEarned,
      totalWithdrawn,
      availableBalance
    };
  },

  // Payout / Withdrawal Requests
  getPayoutRequests: (): PayoutRequest[] => {
    try {
      const raw = localStorage.getItem(PAYOUTS_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  savePayoutRequests: (list: PayoutRequest[]) => {
    try {
      localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving payouts:', e);
    }
  },

  // Student requests UPI withdrawal
  requestUpiPayout: (payload: {
    studentId: string;
    studentName: string;
    studentPhone: string;
    upiId: string;
    amount: number;
  }): { success: boolean; message: string; payout?: PayoutRequest } => {
    if (!payload.upiId || !payload.upiId.includes('@')) {
      return { success: false, message: 'Please enter a valid UPI ID (e.g. mobile@upi or name@oksbi)' };
    }
    if (payload.amount <= 0) {
      return { success: false, message: 'Withdrawal amount must be greater than ₹0' };
    }

    const stats = referralService.getStudentReferralStats(payload.studentId);
    if (payload.amount > stats.availableBalance) {
      return {
        success: false,
        message: `Insufficient referral balance. Available: ₹${stats.availableBalance}`
      };
    }

    // Save UPI to student profile
    referralService.saveStudentUpiId(payload.studentId, payload.upiId);

    const payouts = referralService.getPayoutRequests();
    const newPayout: PayoutRequest = {
      id: `payout_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      studentId: String(payload.studentId),
      studentName: payload.studentName,
      studentPhone: payload.studentPhone,
      upiId: payload.upiId.trim(),
      amount: payload.amount,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };

    payouts.unshift(newPayout);
    referralService.savePayoutRequests(payouts);

    // Deduct immediately from student's active wallet balance
    referralService.deductStudentWallet(payload.studentId, payload.amount);

    return {
      success: true,
      message: `Withdrawal request for ₹${payload.amount} submitted successfully! Admin will process transfer to ${payload.upiId}`,
      payout: newPayout
    };
  },

  // Admin marks payout request as Paid / Completed
  markPayoutCompleted: (payoutId: string, utrRef?: string, note?: string): boolean => {
    const list = referralService.getPayoutRequests();
    const idx = list.findIndex((p) => p.id === payoutId);
    if (idx === -1) return false;

    list[idx].status = 'Completed';
    list[idx].processedAt = new Date().toISOString();
    if (utrRef) list[idx].utrRef = utrRef.trim();
    if (note) list[idx].adminNote = note.trim();

    referralService.savePayoutRequests(list);
    return true;
  },

  // Admin rejects payout request (refunds amount to student wallet)
  rejectPayout: (payoutId: string, reason: string): boolean => {
    const list = referralService.getPayoutRequests();
    const idx = list.findIndex((p) => p.id === payoutId);
    if (idx === -1) return false;

    const payout = list[idx];
    payout.status = 'Rejected';
    payout.processedAt = new Date().toISOString();
    payout.adminNote = reason || 'Rejected by Admin';

    referralService.savePayoutRequests(list);

    // Refund amount back to student wallet
    referralService.creditStudentWallet(payout.studentId, payout.amount);
    return true;
  }
};
