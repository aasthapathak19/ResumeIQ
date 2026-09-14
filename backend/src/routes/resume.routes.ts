import { Router } from 'express';
import { uploadResume, getAllResumes, getResumeById, deleteResume } from '../controllers/resume.controller';
import { requireAuth } from '../middleware/auth';
import { upload } from '../services/storage.service';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(requireAuth);

router.post('/upload', upload.single('resumeFile'), uploadResume);
router.get('/', getAllResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;
