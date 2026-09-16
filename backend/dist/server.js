"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
const PORT = env_1.config.port;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.config.frontendUrl, // Configurable frontend origin
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const share_routes_1 = __importDefault(require("./routes/share.routes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
// API Routes
app.use('/api/auth', auth_routes_1.default); // Auth routes have their own specific limiters inside
app.use('/api/resumes', rateLimiter_1.apiLimiter, resume_routes_1.default); // Apply general API limit
app.use('/api/ai', rateLimiter_1.apiLimiter, ai_routes_1.default); // Apply general API limit
app.use('/api/share', share_routes_1.default); // Share routes have their own rate limits
const error_1 = require("./middleware/error");
// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});
// Centralized error handler should be the last middleware
app.use(error_1.errorHandler);
const logger_1 = require("./utils/logger");
// Start Server
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        await (0, redis_1.connectRedis)();
        app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
