import { Router } from 'express';
import { getAnalysis } from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(requireAuth);

router.get('/analysis/:resumeId', getAnalysis);

export default router;
