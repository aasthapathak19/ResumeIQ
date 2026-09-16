"use strict";
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
    worker.on('failed', async (job, err) => {
        console.error(`Job ${job?.id} has finally failed after all attempts: ${err.message}`);
        if (job?.data?.resumeId) {
            await Resume_1.default.findByIdAndUpdate(job.data.resumeId, { status: 'failed' }).catch(e => console.error(e));
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
