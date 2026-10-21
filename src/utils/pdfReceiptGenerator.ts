import { jsPDF } from 'jspdf';

export interface ReceiptData {
  receiptNo: string;
  date?: string;
  studentName?: string;
  studentId?: string;
  studentRefId?: string;
  phone?: string;
  seatNo?: string | number;
  seatCategory?: string;
  plan?: string;
  mode?: string;
  amount?: number | string;
  dueAmount?: number | string;
  balanceDueDate?: string;
  newDueDate?: string;
  nextDueDate?: string;
  reference?: string;
  notes?: string;
}

export interface LibrarySettings {
  libraryName?: string;
  address?: string;
  phone?: string;
  email?: string;
  tagline?: string;
}

export interface ReceiptPdfOptions {
  showRemainingDue?: boolean;
}

/**
 * Generate a beautifully styled, high-resolution A5 PDF Receipt
 */
export const createReceiptPDF = (
  receipt: ReceiptData,
  settings: LibrarySettings = {},
  options: ReceiptPdfOptions = {}
): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pageWidth = 148;
  const pageHeight = 210;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  const libraryName = (settings.libraryName || 'VIDYA LIBRARY').toUpperCase();
  const address = settings.address || 'Premium Study Lounge & Digital Reading Library';
  const contact = settings.phone || '9303961613';
  const email = settings.email || 'contact@vidyalibrary.com';

  const receiptNo = receipt.receiptNo || 'REC-2026-0001';
  const dateStr = receipt.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const studentName = (receipt.studentName || 'Student').trim();
  const studentId = receipt.studentRefId || receipt.studentId || '-';
  const phone = receipt.phone || '-';
  const seatNo = receipt.seatNo && receipt.seatNo !== '-' ? `Seat #${receipt.seatNo}` : 'Unassigned';
  const seatCategory = receipt.seatCategory || 'Normal';
  const plan = receipt.plan || 'Monthly';
  const mode = receipt.mode || 'Cash';
  const showRemainingDue = options.showRemainingDue !== undefined ? options.showRemainingDue : true;
  const amountVal = Number(receipt.amount || 0);
  const dueVal = Number(receipt.dueAmount || 0);
  const nextDueDate = receipt.newDueDate || receipt.nextDueDate || '-';
  const reference = receipt.reference || '';
  const notes = receipt.notes || (receipt as any).remarks || '';

  // 1. Outer Border & Aesthetic Frame
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4, 'S');

  // 2. Top Header Accent Banner (Emerald Green #544bec)
  doc.setFillColor(0, 169, 122);
  doc.roundedRect(margin, margin, contentWidth, 26, 4, 4, 'F');
  // Fill the bottom corners to keep banner straight at bottom
  doc.rect(margin, margin + 20, contentWidth, 6, 'F');

  // Library Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(libraryName, pageWidth / 2, margin + 8, { align: 'center' });

  // Tagline & Address
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(address, pageWidth / 2, margin + 14, { align: 'center' });
  doc.text(`Contact: ${contact}   |   Email: ${email}`, pageWidth / 2, margin + 20, { align: 'center' });

  // 3. Receipt Title & Badge Row
  let y = margin + 34;

  doc.setTextColor(25, 32, 56);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FEE PAYMENT RECEIPT', margin + 3, y);

  // Status Badge: PAID (Green) or PARTIAL (Amber)
  const isPaid = dueVal <= 0 || !showRemainingDue;
  if (isPaid) {
    doc.setFillColor(232, 248, 243);
    doc.setDrawColor(0, 169, 122);
    doc.roundedRect(pageWidth - margin - 25, y - 5, 22, 6.5, 2, 2, 'FD');
    doc.setTextColor(0, 169, 122);
    doc.setFontSize(8);
    doc.text('FULLY PAID', pageWidth - margin - 14, y - 0.7, { align: 'center' });
  } else {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(pageWidth - margin - 26, y - 5, 23, 6.5, 2, 2, 'FD');
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(7.5);
    doc.text('PARTIAL PAID', pageWidth - margin - 14.5, y - 0.7, { align: 'center' });
  }

  // Divider
  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin + 3, y, pageWidth - margin - 3, y);

  // 4. Meta Information Row
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Receipt No: ', margin + 3, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(25, 32, 56);
  doc.text(receiptNo, margin + 22, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Payment Date: ', pageWidth - margin - 45, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(25, 32, 56);
  doc.text(dateStr, pageWidth - margin - 3, y, { align: 'right' });

  // 5. Student Details Card with Dynamic Content Wrapping
  y += 7;

  const rows = [
    { label: 'Student Name', value: studentName, isBold: true },
    { label: 'Student ID', value: studentId },
    { label: 'Mobile Number', value: phone },
    { label: 'Allotted Seat', value: `${seatNo} (${seatCategory})`, isBold: true, color: [0, 169, 122] },
    { label: 'Subscription Plan', value: plan },
    { label: 'Payment Mode', value: mode },
    { label: 'Next Due / Renewal', value: nextDueDate, isBold: true, color: [0, 169, 122] }
  ];

  if (reference) {
    rows.push({ label: 'Transaction Ref', value: reference });
  }
  if (notes) {
    rows.push({ label: 'Notes', value: notes });
  }

  // Value column maximum width inside card (prevent any overflow past card border)
  const valueMaxWidth = contentWidth - 48; // ~80mm width for value text

  interface FormattedRow {
    label: string;
    lines: string[];
    isBold?: boolean;
    color?: number[];
    rowHeight: number;
  }

  const formattedRows: FormattedRow[] = rows.map((r) => {
    doc.setFont('helvetica', r.isBold ? 'bold' : 'normal');
    doc.setFontSize(8);
    const split = doc.splitTextToSize(String(r.value || '-'), valueMaxWidth);
    // Limit to max 2 lines so notes don't disrupt overall receipt layout
    const displayLines = split.slice(0, 2);
    if (split.length > 2 && displayLines.length === 2) {
      displayLines[1] = displayLines[1].slice(0, -3) + '...';
    }
    const h = displayLines.length > 1 ? 9.5 : 6.0;
    return {
      label: r.label,
      lines: displayLines,
      isBold: r.isBold,
      color: r.color,
      rowHeight: h
    };
  });

  const totalContentHeight = formattedRows.reduce((sum, r) => sum + r.rowHeight, 0);
  const cardHeight = totalContentHeight + 5;

  // Draw card background with dynamic fitted height
  doc.setFillColor(248, 250, 253);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 3, y, contentWidth - 6, cardHeight, 3, 3, 'FD');

  let rowY = y + 5;
  formattedRows.forEach((r, idx) => {
    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(r.label, margin + 7, rowY);

    // Separator colon
    doc.text(':', margin + 39, rowY);

    // Wrapped Value lines (strictly contained within card bounds)
    doc.setFont('helvetica', r.isBold ? 'bold' : 'normal');
    if (r.color) {
      doc.setTextColor(r.color[0], r.color[1], r.color[2]);
    } else {
      doc.setTextColor(25, 32, 56);
    }

    r.lines.forEach((lineText, lineIdx) => {
      doc.text(lineText, margin + 43, rowY + lineIdx * 3.8);
    });

    // Subtle row line (except last row)
    if (idx < formattedRows.length - 1) {
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      const dividerY = rowY + (r.lines.length > 1 ? 5.8 : 2.5);
      doc.line(margin + 7, dividerY, pageWidth - margin - 7, dividerY);
    }

    rowY += r.rowHeight;
  });

  // Advance y position dynamically past the card
  y += cardHeight + 4;

  // 6. Fee Paid Highlight Box
  doc.setFillColor(232, 248, 243);
  doc.setDrawColor(0, 169, 122);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 3, y, contentWidth - 6, 18, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 169, 122);
  doc.text('TOTAL AMOUNT PAID', margin + 8, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Payment received & verified', margin + 8, y + 13);

  // Big Amount Display (Rs. X)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 169, 122);
  doc.text(`Rs. ${amountVal.toLocaleString('en-IN')}.00`, pageWidth - margin - 8, y + 12, { align: 'right' });

  // 7. Remaining Balance Box (if any)
  if (dueVal > 0 && showRemainingDue) {
    y += 21;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin + 3, y, contentWidth - 6, 12, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('Remaining Balance Due:', margin + 8, y + 5.5);
    doc.text(`Rs. ${dueVal.toLocaleString('en-IN')}`, pageWidth - margin - 8, y + 5.5, { align: 'right' });

    if (receipt.balanceDueDate) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(146, 64, 14);
      doc.text(`Due by: ${receipt.balanceDueDate}`, margin + 8, y + 9.5);
    }
  }

  // 8. Footer Section
  const footerY = pageHeight - margin - 15;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin + 3, footerY, pageWidth - margin - 3, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('* This is an official computer-generated receipt issued by Vidya Library management system.', pageWidth / 2, footerY + 4.5, { align: 'center' });
  doc.text('Keep this digital receipt slip for membership verification and seat allotment.', pageWidth / 2, footerY + 8.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 169, 122);
  doc.text(`Thank you for choosing ${libraryName}!`, pageWidth / 2, footerY + 12.5, { align: 'center' });

  return doc;
};

/**
 * Download genuine PDF receipt directly
 */
export const downloadReceiptPDF = (
  receipt: ReceiptData,
  settings: LibrarySettings = {},
  options: ReceiptPdfOptions = {}
): void => {
  const doc = createReceiptPDF(receipt, settings, options);
  const cleanName = (receipt.studentName || 'student').replace(/\s+/g, '_');
  const fileName = `Receipt_${receipt.receiptNo || 'REC'}_${cleanName}.pdf`;
  doc.save(fileName);
};

/**
 * Get PDF as a File object (ready for Web Share API)
 */
export const getReceiptPDFFile = (
  receipt: ReceiptData,
  settings: LibrarySettings = {},
  options: ReceiptPdfOptions = {}
): File => {
  const doc = createReceiptPDF(receipt, settings, options);
  const cleanName = (receipt.studentName || 'student').replace(/\s+/g, '_');
  const fileName = `Receipt_${receipt.receiptNo || 'REC'}_${cleanName}.pdf`;
  const blob = doc.output('blob');
  return new File([blob], fileName, { type: 'application/pdf' });
};

/**
 * Share PDF Receipt on WhatsApp
 * If Web Share API supports file sharing: shares the actual PDF directly to WhatsApp.
 * On desktop / standard browsers: downloads the official PDF and opens WhatsApp chat with clear instructions.
 */
export const shareReceiptOnWhatsApp = async (
  receipt: ReceiptData,
  settings: LibrarySettings = {},
  options: ReceiptPdfOptions = {}
): Promise<void> => {
  const cleanName = (receipt.studentName || 'student').replace(/\s+/g, '_');
  const fileName = `Receipt_${receipt.receiptNo || 'REC'}_${cleanName}.pdf`;
  const rawPhone = (receipt.phone || '').replace(/\D/g, '');
  const waPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
  const libraryName = settings.libraryName || 'Vidya Library';
  const showRemainingDue = options.showRemainingDue !== undefined ? options.showRemainingDue : true;
  const dueVal = Number(receipt.dueAmount || 0);

  const dueLine = (dueVal > 0 && showRemainingDue)
    ? `\n*Remaining Due:* Rs. ${dueVal}${receipt.balanceDueDate ? ' (by ' + receipt.balanceDueDate + ')' : ''}`
    : '';

  const shareText = `*🧾 FEE PAYMENT RECEIPT - ${libraryName.toUpperCase()}*\n━━━━━━━━━━━━━━━━━━━\n*Receipt No:* ${receipt.receiptNo}\n*Student:* ${receipt.studentName}\n*Seat:* ${receipt.seatNo ? 'Seat #' + receipt.seatNo : 'Unassigned'}\n*Amount Paid:* Rs. ${Number(receipt.amount || 0).toLocaleString('en-IN')}\n*Next Due Date:* ${receipt.newDueDate || receipt.nextDueDate || '-'}${dueLine}\n━━━━━━━━━━━━━━━━━━━\nOfficial digital PDF receipt attached. Thank you for studying with us!`;

  const pdfFile = getReceiptPDFFile(receipt, settings, options);

  // 1. Check if native Web Share with Files is supported (Mobile / supported desktop browsers)
  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [pdfFile] })
  ) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: `Fee Receipt - ${receipt.receiptNo}`,
        text: shareText
      });
      return;
    } catch (shareErr: any) {
      if (shareErr.name === 'AbortError') return; // User closed share sheet
      console.warn('Native share failed, falling back to download + WhatsApp Web:', shareErr);
    }
  }

  // 2. Fallback for Desktop WhatsApp Web:
  // Automatically download the official PDF file to their computer
  downloadReceiptPDF(receipt, settings, options);

  // Open WhatsApp Web with student pre-selected
  const waUrl = waPhone
    ? `https://web.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(shareText)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  // Also support mobile fallback if web.whatsapp fails
  const fallbackUrl = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(shareText)}`
    : `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  window.open(isMobile ? fallbackUrl : waUrl, '_blank');
};
