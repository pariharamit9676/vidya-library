import React from 'react';
import { X, Clock, History } from 'lucide-react';
import { formatDateOnly, formatTimeOnly } from '../../utils/storage';
import { CommonTable } from '../common/CommonTable';

export const AttendanceHistoryModal = ({
  isOpen,
  onClose,
  student
}) => {
  if (!isOpen || !student) return null;

  const history = student.attendanceHistory || [];
  const totalMinutes = history.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const avgMinutes = history.length > 0 ? Math.round(totalMinutes / history.length) : 0;
  const avgHours = Math.floor(avgMinutes / 60);
  const avgRemMin = avgMinutes % 60;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#01a06e]/20 text-[#01a06e] flex items-center justify-center">
              <History size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold m-0 text-[var(--text-main)]">Attendance & Stay Logs</h2>
              <span className="text-xs text-[var(--text-muted)]">
                {student.name} • Seat {student.seatNo} • {student.id}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm p-1">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Average metrics */}
          <div className="grid grid-cols-3 gap-3 bg-[var(--bg-card-subtle)] p-4 rounded-lg border border-[var(--border-color)] text-center">
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Total Visits</span>
              <strong className="text-base font-bold text-[var(--text-main)]">{history.length}</strong>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Total Study Hours</span>
              <strong className="text-base font-bold text-[#01a06e]">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </strong>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Avg Daily Stay</span>
              <strong className="text-base font-bold text-[#01a06e]">
                {avgHours}h {avgRemMin}m
              </strong>
            </div>
          </div>

          <h3 className="text-sm font-bold mt-3 mb-2 text-[var(--text-main)]">Past Stay History</h3>

          <CommonTable
            data={history}
            emptyMessage="No previous stay records found for this student."
            pagination={false}
            minWidth="450px"
            columns={[
              {
                header: 'Date',
                render: (record) => (
                  <span className="font-semibold text-[var(--text-main)]">
                    {formatDateOnly(record.date)}
                  </span>
                )
              },
              {
                header: 'Check-In',
                render: (record) => (
                  <span className="text-[#01a06e] font-medium">
                    {formatTimeOnly(record.checkInTime || record.checkIn)}
                  </span>
                )
              },
              {
                header: 'Check-Out',
                render: (record) => (
                  <span className="text-rose-500 font-medium">
                    {formatTimeOnly(record.checkOutTime || record.checkOut)}
                  </span>
                )
              },
              {
                header: 'Total Duration',
                align: 'right',
                render: (record) => (
                  <span className="badge badge-info font-mono text-[11px] inline-flex items-center gap-1">
                    <Clock size={11} /> {record.formattedDuration}
                  </span>
                )
              }
            ]}
          />
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
