export type SeatStatus = 'occupied' | 'available' | 'reserved' | 'maintenance';

export interface AssignedStudent {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  plan: string;
  bookingPeriod: {
    start: string;
    end: string;
  };
  isTemporaryReservation: boolean; // distinguish temporary vs confirmed
  isCheckedIn?: boolean;
  currentCheckInTime?: string | null;
}

export interface Seat {
  id: string;
  seatNumber: number;
  label: string;
  floor: number;
  status: SeatStatus;
  assignedStudent?: AssignedStudent;
  currentAvailability: boolean;
  futureMonthlyAvailability: {
    [monthYear: string]: boolean; // e.g. "Nov 2026": true, "Dec 2026": false
  };
}

export interface UpcomingFee {
  id: string;
  studentName: string;
  studentId: string;
  avatar: string;
  seatNo: string;
  plan: string;
  dueDate: string;
  amount: number;
  status: 'Due Soon' | 'Overdue' | 'Upcoming';
}

export interface RecentStudent {
  id: string;
  name: string;
  phone: string;
  seatNo: string;
  admissionDate: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

export interface RecentPayment {
  id: string;
  studentName: string;
  seatNo: string;
  amount: number;
  paymentMode: 'UPI' | 'Cash' | 'Card';
  date: string;
  avatar: string;
  receiptNumber: string;
}

export interface MonthlyCollectionData {
  month: string;
  collection: number;
  isCurrent?: boolean;
}
