import React, { useState } from 'react';
import { Search, Filter, X, Calendar, CalendarDays } from 'lucide-react';

export interface ReceiptFilterOptions {
  search: string;
  paymentMethod?: string;
  dateRange: string; // 'All' | 'Specific Date' | 'Date Range' | 'Today' | 'This Month' | 'Last 30 Days'
  selectedDate?: string;
  startDate?: string;
  endDate?: string;
  amountRange?: string;
}

interface ReceiptTableToolbarProps {
  filters: ReceiptFilterOptions;
  onFilterChange: (filters: ReceiptFilterOptions) => void;
  onClearFilters: () => void;
  totalFilteredCount?: number;
}

export const ReceiptTableToolbar: React.FC<ReceiptTableToolbarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  totalFilteredCount
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const activeFilterCount =
    (filters.dateRange !== 'All' ? 1 : 0) +
    (filters.selectedDate ? 1 : 0) +
    (filters.startDate || filters.endDate ? 1 : 0);

  const datePresets = [
    { key: 'All', label: 'All Dates' },
    { key: 'Today', label: 'Today' },
    { key: 'This Month', label: 'This Month' },
    { key: 'Last 30 Days', label: 'Last 30 Days' },
    { key: 'Specific Date', label: 'Single Date' },
    { key: 'Date Range', label: 'Date Range' }
  ];

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#EDF1F7] shadow-xs flex flex-col gap-3">
      {/* Top Row: Search Input + Filter Toggle Icon Button */}
      <div className="flex items-center gap-2.5 w-full">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search by receipt #, student name, or mobile..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-medium text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#00A97A] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            isOpen || activeFilterCount > 0
              ? 'bg-[#E8F8F3] text-[#00A97A] border-[#00A97A]/30 shadow-xs'
              : 'bg-white text-[#192038] border-[#EDF1F7] hover:bg-[#F8FAFD]'
          }`}
          title="Filter Receipts"
        >
          <Filter size={15} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#00A97A] text-white text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expandable Filter Drawer */}
      {isOpen && (
        <div className="pt-2 border-t border-[#EDF1F7] flex flex-col gap-3 animate-in fade-in duration-150">
          {/* Quick Date Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-[#8F9BB3] mr-1 shrink-0">Date:</span>
            {datePresets.map(({ key, label }) => {
              const isActive = filters.dateRange === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, dateRange: key })}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00A97A] text-white shadow-xs'
                      : 'bg-[#F7F9FC] text-[#6B778C] border border-[#EDF1F7] hover:bg-[#EDF1F7]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Date Picker row if Specific Date or Date Range */}
          {(filters.dateRange === 'Specific Date' || filters.dateRange === 'Date Range') && (
            <div className="flex flex-wrap items-center gap-2.5 bg-[#F8FAFD] p-2.5 rounded-xl border border-[#EDF1F7]">
              {filters.dateRange === 'Specific Date' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#6B778C]">Date:</span>
                  <input
                    type="date"
                    value={filters.selectedDate || ''}
                    onChange={(e) => onFilterChange({ ...filters, selectedDate: e.target.value })}
                    className="bg-white border border-[#EDF1F7] rounded-lg text-xs font-semibold text-[#192038] py-1 px-2.5 cursor-pointer focus:outline-hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 text-[#6B778C]">
                    <span>From:</span>
                    <input
                      type="date"
                      value={filters.startDate || ''}
                      onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                      className="bg-white border border-[#EDF1F7] rounded-lg text-xs font-semibold text-[#192038] py-1 px-2 cursor-pointer focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B778C]">
                    <span>To:</span>
                    <input
                      type="date"
                      value={filters.endDate || ''}
                      onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                      className="bg-white border border-[#EDF1F7] rounded-lg text-xs font-semibold text-[#192038] py-1 px-2 cursor-pointer focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Filter Clear Action */}
          {activeFilterCount > 0 && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <X size={13} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
