import React, { useState } from 'react';
import { Edit2, Trash2, IndianRupee, Phone, Armchair, Calendar, ChevronDown, Eye } from 'lucide-react';
import { StudentRecord } from '../../types/student';
import { formatDisplayDate, computeStudentStatus, getStudentLastPaymentDate } from '../../utils/dateFormatter';
import { CommonTable, CommonTableColumn } from '../common/CommonTable';

interface StudentsTableProps {
  students: StudentRecord[];
  selectedStudent: StudentRecord | null;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onSelectStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (student: StudentRecord) => void;
  onCollectFee: (student: StudentRecord) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  selectedStudent: _selectedStudent,
  selectedIds = [],
  onSelectionChange,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onCollectFee
}) => {
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const handleToggleCard = (id: string) => {
    setExpandedStudentId((prev) => (prev === id ? null : id));
  };

  // Dynamic status resolver
  const resolveStudentStatus = (student: StudentRecord): string => {
    return computeStudentStatus(student);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Demo':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">
            Demo
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF0FD] text-[#544bec]">
            Active
          </span>
        );
      case 'Due Soon':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7E8] text-[#FFAA00]">
            Due Soon
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEFF0] text-[#FF3D71]">
            Overdue
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F5F7] text-[#8F9BB3] border border-[#E4E9F2]">
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F5F7] text-[#8F9BB3]">
            {status}
          </span>
        );
    }
  };

  // Columns definition for CommonTable
  const columns: CommonTableColumn<StudentRecord>[] = [
    {
      header: '#',
      align: 'center',
      width: '40px',
      render: (_row, idx) => (
        <span className="text-[#8F9BB3] font-medium text-[11px]">{idx + 1}</span>
      )
    },
    {
      header: 'Photo',
      width: '50px',
      render: (student) => (
        <img
          src={student.avatar}
          alt={student.name}
          className="w-8 h-8 rounded-full object-cover border border-[#EDF1F7]"
        />
      )
    },
    {
      header: 'Name',
      render: (student) => (
        <span className="font-bold text-[#192038] whitespace-nowrap">{student.name}</span>
      )
    },
    {
      header: 'Student ID',
      render: (student) => (
        <span className="font-mono font-medium text-[#8F9BB3] text-[11px]">{student.studentId}</span>
      )
    },
    {
      header: 'Phone',
      render: (student) => (
        <span className="text-[#192038] font-medium whitespace-nowrap">{student.phone}</span>
      )
    },
    {
      header: 'Seat No.',
      align: 'center',
      render: (student) => {
        const isInactive = student.status === 'Inactive' || computeStudentStatus(student) === 'Inactive';
        const displaySeat = isInactive || !student.seatNo || student.seatNo === '-' ? '-' : student.seatNo;
        return (
          <span className={`font-bold ${displaySeat === '-' ? 'text-[#8F9BB3]' : 'text-[#192038]'}`}>
            {displaySeat}
          </span>
        );
      }
    },
    {
      header: 'Plan',
      render: (student) => {
        const isConverted = (student.status === 'Active' && student.seatNo && student.seatNo !== '-') || (Array.isArray(student.paymentHistory) && student.paymentHistory.length > 0) || student.studentType === 'Regular';
        const displayPlan = isConverted && student.plan?.includes('Demo') ? 'Monthly' : (student.plan || 'Monthly');
        return (
          <span className="text-[#6B778C] font-medium">{displayPlan}</span>
        );
      }
    },
    {
      header: 'Last Payment Date',
      render: (student) => (
        <span className="text-[#6B778C] whitespace-nowrap">{getStudentLastPaymentDate(student)}</span>
      )
    },
    {
      header: 'Next Due Date',
      render: (student) => (
        <div>
          <span className="text-xs font-semibold text-[#192038]">
            {formatDisplayDate(student.nextDueDate || student.nextFeeDueDate)}
          </span>
          {Number(student.dueAmount) > 0 && (
            <div className="mt-0.5 flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCollectFee(student);
                }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#FFF9F2] text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer shadow-2xs"
                title="Click to clear this pending due"
              >
                <span>Due: ₹{student.dueAmount}</span>
                <span className="text-[9px] underline font-bold text-amber-800">Clear</span>
              </button>
              {student.balanceDueDate && (
                <span className="text-[10px] text-[#8F9BB3] font-medium" title="Balance Promise Date">
                  (by {formatDisplayDate(student.balanceDueDate)})
                </span>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      align: 'center',
      render: (student) => getStatusBadge(resolveStudentStatus(student))
    },
    {
      header: 'Action',
      align: 'center',
      render: (student) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onEditStudent(student)}
            className="p-1.5 text-[#8F9BB3] hover:text-[#3366FF] hover:bg-[#3366FF]/10 rounded-lg transition-all cursor-pointer"
            title="Edit student"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteStudent(student)}
            className="p-1.5 text-[#8F9BB3] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
            title="Delete student"
          >
            <Trash2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onCollectFee(student)}
            className="p-1.5 text-[#8F9BB3] hover:text-[#544bec] hover:bg-[#EEF0FD] rounded-lg transition-all cursor-pointer"
            title="Collect fee"
          >
            <IndianRupee size={13} />
          </button>
        </div>
      )
    }
  ];

  // Mobile card renderer for CommonTable with expandable accordion
  const renderMobileCard = (student: StudentRecord) => {
    const status = resolveStudentStatus(student);
    const dueAmt = Number(student.dueAmount) || 0;
    const isSelected = selectedIds.includes(student.id);
    const isExpanded = expandedStudentId === student.id;
    const lastPayment = getStudentLastPaymentDate(student);

    return (
      <div
        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
          isSelected
            ? 'border-[#544bec] ring-2 ring-[#544bec]/20 bg-[#FAF9FF]'
            : isExpanded
            ? 'border-[#544bec]/60 shadow-md ring-1 ring-[#544bec]/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        {/* Card Header (Always visible - Click to toggle expand/collapse) */}
        <div
          onClick={() => handleToggleCard(student.id)}
          className="p-3.5 sm:p-4 cursor-pointer select-none flex flex-col gap-2.5 active:bg-slate-50/70 transition-colors"
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
        >
          {/* Top Row: Checkbox, Avatar, Name, Student ID, Status & Chevron */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              {onSelectionChange && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (isSelected) {
                      onSelectionChange(selectedIds.filter((id) => id !== student.id));
                    } else {
                      onSelectionChange([...selectedIds, student.id]);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded border-[#EDF1F7] accent-[#544bec] cursor-pointer w-4 h-4 shrink-0"
                />
              )}
              <img
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover border border-[#EDF1F7] shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-extrabold text-[#192038] tracking-tight truncate m-0">
                  {student.name}
                </h4>
                <div className="text-[10px] font-mono font-medium text-[#8F9BB3] mt-0.5">
                  {student.studentId}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {getStatusBadge(status)}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 bg-[#EEF0FD] text-[#544bec]' : 'bg-slate-100 text-slate-500'
                }`}
                title={isExpanded ? 'Collapse card' : 'Tap to expand details and actions'}
              >
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Quick Summary Chips Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                <Armchair size={11} className="text-slate-500" />
                {student.status !== 'Inactive' && computeStudentStatus(student) !== 'Inactive' && student.seatNo && student.seatNo !== '-'
                  ? `#${student.seatNo}`
                  : 'No Seat'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                {student.plan || 'Monthly'}
              </span>
            </div>

            {dueAmt > 0 ? (
              <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                Due: ₹{dueAmt}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400">
                {isExpanded ? 'Tap to close' : 'Tap for actions'}
              </span>
            )}
          </div>
        </div>

        {/* Expanded Drawer: Revealed ONLY on Click */}
        {isExpanded && (
          <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-0 border-t border-slate-100 space-y-3">
            {/* Extended Details Grid */}
            <div className="grid grid-cols-2 gap-2 bg-[#F8FAFD] rounded-xl p-2.5 text-xs border border-[#EDF1F7] mt-3">
              {/* Phone */}
              <div className="flex items-center gap-1.5 text-[#6B778C]">
                <Phone size={13} className="text-[#544bec] shrink-0" />
                <span className="text-[11px]">Phone:</span>
                <a
                  href={`tel:${student.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-800 font-bold text-xs hover:text-[#544bec] hover:underline truncate"
                >
                  {student.phone}
                </a>
              </div>

              {/* Next Due Date */}
              <div className="flex items-center gap-1.5 text-[#6B778C]">
                <Calendar size={13} className="text-amber-600 shrink-0" />
                <span className="text-[11px]">Due:</span>
                <strong className="text-[#192038] font-semibold text-[11px] truncate">
                  {formatDisplayDate(student.nextDueDate || student.nextFeeDueDate)}
                </strong>
              </div>

              {/* Last Payment Date */}
              <div className="flex items-center gap-1.5 text-[#6B778C] col-span-2">
                <span className="text-[11px]">Last Payment:</span>
                <strong className="text-[#192038] font-bold text-xs truncate">
                  {lastPayment}
                </strong>
              </div>
            </div>

            {/* Pending Dues Banner if any */}
            {dueAmt > 0 && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFF9F2] border border-amber-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-900 font-extrabold text-xs">
                    Pending Due: ₹{dueAmt}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCollectFee(student);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shadow-xs transition-colors"
                >
                  Clear Due
                </button>
              </div>
            )}

            {/* Action Buttons Row (Hidden until expanded) */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EDF1F7]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCollectFee(student);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-2xs transition-all cursor-pointer active:scale-98"
              >
                <IndianRupee size={13} />
                <span>Collect Fee</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStudent?.(student);
                }}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                title="View full details"
              >
                <Eye size={13} />
                <span>View</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditStudent(student);
                }}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#3366FF] bg-[#EAF2FF] hover:bg-[#d8e6ff] transition-colors cursor-pointer"
                title="Edit student"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteStudent(student);
                }}
                className="p-2 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Delete student"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <CommonTable
      data={students}
      columns={columns}
      renderMobileCard={renderMobileCard}
      mobileCardLayout="cards"
      selectable={true}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      emptyMessage="No students found matching your search or filters."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50]}
    />
  );
};
