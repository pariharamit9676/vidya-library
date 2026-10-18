import { SeatGridCell, CategoryRateConfig } from '../types/seatManagement';

export const initialCategoryRates: Record<string, CategoryRateConfig> = {
  Premium: {
    category: 'Premium',
    rate: 800,
    description: 'Spacious & comfortable desks with priority power outlets',
    totalSeats: 12
  },
  Locker: {
    category: 'Locker',
    rate: 700,
    description: 'Personal secure locker attached to study desk',
    totalSeats: 16
  },
  Normal: {
    category: 'Normal',
    rate: 600,
    description: 'Standard quiet study carrel',
    totalSeats: 20
  }
};

// Initial 6 rows x 8 columns layout (48 real seats + 2 aisle/empty cells)
export const initialSeatCells: SeatGridCell[] = [
  // ROW 1
  {
    id: 'cell-1-1', row: 1, col: 1, isSeat: true, seatNumber: 1,
    category: 'Normal', status: 'Available', monthlyFee: 600, addedOn: '10 Aug 2026, 09:00 AM', assignedStudent: null
  },
  {
    id: 'cell-1-2', row: 1, col: 2, isSeat: true, seatNumber: 2,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '10 Aug 2026, 09:15 AM',
    assignedStudent: { id: 's2', studentId: '#STU002', name: 'Priya Verma', phone: '9123456789', admissionDate: '10 Aug 2026', nextFeeDueDate: '20 Oct 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-1-3', row: 1, col: 3, isSeat: true, seatNumber: 3,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '11 Aug 2026, 10:00 AM', assignedStudent: null
  },
  {
    id: 'cell-1-4', row: 1, col: 4, isSeat: true, seatNumber: 4,
    category: 'Premium', status: 'Occupied', monthlyFee: 800, addedOn: '11 Aug 2026, 10:30 AM',
    assignedStudent: { id: 's4', studentId: '#STU004', name: 'Neha Gupta', phone: '9876123456', admissionDate: '05 Aug 2026', nextFeeDueDate: '22 Oct 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-1-5', row: 1, col: 5, isSeat: true, seatNumber: 5,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '12 Aug 2026, 10:30 AM', assignedStudent: null
  },
  {
    id: 'cell-1-6', row: 1, col: 6, isSeat: true, seatNumber: 6,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '12 Aug 2026, 11:00 AM', assignedStudent: null
  },
  {
    id: 'cell-1-7', row: 1, col: 7, isSeat: true, seatNumber: 7,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '12 Aug 2026, 11:30 AM',
    assignedStudent: { id: 's7', studentId: '#STU007', name: 'Sahil Khan', phone: '9876001122', admissionDate: '18 Aug 2026', nextFeeDueDate: '18 Oct 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-1-8', row: 1, col: 8, isSeat: true, seatNumber: 8,
    category: 'Normal', status: 'Maintenance', monthlyFee: 600, addedOn: '12 Aug 2026, 12:00 PM', assignedStudent: null
  },

  // ROW 2
  {
    id: 'cell-2-1', row: 2, col: 1, isSeat: true, seatNumber: 9,
    category: 'Normal', status: 'Available', monthlyFee: 600, addedOn: '12 Aug 2026, 12:30 PM', assignedStudent: null
  },
  {
    id: 'cell-2-2', row: 2, col: 2, isSeat: true, seatNumber: 10,
    category: 'Normal', status: 'Available', monthlyFee: 600, addedOn: '12 Aug 2026, 01:00 PM', assignedStudent: null
  },
  {
    id: 'cell-2-3', row: 2, col: 3, isSeat: true, seatNumber: 11,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '12 Aug 2026, 01:30 PM',
    assignedStudent: { id: 's3', studentId: '#STU003', name: 'Aman Singh', phone: '9988776655', admissionDate: '12 Aug 2026', nextFeeDueDate: '15 Oct 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-2-4', row: 2, col: 4, isSeat: true, seatNumber: 12,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '12 Aug 2026, 02:00 PM', assignedStudent: null
  },
  {
    id: 'cell-2-5', row: 2, col: 5, isSeat: false, seatNumber: null, // Empty Aisle Space
    category: 'Normal', status: 'Available', monthlyFee: 0, addedOn: '12 Aug 2026, 02:00 PM', assignedStudent: null
  },
  {
    id: 'cell-2-6', row: 2, col: 6, isSeat: true, seatNumber: 13,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '12 Aug 2026, 02:15 PM', assignedStudent: null
  },
  {
    id: 'cell-2-7', row: 2, col: 7, isSeat: true, seatNumber: 14,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '12 Aug 2026, 02:30 PM',
    assignedStudent: { id: 's5', studentId: '#STU005', name: 'Rohit Yadav', phone: '9123987654', admissionDate: '01 Aug 2026', nextFeeDueDate: '25 Oct 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-2-8', row: 2, col: 8, isSeat: true, seatNumber: 15,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '12 Aug 2026, 03:00 PM', assignedStudent: null
  },

  // ROW 3
  {
    id: 'cell-3-1', row: 3, col: 1, isSeat: true, seatNumber: 16,
    category: 'Normal', status: 'Available', monthlyFee: 600, addedOn: '13 Aug 2026, 09:00 AM', assignedStudent: null
  },
  {
    id: 'cell-3-2', row: 3, col: 2, isSeat: true, seatNumber: 17,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '13 Aug 2026, 09:30 AM', assignedStudent: null
  },
  {
    id: 'cell-3-3', row: 3, col: 3, isSeat: true, seatNumber: 18,
    category: 'Premium', status: 'Occupied', monthlyFee: 800, addedOn: '13 Aug 2026, 10:00 AM',
    assignedStudent: { id: 's1', studentId: '#STU001', name: 'Rahul Sharma', phone: '9876543210', admissionDate: '15 Aug 2026', nextFeeDueDate: '18 Oct 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-3-4', row: 3, col: 4, isSeat: true, seatNumber: 19,
    category: 'Normal', status: 'Available', monthlyFee: 600, addedOn: '13 Aug 2026, 10:30 AM', assignedStudent: null
  },
  {
    id: 'cell-3-5', row: 3, col: 5, isSeat: true, seatNumber: 20,
    category: 'Normal', status: 'Available', monthlyFee: 600, addedOn: '13 Aug 2026, 11:00 AM', assignedStudent: null
  },
  {
    id: 'cell-3-6', row: 3, col: 6, isSeat: true, seatNumber: 21,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '13 Aug 2026, 11:30 AM',
    assignedStudent: { id: 's9', studentId: '#STU009', name: 'Vivek Mishra', phone: '9877009988', admissionDate: '15 Aug 2026', nextFeeDueDate: '15 Oct 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-3-7', row: 3, col: 7, isSeat: true, seatNumber: 22,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '13 Aug 2026, 12:00 PM', assignedStudent: null
  },
  {
    id: 'cell-3-8', row: 3, col: 8, isSeat: true, seatNumber: 23,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '13 Aug 2026, 12:30 PM', assignedStudent: null
  },

  // ROW 4
  {
    id: 'cell-4-1', row: 4, col: 1, isSeat: true, seatNumber: 24,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '13 Aug 2026, 01:00 PM',
    assignedStudent: { id: 's10', studentId: '#STU010', name: 'Muskan Patel', phone: '9123667788', admissionDate: '12 Aug 2026', nextFeeDueDate: '12 Nov 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-4-2', row: 4, col: 2, isSeat: true, seatNumber: 25,
    category: 'Normal', status: 'Available', monthlyFee: 600, addedOn: '13 Aug 2026, 01:30 PM', assignedStudent: null
  },
  {
    id: 'cell-4-3', row: 4, col: 3, isSeat: true, seatNumber: 26,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '13 Aug 2026, 02:00 PM', assignedStudent: null
  },
  {
    id: 'cell-4-4', row: 4, col: 4, isSeat: true, seatNumber: 27,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '13 Aug 2026, 02:30 PM',
    assignedStudent: { id: 's11', studentId: '#STU011', name: 'Kavita Singh', phone: '9876540001', admissionDate: '01 Sep 2026', nextFeeDueDate: '01 Nov 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-4-5', row: 4, col: 5, isSeat: true, seatNumber: 28,
    category: 'Normal', status: 'Maintenance', monthlyFee: 600, addedOn: '13 Aug 2026, 03:00 PM', assignedStudent: null
  },
  {
    id: 'cell-4-6', row: 4, col: 6, isSeat: true, seatNumber: 29,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '13 Aug 2026, 03:30 PM', assignedStudent: null
  },
  {
    id: 'cell-4-7', row: 4, col: 7, isSeat: false, seatNumber: null, // Empty Aisle Space
    category: 'Normal', status: 'Available', monthlyFee: 0, addedOn: '13 Aug 2026, 03:30 PM', assignedStudent: null
  },
  {
    id: 'cell-4-8', row: 4, col: 8, isSeat: true, seatNumber: 30,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '13 Aug 2026, 04:00 PM', assignedStudent: null
  },

  // ROW 5
  {
    id: 'cell-5-1', row: 5, col: 1, isSeat: true, seatNumber: 31,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '14 Aug 2026, 09:00 AM',
    assignedStudent: { id: 's12', studentId: '#STU012', name: 'Deepak Rao', phone: '9876540002', admissionDate: '02 Sep 2026', nextFeeDueDate: '02 Nov 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-5-2', row: 5, col: 2, isSeat: true, seatNumber: 32,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '14 Aug 2026, 09:30 AM', assignedStudent: null
  },
  {
    id: 'cell-5-3', row: 5, col: 3, isSeat: true, seatNumber: 33,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '14 Aug 2026, 10:00 AM',
    assignedStudent: { id: 's13', studentId: '#STU013', name: 'Sneha Jain', phone: '9876540003', admissionDate: '05 Sep 2026', nextFeeDueDate: '05 Nov 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-5-4', row: 5, col: 4, isSeat: true, seatNumber: 34,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '14 Aug 2026, 10:30 AM', assignedStudent: null
  },
  {
    id: 'cell-5-5', row: 5, col: 5, isSeat: true, seatNumber: 35,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '14 Aug 2026, 11:00 AM', assignedStudent: null
  },
  {
    id: 'cell-5-6', row: 5, col: 6, isSeat: true, seatNumber: 36,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '14 Aug 2026, 11:30 AM',
    assignedStudent: { id: 's14', studentId: '#STU014', name: 'Manish Soni', phone: '9876540004', admissionDate: '08 Sep 2026', nextFeeDueDate: '08 Nov 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-5-7', row: 5, col: 7, isSeat: true, seatNumber: 37,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '14 Aug 2026, 12:00 PM', assignedStudent: null
  },
  {
    id: 'cell-5-8', row: 5, col: 8, isSeat: true, seatNumber: 38,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '14 Aug 2026, 12:30 PM', assignedStudent: null
  },

  // ROW 6
  {
    id: 'cell-6-1', row: 6, col: 1, isSeat: true, seatNumber: 39,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '14 Aug 2026, 01:00 PM',
    assignedStudent: { id: 's15', studentId: '#STU015', name: 'Tanmay Vyas', phone: '9876540005', admissionDate: '10 Sep 2026', nextFeeDueDate: '10 Nov 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-6-2', row: 6, col: 2, isSeat: true, seatNumber: 40,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '14 Aug 2026, 01:30 PM', assignedStudent: null
  },
  {
    id: 'cell-6-3', row: 6, col: 3, isSeat: true, seatNumber: 41,
    category: 'Normal', status: 'Maintenance', monthlyFee: 600, addedOn: '14 Aug 2026, 02:00 PM', assignedStudent: null
  },
  {
    id: 'cell-6-4', row: 6, col: 4, isSeat: true, seatNumber: 42,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '14 Aug 2026, 02:30 PM', assignedStudent: null
  },
  {
    id: 'cell-6-5', row: 6, col: 5, isSeat: true, seatNumber: 43,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '14 Aug 2026, 03:00 PM',
    assignedStudent: { id: 's16', studentId: '#STU016', name: 'Pooja Rawat', phone: '9876540006', admissionDate: '12 Sep 2026', nextFeeDueDate: '12 Nov 2026', plan: 'Monthly' }
  },
  {
    id: 'cell-6-6', row: 6, col: 6, isSeat: true, seatNumber: 44,
    category: 'Locker', status: 'Available', monthlyFee: 700, addedOn: '14 Aug 2026, 03:30 PM', assignedStudent: null
  },
  {
    id: 'cell-6-7', row: 6, col: 7, isSeat: true, seatNumber: 45,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '14 Aug 2026, 04:00 PM', assignedStudent: null
  },
  {
    id: 'cell-6-8', row: 6, col: 8, isSeat: true, seatNumber: 46,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '14 Aug 2026, 04:30 PM',
    assignedStudent: { id: 's17', studentId: '#STU017', name: 'Gaurav Pandey', phone: '9876540007', admissionDate: '15 Sep 2026', nextFeeDueDate: '15 Nov 2026', plan: 'Monthly' }
  },

  // Additional 2 seats so total seats is 48 (seats 47 and 48)
  {
    id: 'cell-extra-47', row: 6, col: 9, isSeat: true, seatNumber: 47,
    category: 'Premium', status: 'Available', monthlyFee: 800, addedOn: '14 Aug 2026, 05:00 PM', assignedStudent: null
  },
  {
    id: 'cell-extra-48', row: 6, col: 10, isSeat: true, seatNumber: 48,
    category: 'Normal', status: 'Occupied', monthlyFee: 600, addedOn: '14 Aug 2026, 05:30 PM',
    assignedStudent: { id: 's18', studentId: '#STU018', name: 'Ritu Sharma', phone: '9876540008', admissionDate: '16 Sep 2026', nextFeeDueDate: '16 Nov 2026', plan: 'Monthly' }
  }
];
