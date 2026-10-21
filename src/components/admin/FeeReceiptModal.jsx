import React, { useState, useEffect } from 'react';
import { X, Download, MessageSquare, CheckCircle, Printer, FileText, Edit2, Check, Plus } from 'lucide-react';
import { formatDateOnly } from '../../utils/storage';
import { downloadReceiptPDF, shareReceiptOnWhatsApp, createReceiptPDF } from '../../utils/pdfReceiptGenerator';

export const FeeReceiptModal = ({
  isOpen,
  onClose,
  receipt,
  settings,
  isStudentView = false
}) => {
  if (!isOpen || !receipt) return null;

  const libraryName = settings?.libraryName || 'Vidya Library';
  const libraryAddress = settings?.address || '66W8+4FH, Gayatri Nagar, Gwalior, Madhya Pradesh 474005';
  const receiptNo = receipt.receiptNo || receipt.id || `REC-${Date.now().toString().slice(-4)}`;

  // Admin preference: toggle whether to include remaining due on receipt
  const [includeRemainingDue, setIncludeRemainingDue] = useState(() => {
    const saved = localStorage.getItem('viya_receipt_show_due');
    return saved !== null ? saved === 'true' : true;
  });

  // Note state for receipt (with inline edit support)
  const [currentNote, setCurrentNote] = useState(receipt.notes || receipt.remarks || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    const initialNote = receipt.notes || receipt.remarks || '';
    setCurrentNote(initialNote);
    setNoteInput(initialNote);
    setIsEditingNote(false);
  }, [receipt]);

  const handleSaveNote = () => {
    const trimmed = noteInput.trim();
    setCurrentNote(trimmed);
    receipt.notes = trimmed;
    receipt.remarks = trimmed;
    setIsEditingNote(false);

    try {
      const stored = localStorage.getItem('viya_library_payments');
      if (stored) {
        const payments = JSON.parse(stored);
        const p = payments.find((x) => x.receiptNo === receiptNo || x.id === receipt.id);
        if (p) {
          p.notes = trimmed;
          localStorage.setItem('viya_library_payments', JSON.stringify(payments));
        }
      }
    } catch {}

    try {
      const storedStudents = localStorage.getItem('viya_library_students');
      if (storedStudents) {
        const students = JSON.parse(storedStudents);
        const stu = students.find((x) => x.id === receipt.studentId || x.studentId === receipt.studentId || x.name === receipt.studentName);
        if (stu) {
          stu.notes = trimmed;
          if (Array.isArray(stu.feeHistory)) {
            const h = stu.feeHistory.find((x) => x.receiptNo === receiptNo || x.id === receipt.id);
            if (h) h.notes = trimmed;
          }
          localStorage.setItem('viya_library_students', JSON.stringify(students));
        }
      }
    } catch {}
  };

  // 1. Download official A5 PDF
  const handleDownload = () => {
    downloadReceiptPDF({ ...receipt, notes: currentNote }, settings, { showRemainingDue: includeRemainingDue });
  };

  // 2. Share PDF on WhatsApp
  const handleWhatsApp = async () => {
    await shareReceiptOnWhatsApp({ ...receipt, notes: currentNote }, settings, { showRemainingDue: includeRemainingDue });
  };

  // 3. Direct Print PDF
  const handlePrint = () => {
    try {
      const doc = createReceiptPDF({ ...receipt, notes: currentNote }, settings, { showRemainingDue: includeRemainingDue });
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
            <div className="w-7 h-7 rounded-lg bg-[#EEF0FD] text-[#544bec] flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#192038] m-0 leading-tight">Payment Receipt</h3>
              <span className="text-[10px] text-[#544bec] font-bold">Official PDF Ready</span>
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
              <span className="font-bold text-[#544bec]">{receipt.seatNo && receipt.seatNo !== '-' ? `Seat #${receipt.seatNo}` : 'Unassigned'}</span>
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
            {/* Note / Remarks Row (Always visible with inline edit) */}
            <div className="pt-1.5 border-t border-[#EDF1F7] text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#8F9BB3] shrink-0 font-medium flex items-center gap-1 mt-0.5">
                  <FileText size={12} className="text-[#544bec]" />
                  <span>Note / Remarks:</span>
                </span>

                {!isEditingNote ? (
                  <div className="flex items-center gap-1.5 justify-end text-right min-w-0 max-w-[210px]">
                    {currentNote ? (
                      <span className="text-[#192038] font-semibold break-words bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
                        {currentNote}
                      </span>
                    ) : (
                      <span className="text-[#8F9BB3] text-[11px] italic">No note added</span>
                    )}
                    {!isStudentView && (
                      <button
                        type="button"
                        onClick={() => {
                          setNoteInput(currentNote);
                          setIsEditingNote(true);
                        }}
                        className="text-[11px] text-[#544bec] hover:text-[#4338ca] font-bold p-1 rounded-md hover:bg-[#EEF0FD] transition-colors cursor-pointer shrink-0"
                        title={currentNote ? 'Edit note' : 'Add note'}
                      >
                        {currentNote ? <Edit2 size={12} /> : '+ Add Note'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        autoFocus
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Add note or remarks..."
                        className="w-full px-2 py-1 text-xs font-medium bg-white border border-[#544bec] rounded-lg focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleSaveNote}
                        className="p-1 rounded-lg bg-[#544bec] text-white hover:bg-[#4338ca] cursor-pointer shrink-0"
                        title="Save note"
                      >
                        <Check size={13} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingNote(false)}
                        className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer shrink-0"
                        title="Cancel"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Quick suggestion tags when adding note */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {['Paid via UPI', 'Cash received', 'Balance promised soon'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNoteInput((prev) => (prev ? `${prev}, ${tag}` : tag))}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 hover:bg-[#EEF0FD] hover:text-[#544bec] cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {receipt.newDueDate && (
              <div className="flex justify-between pt-1 border-t border-[#EDF1F7]">
                <span className="text-[#8F9BB3]">Next Due Date:</span>
                <strong className="text-[#544bec]">{receipt.newDueDate}</strong>
              </div>
            )}
          </div>

          {/* Amount Paid Box */}
          <div className="p-3 bg-[#EEF0FD] border border-[#BBF7D0] rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#544bec]">Amount Paid</span>
            <span className="text-xl font-black text-[#544bec]">
              ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}.00
            </span>
          </div>

          {/* Remaining Due Box with Admin Toggle */}
          {Number(receipt.dueAmount || 0) > 0 && (
            <div className="space-y-1.5 pt-0.5">
              {!isStudentView && (
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100/90 border border-slate-200 rounded-xl text-[11px]">
                  <span className="font-bold text-slate-700">Include Remaining Due on Receipt:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeRemainingDue}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setIncludeRemainingDue(val);
                        localStorage.setItem('viya_receipt_show_due', String(val));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#544bec]"></div>
                  </label>
                </div>
              )}

              {includeRemainingDue ? (
                <div className="p-2.5 bg-[#FFF9F2] border border-[#FFE0B2] rounded-xl flex items-center justify-between text-xs text-amber-900 transition-all">
                  <span className="font-bold text-amber-800">Remaining Balance:</span>
                  <div className="text-right">
                    <span className="font-extrabold text-amber-700">₹{receipt.dueAmount}</span>
                    {receipt.balanceDueDate && (
                      <span className="block text-[10px] text-amber-600">Due: {receipt.balanceDueDate}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-2.5 py-1.5 bg-slate-100/70 border border-dashed border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
                  <span>Remaining balance (₹{receipt.dueAmount}) omitted from receipt</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIncludeRemainingDue(true);
                      localStorage.setItem('viya_receipt_show_due', 'true');
                    }}
                    className="text-[#544bec] font-bold underline cursor-pointer"
                  >
                    Show
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-3.5 bg-white border-t border-[#EDF1F7] space-y-2">
          {isStudentView ? (
            /* Student View: Only Download PDF (Print & WhatsApp removed) */
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-2.5 px-4 rounded-xl bg-[#544bec] hover:bg-[#4338ca] text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-[#544bec]/25 cursor-pointer"
              title="Download official PDF receipt"
            >
              <Download size={15} />
              <span>Download Receipt (PDF)</span>
            </button>
          ) : (
            /* Admin View: PDF, Print, WhatsApp */
            <div className="grid grid-cols-3 gap-1.5">
              {/* Download PDF Button */}
              <button
                type="button"
                onClick={handleDownload}
                className="py-2.5 px-2 rounded-xl border border-[#EDF1F7] bg-white hover:bg-[#F8FAFD] text-[#192038] font-bold text-xs inline-flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                title="Download official PDF file"
              >
                <Download size={13} className="text-[#544bec]" />
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
          )}

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
