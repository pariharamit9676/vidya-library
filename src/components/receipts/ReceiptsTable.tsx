import React from 'react';
import { Eye, FileText, IndianRupee, Calendar } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateFormatter';
import { CommonTable, CommonTableColumn } from '../common/CommonTable';

export interface ReceiptRecordItem {
  id: string;
  receiptNo: string;
  date: string;
  studentName: string;
  studentId: string;
  phone?: string;
  seatNo: string;
  seatCategory?: string;
  mode: string;
  amount: number;
  plan?: string;
  newDueDate?: string;
  dueAmount?: number;
  balanceDueDate?: string;
  reference?: string;
  notes?: string;
  createdAt?: string;
}

interface ReceiptsTableProps {
  receipts: ReceiptRecordItem[];
  onViewReceipt: (receipt: ReceiptRecordItem) => void;
}

export const formatNumericSeatNumber = (seat?: string | number | null): string => {
  if (!seat) return '-';
  const str = String(seat).trim();
  if (str === '-' || str.toLowerCase() === 'unassigned' || str.toLowerCase() === 'null') return '-';
  const match = str.match(/\d+/);
  return match ? match[0] : '-';
};

export const ReceiptsTable: React.FC<ReceiptsTableProps> = ({
  receipts,
  onViewReceipt
}) => {
  const getPaymentModeBadge = (mode: string = 'Cash') => {
    const clean = mode.trim();
    if (clean === 'UPI') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">
          UPI
        </span>
      );
    }
    if (clean === 'Cash') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF0FD] text-[#544bec] border border-[#BBF7D0]">
          Cash
        </span>
      );
    }
    if (clean === 'Bank Transfer' || clean === 'Card' || clean === 'Net Banking') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FF] text-[#3366FF] border border-[#D0E2FF]">
          {clean}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F5F7] text-[#6B778C] border border-[#E4E9F2]">
        {clean || 'Other'}
      </span>
    );
  };

  const columns: CommonTableColumn<ReceiptRecordItem>[] = [
    {
      header: '#',
      align: 'center',
      width: '40px',
      render: (_row, idx) => (
        <span className="text-[#8F9BB3] font-medium text-[11px]">{idx + 1}</span>
      )
    },
    {
      header: 'Receipt Number',
      render: (rc) => (
        <div className="flex items-center gap-1.5">
          <FileText size={13} className="text-[#544bec] shrink-0" />
          <span className="font-mono font-bold text-[#192038] tracking-tight">{rc.receiptNo}</span>
        </div>
      )
    },
    {
      header: 'Payment Date',
      render: (rc) => (
        <span className="whitespace-nowrap font-medium text-[#192038]">{formatDisplayDate(rc.date)}</span>
      )
    },
    {
      header: 'Student Name',
      render: (rc) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#544bec] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {(rc.studentName || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-[#192038] block truncate">{rc.studentName || 'Student'}</span>
            {rc.phone && <span className="text-[10px] text-[#8F9BB3] block truncate">{rc.phone}</span>}
          </div>
        </div>
      )
    },
    {
      header: 'Student ID',
      render: (rc) => (
        <span className="font-mono font-medium text-[#6B778C] text-[11px] whitespace-nowrap">
          {rc.studentId || '-'}
        </span>
      )
    },
    {
      header: 'Seat #',
      align: 'center',
      render: (rc) => {
        const num = formatNumericSeatNumber(rc.seatNo);
        return num !== '-' ? (
          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#F7F9FC] border border-[#EDF1F7] text-xs font-bold text-[#192038]">
            #{num}
          </span>
        ) : (
          <span className="text-[#8F9BB3] font-normal">-</span>
        );
      }
    },
    {
      header: 'Payment Method',
      align: 'center',
      render: (rc) => getPaymentModeBadge(rc.mode)
    },
    {
      header: 'Amount Received',
      align: 'right',
      render: (rc) => (
        <span className="font-black text-[#544bec] text-sm whitespace-nowrap">
          ₹{Number(rc.amount || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'center',
      render: (rc) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onViewReceipt(rc)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F8FAFD] hover:text-[#544bec] hover:border-[#544bec]/40 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="View Receipt"
          >
            <Eye size={13} className="text-[#544bec]" />
            <span>View</span>
          </button>
        </div>
      )
    }
  ];

  // Mobile card renderer for Receipts
  const renderMobileCard = (rc: ReceiptRecordItem) => {
    const numericSeat = formatNumericSeatNumber(rc.seatNo);

    return (
      <div className="p-3.5 sm:p-4 flex flex-col gap-2.5 transition-colors hover:bg-[#F9FBFC]">
        {/* Header: Receipt # + Date + Amount Badge */}
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <FileText size={14} className="text-[#544bec] shrink-0" />
              <span className="font-mono font-bold text-xs text-[#192038]">{rc.receiptNo}</span>
            </div>
            <div className="text-[11px] text-[#8F9BB3] mt-0.5 flex items-center gap-1">
              <Calendar size={11} />
              <span>{formatDisplayDate(rc.date)}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-[#544bec] block">
              ₹{Number(rc.amount || 0).toLocaleString('en-IN')}
            </span>
            <div className="mt-0.5">{getPaymentModeBadge(rc.mode)}</div>
          </div>
        </div>

        {/* Details row: Student info & Seat */}
        <div className="flex items-center justify-between p-2.5 bg-[#F8FAFD] rounded-xl text-xs border border-[#EDF1F7]">
          <div>
            <span className="font-extrabold text-[#192038] block text-xs">{rc.studentName || 'Student'}</span>
            <span className="text-[10px] font-mono text-[#8F9BB3]">{rc.studentId || '-'}</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#8F9BB3] block">Seat</span>
            <span className="font-bold text-xs text-[#192038]">
              {numericSeat !== '-' ? `#${numericSeat}` : 'None'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-1 border-t border-[#EDF1F7]/80">
          <button
            type="button"
            onClick={() => onViewReceipt(rc)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EEF0FD] text-[#544bec] hover:bg-[#d5f3e9] transition-colors cursor-pointer"
          >
            <Eye size={13} />
            <span>View Receipt</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <CommonTable
      data={receipts}
      columns={columns}
      renderMobileCard={renderMobileCard}
      emptyMessage="No payment receipts found matching your search or filters."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50]}
      minWidth="920px"
    />
  );
};
