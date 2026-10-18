export type SeatCategory = 'Premium' | 'Locker' | 'Normal';
export type SeatStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface AssignedStudentInfo {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  email?: string;
  admissionDate: string;
  nextFeeDueDate: string;
  avatar?: string;
  plan: string;
}

export interface SeatGridCell {
  id: string;
  row: number; // 1-indexed
  col: number; // 1-indexed
  isSeat: boolean; // false = empty space / aisle
  seatNumber: number | null; // strictly numeric: 1, 2, 3, 4, 5...
  category: SeatCategory;
  status: SeatStatus;
  monthlyFee: number;
  addedOn: string;
  assignedStudent: AssignedStudentInfo | null;
}

export interface CategoryRateConfig {
  category: SeatCategory;
  rate: number;
  description: string;
  totalSeats: number;
}
