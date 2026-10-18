import React, { useState } from 'react';
import { X, CalendarCheck, Search, LogIn, LogOut, CheckCircle2, User } from 'lucide-react';
import { calculateDuration } from '../../utils/storage';

export const QuickPunchModal = ({
  isOpen,
  onClose,
  students = [],
  onToggleCheckIn
}) => {
  const [query, setQuery] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  if (!isOpen) return null;

  const studentList = Array.isArray(students) ? students : [];

  const filtered = studentList.filter((s) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = (s.name || '').toLowerCase().includes(q);
    const idMatch = (s.studentId || '').toLowerCase().includes(q) || (s.id ? String(s.id).toLowerCase().includes(q) : false);
    const phoneMatch = (s.phone || '').includes(q);
    const seatMatch = s.seatNo ? String(s.seatNo).toLowerCase().includes(q) : false;
    return nameMatch || idMatch || phoneMatch || seatMatch;
  });

  const insideCount = studentList.filter((s) => s.isCheckedIn).length;
  const outsideCount = studentList.length - insideCount;

  const handleToggle = async (student) => {
    const id = student.id || student._id || student.studentId;
    setLoadingId(id);
    try {
      if (onToggleCheckIn) {
        await onToggleCheckIn(id);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-[#EDF1F7] shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EDF1F7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center shadow-xs">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#192038] m-0 leading-tight">
                Mark Attendance
              </h3>
              <p className="text-xs text-[#8F9BB3] m-0 font-medium mt-0.5">
                Quick Check-In / Check-Out for enrolled library students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-[#EDF1F7] text-[#8F9BB3] hover:text-[#192038] hover:bg-[#F7F9FC] flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Summary Strip & Quick Search */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E8F8F3] text-[#00A97A]">
                {insideCount} Inside
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F7F9FC] text-[#6B778C] border border-[#EDF1F7]">
                {outsideCount} Outside
              </span>
              <span className="text-xs text-[#8F9BB3] font-medium hidden sm:inline">
                Total: {studentList.length} Students
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
            />
            <input
              type="text"
              autoFocus
              className="w-full bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#192038] placeholder-[#8F9BB3] focus:outline-none focus:border-[#00A97A] focus:bg-white transition-all"
              placeholder="Search by Student ID (#STU008), Name, Seat, or Mobile..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Student Attendance List */}
          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-10 bg-[#F7F9FC] rounded-xl border border-dashed border-[#EDF1F7]">
                <User size={28} className="mx-auto text-[#8F9BB3] mb-2 opacity-50" />
                <p className="text-xs font-bold text-[#192038] m-0">No matching enrolled students</p>
                <p className="text-[11px] text-[#8F9BB3] mt-0.5 m-0">
                  Try searching with a different name, roll ID, or seat number
                </p>
              </div>
            ) : (
              filtered.map((student) => {
                const sId = student.id || student._id || student.studentId;
                const isInside = Boolean(student.isCheckedIn);
                const isLoading = loadingId === sId;
                const seatDisplay = student.seatNo && student.seatNo !== '-' ? `Seat ${student.seatNo}` : 'No Seat';

                return (
                  <div
                    key={sId}
                    className="p-3.5 bg-white hover:bg-[#F7F9FC]/60 rounded-xl border border-[#EDF1F7] flex items-center justify-between gap-3 transition-all shadow-xs"
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#E8F8F3] text-[#00A97A] font-bold text-xs flex items-center justify-center border border-[#00A97A]/20">
                          {student.name ? student.name.slice(0, 2).toUpperCase() : 'ST'}
                        </div>
                        {isInside && (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00A97A] border-2 border-white"
                            title="Inside"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-extrabold text-[#192038] m-0 truncate">
                            {student.name}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F7F9FC] border border-[#EDF1F7] text-[#6B778C]">
                            {student.studentId || sId}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F3] text-[#00A97A]">
                            {seatDisplay}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8F9BB3] mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{student.phone}</span>
                          {student.shift && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{student.shift}</span>
                            </>
                          )}
                          <span>•</span>
                          {isInside ? (
                            <span className="text-[#00A97A] font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00A97A]" />
                              Inside ({calculateDuration(student.currentCheckInTime)})
                            </span>
                          ) : (
                            <span className="text-[#8F9BB3]">Outside</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Punch Button */}
                    <div className="shrink-0">
                      {isInside ? (
                        <button
                          onClick={() => handleToggle(student)}
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <LogOut size={13} />
                          <span>{isLoading ? 'Punching...' : 'Punch Out'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggle(student)}
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00A97A] text-white hover:bg-[#008f67] transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <LogIn size={13} />
                          <span>{isLoading ? 'Punching...' : 'Punch In'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EDF1F7] bg-[#F7F9FC]/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F7F9FC] shadow-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
