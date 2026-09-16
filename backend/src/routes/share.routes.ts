import { Router } from 'express';
import { getSharedResume, getSharedResumeFile } from '../controllers/resume.controller';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Unauthenticated routes for viewing shared resumes
router.get('/:token', apiLimiter, getSharedResume);
router.get('/:token/file', apiLimiter, getSharedResumeFile);

export default router;
