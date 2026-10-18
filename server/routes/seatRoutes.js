import { Router } from 'express';
import { SeatController } from '../controllers/seatController.js';

const router = Router();

router.get('/layout', SeatController.getLayout);
router.put('/layout', SeatController.saveLayout);
router.put('/dimensions', SeatController.updateDimensions);
router.put('/cells/:id', SeatController.updateSeat);
router.post('/cells/:id/assign', SeatController.assignStudent);
router.post('/cells/:id/unassign', SeatController.unassignStudent);

export default router;
