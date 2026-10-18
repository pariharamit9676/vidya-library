import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../../services/useLibraryQueries';
import { computeFeeStatus } from '../../utils/dateFormatter';
import { CommonTable, CommonTableColumn } from '../common/CommonTable';

export const UpcomingFeesTable: React.FC = () => {
  const navigate = useNavigate();
  const { data: students = [] } = useStudents();

  // Find students with pending dues or upcoming fee due dates (Inactive students excluded)
  const feeStudents = (Array.isArray(students) ? students : [])
    .filter((s: any) => s.status !== 'Inactive' && s.feeStatus !== 'INACTIVE')
    .map((s: any) => {
      const dueDate = s.nextDueDate || s.nextFeeDueDate || '';
      const dueAmt = Number(s.dueAmount) || 0;
      const status = computeFeeStatus(dueDate, dueAmt, s.status);
      return {
        ...s,
        displayStatus: status === 'OVERDUE' ? 'Overdue' : status === 'DUE_SOON' ? 'Due Soon' : 'Upcoming',
        feeAmount: dueAmt > 0 ? dueAmt : (Number(s.planAmount) || 600)
      };
    })
    .filter((s: any) => s.displayStatus !== ('INACTIVE' as any))
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Overdue':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FFE3E3] text-[#FA5252]">
            Overdue
          </span>
        );
      case 'Due Soon':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FFF3BF] text-[#F59F00]">
            Due Soon
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#D3F9D8] text-[#2B8A3E]">
            Upcoming
          </span>
        );
    }
  };

  const columns: CommonTableColumn<any>[] = [
    {
      header: 'Student Name',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E8F8F3] text-[#00A97A] font-bold text-xs flex items-center justify-center shrink-0">
            {(item.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-[#192038] leading-tight capitalize">
              {item.name}
            </div>
            <div className="text-[10px] text-[#8F9BB3] font-medium leading-none">
              {item.studentId}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Seat No.',
      render: (item) => (
        <span className="text-[#6B778C] font-semibold">
          {item.seatNo && item.seatNo !== '-' ? `Seat #${item.seatNo}` : '—'}
        </span>
      )
    },
    {
      header: 'Plan',
      render: (item) => (
        <span className="text-[#6B778C] font-medium">{item.plan || 'Monthly'}</span>
      )
    },
    {
      header: 'Due Date',
      render: (item) => (
        <span className="text-[#192038] font-semibold">
          {item.nextDueDate || item.nextFeeDueDate || '—'}
        </span>
      )
    },
    {
      header: 'Amount',
      render: (item) => (
        <span className="font-bold text-[#192038]">₹{item.feeAmount.toLocaleString('en-IN')}</span>
      )
    },
    {
      header: 'Status',
      align: 'right',
      render: (item) => getStatusBadge(item.displayStatus)
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDF1F7] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-[#192038] m-0">
          Upcoming Fee Due
        </h3>
        <button
          onClick={() => navigate('/admin/fees')}
          className="text-xs font-bold text-[#00A97A] hover:underline cursor-pointer bg-transparent border-0"
        >
          View All
        </button>
      </div>

      {/* Common Table */}
      <CommonTable
        data={feeStudents}
        columns={columns}
        pagination={false}
        emptyMessage="No upcoming fee dues right now."
        minWidth="600px"
        className="border-0 shadow-none rounded-none"
        renderMobileCard={(item) => (
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E8F8F3] text-[#00A97A] font-bold text-xs flex items-center justify-center shrink-0">
                {(item.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-xs text-[#192038] capitalize">{item.name}</div>
                <div className="text-[10px] text-[#8F9BB3]">
                  {item.seatNo ? `Seat #${item.seatNo}` : 'No seat'} • Due: {item.nextDueDate || item.nextFeeDueDate || '—'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-xs text-[#192038]">₹{item.feeAmount}</div>
              <div className="mt-0.5">{getStatusBadge(item.displayStatus)}</div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
