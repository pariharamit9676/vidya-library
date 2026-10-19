import React, { useState, useMemo, useEffect } from 'react';
import {
  Gift,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Users,
  IndianRupee,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  X,
  Copy
} from 'lucide-react';
import { useStudents } from '../services/useLibraryQueries';
import { useLibrary } from '../context/LibraryContext';
import {
  referralService,
  ReferralRecord,
  PayoutRequest
} from '../services/referralService';
import { CommonTable } from '../components/common/CommonTable';
import { formatDisplayDate } from '../utils/dateFormatter';

export const AdminReferralsPage: React.FC = () => {
  const { data: apiStudents = [], isLoading: isStudentsLoading } = useStudents();
  const { showToast, showConfirm } = useLibrary();

  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'referrals' | 'payouts'>('referrals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Modal for marking payout completed
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [utrRef, setUtrRef] = useState<string>('');
  const [payoutNote, setPayoutNote] = useState<string>('');
  const [isProcessingPayout, setIsProcessingPayout] = useState<boolean>(false);

  // Load referrals and payouts
  const reloadData = () => {
    setReferrals(referralService.getReferrals());
    setPayouts(referralService.getPayoutRequests());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Sync with live students data to auto-detect if referee got assigned a seat
  useEffect(() => {
    if (Array.isArray(apiStudents) && apiStudents.length > 0) {
      let updatedAny = false;
      apiStudents.forEach((student: any) => {
        // If referee is now Active or has a seat assigned, ensure referral is approved
        if (
          student.seatNo &&
          student.seatNo !== '-' &&
          student.status !== 'Demo' &&
          student.studentType !== 'Demo'
        ) {
          const approved = referralService.checkAndApproveByStudent(
            student.phone || student.id || student._id,
            student.seatNo
          );
          if (approved) updatedAny = true;
        }
      });
      if (updatedAny) {
        reloadData();
      }
    }
  }, [apiStudents]);

  // Derived KPI Stats
  const stats = useMemo(() => {
    const totalCount = referrals.length;
    const pendingCount = referrals.filter((r) => r.status === 'Pending').length;
    const approvedCount = referrals.filter((r) => r.status === 'Approved').length;
    const totalRewards = referrals
      .filter((r) => r.status === 'Approved')
      .reduce((sum, r) => sum + (r.rewardAmount || 100), 0);
    const pendingPayouts = payouts.filter((p) => p.status === 'Pending');
    const pendingPayoutAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalCount,
      pendingCount,
      approvedCount,
      totalRewards,
      pendingPayoutCount: pendingPayouts.length,
      pendingPayoutAmount
    };
  }, [referrals, payouts]);

  // Filtered referrals
  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => {
      if (statusFilter !== 'all' && r.status.toLowerCase() !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchReferrer = (r.referrerName || '').toLowerCase().includes(q);
        const matchReferee = (r.refereeName || '').toLowerCase().includes(q);
        const matchPhone =
          (r.referrerPhone || '').includes(q) || (r.refereePhone || '').includes(q);
        const matchCode = (r.referrerCode || '').toLowerCase().includes(q);
        if (!matchReferrer && !matchReferee && !matchPhone && !matchCode) return false;
      }
      return true;
    });
  }, [referrals, statusFilter, searchQuery]);

  // Filtered payouts
  const filteredPayouts = useMemo(() => {
    if (!searchQuery.trim()) return payouts;
    const q = searchQuery.toLowerCase().trim();
    return payouts.filter(
      (p) =>
        (p.studentName || '').toLowerCase().includes(q) ||
        (p.studentPhone || '').includes(q) ||
        (p.upiId || '').toLowerCase().includes(q)
    );
  }, [payouts, searchQuery]);

  // Action: Manually Approve Referral
  const handleManualApprove = (referral: ReferralRecord) => {
    const success = referralService.approveReferral(referral.id);
    if (success) {
      reloadData();
      if (showToast) {
        showToast(
          `🟢 Referral approved! ₹${referral.rewardAmount || 100} credited to ${referral.referrerName}'s wallet.`,
          'success'
        );
      }
    }
  };

  // Action: Complete Payout
  const handleConfirmPayout = () => {
    if (!selectedPayout) return;
    setIsProcessingPayout(true);
    try {
      referralService.markPayoutCompleted(selectedPayout.id, utrRef, payoutNote);
      reloadData();
      setSelectedPayout(null);
      setUtrRef('');
      setPayoutNote('');
      if (showToast) {
        showToast(
          `✅ ₹${selectedPayout.amount} marked as transferred to ${selectedPayout.studentName} (${selectedPayout.upiId})`,
          'success'
        );
      }
    } catch {
      if (showToast) showToast('Failed to update payout', 'error');
    } finally {
      setIsProcessingPayout(false);
    }
  };

  // Action: Reject Payout
  const handleRejectPayout = async (payout: PayoutRequest) => {
    if (showConfirm) {
      const ok = await showConfirm({
        title: 'Reject Payout Request?',
        message: `Are you sure you want to reject this withdrawal request of ₹${payout.amount}? The amount will be refunded back to ${payout.studentName}'s wallet.`,
        confirmText: 'Yes, Reject & Refund',
        cancelText: 'Cancel',
        variant: 'danger'
      });
      if (!ok) return;
    }
    referralService.rejectPayout(payout.id, 'Declined by Admin');
    reloadData();
    if (showToast) {
      showToast(`Payout request rejected. ₹${payout.amount} refunded to student wallet.`, 'info');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shrink-0">
              <Gift size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#192038] tracking-tight m-0">
              Refer & Earn Management
            </h1>
          </div>
          <p className="text-xs text-[#8F9BB3] mt-1 m-0">
            Track student referrals, trial conversions, wallet rewards, and UPI withdrawal requests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EDF1F7] rounded-xl shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'referrals'
                ? 'bg-[#544bec] text-white shadow-2xs'
                : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F7F9FC]'
            }`}
          >
            <Users size={14} />
            <span>All Referrals ({referrals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === 'payouts'
                ? 'bg-[#544bec] text-white shadow-2xs'
                : 'text-[#6B778C] hover:text-[#192038] hover:bg-[#F7F9FC]'
            }`}
          >
            <IndianRupee size={14} />
            <span>UPI Payouts</span>
            {stats.pendingPayoutCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                {stats.pendingPayoutCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Total Referrals */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#8F9BB3] uppercase tracking-wider block truncate">
              Total Referrals
            </span>
            <div className="text-lg sm:text-2xl font-black text-[#192038] mt-0.5">
              {stats.totalCount}
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-[#544bec] mt-0.5 truncate">
              Lead registrations
            </div>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
        </div>

        {/* Card 2: Pending (Trial / Demo) */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#8F9BB3] uppercase tracking-wider block truncate">
              Pending Admissions
            </span>
            <div className="text-lg sm:text-2xl font-black text-amber-600 mt-0.5">
              {stats.pendingCount}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-[#8F9BB3] mt-0.5 truncate">
              Trial / Demo students
            </div>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={18} />
          </div>
        </div>

        {/* Card 3: Approved & Credited */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#8F9BB3] uppercase tracking-wider block truncate">
              Enrolled & Approved
            </span>
            <div className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5">
              {stats.approvedCount}
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 mt-0.5 truncate">
              ₹{stats.totalRewards} rewards credited
            </div>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* Card 4: UPI Withdrawal Requests */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#8F9BB3] uppercase tracking-wider block truncate">
              UPI Payouts Due
            </span>
            <div className="text-lg sm:text-2xl font-black text-[#544bec] mt-0.5">
              ₹{stats.pendingPayoutAmount}
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-rose-600 mt-0.5 truncate">
              {stats.pendingPayoutCount} requests pending
            </div>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <IndianRupee size={18} />
          </div>
        </div>
      </div>

      {/* 3. Main Data Table Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDF1F7] shadow-xs overflow-hidden space-y-3 sm:space-y-4 p-3.5 sm:p-5">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'referrals'
                  ? 'Search by referrer name, referee, phone, or code...'
                  : 'Search by student name, phone, or UPI ID...'
              }
              className="w-full pl-10 pr-4 py-2 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-none focus:border-[#544bec] focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter for Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
              {(['all', 'pending', 'approved'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                    statusFilter === st
                      ? 'bg-[#544bec] text-white shadow-2xs'
                      : 'bg-[#F7F9FC] text-[#6B778C] border border-[#EDF1F7] hover:bg-[#EDF1F7]'
                  }`}
                >
                  {st === 'pending'
                    ? `Pending (${stats.pendingCount})`
                    : st === 'approved'
                    ? `Approved (${stats.approvedCount})`
                    : 'All'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: All Referrals View */}
        {activeTab === 'referrals' && (
          <CommonTable
            data={filteredReferrals}
            emptyMessage="No referral records found matching your query."
            pagination={true}
            initialPageSize={10}
            minWidth="780px"
            columns={[
              {
                header: 'Referrer (Invited By)',
                render: (r) => (
                  <div>
                    <div className="font-extrabold text-[#192038] flex items-center gap-1.5">
                      <span>{r.referrerName}</span>
                      <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-[#EEF0FD] text-[#544bec]">
                        {r.referrerCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8F9BB3] font-medium">
                      {r.referrerPhone || '—'}
                    </div>
                  </div>
                )
              },
              {
                header: 'New Student (Friend)',
                render: (r) => (
                  <div>
                    <div className="font-bold text-[#192038]">{r.refereeName}</div>
                    <div className="text-[11px] text-[#8F9BB3]">
                      📱 {r.refereePhone}
                      {r.seatNo && <span className="text-[#544bec] font-bold ml-1.5">• Seat #{r.seatNo}</span>}
                    </div>
                  </div>
                )
              },
              {
                header: 'Registration Date',
                render: (r) => (
                  <div className="text-xs text-[#6B778C] font-medium">
                    {formatDisplayDate(r.createdAt)}
                  </div>
                )
              },
              {
                header: 'Reward',
                render: (r) => (
                  <span className="font-mono font-black text-xs text-emerald-700">
                    ₹{r.rewardAmount || 100}
                  </span>
                )
              },
              {
                header: 'Status',
                render: (r) =>
                  r.status === 'Approved' ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Approved</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                      <Clock size={12} />
                      <span>Demo (Pending Fee & Seat)</span>
                    </span>
                  )
              },
              {
                header: 'Action',
                headerAlign: 'right',
                render: (r) => (
                  <div className="flex items-center justify-end gap-1.5">
                    {r.status === 'Pending' ? (
                      <button
                        onClick={() => handleManualApprove(r)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer inline-flex items-center gap-1"
                        title="Manually Approve Referral and credit ₹100"
                      >
                        <Check size={12} />
                        <span>Approve & Credit</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#8F9BB3] font-medium">Credited to wallet</span>
                    )}
                  </div>
                )
              }
            ]}
            renderMobileCard={(r) => (
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-extrabold text-xs text-[#192038]">
                      Friend: {r.refereeName}
                    </div>
                    <div className="text-[11px] text-[#8F9BB3]">
                      📱 {r.refereePhone}
                    </div>
                  </div>
                  {r.status === 'Approved' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Pending
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-[#F8FAFD] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8F9BB3]">Referred By:</span>
                    <span className="font-bold text-[#192038]">
                      {r.referrerName} ({r.referrerCode})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8F9BB3]">Reward:</span>
                    <span className="font-bold text-emerald-700">₹{r.rewardAmount || 100}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8F9BB3]">Date:</span>
                    <span className="text-[#6B778C]">{formatDisplayDate(r.createdAt)}</span>
                  </div>
                </div>

                {r.status === 'Pending' && (
                  <button
                    onClick={() => handleManualApprove(r)}
                    className="w-full py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check size={13} />
                    <span>Approve & Credit ₹{r.rewardAmount || 100}</span>
                  </button>
                )}
              </div>
            )}
          />
        )}

        {/* Tab 2: UPI Payout Requests View */}
        {activeTab === 'payouts' && (
          <CommonTable
            data={filteredPayouts}
            emptyMessage="No UPI payout requests found."
            pagination={true}
            initialPageSize={10}
            minWidth="780px"
            columns={[
              {
                header: 'Student Name',
                render: (p) => (
                  <div>
                    <div className="font-extrabold text-[#192038]">{p.studentName}</div>
                    <div className="text-[11px] text-[#8F9BB3]">📱 {p.studentPhone}</div>
                  </div>
                )
              },
              {
                header: 'UPI ID for Transfer',
                render: (p) => (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-[#544bec] bg-[#EEF0FD] px-2 py-0.5 rounded-md">
                      {p.upiId}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(p.upiId);
                        if (showToast) showToast(`Copied UPI ID: ${p.upiId}`, 'success');
                      }}
                      className="p-1 text-[#8F9BB3] hover:text-[#192038] transition-colors"
                      title="Copy UPI ID"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                )
              },
              {
                header: 'Amount',
                render: (p) => (
                  <span className="font-mono font-black text-sm text-[#192038]">
                    ₹{p.amount}
                  </span>
                )
              },
              {
                header: 'Requested Date',
                render: (p) => (
                  <div className="text-xs text-[#6B778C] font-medium">
                    {formatDisplayDate(p.requestedAt)}
                  </div>
                )
              },
              {
                header: 'Status',
                render: (p) =>
                  p.status === 'Completed' ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Transferred</span>
                    </span>
                  ) : p.status === 'Rejected' ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      Rejected & Refunded
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                      <Clock size={12} />
                      <span>Action Required</span>
                    </span>
                  )
              },
              {
                header: 'Action',
                headerAlign: 'right',
                render: (p) => (
                  <div className="flex items-center justify-end gap-1.5">
                    {p.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedPayout(p);
                            setUtrRef('');
                            setPayoutNote('');
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#544bec] text-white hover:bg-[#4338ca] transition-all cursor-pointer shadow-2xs"
                        >
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => handleRejectPayout(p)}
                          className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Reject Request"
                        >
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#8F9BB3]">
                        {p.utrRef ? `UTR: ${p.utrRef}` : 'Processed'}
                      </span>
                    )}
                  </div>
                )
              }
            ]}
          />
        )}
      </div>

      {/* 4. Modal: Complete UPI Payout */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDF1F7] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <IndianRupee size={16} />
                </div>
                <h3 className="text-base font-extrabold text-[#192038] m-0">
                  Confirm UPI Payout
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 bg-[#F8FAFD] rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8F9BB3]">Student:</span>
                <span className="font-bold text-[#192038]">{selectedPayout.studentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F9BB3]">Amount to Transfer:</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  ₹{selectedPayout.amount}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#EDF1F7]">
                <span className="text-[#8F9BB3]">Target UPI ID:</span>
                <span className="font-mono font-bold text-[#544bec] bg-white px-2 py-0.5 rounded border border-[#EDF1F7]">
                  {selectedPayout.upiId}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#192038] block mb-1">
                  Bank UTR / Transaction Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 429182910481"
                  value={utrRef}
                  onChange={(e) => setUtrRef(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-mono outline-none focus:border-[#544bec] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#192038] block mb-1">
                  Admin Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sent via Google Pay / PhonePe"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs outline-none focus:border-[#544bec] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDF1F7]">
              <button
                type="button"
                onClick={() => setSelectedPayout(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B778C] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingPayout}
                onClick={handleConfirmPayout}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayout ? 'Saving...' : 'Confirm Transferred ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
