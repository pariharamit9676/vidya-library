import React, { useState } from 'react';
import { X, Download, MessageSquare, CheckCircle, Printer, FileText } from 'lucide-react';
import { formatDateOnly } from '../../utils/storage';
import { downloadReceiptPDF, shareReceiptOnWhatsApp, createReceiptPDF } from '../../utils/pdfReceiptGenerator';

export const FeeReceiptModal = ({
  isOpen,
  onClose,
  receipt,
  settings
}) => {
  if (!isOpen || !receipt) return null;

  const libraryName = settings?.libraryName || 'Vidya Library';
  const libraryAddress = settings?.address || '66W8+4FH, Gayatri Nagar, Gwalior, Madhya Pradesh 474005';
  const receiptNo = receipt.receiptNo || receipt.id || `REC-${Date.now().toString().slice(-4)}`;

  // 1. Download official A5 PDF
  const handleDownload = () => {
    downloadReceiptPDF(receipt, settings);
  };

  // 2. Share PDF on WhatsApp
  const handleWhatsApp = async () => {
    await shareReceiptOnWhatsApp(receipt, settings);
  };

  // 3. Direct Print PDF
  const handlePrint = () => {
    try {
      const doc = createReceiptPDF(receipt, settings);
      const blobUrl = doc.output('bloburl');
      const printWindow = window.open(blobUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    } catch (e) {
      console.warn('Direct print window blocked, downloading PDF instead:', e);
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-[#EDF1F7] shadow-2xl overflow-hidden my-6 transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="px-4 py-3 border-b border-[#EDF1F7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#192038] m-0 leading-tight">Payment Receipt</h3>
              <span className="text-[10px] text-[#00A97A] font-bold">Official PDF Ready</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8F9BB3] hover:text-[#192038] hover:bg-[#F7F9FC] transition-all cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Compact Slip Content */}
        <div className="p-4 space-y-3 bg-[#FCFDFE]">
          {/* Library Header */}
          <div className="text-center pb-2.5 border-b border-dashed border-[#EDF1F7]">
            <h4 className="text-sm font-black text-[#192038] m-0">{libraryName}</h4>
            <p className="text-[11px] text-[#8F9BB3] m-0 mt-0.5">{libraryAddress}</p>
          </div>

          {/* Meta Info */}
          <div className="flex justify-between items-center text-[11px] text-[#8F9BB3]">
            <span>Receipt: <strong className="text-[#192038]">{receiptNo}</strong></span>
            <span>Date: <strong className="text-[#192038]">{formatDateOnly(receipt.date)}</strong></span>
          </div>

          {/* Student Breakdown Card */}
          <div className="bg-[#F8FAFD] rounded-xl p-3 border border-[#EDF1F7] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#8F9BB3]">Student:</span>
              <strong className="text-[#192038] capitalize">{receipt.studentName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8F9BB3]">Student ID:</span>
              <span className="font-semibold text-[#192038]">{receipt.studentRefId || receipt.studentId || '-'}</span>
            </div>
            {receipt.phone && (
              <div className="flex justify-between">
                <span className="text-[#8F9BB3]">Mobile:</span>
                <span className="font-medium text-[#192038]">{receipt.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#8F9BB3]">Seat No:</span>
              <span className="font-bold text-[#00A97A]">{receipt.seatNo && receipt.seatNo !== '-' ? `Seat #${receipt.seatNo}` : 'Unassigned'}</span>
            </div>
            {receipt.seatCategory && (
              <div className="flex justify-between">
                <span className="text-[#8F9BB3]">Seat Category:</span>
                <span className="font-semibold text-[#192038]">{receipt.seatCategory}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#8F9BB3]">Plan Duration:</span>
              <span className="text-[#192038] font-medium">{receipt.plan || 'Monthly'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8F9BB3]">Payment Mode:</span>
              <span className="text-[#192038] font-semibold">{receipt.mode || 'Cash'}</span>
            </div>
            {receipt.reference && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#8F9BB3] shrink-0">Transaction Ref:</span>
                <span className="font-mono text-[#192038] text-right break-words max-w-[190px]">{receipt.reference}</span>
              </div>
            )}
            {receipt.notes && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#8F9BB3] shrink-0">Notes:</span>
                <span className="text-[#6B778C] italic text-right break-words max-w-[190px]">{receipt.notes}</span>
              </div>
            )}
            {receipt.newDueDate && (
              <div className="flex justify-between pt-1 border-t border-[#EDF1F7]">
                <span className="text-[#8F9BB3]">Next Due Date:</span>
                <strong className="text-[#00A97A]">{receipt.newDueDate}</strong>
              </div>
            )}
          </div>

          {/* Amount Paid Box */}
          <div className="p-3 bg-[#E8F8F3] border border-[#BBF7D0] rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#00A97A]">Amount Paid</span>
            <span className="text-xl font-black text-[#00A97A]">
              ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}.00
            </span>
          </div>

          {/* Remaining Due Box if Partial */}
          {Number(receipt.dueAmount || 0) > 0 && (
            <div className="p-2.5 bg-[#FFF9F2] border border-[#FFE0B2] rounded-xl flex items-center justify-between text-xs text-amber-900">
              <span className="font-bold text-amber-800">Remaining Balance:</span>
              <div className="text-right">
                <span className="font-extrabold text-amber-700">₹{receipt.dueAmount}</span>
                {receipt.balanceDueDate && (
                  <span className="block text-[10px] text-amber-600">Due: {receipt.balanceDueDate}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-3.5 bg-white border-t border-[#EDF1F7] space-y-2">
          <div className="grid grid-cols-3 gap-1.5">
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="py-2.5 px-2 rounded-xl border border-[#EDF1F7] bg-white hover:bg-[#F8FAFD] text-[#192038] font-bold text-xs inline-flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
              title="Download official PDF file"
            >
              <Download size={13} className="text-[#00A97A]" />
              <span>PDF</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-2 rounded-xl border border-[#EDF1F7] bg-white hover:bg-[#F8FAFD] text-[#192038] font-bold text-xs inline-flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={13} className="text-[#6B778C]" />
              <span>Print</span>
            </button>

            {/* WhatsApp Share PDF Button */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs inline-flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer shadow-[#25D366]/20"
              title="Send PDF Receipt on WhatsApp"
            >
              <MessageSquare size={13} />
              <span>WhatsApp</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-bold text-[#8F9BB3] hover:text-[#192038] hover:bg-[#F7F9FC] transition-all cursor-pointer"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};
