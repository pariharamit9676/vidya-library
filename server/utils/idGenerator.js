/**
 * Generates formatted student registration ID (e.g. #STU009)
 * @param {number} sequenceNumber 
 */
export const generateStudentId = (sequenceNumber) => {
  const pad = String(sequenceNumber).padStart(3, '0');
  return `#STU${pad}`;
};

/**
 * Generates receipt number (e.g. REC-2026-1024)
 * @param {number} sequenceNumber 
 */
export const generateReceiptNumber = (sequenceNumber) => {
  const year = new Date().getFullYear();
  const pad = String(sequenceNumber).padStart(4, '0');
  return `REC-${year}-${pad}`;
};

/**
 * Generates unique transaction ID
 */
export const generateTxnId = () => {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

/**
 * Generates clean, unique referral code for a student
 * Example: "Amit Parihar" + "9685912333" -> "AMIT2333"
 */
export const generateReferralCode = (name = '', phone = '', studentId = '', existingCodesSet = new Set()) => {
  const cleanName = String(name || 'VIDYA')
    .trim()
    .split(' ')[0]
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 5) || 'STUDENT';

  const cleanPhone = String(phone || '').replace(/\D/g, '');
  const cleanId = String(studentId || '').replace(/\D/g, '');
  const digits = cleanPhone.slice(-4) || cleanId.slice(-3) || '101';

  let baseCode = `${cleanName}${digits}`;
  if (!existingCodesSet.has(baseCode)) {
    return baseCode;
  }

  let counter = 1;
  while (existingCodesSet.has(`${baseCode}${counter}`)) {
    counter++;
  }
  return `${baseCode}${counter}`;
};
