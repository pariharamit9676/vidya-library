import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', DashboardController.getStats);
router.get('/charts', DashboardController.getCharts);

export default router;
