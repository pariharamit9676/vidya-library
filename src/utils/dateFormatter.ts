/**
 * Viya Library - Consistent Date Formatter
 * Standardizes all date displays across the application to "DD MMM YYYY" (e.g. "15 Oct 2026")
 */

export const formatDisplayDate = (dateVal?: string | Date | number | null): string => {
  if (!dateVal) return '-';

  const str = String(dateVal).trim();
  if (!str || str === '-' || str === 'null' || str === 'undefined') return '-';

  // If already in "D MMM YYYY" or "DD MMM YYYY" format (e.g. "15 Oct 2026" or "1 Oct 2026"), return standardized
  if (/^\d{1,2}\s[A-Za-z]{3}\s\d{4}$/.test(str)) {
    const parts = str.split(' ');
    const day = parts[0].padStart(2, '0');
    return `${day} ${parts[1]} ${parts[2]}`;
  }

  // Handle YYYY-MM-DD explicitly to prevent UTC timezone offsets
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Handle DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(str)) {
    const parts = str.split(/[-/]/).map(Number);
    const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) {
    return str;
  }

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Returns today's date in standard format "DD MMM YYYY"
 */
export const getTodayFormatted = (): string => {
  return formatDisplayDate(new Date());
};

/**
 * Adds months to a date and returns formatted "DD MMM YYYY"
 */
export const addMonthsFormatted = (startDate: string | Date = new Date(), monthsToAdd: number = 1): string => {
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return formatDisplayDate(new Date());

  const originalDay = d.getDate();
  d.setMonth(d.getMonth() + Number(monthsToAdd));

  // Handle month length difference (e.g. 31st to 30th/28th)
  if (d.getDate() !== originalDay) {
    d.setDate(0);
  }

  return formatDisplayDate(d);
};

/**
 * Calculates days remaining until a due date.
 * Returns null if invalid date.
 * Negative number = days overdue.
 * Positive number = days until due.
 */
export const getDaysUntilDue = (dueDateStr?: string | Date | number | null): number | null => {
  if (!dueDateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  if (isNaN(due.getTime())) return null;
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Computes fee status: 'PAID' | 'DUE_SOON' | 'OVERDUE' | 'INACTIVE'
 * Marks 'DUE_SOON' if days remaining until next renewal is <= 5 and >= 0.
 * Inactive students (overdue > 40 days or status Inactive) return 'INACTIVE', never 'OVERDUE'.
 */
export const computeFeeStatus = (
  dueDateStr?: string | Date | number | null,
  dueAmount: number = 0,
  studentStatus?: string | null
): 'PAID' | 'DUE_SOON' | 'OVERDUE' | 'INACTIVE' => {
  if (studentStatus === 'Inactive') return 'INACTIVE';
  const daysLeft = getDaysUntilDue(dueDateStr);
  if (daysLeft === null) return 'PAID';
  if (daysLeft < -40) return 'INACTIVE';
  if (daysLeft < 0) return 'OVERDUE';
  if (daysLeft <= 5) return 'DUE_SOON';
  return 'PAID';
};

/**
 * Computes student lifecycle status:
 * - 'Demo': Demo student
 * - 'Inactive': Overdue by more than 40 days (daysLeft < -40) or marked Inactive
 * - 'Overdue': Past renewal date (0 to 40 days overdue)
 * - 'Due Soon': Next renewal due within 5 days (daysLeft <= 5)
 * - 'Active': Regular, paid up-to-date
 * Note: Having a partial pending balance due does NOT set status to 'Due Soon'.
 */
export const computeStudentStatus = (student: {
  studentType?: string;
  status?: string;
  plan?: string;
  nextDueDate?: string | Date | number | null;
  nextFeeDueDate?: string | Date | number | null;
  dueAmount?: number | string | null;
}): 'Demo' | 'Inactive' | 'Overdue' | 'Due Soon' | 'Active' => {
  if (student.studentType === 'Demo' || student.status === 'Demo' || student.plan?.includes('Demo')) {
    return 'Demo';
  }

  // Explicit status set by Admin takes precedence
  if (student.status === 'Inactive') {
    return 'Inactive';
  }

  const dueDate = student.nextDueDate || student.nextFeeDueDate;
  const daysLeft = getDaysUntilDue(dueDate);

  // If explicitly set to Active by Admin, honor it if not heavily overdue (>40d)
  if (student.status === 'Active' && (daysLeft === null || daysLeft >= -40)) {
    return 'Active';
  }

  if (student.status === 'Overdue' || student.status === 'Due Soon') {
    return student.status;
  }

  // Fallback to dynamic computation based on renewal dates
  if (daysLeft !== null && daysLeft > 5) {
    return 'Active';
  }

  // Renewal due within 5 days -> Due Soon
  if (daysLeft !== null && daysLeft >= 0 && daysLeft <= 5) {
    return 'Due Soon';
  }

  // Overdue by more than 40 days -> Inactive
  if (daysLeft !== null && daysLeft < -40) {
    return 'Inactive';
  }

  // Past due by 0 to 40 days -> Overdue
  if (daysLeft !== null && daysLeft < 0) {
    return 'Overdue';
  }

  return (student.status as any) || 'Active';
};

/**
 * Formats any ISO string, Date object, or time string into standard 12-hour format "hh:mm AM/PM" (e.g. "10:26 AM")
 */
export const formatDisplayTime = (timeVal?: string | Date | number | null): string => {
  if (!timeVal) return '';
  const str = String(timeVal).trim();
  if (!str || str === 'null' || str === 'undefined' || str === '-') return '';

  // If already in 12h format like "10:30 AM" or "04:56 PM"
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(str)) {
    return str.toUpperCase();
  }

  // Parse Date or ISO string
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  }

  return str;
};

/**
 * Returns a human-friendly live check-in label, e.g. "Today at 10:26 AM" or "10:26 AM"
 */
export const formatLiveCheckInTime = (timeVal?: string | Date | number | null): string => {
  if (!timeVal) return 'Today';
  const str = String(timeVal).trim();
  if (!str || str === 'null' || str === 'undefined') return 'Today';

  const timeFormatted = formatDisplayTime(str);
  if (!timeFormatted) return 'Today';

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      return `Today at ${timeFormatted}`;
    }

    const dateFormatted = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
    return `${dateFormatted} at ${timeFormatted}`;
  }

  return timeFormatted;
};
