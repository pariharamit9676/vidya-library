import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { StudentFilterOptions } from '../../types/student';

interface StudentTableToolbarProps {
  filters: StudentFilterOptions;
  onFilterChange: (filters: StudentFilterOptions) => void;
  onClearFilters: () => void;
}

export const StudentTableToolbar: React.FC<StudentTableToolbarProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const statusOptions = ['All', 'Active', 'Due Soon', 'Overdue', 'Demo', 'Inactive'];

  const activeFilterCount =
    (filters.status !== 'All' ? 1 : 0) +
    (filters.plan !== 'All' ? 1 : 0) +
    (filters.seat !== 'All' ? 1 : 0);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#EDF1F7] shadow-xs flex flex-col gap-3">
      {/* Top Row: Search Input + Filter Toggle Icon Button */}
      <div className="flex items-center gap-2.5 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search students by name, phone, seat..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Toggle Button with Filter Icon */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            isOpen || activeFilterCount > 0
              ? 'bg-[#544bec] text-white border-[#544bec] shadow-xs'
              : 'bg-white text-[#192038] border-[#EDF1F7] hover:bg-[#F8FAFD]'
          }`}
          title="Filter Students"
        >
          <Filter size={15} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expandable Filter Section (Hidden by default, reveals on Filter icon click) */}
      {isOpen && (
        <div className="pt-2 border-t border-[#EDF1F7] flex flex-col gap-3">
          {/* Status Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-[#8F9BB3] mr-1 shrink-0">Status:</span>
            {statusOptions.map((st) => {
              const isActive = filters.status === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, status: st })}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#544bec] text-white shadow-2xs'
                      : 'bg-[#F7F9FC] text-[#6B778C] border border-[#EDF1F7] hover:bg-[#EDF1F7]'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Secondary Dropdowns: Plan & Seat & Reset Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Plan Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3]">
              <span className="font-medium text-[#192038]">Plan:</span>
              <select
                value={filters.plan}
                onChange={(e) => onFilterChange({ ...filters, plan: e.target.value })}
                className="bg-white border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] py-1.5 px-3 focus:outline-hidden focus:border-[#544bec] cursor-pointer"
              >
                <option value="All">All Plans</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Seat Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3]">
              <span className="font-medium text-[#192038]">Seat:</span>
              <select
                value={filters.seat}
                onChange={(e) => onFilterChange({ ...filters, seat: e.target.value })}
                className="bg-white border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] py-1.5 px-3 focus:outline-hidden focus:border-[#544bec] cursor-pointer"
              >
                <option value="All">All Seats</option>
                <option value="Assigned">Assigned Only</option>
                <option value="Unassigned">Unassigned Only</option>
              </select>
            </div>

            {/* Clear Filter Button */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all cursor-pointer ml-auto"
              >
                <X size={13} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
