import { Router } from 'express';
import { StudentController } from '../controllers/studentController.js';

const router = Router();

router.get('/', StudentController.getAll);
router.post('/bulk-delete', StudentController.bulkDelete);
router.get('/:id', StudentController.getById);
router.post('/', StudentController.create);
router.put('/:id', StudentController.update);
router.delete('/:id', StudentController.delete);

router.post('/:id/check-in', StudentController.toggleCheckIn);
router.post('/:id/payments', StudentController.recordPayment);
router.post('/:id/change-password', StudentController.changePassword);

export default router;
