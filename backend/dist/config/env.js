"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvs = [
    'MONGODB_URI',
    'REDIS_URL',
    'JWT_SECRET',
    'GEMINI_API_KEY',
    'FRONTEND_URL'
];
for (const env of requiredEnvs) {
    if (!process.env[env]) {
        throw new Error(`CRITICAL: Required environment variable ${env} is missing.`);
    }
}
exports.config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    frontendUrl: process.env.FRONTEND_URL,
    uploadDir: process.env.UPLOAD_DIR || '/app/uploads',
};
