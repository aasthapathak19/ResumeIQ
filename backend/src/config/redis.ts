import Redis from 'ioredis';
import { Queue } from 'bullmq';

let redisClient: Redis;
let aiQueue: Queue;

export const connectRedis = async (): Promise<void> => {
  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in the environment variables');
    }

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null, // Required by BullMQ
    });

    redisClient.on('connect', () => {
      console.log('🔴 Redis Connected successfully');
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    // Initialize BullMQ Queue
    aiQueue = new Queue('ai-processing-queue', { connection: redisClient });

  } catch (error) {
    console.error('❌ Error connecting to Redis:', error);
    process.exit(1);
  }
};

export const getRedisClient = () => redisClient;
export const getAiQueue = () => aiQueue;
