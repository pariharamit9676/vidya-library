import React, { useState, useMemo } from 'react';
import { Armchair, Maximize2, X, Search } from 'lucide-react';
import { useSeatLayout, useStudents } from '../../services/useLibraryQueries';
import { Seat } from '../../types/dashboard';
import { SeatDetailModal } from './SeatDetailModal';

export const SeatMapCard: React.FC = () => {
  const { data: layoutData } = useSeatLayout();
  const { data: studentsData } = useStudents();

  // Modals state
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState<boolean>(false);

  // Search & Filter state inside the Full Layout Modal
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');
  const [modalFilterMode, setModalFilterMode] = useState<'all' | 'occupied' | 'available'>('all');

  const students = useMemo(() => (Array.isArray(studentsData) ? studentsData : []), [studentsData]);

  // Build a map of active student by numeric seat number
  const studentBySeatNumber = useMemo(() => {
    const map = new Map<number, any>();
    students.forEach((s: any) => {
      if (s.seatNo && s.seatNo !== '-') {
        const match = String(s.seatNo).match(/\d+/);
        const num = match ? parseInt(match[0], 10) : parseInt(String(s.seatNo).trim(), 10);
        if (!isNaN(num)) {
          map.set(num, s);
        }
      }
    });
    return map;
  }, [students]);

  // All valid seat cells from layout
  const rawCells: any[] = (layoutData as any)?.cells || [];
  const seatCells = useMemo(() => {
    return rawCells
      .filter((c) => c.isSeat)
      .map((cell) => {
        const seatNum = Number(cell.seatNumber);
        // Student assigned to this seat
        const student = studentBySeatNumber.get(seatNum) || cell.assignedStudent;
        const isMaintenance = cell.status === 'Maintenance';
        
        // Seat is Occupied (green) ONLY when student is checked in!
        // When student punches out, isCheckedIn is false so seat becomes Available (gray)!
        const isStudentCheckedIn = Boolean(student?.isCheckedIn);

        const computedStatus: Seat['status'] = isMaintenance
          ? 'maintenance'
          : isStudentCheckedIn
          ? 'occupied'
          : 'available';

        return {
          ...cell,
          computedStatus,
          liveStudent: student || null,
          isCheckedIn: isStudentCheckedIn
        };
      });
  }, [rawCells, studentBySeatNumber]);

  // 1. DASHBOARD PREVIEW SEATS (Exactly 30 seats, with currently checked-in seats having priority)
  const dashboardPreviewSeats = useMemo(() => {
    // Priority 1: Currently occupied (checked in) seats
    const occupiedSeats = seatCells.filter((c) => c.computedStatus === 'occupied');
    const occupiedIds = new Set(occupiedSeats.map((c) => c.id));

    // Priority 2: Other assigned student seats (currently punched out)
    const otherAssignedSeats = seatCells.filter(
      (c) => !occupiedIds.has(c.id) && c.liveStudent
    );
    const assignedIds = new Set([
      ...occupiedSeats.map((c) => c.id),
      ...otherAssignedSeats.map((c) => c.id)
    ]);

    // Priority 3: Remaining seats starting from seat 1, 2, 3...
    const remainingSeats = seatCells.filter((c) => !assignedIds.has(c.id));

    const pool: any[] = [];
    // Include currently checked in seats first (so they are guaranteed to be in the 30)
    occupiedSeats.forEach((c) => pool.push(c));

    // Then add other assigned seats
    for (const c of otherAssignedSeats) {
      if (pool.length >= 30) break;
      pool.push(c);
    }

    // Fill remaining slots up to 30 from the available seats
    for (const c of remainingSeats) {
      if (pool.length >= 30) break;
      pool.push(c);
    }

    // Sort by numeric seatNumber ascending for a clean, ordered grid preview
    return pool.sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber));
  }, [seatCells]);

  // 2. MODAL SEATS (All 164 seats filtered by search and filter tab)
  const modalFilteredSeats = useMemo(() => {
    return seatCells.filter((cell) => {
      // Search filter
      if (modalSearchQuery.trim()) {
        const q = modalSearchQuery.toLowerCase().trim();
        const seatMatch = String(cell.seatNumber).includes(q);
        const nameMatch = cell.liveStudent?.name?.toLowerCase().includes(q);
        const idMatch = cell.liveStudent?.studentId?.toLowerCase().includes(q);
        if (!seatMatch && !nameMatch && !idMatch) return false;
      }

      // Tab filter
      if (modalFilterMode === 'occupied') return cell.computedStatus === 'occupied';
      if (modalFilterMode === 'available') return cell.computedStatus === 'available';
      return true;
    });
  }, [seatCells, modalSearchQuery, modalFilterMode]);

  const handleSelectCell = (cell: any) => {
    const student = cell.liveStudent;
    const seatObj: Seat = {
      id: cell.id,
      seatNumber: cell.seatNumber,
      label: `Seat ${cell.seatNumber}`,
      floor: 1,
      status: cell.computedStatus,
      currentAvailability: cell.computedStatus === 'available',
      futureMonthlyAvailability: {},
      assignedStudent: student
        ? {
            id: student.id || student._id || '',
            name: student.name || '',
            phone: student.phone || '',
            avatar: student.avatar,
            plan: student.plan || 'Monthly',
            bookingPeriod: {
              start: student.admissionDate || 'Today',
              end: student.nextDueDate || student.nextFeeDueDate || 'Next Month'
            },
            isTemporaryReservation: false,
            isCheckedIn: Boolean(student.isCheckedIn),
            currentCheckInTime: student.currentCheckInTime || null
          }
        : undefined
    };
    setSelectedSeat(seatObj);
  };

  const getSeatColorClasses = (status: Seat['status']) => {
    switch (status) {
      case 'occupied':
        return {
          bg: 'bg-[#544bec]',
          text: 'text-white',
          chair: 'text-[#544bec]',
          border: 'border-[#544bec]'
        };
      case 'maintenance':
        return {
          bg: 'bg-[#FA5252]',
          text: 'text-white',
          chair: 'text-[#FA5252]',
          border: 'border-[#FA5252]'
        };
      case 'available':
      default:
        return {
          bg: 'bg-[#EDF1F7]',
          text: 'text-[#6B778C]',
          chair: 'text-[#8F9BB3]',
          border: 'border-[#EDF1F7]'
        };
    }
  };

  const occupiedCount = seatCells.filter((c) => c.computedStatus === 'occupied').length;
  const availableCount = seatCells.filter((c) => c.computedStatus === 'available').length;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EDF1F7] shadow-sm flex flex-col justify-between">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-extrabold text-[#192038] m-0">
          Seat Map Overview
        </h3>

        {/* Full Seat Layout Button -> OPENS MODAL (Does NOT navigate to another page) */}
        <button
          onClick={() => setIsLayoutModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-xs font-bold text-[#544bec] hover:bg-[#EEF0FD] hover:border-[#544bec]/30 transition-all cursor-pointer shadow-2xs"
          title="Open Full 164 Seats Layout Modal"
        >
          <span>Full Seat Layout (164)</span>
          <Maximize2 size={13} />
        </button>
      </div>

      {/* 2. Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-[#6B778C] flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#544bec]" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EDF1F7] border border-[#CBD5E1]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FA5252]" />
          <span>Maintenance</span>
        </div>
      </div>

      {/* 3. Dashboard Seat Grid Preview (30 Seats with all occupied seats prioritized, showing only table numbers) */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[500px] grid grid-cols-10 gap-2.5 sm:gap-3 py-2">
          {dashboardPreviewSeats.map((cell) => {
            const colors = getSeatColorClasses(cell.computedStatus);
            const studentName = cell.liveStudent?.name || '';
            const tooltip = `Seat ${cell.seatNumber} (${cell.computedStatus})${
              studentName ? ` - ${studentName}` : ''
            }`;

            return (
              <button
                key={cell.id}
                onClick={() => handleSelectCell(cell)}
                className="group flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl transition-all hover:scale-105 cursor-pointer bg-transparent border-none"
                title={tooltip}
              >
                {/* Seat Number Box */}
                <div
                  className={`w-7 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all shadow-xs ${colors.bg} ${colors.text}`}
                >
                  {cell.seatNumber}
                </div>

                {/* Chair Graphic */}
                <div className={`${colors.chair} group-hover:opacity-85 transition-opacity`}>
                  <Armchair size={22} strokeWidth={1.75} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Footer */}
      <div className="pt-3 border-t border-[#EDF1F7] flex items-center justify-between text-xs text-[#8F9BB3] flex-wrap gap-2">
        <span>
          Showing 30 seats • Click <strong>Full Seat Layout</strong> for all {seatCells.length} seats
        </span>
        <span className="font-semibold text-[#192038]">
          {occupiedCount} Occupied / {seatCells.length} Total
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 5. FULL SEAT LAYOUT MODAL (Displays all 164 seats in clean standard view) */}
      {/* ========================================================================= */}
      {isLayoutModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsLayoutModalOpen(false)}
        >
          <div
            className="w-full max-w-5xl bg-white rounded-2xl border border-[#EDF1F7] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EDF1F7] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center shadow-xs">
                  <Armchair size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#192038] m-0">
                    Full Seat Layout ({seatCells.length} Seats)
                  </h3>
                  <p className="text-xs text-[#8F9BB3] m-0 mt-0.5">
                    Complete library layout showing all {seatCells.length} seats
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsLayoutModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-[#EDF1F7] text-[#8F9BB3] hover:text-[#192038] hover:bg-[#F7F9FC] flex items-center justify-center transition-all cursor-pointer"
                title="Close Modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Controls (Search + Filter Tabs) */}
            <div className="p-4 border-b border-[#EDF1F7] bg-[#F8FAFD] flex items-center justify-between gap-3 flex-wrap shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
                />
                <input
                  type="text"
                  className="w-full bg-white border border-[#EDF1F7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#192038] placeholder-[#8F9BB3] focus:outline-none focus:border-[#544bec] transition-all"
                  placeholder="Search seat number (e.g. 50) or student name..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EDF1F7]">
                <button
                  onClick={() => setModalFilterMode('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    modalFilterMode === 'all'
                      ? 'bg-[#192038] text-white shadow-xs'
                      : 'text-[#6B778C] hover:text-[#192038]'
                  }`}
                >
                  All ({seatCells.length})
                </button>
                <button
                  onClick={() => setModalFilterMode('occupied')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    modalFilterMode === 'occupied'
                      ? 'bg-[#544bec] text-white shadow-xs'
                      : 'text-[#6B778C] hover:text-[#192038]'
                  }`}
                >
                  Occupied ({occupiedCount})
                </button>
                <button
                  onClick={() => setModalFilterMode('available')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    modalFilterMode === 'available'
                      ? 'bg-[#192038] text-white shadow-xs'
                      : 'text-[#6B778C] hover:text-[#192038]'
                  }`}
                >
                  Available ({availableCount})
                </button>
              </div>
            </div>

            {/* Modal Legend */}
            <div className="px-5 py-2.5 border-b border-[#EDF1F7] bg-white flex items-center gap-4 text-xs font-semibold text-[#6B778C] flex-wrap shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#544bec]" />
                <span>Occupied ({occupiedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EDF1F7] border border-[#CBD5E1]" />
                <span>Available ({availableCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FA5252]" />
                <span>Maintenance</span>
              </div>
            </div>

            {/* Modal Grid (Scrollable displaying all 164 seats, showing only table numbers) */}
            <div className="p-5 overflow-y-auto flex-1">
              {modalFilteredSeats.length === 0 ? (
                <div className="text-center py-16 bg-[#F7F9FC] rounded-2xl border border-dashed border-[#EDF1F7]">
                  <Armchair size={36} className="mx-auto text-[#8F9BB3] mb-3 opacity-40" />
                  <p className="text-sm font-bold text-[#192038] m-0">No matching seats found</p>
                  <p className="text-xs text-[#8F9BB3] mt-1 m-0">Try clearing the search query or changing filter tab</p>
                </div>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {modalFilteredSeats.map((cell) => {
                    const colors = getSeatColorClasses(cell.computedStatus);
                    const studentName = cell.liveStudent?.name || '';
                    const tooltip = `Seat ${cell.seatNumber} (${cell.computedStatus})${
                      studentName ? ` - ${studentName}` : ''
                    }`;

                    return (
                      <button
                        key={cell.id}
                        onClick={() => handleSelectCell(cell)}
                        className="group flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl transition-all hover:scale-110 cursor-pointer bg-transparent border-none"
                        title={tooltip}
                      >
                        {/* Seat Number Tag */}
                        <div
                          className={`w-8 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-xs ${colors.bg} ${colors.text}`}
                        >
                          {cell.seatNumber}
                        </div>

                        {/* Chair Graphic */}
                        <div className={`${colors.chair} group-hover:opacity-85 transition-opacity`}>
                          <Armchair size={22} strokeWidth={1.75} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#EDF1F7] bg-[#F8FAFD] flex items-center justify-between text-xs shrink-0">
              <span className="text-[#8F9BB3]">
                Showing <strong>{modalFilteredSeats.length}</strong> of <strong>{seatCells.length}</strong> seats
              </span>
              <button
                type="button"
                onClick={() => setIsLayoutModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F7F9FC] shadow-xs transition-all cursor-pointer"
              >
                Close Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Individual Seat Detail Modal */}
      {selectedSeat && (
        <SeatDetailModal
          seat={selectedSeat}
          onClose={() => setSelectedSeat(null)}
        />
      )}
    </div>
  );
};
