import { Router } from 'express';
import { ReferralController } from '../controllers/referralController.js';

const router = Router();

router.get('/', ReferralController.getAll);
router.post('/', ReferralController.createLead);
router.get('/student/:studentId', ReferralController.getStudentStats);
router.put('/:id/status', ReferralController.updateStatus);

// Payouts
router.get('/payouts', ReferralController.getAllPayouts);
router.post('/payouts', ReferralController.requestPayout);
router.put('/payouts/:id', ReferralController.updatePayoutStatus);

export default router;
