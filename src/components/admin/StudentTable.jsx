import React from 'react';
import {
  LogInIcon,
  LogOutIcon,
  IndianRupeeIcon,
  ClockIcon,
  HistoryIcon,
  Edit2Icon,
  TrashIcon
} from '../Icons';
import { LiveStayTimer } from './LiveStayTimer';
import { formatDateOnly, formatTimeOnly } from '../../utils/storage';

export const StudentTable = ({
  students,
  onToggleCheckIn,
  onOpenFeeModal,
  onOpenHistory,
  onEditStudent,
  onDeleteStudent
}) => {
  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-[var(--text-muted)]">
            <th className="py-3 px-4 font-semibold">Student / ID</th>
            <th className="py-3 px-4 font-semibold">Seat & Shift</th>
            <th className="py-3 px-4 font-semibold">Current Presence</th>
            <th className="py-3 px-4 font-semibold">Last Stay Record</th>
            <th className="py-3 px-4 font-semibold">Fee Status & Due</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {students.map((student) => {
            const isInside = student.isCheckedIn;

            return (
              <tr
                key={student.id}
                className={`transition-colors ${isInside ? 'bg-[#01a06e]/5' : 'hover:bg-[var(--bg-card-subtle)]/40'}`}
              >
                {/* Student Info */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isInside ? 'bg-[#01a06e]/20 text-[#01a06e]' : 'bg-[var(--bg-card-subtle)] text-[#01a06e]'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-main)] text-sm">{student.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {student.id} • {student.phone}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Seat & Shift */}
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-[#01a06e]/15 text-[#01a06e] font-mono font-bold text-xs border border-[#01a06e]/30">
                    {student.seatNo}
                  </span>
                  <div className="text-[11px] text-[var(--text-subtle)] mt-1">{student.shift}</div>
                </td>

                {/* Live Stay */}
                <td className="py-3.5 px-4">
                  {isInside ? (
                    <div>
                      <LiveStayTimer checkInTime={student.currentCheckInTime} />
                      <div className="text-[11px] text-[var(--text-muted)] mt-1">
                        In since {formatTimeOnly(student.currentCheckInTime)}
                      </div>
                    </div>
                  ) : (
                    <span className="badge badge-muted text-[11px]">Outside</span>
                  )}
                </td>

                {/* Last Stay */}
                <td className="py-3.5 px-4">
                  {student.lastStay ? (
                    <div>
                      <strong className="text-[var(--text-main)] block text-xs">
                        {student.lastStay.formattedDuration}
                      </strong>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {formatDateOnly(student.lastStay.date)} ({formatTimeOnly(student.lastStay.checkIn)} - {formatTimeOnly(student.lastStay.checkOut)})
                      </span>
                    </div>
                  ) : (
                    <span className="text-[var(--text-subtle)] text-[11px] italic">No previous stay</span>
                  )}
                </td>

                {/* Fee Status */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[var(--text-main)]">₹{student.monthlyFee}</span>
                    {student.feeStatus === 'PAID' && <span className="badge badge-success text-[11px]">Paid</span>}
                    {student.feeStatus === 'DUE_SOON' && <span className="badge badge-warning text-[11px]">Due Soon</span>}
                    {student.feeStatus === 'OVERDUE' && <span className="badge badge-danger text-[11px]">Overdue</span>}
                  </div>
                  <div className={`text-[11px] ${student.feeStatus === 'OVERDUE' ? 'text-rose-500 font-semibold' : 'text-[var(--text-muted)]'}`}>
                    Due: {formatDateOnly(student.nextFeeDueDate)}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {isInside ? (
                      <button
                        onClick={() => onToggleCheckIn(student.id)}
                        className="btn btn-danger btn-sm text-xs py-1 px-2.5"
                        title="Check Out"
                      >
                        <LogOutIcon size={13} />
                        <span>Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleCheckIn(student.id)}
                        className="btn btn-success btn-sm text-xs py-1 px-2.5 bg-[#01a06e] hover:bg-[#01855a]"
                        title="Check In"
                      >
                        <LogInIcon size={13} />
                        <span>In</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenFeeModal(student)}
                      className="btn btn-secondary btn-sm p-1.5"
                      title="Collect Fee"
                    >
                      <IndianRupeeIcon size={13} />
                    </button>

                    <button
                      onClick={() => onOpenHistory(student)}
                      className="btn btn-secondary btn-sm p-1.5"
                      title="Stay History Log"
                    >
                      <HistoryIcon size={13} />
                    </button>

                    <button
                      onClick={() => onEditStudent(student)}
                      className="btn btn-secondary btn-sm p-1.5"
                      title="Edit"
                    >
                      <Edit2Icon size={13} />
                    </button>

                    <button
                      onClick={() => onDeleteStudent(student.id)}
                      className="btn btn-secondary btn-sm p-1.5 text-rose-500"
                      title="Remove"
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
