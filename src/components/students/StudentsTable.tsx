import React, { useState } from 'react';
import { Edit2, Trash2, IndianRupee, Phone, Armchair, Calendar } from 'lucide-react';
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
  onSelectStudent: _onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onCollectFee
}) => {

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

  // Mobile card renderer for CommonTable
  const renderMobileCard = (student: StudentRecord) => {
    const status = resolveStudentStatus(student);
    const dueAmt = Number(student.dueAmount) || 0;
    const isSelected = selectedIds.includes(student.id);

    return (
      <div className={`p-3.5 sm:p-4 flex flex-col gap-2.5 transition-colors ${isSelected ? 'bg-[#F5F6FE]' : 'hover:bg-[#F9FBFC]'}`}>
        {/* Header: Checkbox + Photo + Name + ID + Status */}
        <div className="flex items-start justify-between gap-2.5">
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
          <div className="shrink-0">{getStatusBadge(status)}</div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-2 bg-[#F8FAFD] rounded-xl p-2.5 text-xs border border-[#EDF1F7]">
          {/* Seat */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <Armchair size={13} className="text-slate-500 shrink-0" />
            <span className="text-[11px]">Seat:</span>
            <strong className="text-[#192038] font-bold text-xs truncate">
              {student.status !== 'Inactive' && computeStudentStatus(student) !== 'Inactive' && student.seatNo && student.seatNo !== '-'
                ? `#${student.seatNo}`
                : 'None'}
            </strong>
          </div>

          {/* Plan */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <Calendar size={13} className="text-indigo-500 shrink-0" />
            <span className="text-[11px]">Plan:</span>
            <strong className="text-[#192038] font-bold text-xs truncate">
              {student.plan || 'Monthly'}
            </strong>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <Phone size={13} className="text-slate-400 shrink-0" />
            <a
              href={`tel:${student.phone}`}
              className="text-slate-800 font-bold text-xs hover:underline truncate"
            >
              {student.phone}
            </a>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <span className="text-[11px]">Due:</span>
            <strong className="text-[#192038] font-semibold text-[11px] truncate">
              {formatDisplayDate(student.nextDueDate || student.nextFeeDueDate)}
            </strong>
          </div>
        </div>

        {/* Due Banner if has pending dues */}
        {dueAmt > 0 && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FFF9F2] border border-amber-200 text-xs">
            <span className="text-amber-800 font-bold text-[11px]">
              Due: ₹{dueAmt}
            </span>
            <button
              type="button"
              onClick={() => onCollectFee(student)}
              className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shadow-2xs"
            >
              Clear
            </button>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between pt-1 border-t border-[#EDF1F7]/80">
          <button
            type="button"
            onClick={() => onCollectFee(student)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-2xs transition-colors cursor-pointer"
          >
            <IndianRupee size={12} />
            <span>Collect Fee</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEditStudent(student)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#3366FF] bg-[#EAF2FF] hover:bg-[#d8e6ff] transition-colors cursor-pointer"
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onDeleteStudent(student)}
              className="p-1.5 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CommonTable
      data={students}
      columns={columns}
      renderMobileCard={renderMobileCard}
      selectable={true}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      emptyMessage="No students found matching your search or filters."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50]}
    />
  );
};
