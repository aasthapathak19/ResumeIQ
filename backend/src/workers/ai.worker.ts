import { Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { analyzeResumeContent } from '../services/gemini.service';
import { calculateATSScore } from '../services/scoring.service';
import { config } from '../config/env';
import Resume from '../models/Resume';
import Analysis from '../models/Analysis';

export const startAiWorker = () => {
  const redisConnection = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null
  });

  const worker = new Worker('ai-processing-queue', async (job) => {
    console.log(`Processing job ${job.id} for resume ${job.data.resumeId}`);
    const { resumeId, filePath, userId, jobDescription } = job.data;

    try {
      // 1. Update resume status to analyzing
      await Resume.findByIdAndUpdate(resumeId, { status: 'analyzing' });

      // 2. Call Gemini Service (Extract features)
      const aiExtraction = await analyzeResumeContent(filePath, jobDescription);

      // 3. Compute Deterministic ATS Score
      const scoringResult = calculateATSScore(aiExtraction, jobDescription);

      // 4. Save Analysis to DB
      const analysis = new Analysis({
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
      await Resume.findByIdAndUpdate(resumeId, { status: 'completed' });

      console.log(`Successfully completed job ${job.id}`);
      return analysis;
    } catch (error) {
      console.error(`Failed to process job ${job.id} (Attempt ${job.attemptsMade + 1}):`, error);
      throw error;
    }
  }, { connection: redisConnection });

  const queueEvents = new QueueEvents('ai-processing-queue', { connection: redisConnection });

  queueEvents.on('failed', async ({ jobId, failedReason }) => {
    // BullMQ QueueEvents 'failed' fires when a job finally exhausts all retries or fails permanently.
    console.error(`Job ${jobId} has permanently failed: ${failedReason}`);
    try {
      // We need to fetch the job to get the resumeId
      const { Job } = await import('bullmq');
      const job = await Job.fromId(worker.opts.connection as any, jobId);
      if (job?.data?.resumeId) {
        await Resume.findByIdAndUpdate(job.data.resumeId, { status: 'failed' });
        console.log(`Updated Resume ${job.data.resumeId} status to failed.`);
      }
    } catch (e) {
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

  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, closing worker gracefully...`);
    await worker.close();
    await redisConnection.quit();
    process.exit(0);
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  console.log('🤖 AI Worker is running and listening to queue...');
};
