import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { analyzeResumeContent } from '../services/gemini.service';
import Resume from '../models/Resume';
import Analysis from '../models/Analysis';

export const startAiWorker = () => {
  const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
  });

  const worker = new Worker('ai-processing-queue', async (job) => {
    console.log(`Processing job ${job.id} for resume ${job.data.resumeId}`);
    const { resumeId, filePath, userId, jobDescription } = job.data;

    try {
      // 1. Update resume status to analyzing
      await Resume.findByIdAndUpdate(resumeId, { status: 'analyzing' });

      // 2. Call Gemini Service
      const analysisResult = await analyzeResumeContent(filePath, jobDescription);

      // 3. Save Analysis to DB
      const analysis = new Analysis({
        resumeId,
        atsScore: analysisResult.atsScore,
        summary: analysisResult.summary,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        missingKeywords: analysisResult.missingKeywords,
        sectionScores: analysisResult.sectionScores,
        suggestions: analysisResult.suggestions,
        coverLetter: analysisResult.coverLetter,
        interviewQuestions: analysisResult.interviewQuestions,
      });
      await analysis.save();

      // 4. Update resume status to completed
      await Resume.findByIdAndUpdate(resumeId, { status: 'completed' });

      console.log(`Successfully completed job ${job.id}`);
      return analysisResult;
    } catch (error) {
      console.error(`Failed to process job ${job.id}:`, error);
      // Mark as failed
      await Resume.findByIdAndUpdate(resumeId, { status: 'failed' });
      throw error;
    }
  }, { connection: redisConnection });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} has failed with ${err.message}`);
  });

  console.log('🤖 AI Worker is running and listening to queue...');
};
