import { Request, Response } from 'express';
import Analysis from '../models/Analysis';
import Resume from '../models/Resume';

export const getAnalysis = async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.params;

    // First ensure the user owns this resume
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user?.id });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found or unauthorized' });
    }

    // Check if analysis is ready
    if (resume.status !== 'completed') {
      return res.status(202).json({ 
        status: resume.status, 
        message: 'Analysis is still in progress' 
      });
    }

    const analysis = await Analysis.findOne({ resumeId });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching analysis' });
  }
};
