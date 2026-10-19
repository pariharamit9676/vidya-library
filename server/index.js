import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { connectDB } from './config/database.js';
import { seedMongoIfEmpty } from './utils/mongoSync.js';
import apiRoutes from './routes/index.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { StudentModel } from './models/Student.js';

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use(requestLogger);

// Mount API Routes
app.use('/api', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    name: 'Viya Library Management System API',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'Running'
  });
});

// Centralized Error Handling
app.use(errorHandler);

// Connect to MongoDB Atlas & Initialize
const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await seedMongoIfEmpty();
    try {
      await StudentModel.resetTodayAttendance('all');
      console.log('🍃 [Attendance] Today check-in limits successfully reset to 0/3.');
    } catch (resetErr) {
      console.error('🍃 [Attendance Reset Error]:', resetErr.message);
    }
  }

  // Always migrate any student missing a referral code (MongoDB and local store)
  try {
    await StudentModel.migrateReferralCodes();
  } catch (migErr) {
    console.error('🍃 [Referral Migration Error]:', migErr.message);
  }

  const server = app.listen(ENV.PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Viya Library Backend Server running!`);
    console.log(`📡 URL: http://localhost:${ENV.PORT}`);
    console.log(`🛡️  Environment: ${ENV.NODE_ENV}`);
    console.log(`📊 Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`🍃 Database: ${isConnected ? 'MongoDB Atlas (Connected)' : 'Local JSON Store'}`);
    console.log(`===============================================`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated.');
    });
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});

export default app;
