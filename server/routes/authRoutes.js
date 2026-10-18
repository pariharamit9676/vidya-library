import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

router.post('/login', AuthController.login);
router.get('/me', AuthController.getProfile);

export default router;
