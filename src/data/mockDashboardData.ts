import {
  Seat,
  UpcomingFee,
  RecentStudent,
  RecentPayment,
  MonthlyCollectionData
} from '../types/dashboard';

export const STATS_DATA = {
  totalStudents: {
    count: 248,
    change: "+12 this month",
    isPositive: true
  },
  totalSeats: {
    count: 200,
    subtitle: "186 occupied • 14 available"
  },
  monthlyCollection: {
    amount: "₹1,24,500",
    change: "+18% from last month",
    isPositive: true
  },
  pendingDues: {
    count: 32,
    amount: "₹25,600 pending"
  }
};

export const MONTHLY_COLLECTION_CHART: MonthlyCollectionData[] = [
  { month: 'Jan', collection: 70000 },
  { month: 'Feb', collection: 85000 },
  { month: 'Mar', collection: 92000 },
  { month: 'Apr', collection: 110000 },
  { month: 'May', collection: 105000 },
  { month: 'Jun', collection: 118000 },
  { month: 'Jul', collection: 98000 },
  { month: 'Aug', collection: 115000 },
  { month: 'Sep', collection: 112000 },
  { month: 'Oct', collection: 124500, isCurrent: true },
  { month: 'Nov', collection: 65000 },
  { month: 'Dec', collection: 78000 }
];

export const SEAT_OCCUPANCY_DATA = [
  { name: 'Occupied', value: 186, percentage: '93%', color: '#544bec' },
  { name: 'Available', value: 14, percentage: '7%', color: '#B2EBD9' },
  { name: 'Maintenance', value: 0, percentage: '0%', color: '#FA5252' }
];

export const ATTENDANCE_DATA = [
  { name: 'Present', value: 186, percentage: '75%', color: '#544bec' },
  { name: 'Absent', value: 54, percentage: '22%', color: '#A0E3CD' },
  { name: 'Late', value: 8, percentage: '3%', color: '#F59F00' }
];

// 30 numbered seats mapped exactly like the reference image
// Row 1: 1 (green), 2 (green), 3 (gray), 4 (green), 5 (green), 6 (green), 7 (yellow), 8 (green), 9 (green), 10 (gray)
// Row 2: 11 (green), 12 (green), 13 (gray), 14 (green), 15 (green), 16 (green), 17 (yellow), 18 (green), 19 (green), 20 (gray)
// Row 3: 21 (green), 22 (green), 23 (gray), 24 (green), 25 (green), 26 (red), 27 (green), 28 (green), 29 (green), 30 (gray)
const STATUS_ARRAY: ('occupied' | 'available' | 'reserved' | 'maintenance')[] = [
  // 1 to 10
  'occupied', 'occupied', 'available', 'occupied', 'occupied', 'occupied', 'reserved', 'occupied', 'occupied', 'available',
  // 11 to 20
  'occupied', 'occupied', 'available', 'occupied', 'occupied', 'occupied', 'reserved', 'occupied', 'occupied', 'available',
  // 21 to 30
  'occupied', 'occupied', 'available', 'occupied', 'occupied', 'maintenance', 'occupied', 'occupied', 'occupied', 'available'
];

export const MOCK_SEATS: Seat[] = Array.from({ length: 30 }, (_, i) => {
  const seatNum = i + 1;
  const status = STATUS_ARRAY[i];

  let assignedStudent = undefined;
  if (status === 'occupied') {
    assignedStudent = {
      id: `STU-0${seatNum}`,
      name: ['Rahul Sharma', 'Priya Verma', 'Aman Singh', 'Neha Gupta', 'Rohit Yadav', 'Sahil Khan', 'Kritika Jain', 'Vivek Mishra'][i % 8],
      phone: `98765432${(10 + i).toString().slice(-2)}`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + i}?w=100&auto=format&fit=crop&q=60`,
      plan: 'Full Day (24/7 Access)',
      bookingPeriod: {
        start: '01 Oct 2026',
        end: '31 Oct 2026'
      },
      isTemporaryReservation: false
    };
  } else if (status === 'reserved') {
    assignedStudent = {
      id: `STU-RES-${seatNum}`,
      name: ['Tanmay Joshi', 'Sanya Kapoor'][i % 2],
      phone: '9988776655',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      plan: 'Morning Shift (6 AM - 2 PM)',
      bookingPeriod: {
        start: '16 Oct 2026',
        end: '18 Oct 2026'
      },
      isTemporaryReservation: true
    };
  }

  return {
    id: `seat-${seatNum}`,
    seatNumber: seatNum,
    label: `Seat ${seatNum}`,
    floor: 1,
    status: status,
    assignedStudent,
    currentAvailability: status === 'available',
    futureMonthlyAvailability: {
      'Nov 2026': status !== 'occupied' || i % 3 === 0,
      'Dec 2026': true,
      'Jan 2027': true
    }
  };
});

export const UPCOMING_FEES_DATA: UpcomingFee[] = [
  {
    id: 'fee-1',
    studentName: 'Rahul Sharma',
    studentId: '#STU001',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    seatNo: 'A12',
    plan: 'Monthly',
    dueDate: '18 Oct 2026',
    amount: 800,
    status: 'Due Soon'
  },
  {
    id: 'fee-2',
    studentName: 'Priya Verma',
    studentId: '#STU002',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    seatNo: 'B05',
    plan: 'Monthly',
    dueDate: '20 Oct 2026',
    amount: 1000,
    status: 'Due Soon'
  },
  {
    id: 'fee-3',
    studentName: 'Aman Singh',
    studentId: '#STU003',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
    seatNo: 'A08',
    plan: 'Monthly',
    dueDate: '15 Oct 2026',
    amount: 800,
    status: 'Overdue'
  },
  {
    id: 'fee-4',
    studentName: 'Neha Gupta',
    studentId: '#STU004',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
    seatNo: 'C14',
    plan: 'Monthly',
    dueDate: '22 Oct 2026',
    amount: 800,
    status: 'Due Soon'
  },
  {
    id: 'fee-5',
    studentName: 'Rohit Yadav',
    studentId: '#STU005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
    seatNo: 'A03',
    plan: 'Monthly',
    dueDate: '25 Oct 2026',
    amount: 1000,
    status: 'Upcoming'
  }
];

export const RECENT_STUDENTS_DATA: RecentStudent[] = [
  {
    id: 'rec-1',
    name: 'Sahil Khan',
    phone: '9876543210',
    seatNo: 'B10',
    admissionDate: '15 Oct 2026',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'
  },
  {
    id: 'rec-2',
    name: 'Kritika Jain',
    phone: '9123456789',
    seatNo: 'A07',
    admissionDate: '14 Oct 2026',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60'
  },
  {
    id: 'rec-3',
    name: 'Vivek Mishra',
    phone: '9988776655',
    seatNo: 'C02',
    admissionDate: '12 Oct 2026',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=60'
  }
];

export const RECENT_PAYMENTS_DATA: RecentPayment[] = [
  {
    id: 'pay-1',
    studentName: 'Rahul Sharma',
    seatNo: 'A12',
    amount: 800,
    paymentMode: 'UPI',
    date: '15 Oct 2026',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    receiptNumber: 'RCPT-2026-001'
  },
  {
    id: 'pay-2',
    studentName: 'Priya Verma',
    seatNo: 'B05',
    amount: 1000,
    paymentMode: 'Cash',
    date: '15 Oct 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    receiptNumber: 'RCPT-2026-002'
  },
  {
    id: 'pay-3',
    studentName: 'Aman Singh',
    seatNo: 'A08',
    amount: 800,
    paymentMode: 'UPI',
    date: '14 Oct 2026',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
    receiptNumber: 'RCPT-2026-003'
  }
];
