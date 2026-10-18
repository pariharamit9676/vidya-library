import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';
import { generateReceiptNumber } from '../utils/idGenerator.js';
import { formatDate } from '../utils/dateUtils.js';
import { isMongoConnected } from '../config/database.js';
import { PaymentMongo } from './schemas/PaymentSchema.js';

const FILE_NAME = 'payments.json';

const DEFAULT_PAYMENTS = [
  {
    id: 'pay_1',
    receiptNo: 'REC-2026-1015',
    studentId: '2',
    studentName: 'Priya Verma',
    seatNo: '2',
    date: '15 Oct 2026',
    amount: 800,
    mode: 'Cash',
    plan: 'Monthly',
    status: 'Paid',
    receivedBy: 'Admin'
  },
  {
    id: 'pay_2',
    receiptNo: 'REC-2026-1020',
    studentId: '3',
    studentName: 'Aman Singh',
    seatNo: '4',
    date: '01 Sep 2026',
    amount: 800,
    mode: 'UPI',
    plan: 'Monthly',
    status: 'Paid',
    receivedBy: 'Admin'
  },
  {
    id: 'pay_3',
    receiptNo: 'REC-2026-1001',
    studentId: '1',
    studentName: 'Rahul Sharma',
    seatNo: '47',
    date: '15 Sep 2026',
    amount: 600,
    mode: 'UPI',
    plan: 'Monthly',
    status: 'Paid',
    receivedBy: 'Admin'
  }
];

export class PaymentModel {
  static async getAll() {
    if (isMongoConnected()) {
      try {
        const docs = await PaymentMongo.find({}).sort({ createdAt: -1 }).lean();
        if (docs && docs.length > 0) {
          return docs.map((d) => ({
            ...d,
            id: d.id || String(d._id)
          }));
        }
      } catch (err) {
        console.error('Mongo read payments error, fallback to JSON:', err.message);
      }
    }
    return readJsonFile(FILE_NAME, DEFAULT_PAYMENTS);
  }

  static async getById(id) {
    const all = await this.getAll();
    return all.find((p) => p.id === id || p.receiptNo === id || p._id === id) || null;
  }

  static async create(paymentData) {
    const payments = await this.getAll();
    const receiptNo = paymentData.receiptNo || generateReceiptNumber(payments.length + 100);

    const record = {
      id: `pay_${Date.now()}`,
      receiptNo,
      studentId: paymentData.studentId,
      studentName: paymentData.studentName,
      seatNo: paymentData.seatNo || '-',
      date: paymentData.date || formatDate(),
      amount: Number(paymentData.amount) || 0,
      mode: paymentData.mode || 'Cash',
      plan: paymentData.plan || 'Monthly',
      status: 'Paid',
      receivedBy: paymentData.receivedBy || 'Admin',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      try {
        await PaymentMongo.create(record);
      } catch (err) {
        console.error('Mongo save payment error:', err.message);
      }
    }

    const currentLocal = readJsonFile(FILE_NAME, DEFAULT_PAYMENTS);
    currentLocal.unshift(record);
    writeJsonFile(FILE_NAME, currentLocal);
    return record;
  }

  static async getTotalCollectedThisMonth() {
    const payments = await this.getAll();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return payments.reduce((acc, curr) => {
      const d = new Date(curr.date);
      if (!isNaN(d.getTime())) {
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          return acc + Number(curr.amount || 0);
        }
      }
      return acc + Number(curr.amount || 0);
    }, 0);
  }
}
