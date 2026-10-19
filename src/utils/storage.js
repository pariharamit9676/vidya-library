// Storage & Formatting Utilities for Vidya Library
import { INITIAL_STUDENTS } from "../data/initialData";

const STORAGE_KEY = "vidya_library_students_v2";
const SETTINGS_KEY = "vidya_library_settings_v2";

export const getStoredStudents = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load students", e);
    return INITIAL_STUDENTS;
  }
};

export const saveStudents = (students) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error("Failed to save students", e);
  }
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      const defaultSettings = {
        libraryName: "Vidya Library & Study Lounge",
        tagline: "Knowledge Bestows Humility • Premier Reading Hall",
        address: "Near Metro Gate 2, Main Market, New Delhi",
        phone: "+91 98765 43210",
        upiId: "vidyalibrary@upi"
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      libraryName: "Vidya Library & Study Lounge",
      tagline: "Knowledge Bestows Humility • Premier Reading Hall",
      address: "Near Metro Gate 2, Main Market, New Delhi",
      phone: "+91 98765 43210",
      upiId: "vidyalibrary@upi"
    };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const calculateDuration = (startTime, endTime = new Date().toISOString()) => {
  if (!startTime) return "0m";
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffMs = Math.max(0, end - start);

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const formatTimeOnly = (isoString) => {
  if (!isoString) return "-";
  const str = String(isoString).trim();
  if (!str || str === 'null' || str === 'undefined' || str === '-') return "-";

  // If already in 12-hr format like "10:30 AM" or "04:15 PM"
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(str)) {
    return str.toUpperCase();
  }

  // If 24-hr time like "14:30" or "09:15"
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
    const [h, m] = str.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();
};

export const formatDateOnly = (dateStr) => {
  if (!dateStr) return "-";
  const str = String(dateStr).trim();
  if (!str || str === 'null' || str === 'undefined' || str === '-') return "-";

  // If already in DD MMM YYYY (e.g. 19 Oct 2026)
  if (/^\d{1,2}\s[A-Za-z]{3}\s\d{4}$/.test(str)) {
    return str;
  }

  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const computeFeeStatus = (nextDueDate) => {
  if (!nextDueDate) return "PAID";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(nextDueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < -40) {
    return "INACTIVE";
  } else if (diffDays < 0) {
    return "OVERDUE";
  } else if (diffDays <= 5) {
    return "DUE_SOON";
  } else {
    return "PAID";
  }
};

export const exportStudentsToCSV = (students) => {
  const headers = [
    "Student ID",
    "Name",
    "Phone",
    "Seat No",
    "Shift",
    "Monthly Fee (INR)",
    "Fee Status",
    "Next Due Date",
    "Currently Inside",
    "Last Stay Duration",
    "Last Check-In",
    "Last Check-Out"
  ];

  const rows = students.map((s) => [
    `"${s.id}"`,
    `"${s.name}"`,
    `"${s.phone}"`,
    `"${s.seatNo}"`,
    `"${s.shift}"`,
    s.monthlyFee,
    s.feeStatus,
    s.nextFeeDueDate || "N/A",
    s.isCheckedIn ? "YES" : "NO",
    s.lastStay ? `"${s.lastStay.formattedDuration}"` : "N/A",
    s.lastStay ? `"${formatTimeOnly(s.lastStay.checkIn)}"` : "N/A",
    s.lastStay ? `"${formatTimeOnly(s.lastStay.checkOut)}"` : "N/A"
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `vidya_library_records_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
