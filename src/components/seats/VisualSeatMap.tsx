import React, { useState } from 'react';
import {
  LayoutGrid,
  Search,
  Plus,
  Minus,
  Wrench,
  Lightbulb,
  Armchair,
  Check,
  Crown,
  Archive,
  Trash2,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { SeatGridCell, SeatCategory, SeatStatus } from '../../types/seatManagement';

interface VisualSeatMapProps {
  cells: SeatGridCell[];
  rows: number;
  cols: number;
  selectedCell: SeatGridCell | null;
  onSelectCell: (cell: SeatGridCell) => void;
  isEditMode: boolean;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onUpdateGridDimensions: (newRows: number, newCols: number) => void;
  onUpdateCell: (cellId: string, updates: Partial<SeatGridCell>) => void;
  categoryFilter: string;
}

export const VisualSeatMap: React.FC<VisualSeatMapProps> = ({
  cells,
  rows,
  cols,
  selectedCell,
  onSelectCell,
  isEditMode,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onUpdateGridDimensions,
  onUpdateCell,
  categoryFilter
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getSeatColorStyles = (cell: SeatGridCell) => {
    if (!cell.isSeat) {
      return 'border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]/80 text-[#94A3B8]';
    }

    if (cell.status === 'Maintenance') {
      return 'bg-[#F1F5F9] text-[#475569] border-2 border-[#CBD5E1] shadow-xs';
    }

    const isOccupied = cell.status === 'Occupied' || Boolean(cell.assignedStudent?.name);

    if (isOccupied) {
      // Occupied seats retain luxury category border so category is immediately obvious
      if (cell.category === 'Premium') {
        return 'bg-gradient-to-b from-[#FFF7ED] to-[#FFE4E6] text-[#9F1239] border-2 border-[#D97706] shadow-[0_3px_10px_rgba(217,119,6,0.25)] ring-1 ring-amber-400/40 hover:bg-[#FFE4E6]';
      }
      if (cell.category === 'Locker') {
        return 'bg-gradient-to-b from-[#F0F9FF] to-[#FFE4E6] text-[#9F1239] border-2 border-[#0284C7] shadow-[0_3px_10px_rgba(2,132,199,0.22)] ring-1 ring-sky-400/40 hover:bg-[#FFE4E6]';
      }
      return 'bg-gradient-to-b from-[#FFF1F2] to-[#FFE4E6] text-[#9F1239] border-2 border-[#FDA4AF] shadow-xs hover:bg-[#FECDD3]';
    }

    // Available seats: High-end distinct luxury designs
    if (cell.category === 'Premium') {
      // Warm Luxury Gold/Amber VIP Lounge Look
      return 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] text-[#78350F] border-2 border-[#D97706] shadow-[0_3px_10px_rgba(217,119,6,0.28)] ring-1 ring-amber-400/50 hover:brightness-105';
    }

    if (cell.category === 'Locker') {
      // Crisp Tech Ocean Blue
      return 'bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] text-[#075985] border-2 border-[#0284C7] shadow-[0_3px_10px_rgba(2,132,199,0.25)] ring-1 ring-sky-400/50 hover:brightness-105';
    }

    // Normal Available - Fresh Clean Mint Emerald
    return 'bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0] text-[#14532D] border-2 border-[#4ADE80] shadow-[0_2px_6px_rgba(74,222,128,0.2)] hover:brightness-105';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDF1F7] shadow-xs overflow-hidden flex flex-col">
      {/* 1. Map Control Toolbar */}
      <div className="p-3 sm:p-5 border-b border-[#EDF1F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white">
        {/* Title & Status */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center shrink-0">
              <LayoutGrid size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#192038]">Library Layout</span>
                {isEditMode ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Editing
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-[#F7F9FC] border border-[#EDF1F7] text-[#6B778C] text-[11px] font-bold">
                    {rows}R × {cols}C
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isEditMode && (
            <button
              type="button"
              onClick={onStartEdit}
              className="sm:hidden px-3 py-1.5 rounded-lg bg-[#00A97A] text-white hover:bg-[#008f67] text-xs font-extrabold inline-flex items-center gap-1 shadow-sm shadow-[#00A97A]/30 transition-all cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Center / Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap w-full sm:w-auto">
          {isEditMode ? (
            /* ONLY VISIBLE AFTER CLICKING EDIT LAYOUT */
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto animate-in fade-in duration-200">
              {/* Rows control - Real-time changes, up to 50 */}
              <div className="flex items-center gap-1 text-xs text-[#8F9BB3]">
                <span className="font-semibold text-[#192038]">Rows</span>
                <div className="inline-flex items-center border border-[#EDF1F7] rounded-lg bg-[#F7F9FC]">
                  <button
                    type="button"
                    onClick={() => onUpdateGridDimensions(Math.max(1, rows - 1), cols)}
                    disabled={rows <= 1}
                    className="w-7 h-7 flex items-center justify-center text-[#6B778C] hover:text-[#192038] hover:bg-[#EDF1F7] rounded-l-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Decrease rows"
                  >
                    <Minus size={12} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={rows}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1) {
                        onUpdateGridDimensions(Math.min(50, val), cols);
                      }
                    }}
                    className="w-8 sm:w-9 text-center font-bold text-[#192038] text-xs bg-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateGridDimensions(Math.min(50, rows + 1), cols)}
                    disabled={rows >= 50}
                    className="w-7 h-7 flex items-center justify-center text-[#6B778C] hover:text-[#192038] hover:bg-[#EDF1F7] rounded-r-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Increase rows"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Columns control - Real-time changes, up to 50 */}
              <div className="flex items-center gap-1 text-xs text-[#8F9BB3]">
                <span className="font-semibold text-[#192038]">Cols</span>
                <div className="inline-flex items-center border border-[#EDF1F7] rounded-lg bg-[#F7F9FC]">
                  <button
                    type="button"
                    onClick={() => onUpdateGridDimensions(rows, Math.max(1, cols - 1))}
                    disabled={cols <= 1}
                    className="w-7 h-7 flex items-center justify-center text-[#6B778C] hover:text-[#192038] hover:bg-[#EDF1F7] rounded-l-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Decrease columns"
                  >
                    <Minus size={12} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={cols}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1) {
                        onUpdateGridDimensions(rows, Math.min(50, val));
                      }
                    }}
                    className="w-8 sm:w-9 text-center font-bold text-[#192038] text-xs bg-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateGridDimensions(rows, Math.min(50, cols + 1))}
                    disabled={cols >= 50}
                    className="w-7 h-7 flex items-center justify-center text-[#6B778C] hover:text-[#192038] hover:bg-[#EDF1F7] rounded-r-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Increase columns"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F8FAFD] text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                title="Cancel layout changes and revert"
              >
                <RotateCcw size={12} className="text-[#8F9BB3]" />
                <span>Cancel</span>
              </button>

              {/* Save Layout Button */}
              <button
                type="button"
                onClick={onSaveEdit}
                className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#00A97A] text-white hover:bg-[#008f67] text-xs font-extrabold inline-flex items-center gap-1 shadow-sm shadow-[#00A97A]/30 transition-all cursor-pointer ml-auto sm:ml-0"
                title="Save current layout changes"
              >
                <Save size={12} />
                <span>Save</span>
              </button>
            </div>
          ) : (
            /* VIEW MODE: Desktop Edit Layout button */
            <button
              type="button"
              onClick={onStartEdit}
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg bg-[#00A97A] text-white hover:bg-[#008f67] text-xs font-extrabold items-center gap-1.5 shadow-sm shadow-[#00A97A]/30 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit Layout</span>
            </button>
          )}

          {/* Search Seat Number */}
          <div className="relative flex-1 sm:flex-initial sm:min-w-[170px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F9BB3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seat #..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#00A97A] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden px-3 py-1.5 bg-amber-50/70 border-b border-amber-200/50 text-[10px] text-amber-800 font-semibold flex items-center justify-between">
        <span>👉 Drag/Swipe to view all desks</span>
        <span className="text-[#00A97A] font-bold">Tap to select seat</span>
      </div>

      {/* 2. Architectural Floor Plan Room */}
      <div className="p-2 sm:p-6 bg-[#F8FAFD] flex items-center justify-start sm:justify-center overflow-x-auto">
        <div
          className="bg-[#FAF6EE] border-4 sm:border-8 border-[#D4C3A3] rounded-2xl sm:rounded-3xl p-3 sm:p-8 relative shadow-inner overflow-hidden mx-auto transition-all duration-300"
          style={{
            minWidth: `${Math.max(480, cols * 54)}px`,
            maxWidth: cols > 12 ? 'none' : '56rem',
            width: '100%'
          }}
        >
          {/* Wall Trim Decor */}
          <div className="absolute inset-1 border border-[#E8DEC8] rounded-xl sm:rounded-2xl pointer-events-none" />

          {/* Corner potted plant illustrations */}
          <div className="absolute top-1.5 left-1.5 text-base sm:text-xl select-none">🪴</div>
          <div className="absolute top-1.5 right-1.5 text-base sm:text-xl select-none">🪴</div>
          <div className="absolute bottom-1.5 left-1.5 text-base sm:text-xl select-none">🪴</div>
          <div className="absolute bottom-1.5 right-1.5 text-base sm:text-xl select-none">🪴</div>
          <div className="absolute top-2 right-2 text-xl select-none">🪴</div>
          <div className="absolute bottom-2 left-2 text-xl select-none">🪴</div>
          <div className="absolute bottom-2 right-2 text-xl select-none">🪴</div>

          {/* Grid Layout Container */}
          <div
            className={`grid my-2 transition-all duration-200 ${
              cols > 14 ? 'gap-1.5 sm:gap-2' : cols > 10 ? 'gap-2 sm:gap-3' : 'gap-3 sm:gap-4'
            }`}
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
            }}
          >
            {cells.map((cell) => {
              const isSelected = selectedCell?.id === cell.id;
              const matchesSearch =
                searchQuery.trim() !== '' &&
                cell.isSeat &&
                String(cell.seatNumber).includes(searchQuery.trim());
              const matchesCategory =
                categoryFilter === 'All' || !cell.isSeat || cell.category === categoryFilter;
              const isDimmed = !matchesCategory || (searchQuery.trim() !== '' && !matchesSearch);

              return (
                <div
                  key={cell.id}
                  onClick={() => onSelectCell(cell)}
                  className={`relative group aspect-4/3 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none ${
                    getSeatColorStyles(cell)
                  } ${
                    isSelected
                      ? 'ring-3 ring-[#00A97A] ring-offset-2 scale-105 z-10 shadow-lg'
                      : 'hover:scale-102 hover:shadow-md'
                  } ${
                    isDimmed ? 'opacity-30' : 'opacity-100'
                  } ${
                    matchesSearch ? 'animate-pulse ring-2 ring-amber-400' : ''
                  }`}
                >
                  {cell.isSeat ? (
                    <>
                      {/* Top-Left Occupied Indicator Dot */}
                      {(cell.status === 'Occupied' || Boolean(cell.assignedStudent?.name)) && (
                        <span
                          title={`Occupied by ${cell.assignedStudent?.name || 'Student'}`}
                          className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-rose-600 ring-2 ring-rose-200"
                        />
                      )}

                      {/* Maintenance State */}
                      {cell.status === 'Maintenance' ? (
                        <div className="flex flex-col items-center">
                          <Wrench size={14} className="text-[#455A64]" />
                          <span className="text-[10px] font-mono font-bold leading-none mt-0.5">
                            {cell.seatNumber}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full px-1">
                          {/* Distinctive Category Design Emblem */}
                          {cell.category === 'Premium' && (
                            <Crown
                              size={12}
                              className={`mb-0.5 shrink-0 ${
                                cell.status === 'Occupied' ? 'text-[#D97706]' : 'text-[#B45309]'
                              }`}
                              strokeWidth={2.5}
                            />
                          )}

                          {cell.category === 'Locker' && (
                            <Archive
                              size={11}
                              className={`mb-0.5 shrink-0 ${
                                cell.status === 'Occupied' ? 'text-[#0284C7]' : 'text-[#0369A1]'
                              }`}
                              strokeWidth={2.5}
                            />
                          )}

                          {/* Numeric Seat Number */}
                          <span className="text-xs sm:text-sm font-black tracking-tight leading-none">
                            {cell.seatNumber}
                          </span>

                          {/* Category-Specific Desk Cushion Lip */}
                          {cell.category === 'Premium' ? (
                            <span className="w-6 sm:w-7 h-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 shadow-xs mt-1" />
                          ) : cell.category === 'Locker' ? (
                            <span className="w-5 sm:w-6 h-1 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 shadow-xs mt-1" />
                          ) : (
                            <span className={`w-5 sm:w-6 h-0.5 sm:h-1 rounded-full mt-1 ${
                              cell.status === 'Occupied' ? 'bg-rose-400/70' : 'bg-[#16A34A]/40'
                            }`} />
                          )}
                        </div>
                      )}

                      {/* Edit Mode Hover Badge */}
                      {isEditMode && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center shadow-xs">
                          ✎
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty Space / Aisle */
                    <div className="text-[10px] text-[#A0AEC0] font-medium flex flex-col items-center">
                      <span className="text-[12px] opacity-40">· · ·</span>
                      <span className="text-[9px] scale-90">Aisle</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Door Entry/Exit Threshold */}
          <div className="mt-6 pt-3 border-t-2 border-dashed border-[#D4C3A3] flex items-center justify-center">
            <div className="px-6 py-1 rounded-t-lg bg-[#E5D8BE] text-[#8C7A58] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-b-0 border-[#D4C3A3]">
              <span>🚪 Library Entrance / Exit</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Helpful Instruction Callout */}
      <div className="p-3.5 sm:p-4 bg-[#FFFBEB] border-t border-[#FEF3C7] flex items-center gap-2.5 text-xs text-[#92400E]">
        <div className="text-amber-500 shrink-0">
          <Lightbulb size={16} />
        </div>
        <span>
          Click on any seat to view details or edit its category. Use <strong>Edit Layout</strong> mode to add/remove seats, change rows/columns, or mark empty spaces.
        </span>
      </div>
    </div>
  );
};
