import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { feeService } from '../../services/api';
import { FeeReceiptModal } from '../admin/FeeReceiptModal';
import { CommonTable, CommonTableColumn } from '../common/CommonTable';

export const RecentPaymentsTable: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPayments = async () => {
      try {
        const res = await feeService.getReceipts();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setPayments(res.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load recent payments:', err);
      }
    };
    fetchPayments();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns: CommonTableColumn<any>[] = [
    {
      header: 'Student Name',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#F3EBF9] text-[#9B51E0] font-bold text-xs flex items-center justify-center shrink-0">
            {(item.studentName || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-[#192038] capitalize block">{item.studentName}</span>
            <span className="text-[10px] text-[#8F9BB3] font-mono">{item.receiptNo}</span>
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
      header: 'Amount',
      render: (item) => (
        <span className="font-bold text-[#192038]">
          ₹{(Number(item.amount) || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Mode',
      render: (item) => (
        <span className="text-[#6B778C] font-medium">{item.mode || 'Cash'}</span>
      )
    },
    {
      header: 'Date',
      render: (item) => (
        <span className="text-[#192038] font-medium">{item.date}</span>
      )
    },
    {
      header: 'Receipt',
      align: 'right',
      render: (item) => (
        <button
          onClick={() => setSelectedReceipt(item)}
          className="p-1.5 rounded-lg text-[#6B778C] hover:text-[#00A97A] hover:bg-[#E8F8F3] transition-colors cursor-pointer bg-transparent border-none inline-flex items-center justify-center"
          title={`View Receipt ${item.receiptNo}`}
        >
          <FileText size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDF1F7] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-[#192038] m-0">
          Recent Payments
        </h3>
        <button
          onClick={() => navigate('/admin/receipts')}
          className="text-xs font-bold text-[#00A97A] hover:underline cursor-pointer bg-transparent border-0"
        >
          View All
        </button>
      </div>

      {/* Common Table */}
      <CommonTable
        data={payments}
        columns={columns}
        pagination={false}
        emptyMessage="No recent payments recorded."
        minWidth="600px"
        className="border-0 shadow-none rounded-none"
        renderMobileCard={(item) => (
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F3EBF9] text-[#9B51E0] font-bold text-xs flex items-center justify-center shrink-0">
                {(item.studentName || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-xs text-[#192038] capitalize">{item.studentName}</div>
                <div className="text-[10px] text-[#8F9BB3]">
                  {item.mode || 'Cash'} • {item.date}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#192038]">₹{item.amount}</span>
              <button
                onClick={() => setSelectedReceipt(item)}
                className="p-1 rounded-lg text-[#6B778C] hover:text-[#00A97A] hover:bg-[#E8F8F3] transition-colors cursor-pointer"
              >
                <FileText size={15} />
              </button>
            </div>
          </div>
        )}
      />

      {/* Fee Receipt Preview Modal */}
      {selectedReceipt && (
        <FeeReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={{
            id: selectedReceipt.receiptNo || selectedReceipt.id,
            receiptNo: selectedReceipt.receiptNo || selectedReceipt.id,
            studentName: selectedReceipt.studentName || 'Student',
            studentId: selectedReceipt.studentId || selectedReceipt.studentRefId || '-',
            studentRefId: selectedReceipt.studentRefId || selectedReceipt.studentId || '-',
            phone: selectedReceipt.phone || '',
            seatNo: selectedReceipt.seatNo,
            seatCategory: selectedReceipt.seatCategory || 'Normal',
            plan: selectedReceipt.plan || 'Monthly',
            shift: 'Full Day (24/7)',
            amount: selectedReceipt.amount,
            mode: selectedReceipt.mode || 'Cash',
            date: selectedReceipt.date,
            newDueDate: selectedReceipt.newDueDate || selectedReceipt.nextDueDate || '',
            dueAmount: selectedReceipt.dueAmount || 0,
            balanceDueDate: selectedReceipt.balanceDueDate || '',
            remarks: 'Monthly library membership fee'
          }}
          settings={{
            libraryName: 'Vidya Library',
            address: 'Main Reading Hall, Sector 14, New Delhi',
            phone: '+91 98765 43210',
            upiId: 'vidyalibrary@upi'
          }}
        />
      )}
    </div>
  );
};
