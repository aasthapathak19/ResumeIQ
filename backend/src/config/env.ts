import dotenv from 'dotenv';
dotenv.config();

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

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI as string,
  redisUrl: process.env.REDIS_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  geminiApiKey: process.env.GEMINI_API_KEY as string,
  frontendUrl: process.env.FRONTEND_URL as string,
  uploadDir: process.env.UPLOAD_DIR || '/app/uploads',
};
