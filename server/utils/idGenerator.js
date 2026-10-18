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
