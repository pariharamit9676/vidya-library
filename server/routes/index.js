import { Router } from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import studentRoutes from './studentRoutes.js';
import seatRoutes from './seatRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import feeRoutes from './feeRoutes.js';
import settingRoutes from './settingRoutes.js';
import referralRoutes from './referralRoutes.js';
import { isMongoConnected } from '../config/database.js';

const router = Router();

// Mount API feature routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/students', studentRoutes);
router.use('/seats', seatRoutes);
router.use('/categories', categoryRoutes);
router.use('/fees', feeRoutes);
router.use('/settings', settingRoutes);
router.use('/referrals', referralRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Viya Library Backend API is healthy and operational.',
    database: isMongoConnected() ? 'MongoDB Atlas (Connected)' : 'Local JSON Fallback',
    timestamp: new Date().toISOString()
  });
});

export default router;
