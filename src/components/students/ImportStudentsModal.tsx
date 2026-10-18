import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (count: number) => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent =
      'Name,Phone,SeatNo,StudentType,Plan,Amount,AdmissionDate\n' +
      'Rahul Verma,9876543210,12,Regular,Monthly,800,15 Oct 2026\n' +
      'Priya Sharma,9123456789,15,Regular,Monthly,800,16 Oct 2026\n' +
      'Aman Gupta,9988776655,-,Demo,Demo (3-Day Trial),0,17 Oct 2026\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (file: File | null) => {
    setErrorMsg('');
    if (!file) return;

    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const isExtensionValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isExtensionValid) {
      setErrorMsg('Please select a valid CSV (.csv) or Excel (.xlsx, .xls) file.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMsg('Please select a file to import.');
      return;
    }

    setIsProcessing(true);
    // Simulate parsing and importing
    setTimeout(() => {
      setIsProcessing(false);
      onImportSuccess?.(1);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-100 shadow-2xl p-5 sm:p-6 pb-8 sm:pb-6 relative flex flex-col gap-5 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center shrink-0">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#192038] tracking-tight m-0">
                Import Students
              </h3>
              <p className="text-xs text-[#8F9BB3] font-medium m-0 mt-0.5">
                Bulk upload students via CSV or Excel file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Template Download Tip */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet size={18} className="text-[#00A97A] shrink-0" />
            <span className="text-xs text-[#192038] font-medium">
              Need the correct column structure?
            </span>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-[#192038] transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <Download size={13} className="text-[#00A97A]" />
            <span>Download Template</span>
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#00A97A] bg-[#E8F8F3]/50 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-400 bg-emerald-50/40'
              : 'border-slate-200 hover:border-[#00A97A] hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />

          {selectedFile ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00A97A] flex items-center justify-center">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#192038] m-0 break-all">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#8F9BB3] mt-1 m-0">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop to change
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#192038] m-0">
                  Tap to upload file from phone or computer
                </p>
                <p className="text-xs text-[#8F9BB3] mt-1 m-0">
                  Supports .csv, .xlsx, .xls (up to 10MB)
                </p>
              </div>
            </>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 mt-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#192038] font-bold text-xs sm:text-sm transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isProcessing}
            className={`w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white transition-all cursor-pointer text-center ${
              !selectedFile || isProcessing
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#00A97A] hover:bg-[#008f67] shadow-lg shadow-[#00A97A]/30'
            }`}
          >
            {isProcessing ? 'Importing...' : 'Upload & Import Records'}
          </button>
        </div>
      </div>
    </div>
  );
};
