import React from 'react';
import {
  X,
  Edit2,
  UserPlus,
  Wrench,
  Trash2,
  Crown,
  Archive,
  Armchair,
  CheckCircle2,
  Calendar,
  Phone,
  UserCheck
} from 'lucide-react';
import { SeatGridCell, CategoryRateConfig } from '../../types/seatManagement';

interface SeatDetailPanelProps {
  cell: SeatGridCell | null;
  isEditMode?: boolean;
  onClose: () => void;
  onAssignStudent: (cell: SeatGridCell) => void;
  onToggleMaintenance: (cell: SeatGridCell) => void;
  onToggleAisleOrRemove: (cell: SeatGridCell) => void;
  onEditCellCategory: (cell: SeatGridCell) => void;
  categoryRates: Record<string, CategoryRateConfig>;
  onOpenEditRates: () => void;
  onUnassignStudent: (cell: SeatGridCell) => void;
  onQuickChangeCategory?: (cellId: string, newCategory: import('../../types/seatManagement').SeatCategory) => void;
  categoryCounts?: { premium: number; locker: number; normal: number };
}

export const SeatDetailPanel: React.FC<SeatDetailPanelProps> = ({
  cell,
  isEditMode = false,
  onClose,
  onAssignStudent,
  onToggleMaintenance,
  onToggleAisleOrRemove,
  onEditCellCategory,
  categoryRates,
  onOpenEditRates,
  onUnassignStudent,
  onQuickChangeCategory,
  categoryCounts
}) => {
  if (!cell) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDF1F7] p-8 text-center text-[#8F9BB3] shadow-xs">
        <Armchair size={32} className="mx-auto text-[#544bec]/40 mb-3" />
        <strong className="text-sm text-[#192038] block">No Seat Selected</strong>
        <p className="text-xs text-[#8F9BB3] mt-1">
          Click on any seat on the library layout to view its details, assigned student, or update status.
        </p>
      </div>
    );
  }

  const isOccupied = Boolean(cell.isSeat && (cell.status === 'Occupied' || cell.assignedStudent?.name));
  const displayStatus = !cell.isSeat ? 'Aisle / Empty' : cell.status === 'Maintenance' ? 'Maintenance' : isOccupied ? 'Occupied' : 'Available';

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Premium':
        return <Crown size={14} className="text-amber-500" />;
      case 'Locker':
        return <Archive size={14} className="text-blue-500" />;
      default:
        return <Armchair size={14} className="text-[#544bec]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Main Seat Details Card */}
      <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDF1F7] pb-3">
          <h3 className="text-sm font-extrabold text-[#192038] m-0">Seat Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#8F9BB3] hover:text-[#192038] rounded-lg transition-all"
            title="Close details"
          >
            <X size={16} />
          </button>
        </div>

        {/* Selected Seat Hero Header Card */}
        <div className="flex items-center justify-between bg-[#F7F9FC] p-3.5 rounded-xl border border-[#EDF1F7]">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl border shadow-xs flex items-center justify-center font-black text-lg ${
              !cell.isSeat
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : cell.category === 'Premium'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : cell.category === 'Locker'
                ? 'bg-sky-100 text-sky-900 border-sky-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {cell.isSeat ? cell.seatNumber : '—'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  !cell.isSeat
                    ? 'bg-slate-100 text-slate-500'
                    : isOccupied
                    ? 'bg-[#FFEFF0] text-[#FF3D71]'
                    : cell.status === 'Maintenance'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-[#EEF0FD] text-[#544bec]'
                }`}>
                  {displayStatus}
                </span>
                {cell.isSeat && (
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-black border ${
                    cell.category === 'Premium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : cell.category === 'Locker'
                      ? 'bg-sky-50 text-sky-800 border-sky-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {cell.category === 'Premium' && '👑 '}
                    {cell.category === 'Locker' && '📦 '}
                    {cell.category === 'Normal' && '💺 '}
                    {cell.category}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#8F9BB3] block mt-0.5">
                {cell.isSeat ? `Row ${cell.row}, Col ${cell.col}` : 'No seat allocated'}
              </span>
            </div>
          </div>

          {cell.isSeat && (
            <button
              onClick={() => onEditCellCategory(cell)}
              className="px-2.5 py-1.5 rounded-lg border border-[#544bec]/30 bg-[#EEF0FD] text-[#544bec] hover:bg-[#d6f4ea] font-bold text-xs inline-flex items-center gap-1 shadow-xs cursor-pointer transition-all"
              title="Edit full seat details"
            >
              <Edit2 size={12} className="text-[#544bec]" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Key Attributes List */}
        {cell.isSeat ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[#F7F9FC]">
              <span className="text-[#8F9BB3]">Seat Number</span>
              <strong className="text-[#192038] font-bold">Seat #{cell.seatNumber}</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#F7F9FC]">
              <span className="text-[#8F9BB3]">Category</span>
              <div className="flex items-center gap-1.5 font-bold text-[#192038]">
                {getCategoryIcon(cell.category)}
                <span>{cell.category}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#F7F9FC]">
              <span className="text-[#8F9BB3]">Monthly Fee</span>
              <strong className="text-[#544bec] font-extrabold text-sm">₹{cell.monthlyFee} / mo</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#F7F9FC]">
              <span className="text-[#8F9BB3]">Row / Column</span>
              <span className="font-semibold text-[#192038]">Row {cell.row}, Column {cell.col}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#F7F9FC]">
              <span className="text-[#8F9BB3]">Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  isOccupied ? 'bg-[#FF3D71]' : cell.status === 'Maintenance' ? 'bg-slate-400' : 'bg-[#544bec]'
                }`} />
                <span className="font-bold text-[#192038]">{displayStatus}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#8F9BB3]">Added On</span>
              <span className="text-[#8F9BB3] text-[11px]">{cell.addedOn}</span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-[#8F9BB3]">
            This grid cell is configured as an empty space or aisle.
          </div>
        )}

        {/* Assigned Student Card (if occupied) */}
        {cell.isSeat && isOccupied && cell.assignedStudent && (
          <div className="p-3 bg-[#FFF5F7] border border-[#FFD6DF] rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#FF3D71] uppercase tracking-wider">
                Assigned Student
              </span>
              <button
                onClick={() => onUnassignStudent(cell)}
                className="text-[10px] text-rose-600 hover:underline font-bold"
              >
                Unassign
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF3D71]/15 text-[#FF3D71] font-bold flex items-center justify-center shrink-0">
                {cell.assignedStudent.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <strong className="text-sm text-[#192038] block truncate">
                  {cell.assignedStudent.name}
                </strong>
                <span className="text-[11px] text-[#8F9BB3] block">
                  {cell.assignedStudent.studentId} • {cell.assignedStudent.phone}
                </span>
              </div>
            </div>
            <div className="pt-1 text-[11px] text-[#8F9BB3] border-t border-[#FFE4EA] flex items-center justify-between">
              <span>Next Fee Due:</span>
              <strong className="text-[#192038]">{cell.assignedStudent.nextFeeDueDate}</strong>
            </div>
          </div>
        )}

        {/* Primary Action Button: only shown if seat is truly unassigned and not maintenance */}
        {cell.isSeat && !isOccupied && cell.status !== 'Maintenance' && (
          <button
            onClick={() => onAssignStudent(cell)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#544bec] text-white hover:bg-[#4338ca] font-extrabold text-xs inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <UserCheck size={16} />
            <span>Assign to Student</span>
          </button>
        )}
      </div>

      {/* 2. Quick Actions Card */}
      <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EDF1F7] pb-2">
          <span className="text-xs font-extrabold text-[#192038] uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-amber-500">⚡</span> Quick Actions
          </span>
          <span className="text-[10px] text-[#8F9BB3]">1-Click Controls</span>
        </div>

        {/* QUICK CATEGORY CHANGER */}
        {cell.isSeat && (
          <div className="p-3 bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#334155] flex items-center gap-1">
                Change Category
              </span>
              <span className="text-[10px] text-[#544bec] font-bold">Instant Apply</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {/* Normal Button */}
              <button
                type="button"
                onClick={() => onQuickChangeCategory && onQuickChangeCategory(cell.id, 'Normal')}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                  cell.category === 'Normal'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300 ring-offset-1 scale-[1.02]'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
                title="Change to Normal seat"
              >
                <div className="flex items-center gap-1">
                  <Armchair size={13} />
                  <span>Normal</span>
                </div>
                <span className={`text-[10px] font-extrabold ${cell.category === 'Normal' ? 'text-emerald-100' : 'text-emerald-600'}`}>
                  ₹{categoryRates.Normal?.rate || 600}
                </span>
                {cell.category === 'Normal' ? (
                  <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-700 text-white font-black">ACTIVE</span>
                ) : (
                  <span className="text-[8px] text-slate-400">Set</span>
                )}
              </button>

              {/* Premium Button */}
              <button
                type="button"
                onClick={() => onQuickChangeCategory && onQuickChangeCategory(cell.id, 'Premium')}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                  cell.category === 'Premium'
                    ? 'bg-amber-500 text-amber-950 border-amber-600 shadow-sm ring-2 ring-amber-300 ring-offset-1 scale-[1.02]'
                    : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
                title="Change to Premium seat (Luxury desk & power)"
              >
                <div className="flex items-center gap-1">
                  <Crown size={13} />
                  <span>Premium</span>
                </div>
                <span className={`text-[10px] font-extrabold ${cell.category === 'Premium' ? 'text-amber-950' : 'text-amber-700'}`}>
                  ₹{categoryRates.Premium?.rate || 800}
                </span>
                {cell.category === 'Premium' ? (
                  <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-amber-600 text-amber-950 font-black">ACTIVE</span>
                ) : (
                  <span className="text-[8px] text-slate-400">Set</span>
                )}
              </button>

              {/* Locker Button */}
              <button
                type="button"
                onClick={() => onQuickChangeCategory && onQuickChangeCategory(cell.id, 'Locker')}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                  cell.category === 'Locker'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-sm ring-2 ring-sky-300 ring-offset-1 scale-[1.02]'
                    : 'bg-white text-sky-800 border-sky-200 hover:bg-sky-50 hover:border-sky-300'
                }`}
                title="Change to Locker seat (Desk with personal locker)"
              >
                <div className="flex items-center gap-1">
                  <Archive size={13} />
                  <span>Locker</span>
                </div>
                <span className={`text-[10px] font-extrabold ${cell.category === 'Locker' ? 'text-sky-100' : 'text-sky-600'}`}>
                  ₹{categoryRates.Locker?.rate || 700}
                </span>
                {cell.category === 'Locker' ? (
                  <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-sky-700 text-white font-black">ACTIVE</span>
                ) : (
                  <span className="text-[8px] text-slate-400">Set</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Maintenance Toggle */}
        <button
          onClick={() => onToggleMaintenance(cell)}
          className="w-full py-2 px-3 rounded-xl bg-[#FFF9E6] border border-[#FFE7A3] text-[#B78103] hover:bg-[#FFF3CC] font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Wrench size={14} />
          <span>
            {cell.status === 'Maintenance' ? 'Mark as Available' : 'Mark as Maintenance'}
          </span>
        </button>

        {isEditMode ? (
          <button
            onClick={() => onToggleAisleOrRemove(cell)}
            className="w-full py-2 px-3 rounded-xl bg-[#FFF1F3] border border-[#FFCCD4] text-[#E0245E] hover:bg-[#FFE4E8] font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer animate-in fade-in"
          >
            <Trash2 size={14} />
            <span>{cell.isSeat ? 'Remove Seat (Set as Aisle)' : 'Convert to Seat'}</span>
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#F8FAFD] border border-[#EDF1F7] text-[11px] text-[#8F9BB3] leading-relaxed">
            💡 To remove seats, convert aisles, or alter the layout, click <strong>Edit Layout</strong>.
          </div>
        )}
      </div>

      {/* 3. Seat Categories Rates Overview Card */}
      <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EDF1F7] pb-2">
          <span className="text-xs font-extrabold text-[#192038]">Seat Categories</span>
          <button
            type="button"
            onClick={onOpenEditRates}
            className="px-2.5 py-1 rounded-lg bg-[#EEF0FD] hover:bg-[#d4f5ea] border border-[#544bec]/30 text-[#544bec] font-extrabold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Edit category monthly prices"
          >
            <Edit2 size={12} />
            <span>Edit Prices</span>
          </button>
        </div>

        <div className="space-y-2">
          {/* Premium */}
          <div
            onClick={onOpenEditRates}
            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-50/70 to-transparent border border-amber-200/60 hover:border-amber-400 hover:bg-amber-50 text-xs transition-all cursor-pointer group shadow-2xs"
            title="Click to edit Premium price"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                <Crown size={14} className="text-[#D97706]" strokeWidth={2.5} />
              </div>
              <div>
                <strong className="text-[#192038] block font-bold text-xs">Premium</strong>
                <span className="text-[10px] text-[#8F9BB3]">
                  {categoryCounts?.premium ?? categoryRates.Premium?.totalSeats ?? 18} seats
                </span>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <strong className="text-[#544bec] font-extrabold text-sm block">₹{categoryRates.Premium?.rate || 800}</strong>
                <span className="text-[10px] text-[#8F9BB3]">/ month</span>
              </div>
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-[#8F9BB3] group-hover:text-[#544bec] group-hover:bg-[#EEF0FD] transition-all">
                <Edit2 size={12} />
              </div>
            </div>
          </div>

          {/* Locker */}
          <div
            onClick={onOpenEditRates}
            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-sky-50/70 to-transparent border border-sky-200/60 hover:border-sky-400 hover:bg-sky-50 text-xs transition-all cursor-pointer group shadow-2xs"
            title="Click to edit Locker price"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shadow-xs">
                <Archive size={14} className="text-[#0284C7]" strokeWidth={2.5} />
              </div>
              <div>
                <strong className="text-[#192038] block font-bold text-xs">Locker</strong>
                <span className="text-[10px] text-[#8F9BB3]">
                  {categoryCounts?.locker ?? categoryRates.Locker?.totalSeats ?? 8} seats
                </span>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <strong className="text-[#544bec] font-extrabold text-sm block">₹{categoryRates.Locker?.rate || 700}</strong>
                <span className="text-[10px] text-[#8F9BB3]">/ month</span>
              </div>
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-[#8F9BB3] group-hover:text-[#544bec] group-hover:bg-[#EEF0FD] transition-all">
                <Edit2 size={12} />
              </div>
            </div>
          </div>

          {/* Normal */}
          <div
            onClick={onOpenEditRates}
            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-50/70 to-transparent border border-emerald-200/60 hover:border-emerald-400 hover:bg-emerald-50 text-xs transition-all cursor-pointer group shadow-2xs"
            title="Click to edit Normal price"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                <Armchair size={14} className="text-[#544bec]" strokeWidth={2.5} />
              </div>
              <div>
                <strong className="text-[#192038] block font-bold text-xs">Normal</strong>
                <span className="text-[10px] text-[#8F9BB3]">
                  {categoryCounts?.normal ?? categoryRates.Normal?.totalSeats ?? 138} seats
                </span>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <strong className="text-[#544bec] font-extrabold text-sm block">₹{categoryRates.Normal?.rate || 600}</strong>
                <span className="text-[10px] text-[#8F9BB3]">/ month</span>
              </div>
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-[#8F9BB3] group-hover:text-[#544bec] group-hover:bg-[#EEF0FD] transition-all">
                <Edit2 size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
