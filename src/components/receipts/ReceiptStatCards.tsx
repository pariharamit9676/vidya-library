import React from 'react';
import { FileText, IndianRupee, Banknote, Smartphone } from 'lucide-react';

interface ReceiptStatCardsProps {
  totalReceipts: number;
  totalAmountReceived: number;
  cashCollections: number;
  upiCollections: number;
  cashCount?: number;
  upiCount?: number;
}

export const ReceiptStatCards: React.FC<ReceiptStatCardsProps> = ({
  totalReceipts,
  totalAmountReceived,
  cashCollections,
  upiCollections,
  cashCount = 0,
  upiCount = 0
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Total Receipts */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#EAF2FF] text-[#3366FF] flex items-center justify-center shrink-0 shadow-2xs">
          <FileText size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Total Receipts
          </span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight leading-tight mt-0.5 truncate">
            {totalReceipts}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#3366FF] truncate mt-0.5">
            Issued vouchers
          </div>
        </div>
      </div>

      {/* 2. Total Amount Received */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center shrink-0 shadow-2xs">
          <IndianRupee size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Total Revenue
          </span>
          <div className="text-base sm:text-2xl font-black text-[#192038] tracking-tight leading-tight mt-0.5 truncate">
            ₹{totalAmountReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-[#00A97A] truncate mt-0.5">
            Collected sum
          </div>
        </div>
      </div>

      {/* 3. Cash Collections */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#FFF9F2] text-[#FFAA00] flex items-center justify-center shrink-0 shadow-2xs">
          <Banknote size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            Cash Amount
          </span>
          <div className="text-base sm:text-2xl font-black text-[#FFAA00] tracking-tight leading-tight mt-0.5 truncate">
            ₹{cashCollections.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 truncate mt-0.5">
            {cashCount} cash voucher{cashCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* 4. UPI Collections */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EDF1F7] shadow-xs flex items-center gap-2.5 sm:gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0 shadow-2xs">
          <Smartphone size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F9BB3] block truncate">
            UPI Transfers
          </span>
          <div className="text-base sm:text-2xl font-black text-[#7E22CE] tracking-tight leading-tight mt-0.5 truncate">
            ₹{upiCollections.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-purple-700 truncate mt-0.5">
            {upiCount} online transfer{upiCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>
    </div>
  );
};
