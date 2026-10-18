/**
 * Formats date into DD MMM YYYY (e.g. 15 Oct 2026)
 * @param {Date|string} date 
 */
export const formatDate = (date = new Date()) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats time into 12-hour format with AM/PM (e.g. 08:30 AM)
 * @param {Date|string} date 
 */
export const formatTime = (date = new Date()) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Adds months to a given date and returns DD MMM YYYY format
 * @param {Date|string} startDate 
 * @param {number} monthsToAdd 
 */
export const addMonthsToDate = (startDate = new Date(), monthsToAdd = 1) => {
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return formatDate(new Date());
  const originalDay = d.getDate();
  d.setMonth(d.getMonth() + Number(monthsToAdd));
  if (d.getDate() !== originalDay) {
    d.setDate(0);
  }
  return formatDate(d);
};

/**
 * Computes fee status based on next due date (DUE_SOON if <= 5 days)
 * @param {string|Date} dueDateStr 
 * @param {number} dueAmount
 * @returns {'PAID' | 'DUE_SOON' | 'OVERDUE'}
 */
export const computeFeeStatus = (dueDateStr, dueAmount = 0, studentStatus = null) => {
  if (studentStatus === 'Inactive') return 'INACTIVE';
  if (!dueDateStr) return 'PAID';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  if (isNaN(due.getTime())) return 'PAID';
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < -40) return 'INACTIVE';
  if (diffDays < 0) return 'OVERDUE';
  if (diffDays <= 5) return 'DUE_SOON';
  return 'PAID';
};

/**
 * Calculates days remaining until a due date.
 * Returns null if invalid date.
 * Negative number = days overdue (e.g. -45 means 45 days overdue).
 * Positive number = days until due.
 */
export const getDaysUntilDue = (dueDateStr) => {
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
 * Calculates duration between two dates
 * @param {Date|string} start 
 * @param {Date|string} end 
 */
export const calculateDuration = (start, end = new Date()) => {
  const s = new Date(start);
  const e = new Date(end);
  const diffMinutes = Math.max(1, Math.floor((e.getTime() - s.getTime()) / (1000 * 60)));
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return {
    diffMinutes,
    formatted: hours === 0 ? `${mins}m` : `${hours}h ${mins}m`
  };
};
