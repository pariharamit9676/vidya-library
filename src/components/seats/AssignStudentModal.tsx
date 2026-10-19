import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, User, Phone, AlertCircle } from 'lucide-react';
import { SeatGridCell } from '../../types/seatManagement';
import { useStudents } from '../../services/useLibraryQueries';
import { formatDisplayDate } from '../../utils/dateFormatter';

interface AssignStudentModalProps {
  isOpen: boolean;
  cell: SeatGridCell | null;
  onClose: () => void;
  onAssign: (cellId: string, studentData: any) => void;
  existingAssignments: Record<string, string>; // studentId -> seatId
}

export const AssignStudentModal: React.FC<AssignStudentModalProps> = ({
  isOpen,
  cell,
  onClose,
  onAssign,
  existingAssignments
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const { data: apiStudents } = useStudents();

  if (!isOpen || !cell) return null;

  const studentsList = Array.isArray(apiStudents) ? apiStudents : [];

  // Filter available Regular students who do not currently occupy any other seat
  // NOTE: Demo students and students who already have a seat are strictly excluded!
  const eligibleStudents = studentsList.filter((s: any) => {
    const hasSeatInRecord = Boolean(s.seatNo && s.seatNo !== '-' && s.seatNo !== 'None' && s.seatNo !== 'Unassigned');
    const isAlreadyAssigned = Boolean(existingAssignments[s.id] || existingAssignments[s._id]) || hasSeatInRecord;
    const isDemo = s.studentType === 'Demo' || s.plan?.includes('Demo');
    return !isAlreadyAssigned && !isDemo;
  });

  const selectedStudent = eligibleStudents.find((s: any) => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    onAssign(cell.id, {
      id: selectedStudent.id,
      studentId: selectedStudent.studentId,
      name: selectedStudent.name,
      phone: selectedStudent.phone,
      email: selectedStudent.email,
      admissionDate: selectedStudent.admissionDate,
      nextFeeDueDate: selectedStudent.nextDueDate,
      avatar: selectedStudent.avatar,
      plan: 'Monthly'
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#EDF1F7] shadow-2xl overflow-hidden animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EDF1F7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EEF0FD] text-[#544bec] flex items-center justify-center">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#192038] m-0">
                Assign Seat {cell.seatNumber}
              </h3>
              <span className="text-xs text-[#8F9BB3]">
                {cell.category} • ₹{cell.monthlyFee}/month
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F9BB3] hover:text-[#192038] rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#192038] block mb-1.5">
              Select Regular Student <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all cursor-pointer"
            >
              <option value="">-- Choose student --</option>
              {eligibleStudents.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.studentId}) • {st.phone}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-[#8F9BB3] mt-1 block">
              Only Regular students without active seat assignments are shown. Demo trial students cannot be assigned seats.
            </span>
          </div>

          {/* Selected Student Preview Card */}
          {selectedStudent && (
            <div className="p-3 bg-[#EEF0FD] border border-[#544bec]/30 rounded-xl text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#EDF1F7]"
                />
                <div>
                  <strong className="text-[#192038] block">{selectedStudent.name}</strong>
                  <span className="text-[11px] text-[#544bec] font-medium">
                    {selectedStudent.studentId} • {selectedStudent.phone}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-[#8F9BB3] pt-1 border-t border-[#544bec]/20 flex items-center justify-between">
                <span>Admission: {formatDisplayDate(selectedStudent.admissionDate)}</span>
                <span>Due: {formatDisplayDate(selectedStudent.nextDueDate)}</span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EDF1F7] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EDF1F7] text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedStudentId}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold text-white transition-all shadow-xs ${
                selectedStudentId
                  ? 'bg-[#544bec] hover:bg-[#4338ca] cursor-pointer shadow-[#544bec]/20'
                  : 'bg-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
