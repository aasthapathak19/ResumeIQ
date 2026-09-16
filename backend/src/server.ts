import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { config } from './config/env';

const app = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl, // Configurable frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import aiRoutes from './routes/ai.routes';
import shareRoutes from './routes/share.routes';
import { apiLimiter } from './middleware/rateLimiter';

// API Routes
app.use('/api/auth', authRoutes); // Auth routes have their own specific limiters inside
app.use('/api/resumes', apiLimiter, resumeRoutes); // Apply general API limit
app.use('/api/ai', apiLimiter, aiRoutes); // Apply general API limit
app.use('/api/share', shareRoutes); // Share routes have their own rate limits

import { errorHandler } from './middleware/error';

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Centralized error handler should be the last middleware
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
