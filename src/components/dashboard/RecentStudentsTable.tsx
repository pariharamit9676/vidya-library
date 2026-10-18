import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../../services/useLibraryQueries';
import { formatDisplayDate } from '../../utils/dateFormatter';
import { CommonTable, CommonTableColumn } from '../common/CommonTable';

export const RecentStudentsTable: React.FC = () => {
  const navigate = useNavigate();
  const { data: students = [] } = useStudents();

  // Show up to 5 real students
  const recentStudents = (Array.isArray(students) ? students : []).slice(0, 5);

  const columns: CommonTableColumn<any>[] = [
    {
      header: 'Student',
      render: (student) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E8F8F3] text-[#00A97A] font-bold text-xs flex items-center justify-center shrink-0">
            {(student.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-[#192038] capitalize block">{student.name}</span>
            <span className="text-[10px] text-[#8F9BB3] font-mono">{student.studentId}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Phone',
      render: (student) => <span className="text-[#6B778C] font-mono">{student.phone}</span>
    },
    {
      header: 'Seat No.',
      render: (student) => (
        <span className="text-[#6B778C] font-semibold">
          {student.seatNo && student.seatNo !== '-' ? `Seat #${student.seatNo}` : '—'}
        </span>
      )
    },
    {
      header: 'Admission Date',
      render: (student) => (
        <span className="text-[#192038] font-medium">
          {formatDisplayDate(student.admissionDate)}
        </span>
      )
    },
    {
      header: 'Status',
      align: 'right',
      render: (student) => (
        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#D3F9D8] text-[#2B8A3E]">
          {student.studentType || 'Regular'}
        </span>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDF1F7] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-[#192038] m-0">
          Recent Students
        </h3>
        <button
          onClick={() => navigate('/admin/students')}
          className="text-xs font-bold text-[#00A97A] hover:underline cursor-pointer bg-transparent border-0"
        >
          View All
        </button>
      </div>

      {/* Common Table */}
      <CommonTable
        data={recentStudents}
        columns={columns}
        pagination={false}
        emptyMessage="No students enrolled yet."
        minWidth="560px"
        className="border-0 shadow-none rounded-none"
        renderMobileCard={(student) => (
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E8F8F3] text-[#00A97A] font-bold text-xs flex items-center justify-center shrink-0">
                {(student.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-xs text-[#192038] capitalize">{student.name}</div>
                <div className="text-[10px] text-[#8F9BB3]">
                  {student.phone} • {student.seatNo ? `Seat #${student.seatNo}` : 'Unassigned'}
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D3F9D8] text-[#2B8A3E]">
              {student.studentType || 'Regular'}
            </span>
          </div>
        )}
      />
    </div>
  );
};
