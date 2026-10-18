import { Router } from 'express';
import { FeeController } from '../controllers/feeController.js';

const router = Router();

router.get('/receipts', FeeController.getReceipts);
router.get('/dues', FeeController.getDues);
router.post('/payments', FeeController.recordPayment);

export default router;
