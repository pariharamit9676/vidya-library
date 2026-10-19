import React from 'react';
import { X, User, Phone, Calendar, Armchair, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Seat } from '../../types/dashboard';

interface SeatDetailModalProps {
  seat: Seat | null;
  onClose: () => void;
  onBookSeat?: (seatId: string) => void;
}

export const SeatDetailModal: React.FC<SeatDetailModalProps> = ({
  seat,
  onClose,
  onBookSeat
}) => {
  if (!seat) return null;

  const getStatusBadge = () => {
    switch (seat.status) {
      case 'occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF0FD] text-[#544bec] border border-[#544bec]/30">
            <span className="w-2 h-2 rounded-full bg-[#544bec]"></span>
            Occupied (Confirmed Booking)
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-300">
            <Clock size={12} />
            Temporary Reservation
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#544bec] border border-[#544bec]/30">
            <CheckCircle size={12} />
            Available Now
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-300">
            <AlertTriangle size={12} />
            Under Maintenance
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#EDF1F7] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-[#EDF1F7] flex items-center justify-between bg-[#F8FAFD]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
              seat.status === 'occupied' ? 'bg-[#544bec]' :
              seat.status === 'reserved' ? 'bg-amber-500' :
              seat.status === 'maintenance' ? 'bg-rose-500' : 'bg-slate-400'
            }`}>
              <Armchair size={22} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#192038] m-0">
                Seat {seat.seatNumber} Details
              </h3>
              <p className="text-xs text-[#8F9BB3] m-0">Floor {seat.floor} • Reading Hall</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8F9BB3]">Current Status:</span>
            {getStatusBadge()}
          </div>

          {/* Assigned Student Details */}
          {seat.assignedStudent ? (
            <div className="bg-[#F8FAFD] rounded-xl p-4 border border-[#EDF1F7] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#192038]">Assigned Student Info</span>
                {seat.assignedStudent.isTemporaryReservation ? (
                  <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded">
                    Temporary Hold (Expires in 48h)
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-[#544bec] bg-[#544bec]/10 px-2 py-0.5 rounded">
                    Confirmed Membership
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#544bec] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {seat.assignedStudent.name.charAt(0)}
                  </div>
                  {seat.assignedStudent.isCheckedIn && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#544bec] border-2 border-white" title="Inside" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#192038]">{seat.assignedStudent.name}</span>
                    {seat.assignedStudent.isCheckedIn ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF0FD] text-[#544bec] border border-[#544bec]/30">
                        Inside
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F7F9FC] text-[#8F9BB3] border border-[#EDF1F7]">
                        Outside
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8F9BB3] mt-0.5">{seat.assignedStudent.id} • {seat.assignedStudent.phone}</div>
                </div>
              </div>

              {/* Booking Period */}
              <div className="pt-2 border-t border-[#EDF1F7] flex items-center justify-between text-xs">
                <span className="text-[#8F9BB3]">Booking Period:</span>
                <span className="font-semibold text-[#192038] flex items-center gap-1">
                  <Calendar size={13} className="text-[#544bec]" />
                  {seat.assignedStudent.bookingPeriod.start} – {seat.assignedStudent.bookingPeriod.end}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F9BB3]">Shift / Plan:</span>
                <span className="font-semibold text-[#192038]">{seat.assignedStudent.plan}</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#F8FAFD] rounded-xl p-4 border border-[#EDF1F7] text-center text-xs text-[#8F9BB3]">
              No student is currently assigned to this seat.
            </div>
          )}

          {/* Future Monthly Booking Availability */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#192038] block">
              Future Monthly Booking Availability
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Object.entries(seat.futureMonthlyAvailability).map(([month, isAvail]) => (
                <div
                  key={month}
                  className={`p-2.5 rounded-xl border text-center font-medium ${
                    isAvail
                      ? 'bg-[#EEF0FD] border-[#544bec]/30 text-[#544bec]'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="font-bold">{month}</div>
                  <div className="text-[10px] mt-0.5">
                    {isAvail ? '✓ Available' : '✕ Reserved'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8FAFD] border-t border-[#EDF1F7] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B778C] hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            Close
          </button>
          {seat.status === 'available' && (
            <button
              onClick={() => {
                if (onBookSeat) onBookSeat(seat.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm transition-all cursor-pointer"
            >
              Assign to Student
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
