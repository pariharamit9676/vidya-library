export type StudentStatus = 'Active' | 'Demo' | 'Due Soon' | 'Overdue' | 'Inactive';

export interface StudentPaymentRecord {
  id: string;
  receiptNo: string;
  date: string;
  amount: number;
  mode: 'UPI' | 'Cash' | 'Card';
  status: 'Paid';
  plan: string;
}

export interface StudentAttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
}

export interface StudentRecord {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  studentType?: 'Regular' | 'Demo';
  seatNo: string;
  seatCategory?: string;
  category?: string;
  plan: string;
  planAmount: number;
  planMonths?: number;
  paidAmount?: number;
  dueAmount?: number;
  balanceDueDate?: string;
  admissionDate: string;
  nextDueDate: string;
  nextFeeDueDate?: string;
  status: StudentStatus;
  avatar: string;
  shift?: string;
  emergencyContact?: string;
  paymentHistory?: StudentPaymentRecord[];
  attendanceHistory?: StudentAttendanceRecord[];
}

export interface StudentFilterOptions {
  search: string;
  status: string;
  plan: string;
  seat: string;
}
