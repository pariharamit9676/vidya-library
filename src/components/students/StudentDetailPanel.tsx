import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Edit2,
  Wallet,
  Armchair,
  Eye,
  Calendar,
  Clock,
  Receipt
} from 'lucide-react';
import { StudentRecord } from '../../types/student';
import { formatDisplayDate, formatDisplayTime, computeFeeStatus, computeStudentStatus } from '../../utils/dateFormatter';

interface StudentDetailPanelProps {
  student: StudentRecord | null;
  onClose?: () => void;
  onCollectFee: (student: StudentRecord) => void;
  onChangeSeat: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
}

export const StudentDetailPanel: React.FC<StudentDetailPanelProps> = ({
  student,
  onClose,
  onCollectFee,
  onChangeSeat,
  onEditStudent
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Fees' | 'Attendance' | 'History'>('Overview');

  if (!student) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDF1F7] p-8 text-center text-[#8F9BB3]">
        Select a student from the table to view their profile details.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs flex flex-col overflow-hidden">
      {/* 1. Header with Close, Avatar, Name & Quick Call/WhatsApp */}
      <div className="p-5 border-b border-[#EDF1F7] relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-[#8F9BB3] hover:text-[#192038] rounded-lg transition-all"
            title="Close panel"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex items-center gap-3.5 pr-8">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-13 h-13 rounded-full object-cover ring-2 ring-[#544bec]/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#192038] m-0 truncate">
              {student.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono font-semibold text-[#8F9BB3]">
                {student.studentId}
              </span>
              {(() => {
                const resolvedStatus = computeStudentStatus(student);

                return (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    resolvedStatus === 'Demo'
                      ? 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]'
                      : resolvedStatus === 'Active'
                      ? 'bg-[#EEF0FD] text-[#544bec]'
                      : resolvedStatus === 'Due Soon'
                      ? 'bg-[#FFF7E8] text-[#FFAA00]'
                      : resolvedStatus === 'Overdue'
                      ? 'bg-[#FFEFF0] text-[#FF3D71]'
                      : 'bg-[#F4F5F7] text-[#8F9BB3] border border-[#E4E9F2]'
                  }`}>
                    {resolvedStatus}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Quick Call & WhatsApp Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={`tel:${student.phone}`}
              className="w-8 h-8 rounded-full bg-[#EEF0FD] text-[#544bec] hover:bg-[#544bec] hover:text-white flex items-center justify-center transition-all shadow-xs"
              title="Call student"
            >
              <Phone size={14} />
            </a>
            <a
              href={`https://wa.me/91${student.phone}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all shadow-xs"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 mt-5 text-xs font-bold border-b border-[#EDF1F7] -mb-5">
          {(['Overview', 'Fees', 'Attendance', 'History'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 transition-all cursor-pointer relative ${
                activeTab === tab
                  ? 'text-[#544bec] font-extrabold'
                  : 'text-[#8F9BB3] hover:text-[#192038]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#544bec] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tab Content Canvas */}
      <div className="p-5 space-y-5 flex-1 overflow-y-auto max-h-[580px]">
        {activeTab === 'Overview' && (
          <>
            {/* Personal Information */}
            <div className="bg-[#F7F9FC] rounded-xl p-4 border border-[#EDF1F7]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-[#192038] uppercase tracking-wider m-0">
                  Personal Information
                </h4>
                <button
                  onClick={() => onEditStudent(student)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8F9BB3] hover:text-[#544bec] cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-8 space-y-2 text-xs">
                  <div>
                    <span className="text-[#8F9BB3] text-[11px] block">Name</span>
                    <strong className="text-[#192038] font-semibold">{student.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#8F9BB3] text-[11px] block">Student ID</span>
                    <span className="font-mono text-[#192038] font-bold">{student.studentId}</span>
                  </div>
                  <div>
                    <span className="text-[#8F9BB3] text-[11px] block">Phone</span>
                    <span className="text-[#192038] font-medium">{student.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8F9BB3] text-[11px] block">Email</span>
                    <span className="text-[#192038] font-medium truncate block">{student.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8F9BB3] text-[11px] block">Address</span>
                    <span className="text-[#192038] font-medium text-[11px] leading-tight block">
                      {student.address}
                    </span>
                  </div>
                </div>

                {/* Right photo */}
                <div className="col-span-4 flex flex-col items-center justify-start">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-20 h-24 rounded-lg object-cover border border-[#EDF1F7] shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Library Details */}
            <div className="bg-[#F7F9FC] rounded-xl p-4 border border-[#EDF1F7]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-[#192038] uppercase tracking-wider m-0">
                  Library Details
                </h4>
                <button
                  onClick={() => onChangeSeat(student)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8F9BB3] hover:text-[#544bec] cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8F9BB3] text-[11px]">Seat Number</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold font-mono text-[11px] ${
                    student.status === 'Inactive' || computeStudentStatus(student) === 'Inactive' || !student.seatNo || student.seatNo === '-'
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-[#544bec] text-white'
                  }`}>
                    {student.status === 'Inactive' || computeStudentStatus(student) === 'Inactive' || !student.seatNo || student.seatNo === '-'
                      ? 'Unassigned'
                      : `#${student.seatNo}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8F9BB3] text-[11px]">Plan</span>
                  <span className="font-semibold text-[#192038]">
                    {student.plan} (₹{student.planAmount})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8F9BB3] text-[11px]">Admission Date</span>
                  <span className="font-medium text-[#192038]">
                    {formatDisplayDate(student.admissionDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8F9BB3] text-[11px]">Next Due Date</span>
                  <div className="text-right">
                    <span className="font-semibold text-[#192038] text-xs">
                      {formatDisplayDate(student.nextDueDate || student.nextFeeDueDate)}
                    </span>
                    {Number(student.dueAmount) > 0 && (
                      <div className="text-[10px] text-amber-700 font-extrabold mt-0.5">
                        Due: ₹{student.dueAmount} {student.balanceDueDate && `(by ${formatDisplayDate(student.balanceDueDate)})`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#8F9BB3] text-[11px]">Status</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    student.studentType === 'Demo' || student.status === 'Demo'
                      ? 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]'
                      : student.status === 'Active'
                      ? 'bg-[#EEF0FD] text-[#544bec]'
                      : 'bg-[#FFF7E8] text-[#FFAA00]'
                  }`}>
                    {student.studentType === 'Demo' || student.status === 'Demo' ? 'Demo' : student.status}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fees Tab */}
        {activeTab === 'Fees' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#192038]">Recent Payments</span>
              <span className="text-[#544bec] font-bold">Total: ₹{student.planAmount * 2}</span>
            </div>
            {student.paymentHistory && student.paymentHistory.length > 0 ? (
              student.paymentHistory.map((p) => (
                <div key={p.id} className="p-3 bg-[#F7F9FC] rounded-xl border border-[#EDF1F7] text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#192038] flex items-center gap-1.5">
                      <Receipt size={13} className="text-[#544bec]" />
                      <span>{p.receiptNo}</span>
                    </div>
                    <span className="text-[11px] text-[#8F9BB3]">{formatDisplayDate(p.date)} • {p.mode}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[#192038]">₹{p.amount}</div>
                    <span className="text-[10px] font-bold text-[#544bec] bg-[#EEF0FD] px-1.5 py-0.5 rounded">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-[#8F9BB3] bg-[#F7F9FC] rounded-xl">
                No previous payments recorded.
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'Attendance' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#192038]">Recent Stay Logs</span>
              <span className="text-[#544bec] font-bold">Shift: {student.shift}</span>
            </div>
            {student.attendanceHistory && student.attendanceHistory.length > 0 ? (
              student.attendanceHistory.map((a) => (
                <div key={a.id} className="p-3 bg-[#F7F9FC] rounded-xl border border-[#EDF1F7] text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#192038] flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#544bec]" />
                      <span>{a.date}</span>
                    </div>
                    <span className="text-[11px] text-[#8F9BB3]">
                      In: {formatDisplayTime(a.checkInTime || a.checkIn)} | Out: {formatDisplayTime(a.checkOutTime || a.checkOut)}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#544bec] bg-[#EEF0FD] px-2 py-1 rounded-md">
                    {a.duration}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-[#8F9BB3] bg-[#F7F9FC] rounded-xl">
                No recent attendance records.
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'History' && (
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#EDF1F7]">
              <span className="text-[11px] text-[#8F9BB3] block">15 Aug 2026</span>
              <strong className="text-[#192038] block mt-0.5">Admitted to Vidya Library</strong>
              <span className="text-[11px] text-[#8F9BB3]">Allocated seat {student.seatNo} with Monthly plan</span>
            </div>
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#EDF1F7]">
              <span className="text-[11px] text-[#8F9BB3]">15 Sep 2026</span>
              <strong className="text-[#192038] block mt-0.5">Monthly Fee Paid</strong>
              <span className="text-[11px] text-[#8F9BB3]">Collected ₹{student.planAmount} via UPI</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Buttons matching reference image */}
      <div className="p-5 border-t border-[#EDF1F7] space-y-2.5 bg-white">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onCollectFee(student)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#544bec] text-white hover:bg-[#4338ca] font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm shadow-[#544bec]/20 transition-all cursor-pointer"
          >
            <Wallet size={15} />
            <span>Collect Fee</span>
          </button>

          <button
            onClick={() => onChangeSeat(student)}
            className="w-full py-2.5 px-3 rounded-xl border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F8FAFD] font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Armchair size={15} className="text-[#8F9BB3]" />
            <span>Change Seat</span>
          </button>
        </div>

        <button
          onClick={() => onEditStudent(student)}
          className="w-full py-2.5 px-3 rounded-xl border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F8FAFD] font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Eye size={15} className="text-[#8F9BB3]" />
          <span>View Full Profile</span>
        </button>
      </div>
    </div>
  );
};
