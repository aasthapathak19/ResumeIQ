"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAiWorker = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const gemini_service_1 = require("../services/gemini.service");
const scoring_service_1 = require("../services/scoring.service");
const env_1 = require("../config/env");
const Resume_1 = __importDefault(require("../models/Resume"));
const Analysis_1 = __importDefault(require("../models/Analysis"));
const startAiWorker = () => {
    const redisConnection = new ioredis_1.default(env_1.config.redisUrl, {
        maxRetriesPerRequest: null
    });
    const worker = new bullmq_1.Worker('ai-processing-queue', async (job) => {
        console.log(`Processing job ${job.id} for resume ${job.data.resumeId}`);
        const { resumeId, filePath, userId, jobDescription } = job.data;
        try {
            // 1. Update resume status to analyzing
            await Resume_1.default.findByIdAndUpdate(resumeId, { status: 'analyzing' });
            // 2. Call Gemini Service (Extract features)
            const aiExtraction = await (0, gemini_service_1.analyzeResumeContent)(filePath, jobDescription);
            // 3. Compute Deterministic ATS Score
            const scoringResult = (0, scoring_service_1.calculateATSScore)(aiExtraction, jobDescription);
            // 4. Save Analysis to DB
            const analysis = new Analysis_1.default({
                resumeId,
                atsScore: scoringResult.overallScore,
                scoreBreakdown: scoringResult.breakdown,
                scoringVersion: scoringResult.version,
                aiModel: 'gemini-3.6-flash',
                promptVersion: 'v2.0-extraction',
                jobDescription: jobDescription,
                summary: aiExtraction.summary,
                strengths: aiExtraction.strengths,
                weaknesses: aiExtraction.weaknesses,
                missingKeywords: aiExtraction.missingKeywords,
                suggestions: aiExtraction.suggestions,
                coverLetter: aiExtraction.coverLetter,
                interviewQuestions: aiExtraction.interviewQuestions,
            });
            await analysis.save();
            // 5. Update resume status to completed
            await Resume_1.default.findByIdAndUpdate(resumeId, { status: 'completed' });
            console.log(`Successfully completed job ${job.id}`);
            return analysis;
        }
        catch (error) {
            console.error(`Failed to process job ${job.id} (Attempt ${job.attemptsMade + 1}):`, error);
            throw error;
        }
    }, { connection: redisConnection });
    const queueEvents = new bullmq_1.QueueEvents('ai-processing-queue', { connection: redisConnection });
    queueEvents.on('failed', async ({ jobId, failedReason }) => {
        // BullMQ QueueEvents 'failed' fires when a job finally exhausts all retries or fails permanently.
        console.error(`Job ${jobId} has permanently failed: ${failedReason}`);
        try {
            // We need to fetch the job to get the resumeId
            const { Job } = await Promise.resolve().then(() => __importStar(require('bullmq')));
            const job = await Job.fromId(worker.opts.connection, jobId);
            if (job?.data?.resumeId) {
                await Resume_1.default.findByIdAndUpdate(job.data.resumeId, { status: 'failed' });
                console.log(`Updated Resume ${job.data.resumeId} status to failed.`);
            }
        }
        catch (e) {
            console.error(`Failed to update DB for failed job ${jobId}:`, e);
        }
    });
    // Log transient attempt errors from the local worker
    worker.on('failed', (job, err) => {
        if (job) {
            const maxAttempts = job.opts.attempts || 1;
            if (job.attemptsMade < maxAttempts) {
                console.warn(`Job ${job.id} failed attempt ${job.attemptsMade} of ${maxAttempts}. Will retry. Error: ${err.message}`);
            }
        }
    });
    const gracefulShutdown = async (signal) => {
        console.log(`Received ${signal}, closing worker gracefully...`);
        await worker.close();
        await redisConnection.quit();
        process.exit(0);
    };
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    console.log('🤖 AI Worker is running and listening to queue...');
};
exports.startAiWorker = startAiWorker;
