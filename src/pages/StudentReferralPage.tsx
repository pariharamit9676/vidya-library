import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  referralService,
  getStudentReferralCode,
  ReferralRecord,
  PayoutRequest
} from '../services/referralService';
import { formatDisplayDate } from '../utils/dateFormatter';
import {
  Gift,
  ArrowLeft,
  Copy,
  Check,
  Share2,
  IndianRupee,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const StudentReferralPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState<any>(user || null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Referral stats & records
  const [referralStats, setReferralStats] = useState({
    myReferrals: [] as ReferralRecord[],
    totalCount: 0,
    approvedCount: 0,
    pendingCount: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    availableBalance: 0
  });

  // UPI State
  const [upiId, setUpiId] = useState<string>(user?.savedUpiId || '');
  const [isEditingUpi, setIsEditingUpi] = useState<boolean>(!user?.savedUpiId);
  const [upiError, setUpiError] = useState<string>('');
  const [isSavingUpi, setIsSavingUpi] = useState<boolean>(false);

  // Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawFeedback, setWithdrawFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const studentId = user?.id || user?.studentId || (user as any)?._id || 'STU';
  const referralCode = useMemo(() => getStudentReferralCode(user), [user]);

  // Load stats
  const reloadStats = () => {
    if (!studentId) return;
    const stats = referralService.getStudentReferralStats(studentId, referralCode);
    setReferralStats(stats);
  };

  useEffect(() => {
    reloadStats();
    if (user?.savedUpiId) {
      setUpiId(user.savedUpiId);
    }
  }, [studentId, referralCode, user]);

  // Share URL & WhatsApp message
  const shareUrl = `${window.location.origin}/`;
  const shareMessage = `Hey! 📚 Join Vidya Library (Gayatri Nagar, Gwalior) for uninterrupted study sessions with pin-drop silence & 300 Mbps Wi-Fi.\n\nUse my referral code *${referralCode}* to reserve your 100% Free Trial Desk:\n👉 ${shareUrl}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // UPI ID validation regex (e.g. mobile@upi, username@oksbi, etc.)
  const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    setUpiError('');
    const clean = upiId.trim();
    if (!clean || !UPI_REGEX.test(clean)) {
      setUpiError('Please enter a valid UPI ID (e.g. mobile@upi or name@oksbi)');
      return;
    }

    setIsSavingUpi(true);
    try {
      referralService.saveStudentUpiId(studentId, clean);
      setIsEditingUpi(false);
      setWithdrawFeedback({ type: 'success', text: 'UPI ID saved successfully!' });
      setTimeout(() => setWithdrawFeedback(null), 3000);
    } catch {
      setUpiError('Failed to save UPI ID.');
    } finally {
      setIsSavingUpi(false);
    }
  };

  const handleOpenWithdraw = () => {
    if (!upiId || !UPI_REGEX.test(upiId.trim())) {
      setIsEditingUpi(true);
      setUpiError('Please enter and save your UPI ID first before requesting payout.');
      return;
    }
    setWithdrawAmount(referralStats.availableBalance);
    setIsWithdrawModalOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    if (withdrawAmount <= 0) return;
    if (withdrawAmount > referralStats.availableBalance) {
      setWithdrawFeedback({ type: 'error', text: 'Requested amount exceeds your available balance.' });
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = referralService.requestUpiPayout({
        studentId,
        studentName: user?.name || 'Student',
        studentPhone: user?.phone || '',
        upiId: upiId.trim(),
        amount: withdrawAmount
      });

      if (res.success) {
        reloadStats();
        setIsWithdrawModalOpen(false);
        setWithdrawFeedback({
          type: 'success',
          text: `🎉 ₹${withdrawAmount} withdrawal requested! Admin will transfer to ${upiId}.`
        });
        setTimeout(() => setWithdrawFeedback(null), 5000);
      } else {
        setWithdrawFeedback({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setWithdrawFeedback({ type: 'error', text: err?.message || 'Failed to submit withdrawal request.' });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#192038] font-sans pb-24 sm:pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDF1F7] px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-9 h-9 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-[#192038] hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-black text-[#192038] m-0 flex items-center gap-1.5">
                <Gift size={16} className="text-[#544bec]" />
                <span>Refer & Earn</span>
              </h1>
              <p className="text-[11px] text-[#8F9BB3] m-0">
                Invite study partners & earn ₹100 per friend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#544bec] bg-[#EEF0FD] px-2.5 py-1 rounded-lg border border-[#544bec]/20 flex items-center gap-1">
              <Sparkles size={12} />
              <span>₹100 / Friend</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        {/* Feedback Alert Toast */}
        {withdrawFeedback && (
          <div
            className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${
              withdrawFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {withdrawFeedback.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{withdrawFeedback.text}</span>
          </div>
        )}

        {/* 1. Hero Share Card */}
        <div className="bg-gradient-to-br from-[#4338CA] via-[#544bec] to-[#6366F1] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-[#544bec]/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold">
              <Gift size={13} />
              <span>Unlimited Referral Program</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight m-0">
              Invite Friends, Earn ₹100 Every Time They Enroll!
            </h2>
            <p className="text-xs text-white/80 leading-relaxed m-0">
              Share your unique referral code. When your friend reserves a free trial desk and pays their first month fee, you instantly receive <strong>₹100</strong> in your referral wallet.
            </p>

            {/* Code Box & Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Code Pill */}
              <div className="flex items-center justify-between bg-white text-[#192038] px-4 py-2.5 rounded-xl border border-white/30 shadow-md">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-[#8F9BB3]">
                    Your Referral Code
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg tracking-wider text-[#544bec]">
                    {referralCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="ml-3 p-1.5 rounded-lg bg-[#EEF0FD] hover:bg-[#E0E4FC] text-[#544bec] transition-all cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* WhatsApp Share Button */}
              <button
                onClick={handleWhatsAppShare}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Referral Wallet & UPI Payout Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card A: Available Balance */}
          <div className="bg-white rounded-2xl border border-[#EDF1F7] p-4.5 sm:p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider block">
                Available Wallet Balance
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                ₹{referralStats.availableBalance}
              </div>
              <p className="text-[11px] text-[#8F9BB3] mt-1 m-0">
                Can be deducted from next fee or withdrawn via UPI
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleOpenWithdraw}
                disabled={referralStats.availableBalance <= 0}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#544bec] hover:bg-[#4338ca] text-white shadow-2xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <IndianRupee size={14} />
                <span>Withdraw to UPI</span>
              </button>
            </div>
          </div>

          {/* Card B: Lifetime Earnings & Enrolled */}
          <div className="bg-white rounded-2xl border border-[#EDF1F7] p-4.5 sm:p-5 shadow-xs space-y-3">
            <span className="text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider block">
              Referral Performance
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 bg-[#F8FAFD] rounded-xl">
                <span className="text-[10px] text-[#8F9BB3] block">Lifetime Earned</span>
                <span className="font-mono font-black text-base text-[#192038]">
                  ₹{referralStats.totalEarned}
                </span>
              </div>
              <div className="p-2.5 bg-[#F8FAFD] rounded-xl">
                <span className="text-[10px] text-[#8F9BB3] block">Friends Enrolled</span>
                <span className="font-black text-base text-[#544bec]">
                  {referralStats.approvedCount}
                </span>
              </div>
            </div>
            <div className="p-2.5 bg-[#F8FAFD] rounded-xl flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#8F9BB3]">Demo Trials Pending:</span>
              <span className="font-bold text-amber-600">{referralStats.pendingCount}</span>
            </div>
          </div>

          {/* Card C: Linked UPI ID */}
          <div className="bg-white rounded-2xl border border-[#EDF1F7] p-4.5 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8F9BB3] uppercase tracking-wider block">
                Payout UPI Account
              </span>
              <Smartphone size={16} className="text-[#544bec]" />
            </div>

            {isEditingUpi ? (
              <form onSubmit={handleSaveUpi} className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or name@oksbi"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setUpiError('');
                  }}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-xl text-xs font-mono outline-none focus:border-[#544bec] focus:bg-white"
                />
                {upiError && (
                  <p className="text-[10px] text-rose-600 font-bold m-0">{upiError}</p>
                )}
                <div className="flex items-center gap-1.5">
                  <button
                    type="submit"
                    disabled={isSavingUpi}
                    className="flex-1 py-1.5 rounded-lg bg-[#544bec] text-white text-xs font-bold cursor-pointer hover:bg-[#4338ca]"
                  >
                    {isSavingUpi ? 'Saving...' : 'Save UPI ID'}
                  </button>
                  {user?.savedUpiId && (
                    <button
                      type="button"
                      onClick={() => setIsEditingUpi(false)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#EDF1F7] text-xs font-medium text-[#6B778C]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-800 block font-medium">Verified UPI ID</span>
                    <span className="font-mono font-bold text-xs text-emerald-950">{upiId}</span>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                </div>
                <button
                  onClick={() => setIsEditingUpi(true)}
                  className="text-[11px] text-[#544bec] font-bold hover:underline cursor-pointer block"
                >
                  Change UPI ID →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. How It Works Steps */}
        <div className="bg-white rounded-2xl border border-[#EDF1F7] p-4.5 sm:p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#8F9BB3] m-0">
            How Refer & Earn Works
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#EEF0FD] text-[#544bec] font-black text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="text-xs font-extrabold text-[#192038] m-0">Share Your Code</h4>
              <p className="text-[11px] text-[#8F9BB3] m-0 leading-relaxed">
                Send your unique code <strong className="text-[#544bec]">{referralCode}</strong> to your friends via WhatsApp.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#EEF0FD] text-[#544bec] font-black text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="text-xs font-extrabold text-[#192038] m-0">Friend Reserves Demo</h4>
              <p className="text-[11px] text-[#8F9BB3] m-0 leading-relaxed">
                Your friend registers for a 100% free trial desk using your referral code on the website.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] space-y-1">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="text-xs font-extrabold text-emerald-700 m-0">₹100 Wallet Reward</h4>
              <p className="text-[11px] text-[#8F9BB3] m-0 leading-relaxed">
                Once they visit and pay their fee, ₹100 is credited to your wallet for fee discounts or UPI withdrawal.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Friends Invited & Status Tracking */}
        <div className="bg-white rounded-2xl border border-[#EDF1F7] p-4.5 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#192038] m-0">
                Your Referred Friends ({referralStats.totalCount})
              </h3>
              <p className="text-[11px] text-[#8F9BB3] m-0">
                Real-time admission status of friends who joined using your code
              </p>
            </div>
          </div>

          {referralStats.myReferrals.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {referralStats.myReferrals.map((item) => {
                const isApproved = item.status === 'Approved';
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-[#EDF1F7] hover:border-[#CBD5E1] bg-[#F8FAFD] flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                          isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {item.refereeName ? item.refereeName.charAt(0).toUpperCase() : 'F'}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#192038]">
                          {item.refereeName}
                        </div>
                        <div className="text-[10px] text-[#8F9BB3]">
                          Registered on {formatDisplayDate(item.createdAt)}
                          {item.seatNo && ` • Seat #${item.seatNo}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {isApproved ? (
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            <span>Enrolled</span>
                          </span>
                          <span className="block font-mono font-black text-xs text-emerald-700 mt-0.5">
                            +₹{item.rewardAmount || 100}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                            <Clock size={11} />
                            <span>Trial Demo</span>
                          </span>
                          <span className="block text-[10px] text-[#8F9BB3] mt-0.5">
                            Awaiting fee & seat
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#8F9BB3] bg-[#F8FAFD] rounded-xl border border-dashed border-[#EDF1F7]">
              <Gift size={32} className="mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-[#192038]">No friends referred yet</div>
              <p className="text-[11px] text-[#8F9BB3] max-w-xs mx-auto mt-0.5">
                Share your referral code <strong>{referralCode}</strong> with your friends preparing for competitive exams to start earning rewards!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 5. Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xl max-w-sm w-full p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EDF1F7] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <IndianRupee size={16} />
                </div>
                <h3 className="text-sm font-extrabold text-[#192038] m-0">
                  Withdraw Referral Earnings
                </h3>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8FAFD] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#8F9BB3]">Available Balance:</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">
                    ₹{referralStats.availableBalance}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8F9BB3]">Transfer To UPI:</span>
                  <span className="font-mono font-bold text-[#544bec]">{upiId}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#192038] block mb-1">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  max={referralStats.availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Math.min(referralStats.availableBalance, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono font-bold outline-none focus:border-[#544bec]"
                />
              </div>

              <p className="text-[11px] text-[#8F9BB3] m-0">
                ⚡ Withdrawal requests are usually processed by Vidya Library within 24 hours directly to your UPI ID.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDF1F7]">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B778C] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isWithdrawing || withdrawAmount <= 0}
                onClick={handleConfirmWithdrawal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#544bec] hover:bg-[#4338ca] text-white shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isWithdrawing ? 'Submitting...' : `Confirm Withdraw ₹${withdrawAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
