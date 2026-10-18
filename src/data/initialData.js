// Initial realistic dataset for Vidya Library
export const INITIAL_STUDENTS = [
  {
    id: "VIDYA-101",
    name: "Rohan Sharma",
    phone: "9876543210",
    email: "rohan.sharma@gmail.com",
    seatNo: "A-01",
    shift: "Morning (6 AM - 2 PM)",
    monthlyFee: 800,
    feeStatus: "PAID",
    lastFeePaidDate: "2026-10-01",
    nextFeeDueDate: "2026-11-01",
    joinDate: "2026-06-15",
    isCheckedIn: true,
    currentCheckInTime: new Date(Date.now() - 3 * 3600 * 1000 - 15 * 60 * 1000).toISOString(),
    lastStay: {
      date: "2026-10-14",
      checkIn: "2026-10-14T06:15:00.000Z",
      checkOut: "2026-10-14T13:45:00.000Z",
      durationMinutes: 450,
      formattedDuration: "7h 30m"
    },
    attendanceHistory: [
      {
        id: "att-101-1",
        date: "2026-10-14",
        checkIn: "2026-10-14T06:15:00.000Z",
        checkOut: "2026-10-14T13:45:00.000Z",
        durationMinutes: 450,
        formattedDuration: "7h 30m"
      },
      {
        id: "att-101-2",
        date: "2026-10-13",
        checkIn: "2026-10-13T06:30:00.000Z",
        checkOut: "2026-10-13T14:00:00.000Z",
        durationMinutes: 450,
        formattedDuration: "7h 30m"
      }
    ],
    feeHistory: [
      {
        id: "RCPT-001",
        amount: 800,
        date: "2026-10-01",
        mode: "UPI",
        remarks: "October 2026 Monthly Fee"
      }
    ]
  },
  {
    id: "VIDYA-102",
    name: "Priya Patel",
    phone: "9823456789",
    email: "priya.p@outlook.com",
    seatNo: "A-02",
    shift: "Full Day (24/7)",
    monthlyFee: 1200,
    feeStatus: "DUE_SOON",
    lastFeePaidDate: "2026-09-18",
    nextFeeDueDate: "2026-10-18",
    joinDate: "2026-07-01",
    isCheckedIn: true,
    currentCheckInTime: new Date(Date.now() - 1 * 3600 * 1000 - 45 * 60 * 1000).toISOString(),
    lastStay: {
      date: "2026-10-14",
      checkIn: "2026-10-14T08:00:00.000Z",
      checkOut: "2026-10-14T18:30:00.000Z",
      durationMinutes: 630,
      formattedDuration: "10h 30m"
    },
    attendanceHistory: [
      {
        id: "att-102-1",
        date: "2026-10-14",
        checkIn: "2026-10-14T08:00:00.000Z",
        checkOut: "2026-10-14T18:30:00.000Z",
        durationMinutes: 630,
        formattedDuration: "10h 30m"
      }
    ],
    feeHistory: [
      {
        id: "RCPT-002",
        amount: 1200,
        date: "2026-09-18",
        mode: "Cash",
        remarks: "September Full Day Fee"
      }
    ]
  },
  {
    id: "VIDYA-103",
    name: "Aman Verma",
    phone: "9711223344",
    email: "aman.upsc@gmail.com",
    seatNo: "B-05",
    shift: "Evening (2 PM - 10 PM)",
    monthlyFee: 800,
    feeStatus: "OVERDUE",
    lastFeePaidDate: "2026-09-05",
    nextFeeDueDate: "2026-10-05",
    joinDate: "2026-05-10",
    isCheckedIn: false,
    currentCheckInTime: null,
    lastStay: {
      date: "2026-10-14",
      checkIn: "2026-10-14T14:10:00.000Z",
      checkOut: "2026-10-14T21:40:00.000Z",
      durationMinutes: 450,
      formattedDuration: "7h 30m"
    },
    attendanceHistory: [
      {
        id: "att-103-1",
        date: "2026-10-14",
        checkIn: "2026-10-14T14:10:00.000Z",
        checkOut: "2026-10-14T21:40:00.000Z",
        durationMinutes: 450,
        formattedDuration: "7h 30m"
      }
    ],
    feeHistory: []
  },
  {
    id: "VIDYA-104",
    name: "Ananya Singh",
    phone: "9988776655",
    email: "ananya.ca@gmail.com",
    seatNo: "B-06",
    shift: "Full Day (24/7)",
    monthlyFee: 1200,
    feeStatus: "PAID",
    lastFeePaidDate: "2026-10-10",
    nextFeeDueDate: "2026-11-10",
    joinDate: "2026-08-01",
    isCheckedIn: true,
    currentCheckInTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    lastStay: {
      date: "2026-10-14",
      checkIn: "2026-10-14T09:00:00.000Z",
      checkOut: "2026-10-14T19:00:00.000Z",
      durationMinutes: 600,
      formattedDuration: "10h 00m"
    },
    attendanceHistory: [
      {
        id: "att-104-1",
        date: "2026-10-14",
        checkIn: "2026-10-14T09:00:00.000Z",
        checkOut: "2026-10-14T19:00:00.000Z",
        durationMinutes: 600,
        formattedDuration: "10h 00m"
      }
    ],
    feeHistory: [
      {
        id: "RCPT-004",
        amount: 1200,
        date: "2026-10-10",
        mode: "UPI",
        remarks: "October Full Day Fee"
      }
    ]
  },
  {
    id: "VIDYA-105",
    name: "Deepak Choudhary",
    phone: "9654123987",
    email: "deepak.gate@gmail.com",
    seatNo: "C-01",
    shift: "Night Shift (10 PM - 6 AM)",
    monthlyFee: 700,
    feeStatus: "PAID",
    lastFeePaidDate: "2026-10-02",
    nextFeeDueDate: "2026-11-02",
    joinDate: "2026-09-01",
    isCheckedIn: false,
    currentCheckInTime: null,
    lastStay: {
      date: "2026-10-15",
      checkIn: "2026-10-14T21:30:00.000Z",
      checkOut: "2026-10-15T05:45:00.000Z",
      durationMinutes: 495,
      formattedDuration: "8h 15m"
    },
    attendanceHistory: [
      {
        id: "att-105-1",
        date: "2026-10-15",
        checkIn: "2026-10-14T21:30:00.000Z",
        checkOut: "2026-10-15T05:45:00.000Z",
        durationMinutes: 495,
        formattedDuration: "8h 15m"
      }
    ],
    feeHistory: [
      {
        id: "RCPT-005",
        amount: 700,
        date: "2026-10-02",
        mode: "Cash",
        remarks: "Night shift slot"
      }
    ]
  },
  {
    id: "VIDYA-106",
    name: "Kavita Meena",
    phone: "9123456780",
    email: "kavita.neet@gmail.com",
    seatNo: "C-02",
    shift: "Morning (6 AM - 2 PM)",
    monthlyFee: 800,
    feeStatus: "OVERDUE",
    lastFeePaidDate: "2026-09-08",
    nextFeeDueDate: "2026-10-08",
    joinDate: "2026-04-12",
    isCheckedIn: true,
    currentCheckInTime: new Date(Date.now() - 2 * 3600 * 1000 - 15 * 60 * 1000).toISOString(),
    lastStay: {
      date: "2026-10-13",
      checkIn: "2026-10-13T07:00:00.000Z",
      checkOut: "2026-10-13T13:30:00.000Z",
      durationMinutes: 390,
      formattedDuration: "6h 30m"
    },
    attendanceHistory: [
      {
        id: "att-106-1",
        date: "2026-10-13",
        checkIn: "2026-10-13T07:00:00.000Z",
        checkOut: "2026-10-13T13:30:00.000Z",
        durationMinutes: 390,
        formattedDuration: "6h 30m"
      }
    ],
    feeHistory: []
  }
];

export const SHIFT_OPTIONS = [
  "Morning (6 AM - 2 PM)",
  "Evening (2 PM - 10 PM)",
  "Night Shift (10 PM - 6 AM)",
  "Full Day (24/7)"
];

export const SEAT_LIST = [
  "A-01", "A-02", "A-03", "A-04", "A-05", "A-06",
  "B-01", "B-02", "B-03", "B-04", "B-05", "B-06",
  "C-01", "C-02", "C-03", "C-04", "C-05", "C-06",
  "D-01", "D-02", "D-03", "D-04", "D-05", "D-06"
];
