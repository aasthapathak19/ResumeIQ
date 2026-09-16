import { Router } from 'express';
import { uploadResume, getAllResumes, getResumeById, deleteResume, getResumeFile } from '../controllers/resume.controller';
import { requireAuth } from '../middleware/auth';
import { upload } from '../services/storage.service';
import { uploadLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validate';
import { uploadSchema } from '../schemas/resume.schema';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(requireAuth);

router.post('/upload', uploadLimiter, upload.single('resumeFile'), validateRequest(uploadSchema), uploadResume);
router.get('/', getAllResumes);
router.get('/:id', getResumeById);
router.get('/:id/file', getResumeFile);
router.delete('/:id', deleteResume);

export default router;
