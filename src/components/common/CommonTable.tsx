import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CommonTableColumn<T> {
  header: React.ReactNode;
  key?: string;
  accessor?: keyof T | ((row: T) => any);
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface CommonTableProps<T> {
  data: T[];
  columns: CommonTableColumn<T>[];
  renderMobileCard?: (row: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  pagination?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  minWidth?: string;
  className?: string;
  mobileCardLayout?: 'cards' | 'list';
}

export function CommonTable<T>({
  data = [],
  columns = [],
  renderMobileCard,
  emptyMessage = 'No records found.',
  isLoading = false,
  pagination = true,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  getRowId = (row: any, i) => row.id || row._id || String(i),
  onRowClick,
  minWidth = '840px',
  className = '',
  mobileCardLayout = 'list'
}: CommonTableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = totalCount === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(safeCurrentPage * pageSize, totalCount);

  const paginatedData = useMemo(() => {
    if (!pagination) return data;
    return data.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
  }, [data, pagination, safeCurrentPage, pageSize]);

  const allPageIds = useMemo(() => {
    return data.map((row, idx) => getRowId(row, idx));
  }, [data, getRowId]);

  const isAllSelected = selectable && allPageIds.length > 0 && allPageIds.every((id) => selectedIds.includes(id));

  const handleToggleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(allPageIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const isCardsMode = mobileCardLayout === 'cards';

  return (
    <div className={`${isCardsMode ? 'bg-[#F8FAFD] sm:bg-white rounded-xl sm:rounded-2xl sm:border sm:border-[#EDF1F7] sm:shadow-xs overflow-hidden flex flex-col' : 'bg-white rounded-xl sm:rounded-2xl border border-[#EDF1F7] shadow-xs overflow-hidden flex flex-col'} ${className}`}>
      {/* ========================================================================= */}
      {/* 1. Mobile Cards View (< lg screens) */}
      {/* ========================================================================= */}
      <div className={isCardsMode ? 'lg:hidden space-y-3 p-1.5 sm:p-2 bg-[#F8FAFD]' : 'lg:hidden divide-y divide-[#EDF1F7]'}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skel-card-${i}`}
              className={
                isCardsMode
                  ? 'p-4 space-y-2.5 animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-2xs'
                  : 'p-4 space-y-2.5 animate-pulse bg-white'
              }
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-slate-100 rounded-md" />
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-48 bg-slate-100 rounded" />
                <div className="h-3 w-36 bg-slate-100 rounded" />
              </div>
            </div>
          ))
        ) : paginatedData.length === 0 ? (
          <div className="py-10 px-4 text-center text-xs text-[#8F9BB3] bg-white rounded-2xl border border-[#EDF1F7]">
            {emptyMessage}
          </div>
        ) : (
          paginatedData.map((row, idx) => {
            const actualIndex = (safeCurrentPage - 1) * pageSize + idx;
            if (renderMobileCard) {
              return (
                <div key={getRowId(row, actualIndex)}>
                  {renderMobileCard(row, actualIndex)}
                </div>
              );
            }

            // Auto-generated fallback card if no custom card renderer provided
            return (
              <div
                key={getRowId(row, actualIndex)}
                onClick={() => onRowClick?.(row)}
                className={`p-3.5 sm:p-4 flex flex-col gap-2 transition-colors hover:bg-[#F9FBFC] ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col, colIdx) => {
                  let value: React.ReactNode = null;
                  if (col.render) {
                    value = col.render(row, actualIndex);
                  } else if (typeof col.accessor === 'function') {
                    value = col.accessor(row);
                  } else if (col.accessor) {
                    value = (row as any)[col.accessor];
                  }

                  return (
                    <div key={col.key || String(colIdx)} className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-[11px] font-semibold text-[#8F9BB3]">{col.header}</span>
                      <div className="font-medium text-[#192038] text-right">{value}</div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. Desktop Structured Table (>= lg screens) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-[#EDF1F7] text-[#8F9BB3] font-bold text-[11px] bg-white">
              {selectable && (
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    className="rounded border-[#EDF1F7] accent-[#544bec] cursor-pointer w-3.5 h-3.5"
                  />
                </th>
              )}

              {columns.map((col, colIdx) => {
                const alignClass =
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                return (
                  <th
                    key={col.key || String(colIdx)}
                    style={col.width ? { width: col.width } : undefined}
                    className={`py-3 px-3 ${alignClass} ${col.headerClassName || ''}`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EDF1F7]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skel-row-${rIdx}`} className="animate-pulse bg-white">
                  {selectable && (
                    <td className="py-3 px-3 text-center">
                      <div className="w-3.5 h-3.5 bg-slate-100 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((_, cIdx) => (
                    <td key={`skel-col-${cIdx}`} className="py-3.5 px-3">
                      <div
                        className="h-3.5 bg-slate-100 rounded"
                        style={{ width: `${Math.max(40, ((cIdx + 1) * 29) % 75 + 20)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-10 text-center text-xs text-[#8F9BB3]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const actualIndex = (safeCurrentPage - 1) * pageSize + idx;
                const rowId = getRowId(row, actualIndex);
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors hover:bg-[#F9FBFC] text-xs ${
                      isSelected ? 'bg-[#F5F6FE]' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {selectable && (
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelectRow(rowId, e as any)}
                          className="rounded border-[#EDF1F7] accent-[#544bec] cursor-pointer w-3.5 h-3.5"
                        />
                      </td>
                    )}

                    {columns.map((col, colIdx) => {
                      const alignClass =
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';

                      let content: React.ReactNode = null;
                      if (col.render) {
                        content = col.render(row, actualIndex);
                      } else if (typeof col.accessor === 'function') {
                        content = col.accessor(row);
                      } else if (col.accessor) {
                        content = (row as any)[col.accessor];
                      }

                      return (
                        <td
                          key={col.key || String(colIdx)}
                          className={`py-3 px-3 ${alignClass} ${col.className || ''}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 3. Universal Pagination Footer (Mobile & Desktop) */}
      {/* ========================================================================= */}
      {pagination && totalCount > 0 && (
        <div className="p-3 sm:p-4 border-t border-[#EDF1F7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8F9BB3]">
          <div className="text-[11px] sm:text-xs">
            Showing <strong>{startIndex} to {endIndex}</strong> of <strong>{totalCount}</strong> records
          </div>

          <div className="flex items-center gap-3">
            {/* Page Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg border border-[#EDF1F7] flex items-center justify-center text-[#8F9BB3] hover:bg-[#F7F9FC] disabled:opacity-40 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center cursor-pointer transition-all ${
                    safeCurrentPage === page
                      ? 'bg-[#544bec] text-white shadow-xs'
                      : 'border border-[#EDF1F7] text-[#192038] hover:bg-[#F7F9FC]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 rounded-lg border border-[#EDF1F7] flex items-center justify-center text-[#8F9BB3] hover:bg-[#F7F9FC] disabled:opacity-40 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Page Size Select */}
            {pageSizeOptions.length > 1 && (
              <div className="flex items-center gap-1.5">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#EDF1F7] rounded-lg text-xs font-semibold text-[#192038] py-1 px-2 cursor-pointer focus:outline-hidden"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} / page
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
