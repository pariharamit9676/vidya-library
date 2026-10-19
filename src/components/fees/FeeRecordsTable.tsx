import React from 'react';
import { IndianRupee, FileText, Crown, Archive, Armchair, Phone, Calendar } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateFormatter';
import { CommonTable, CommonTableColumn } from '../common/CommonTable';

export interface FeeRecordRow {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  avatar: string;
  seatNo: string;
  seatCategory: 'Premium' | 'Locker' | 'Normal' | string;
  monthlyFee: number;
  amountPaid: number;
  dueAmount: number;
  balanceDueDate?: string;
  nextDueDate: string;
  feeStatus: 'Paid' | 'Partial' | 'Due' | 'Overdue' | 'Inactive';
  lastPaymentDate?: string;
  lastReceipt?: any;
  studentRef: any;
}

interface FeeRecordsTableProps {
  records: FeeRecordRow[];
  onCollectFee: (student: any) => void;
  onViewReceipt: (student: any, receipt?: any) => void;
}

export const FeeRecordsTable: React.FC<FeeRecordsTableProps> = ({
  records,
  onCollectFee,
  onViewReceipt
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Premium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7E8] text-[#FFAA00] border border-[#FFE0B2]">
            <Crown size={10} />
            Premium
          </span>
        );
      case 'Locker':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FF] text-[#3366FF] border border-[#D0E2FF]">
            <Archive size={10} />
            Locker
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F5F7] text-[#6B778C] border border-[#E4E9F2]">
            <Armchair size={10} />
            Normal
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EEF0FD] text-[#544bec] border border-[#BBF7D0]">
            Paid
          </span>
        );
      case 'Partial':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF9F2] text-amber-700 border border-amber-300">
            Partial Due
          </span>
        );
      case 'Due':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF7E8] text-[#FFAA00] border border-[#FFE0B2]">
            Due Soon
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFEFF0] text-[#FF3D71] border border-[#FFD0D8]">
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

  const columns: CommonTableColumn<FeeRecordRow>[] = [
    {
      header: '#',
      align: 'center',
      width: '40px',
      render: (_row, idx) => (
        <span className="text-[#8F9BB3] font-medium text-[11px]">{idx + 1}</span>
      )
    },
    {
      header: 'Student Name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover border border-[#EDF1F7] shrink-0"
          />
          <div className="min-w-0">
            <span className="font-extrabold text-[#192038] block truncate">{row.name}</span>
            <span className="text-[10px] font-mono text-[#8F9BB3] block truncate">{row.studentId}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Mobile Number',
      render: (row) => (
        <span className="text-[#192038] font-semibold whitespace-nowrap">{row.phone}</span>
      )
    },
    {
      header: 'Seat Number',
      align: 'center',
      render: (row) => (
        <span className="font-extrabold text-[#192038] text-xs">
          {row.seatNo && row.seatNo !== '-' ? `#${row.seatNo}` : '-'}
        </span>
      )
    },
    {
      header: 'Seat Category',
      render: (row) => getCategoryBadge(row.seatCategory)
    },
    {
      header: 'Monthly Fee',
      align: 'right',
      render: (row) => (
        <span className="font-bold text-[#192038]">₹{row.monthlyFee}</span>
      )
    },
    {
      header: 'Amount Paid',
      align: 'right',
      render: (row) => (
        <span className="font-bold text-[#544bec]">₹{row.amountPaid}</span>
      )
    },
    {
      header: 'Outstanding Balance',
      align: 'right',
      render: (row) => (
        <div>
          {row.dueAmount > 0 ? (
            <span className="font-extrabold text-[#FF3D71]">₹{row.dueAmount}</span>
          ) : (
            <span className="text-[#544bec] font-bold text-xs">₹0</span>
          )}
          {row.dueAmount > 0 && row.balanceDueDate && (
            <span className="block text-[10px] text-[#8F9BB3] font-normal">
              Due by {formatDisplayDate(row.balanceDueDate)}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Next Due Date',
      render: (row) => (
        <span className="text-[#192038] font-bold whitespace-nowrap">
          {formatDisplayDate(row.nextDueDate)}
        </span>
      )
    },
    {
      header: 'Payment Status',
      align: 'center',
      render: (row) => getStatusBadge(row.feeStatus)
    },
    {
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onCollectFee(row.studentRef)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-xs cursor-pointer transition-all"
            title="Collect fee"
          >
            <IndianRupee size={12} />
            <span>Collect</span>
          </button>
          <button
            type="button"
            onClick={() => onViewReceipt(row.studentRef, row.lastReceipt)}
            className="p-1.5 rounded-lg text-[#6B778C] hover:text-[#3366FF] hover:bg-[#F7F9FC] border border-[#EDF1F7] transition-all cursor-pointer"
            title="View receipt"
          >
            <FileText size={13} />
          </button>
        </div>
      )
    }
  ];

  // Mobile Card Renderer for Fee Records
  const renderMobileCard = (row: FeeRecordRow) => {
    return (
      <div className="p-3.5 sm:p-4 flex flex-col gap-2.5 transition-colors hover:bg-[#F9FBFC]">
        {/* Header: Avatar + Name + ID + Status */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={row.avatar}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover border border-[#EDF1F7] shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-extrabold text-[#192038] tracking-tight truncate m-0">
                {row.name}
              </h4>
              <div className="text-[10px] font-mono font-medium text-[#8F9BB3] mt-0.5">
                {row.studentId}
              </div>
            </div>
          </div>
          <div className="shrink-0">{getStatusBadge(row.feeStatus)}</div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 bg-[#F8FAFD] rounded-xl p-2.5 text-xs border border-[#EDF1F7]">
          {/* Seat & Category */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <Armchair size={13} className="text-[#544bec] shrink-0" />
            <span className="text-[11px]">Seat:</span>
            <strong className="text-[#192038] font-bold text-xs truncate">
              {row.seatNo && row.seatNo !== '-' ? `#${row.seatNo}` : 'None'}
            </strong>
          </div>

          {/* Monthly Fee */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <span className="text-[11px]">Fee:</span>
            <strong className="text-[#192038] font-bold text-xs truncate">
              ₹{row.monthlyFee}/mo
            </strong>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <Phone size={13} className="text-[#544bec] shrink-0" />
            <a
              href={`tel:${row.phone}`}
              className="text-[#544bec] font-bold text-xs hover:underline truncate"
            >
              {row.phone}
            </a>
          </div>

          {/* Next Due */}
          <div className="flex items-center gap-1.5 text-[#6B778C]">
            <Calendar size={13} className="text-[#3366FF] shrink-0" />
            <span className="text-[11px]">Due:</span>
            <strong className="text-[#192038] font-semibold text-[11px] truncate">
              {formatDisplayDate(row.nextDueDate)}
            </strong>
          </div>
        </div>

        {/* Outstanding Balance Banner if any */}
        {row.dueAmount > 0 ? (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FFF9F2] border border-amber-200 text-xs">
            <span className="text-amber-800 font-bold text-[11px]">
              Pending Due: ₹{row.dueAmount}
            </span>
            {row.balanceDueDate && (
              <span className="text-[10px] text-amber-700">
                (by {formatDisplayDate(row.balanceDueDate)})
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between px-2.5 py-1 text-[11px] text-[#544bec] font-bold bg-[#EEF0FD]/60 rounded-lg">
            <span>✓ All dues cleared</span>
            <span>Paid: ₹{row.amountPaid}</span>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1 border-t border-[#EDF1F7]/80">
          <button
            type="button"
            onClick={() => onCollectFee(row.studentRef)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#544bec] text-white hover:bg-[#4338ca] shadow-xs cursor-pointer transition-all"
          >
            <IndianRupee size={12} />
            <span>Collect Fee</span>
          </button>

          <button
            type="button"
            onClick={() => onViewReceipt(row.studentRef, row.lastReceipt)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6B778C] hover:text-[#3366FF] bg-[#F7F9FC] border border-[#EDF1F7] cursor-pointer transition-all"
          >
            <FileText size={13} />
            <span>Receipt</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <CommonTable
      data={records}
      columns={columns}
      renderMobileCard={renderMobileCard}
      emptyMessage="No fee records found matching your search or filters."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50]}
      minWidth="960px"
    />
  );
};
