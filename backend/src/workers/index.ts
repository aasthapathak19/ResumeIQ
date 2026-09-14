import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import { startAiWorker } from './ai.worker';

dotenv.config();

const startWorkerProcess = async () => {
  try {
    // Workers need DB connection to save results
    await connectDB();
    startAiWorker();
  } catch (error) {
    console.error('Failed to start worker process:', error);
    process.exit(1);
  }
};

startWorkerProcess();
