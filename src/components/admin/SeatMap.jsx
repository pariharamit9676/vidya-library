import React from 'react';
import { SEAT_LIST } from '../../data/initialData';
import { calculateDuration } from '../../utils/storage';

export const SeatMap = ({
  students = [],
  onSelectStudent
}) => {
  const seatToStudentMap = {};
  students.forEach((s) => {
    if (s.seatNo) {
      seatToStudentMap[s.seatNo] = s;
    }
  });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold m-0 text-[var(--text-main)]">Hall Seating & Live Occupancy Map</h2>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            Visual matrix of all 24 study cubicles
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#01a06e]"></span>
            <span>Occupied & Inside</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#01a06e]/40 border border-[#01a06e]"></span>
            <span>Allotted (Outside)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-dashed border-[var(--border-color)]"></span>
            <span>Vacant Seat</span>
          </div>
        </div>
      </div>

      {/* Grid of 24 desks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {SEAT_LIST.map((seatNo) => {
          const student = seatToStudentMap[seatNo];
          const isInside = student?.isCheckedIn;

          return (
            <div
              key={seatNo}
              onClick={() => student && onSelectStudent(student)}
              className={`rounded-lg p-3 border transition-all duration-200 flex flex-col justify-between gap-2 min-h-[90px] ${
                isInside
                  ? 'border-[#01a06e] bg-[#01a06e]/10 shadow-[0_0_15px_rgba(1,160,110,0.18)] cursor-pointer'
                  : student
                  ? 'border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:border-[#01a06e]/40 cursor-pointer'
                  : 'border-dashed border-[var(--border-color)] bg-transparent opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold ${isInside ? 'text-[#01a06e]' : 'text-[var(--text-muted)]'}`}>
                  {seatNo}
                </span>
                {isInside && <span className="w-2 h-2 rounded-full bg-[#01a06e]"></span>}
              </div>

              {student ? (
                <div>
                  <div className="text-xs font-bold text-[var(--text-main)] truncate">
                    {student.name}
                  </div>
                  <div className={`text-[11px] ${isInside ? 'text-[#01a06e] font-semibold' : 'text-[var(--text-subtle)]'}`}>
                    {isInside ? `In (${calculateDuration(student.currentCheckInTime)})` : 'Outside'}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-[var(--text-subtle)] italic">
                  Available
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
