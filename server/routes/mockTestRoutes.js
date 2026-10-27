import { Router } from 'express';
import { mockTestController } from '../controllers/mockTestController.js';

const router = Router();

// Test management & Catalog
router.get('/', mockTestController.getAllTests);
router.get('/attempts/my', mockTestController.getMyAttempts);
router.get('/attempts/:attemptId', mockTestController.getAttemptDetails);
router.get('/:id', mockTestController.getTestById);
router.post('/generate', mockTestController.generateTest);
router.post('/:id/submit', mockTestController.submitAttempt);
router.delete('/:id', mockTestController.deleteTest);

export default router;
