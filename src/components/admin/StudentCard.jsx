import React from 'react';
import {
  LogInIcon,
  LogOutIcon,
  IndianRupeeIcon,
  ClockIcon,
  PhoneIcon,
  HistoryIcon,
  Edit2Icon,
  TrashIcon
} from '../Icons';
import { LiveStayTimer } from './LiveStayTimer';
import { formatDateOnly, formatTimeOnly } from '../../utils/storage';

export const StudentCard = ({
  student,
  onToggleCheckIn,
  onOpenFeeModal,
  onOpenHistory,
  onEditStudent,
  onDeleteStudent
}) => {
  const isInside = student.isCheckedIn;

  const renderFeeBadge = () => {
    if (student.feeStatus === 'PAID') {
      return <span className="badge badge-success">✓ Paid</span>;
    } else if (student.feeStatus === 'DUE_SOON') {
      return <span className="badge badge-warning">⚡ Due Soon</span>;
    } else {
      return <span className="badge badge-danger">⚠ Overdue</span>;
    }
  };

  return (
    <div
      className={`glass-card p-5 flex flex-col justify-between gap-4 relative transition-all duration-200 ${
        isInside ? 'border-l-4 border-l-[#01a06e]' : 'border-l border-[var(--border-color)]'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base ${
              isInside
                ? 'bg-[#01a06e]/20 text-[#01a06e] border border-[#01a06e]/40'
                : 'bg-[var(--bg-card-subtle)] text-[#01a06e] border border-[var(--border-color)]'
            }`}
          >
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-main)] m-0">
                {student.name}
              </h3>
              <span className="text-xs font-mono bg-[var(--bg-card-subtle)] px-1.5 py-0.5 rounded text-[var(--text-muted)]">
                {student.id}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <PhoneIcon size={12} /> {student.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Seat Badge */}
        <div className="text-right">
          <span className="inline-block px-2.5 py-1 bg-[#01a06e]/15 text-[#01a06e] rounded-md font-bold text-xs font-mono border border-[#01a06e]/30">
            Seat {student.seatNo}
          </span>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">
            {student.shift}
          </div>
        </div>
      </div>

      {/* Middle Section: Stay Timer / Last Stay */}
      <div className="bg-[var(--bg-card-subtle)] p-3 rounded-lg flex flex-col gap-1.5 border border-[var(--border-color)]">
        {isInside ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Entry: {formatTimeOnly(student.currentCheckInTime)}
              </span>
              <span className="badge badge-success text-[11px] py-0.5 px-2">
                Inside Hall
              </span>
            </div>
            <LiveStayTimer checkInTime={student.currentCheckInTime} />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Status: Outside
              </span>
              <span className="badge badge-muted text-[11px] py-0.5 px-2">
                Checked Out
              </span>
            </div>
            <div className="text-xs text-[var(--text-main)] flex items-center gap-1.5">
              <ClockIcon size={14} className="text-[var(--text-muted)]" />
              {student.lastStay ? (
                <span>
                  <strong>Last Stay:</strong> {student.lastStay.formattedDuration} ({formatDateOnly(student.lastStay.date)})
                </span>
              ) : (
                <span className="text-[var(--text-subtle)] italic">No stay record yet</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fee Status Row */}
      <div className="flex items-center justify-between py-1 border-t border-[var(--border-color)] text-xs">
        <div>
          <span className="text-[var(--text-muted)]">Fee: </span>
          <strong className="text-[var(--text-main)]">₹{student.monthlyFee}/mo</strong>
          <span className="mx-2 text-[var(--border-color)]">•</span>
          <span className="text-[var(--text-muted)]">Due: </span>
          <span className={student.feeStatus === 'OVERDUE' ? 'text-rose-500 font-bold' : 'text-[var(--text-main)]'}>
            {formatDateOnly(student.nextFeeDueDate)}
          </span>
        </div>
        <div>{renderFeeBadge()}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {isInside ? (
          <button
            onClick={() => onToggleCheckIn(student.id)}
            className="btn btn-danger btn-sm flex-1"
          >
            <LogOutIcon size={14} />
            <span>Check Out</span>
          </button>
        ) : (
          <button
            onClick={() => onToggleCheckIn(student.id)}
            className="btn btn-success btn-sm flex-1 bg-[#01a06e] hover:bg-[#01855a]"
          >
            <LogInIcon size={14} />
            <span>Check In</span>
          </button>
        )}

        <button
          onClick={() => onOpenFeeModal(student)}
          className={`btn btn-secondary btn-sm ${student.feeStatus === 'OVERDUE' ? 'border-rose-500 text-rose-500' : ''}`}
          title="Collect Fee & Print Receipt"
        >
          <IndianRupeeIcon size={14} />
          <span>Fee</span>
        </button>

        <button
          onClick={() => onOpenHistory(student)}
          className="btn btn-secondary btn-sm w-9 p-0"
          title="Stay History Log"
        >
          <HistoryIcon size={14} />
        </button>

        <button
          onClick={() => onEditStudent(student)}
          className="btn btn-secondary btn-sm w-9 p-0"
          title="Edit Student"
        >
          <Edit2Icon size={14} />
        </button>

        <button
          onClick={() => onDeleteStudent(student.id)}
          className="btn btn-secondary btn-sm w-9 p-0 text-rose-500 hover:border-rose-500"
          title="Remove Student"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  );
};
