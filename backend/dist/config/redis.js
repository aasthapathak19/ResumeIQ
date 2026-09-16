"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiQueue = exports.getRedisClient = exports.connectRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const bullmq_1 = require("bullmq");
const env_1 = require("./env");
let redisClient;
let aiQueue;
const connectRedis = async () => {
    try {
        const redisUrl = env_1.config.redisUrl;
        if (!redisUrl) {
            throw new Error('REDIS_URL is not defined in the environment variables');
        }
        redisClient = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null, // Required by BullMQ
        });
        redisClient.on('connect', () => {
            console.log('🔴 Redis Connected successfully');
        });
        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
        // Initialize BullMQ Queue
        aiQueue = new bullmq_1.Queue('ai-processing-queue', { connection: redisClient });
    }
    catch (error) {
        console.error('❌ Error connecting to Redis:', error);
        process.exit(1);
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => redisClient;
exports.getRedisClient = getRedisClient;
const getAiQueue = () => aiQueue;
exports.getAiQueue = getAiQueue;
