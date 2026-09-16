import { Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import Resume from '../models/Resume';
import Analysis from '../models/Analysis';
import { getAiQueue } from '../config/redis';

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, path, size, mimetype } = req.file;
    const { companyName, jobTitle, jobDescription } = req.body;

    const resume = new Resume({
      userId: req.user?.id,
      originalName: originalname,
      fileName: filename,
      filePath: path,
      fileSize: size,
      mimeType: mimetype,
      status: 'uploaded',
    });

    await resume.save();

    // Trigger AI processing job via BullMQ
    const aiQueue = getAiQueue();
    await aiQueue.add('analyze-resume', {
      resumeId: resume._id.toString(),
      filePath: resume.filePath,
      userId: req.user?.id,
      jobDescription
    });

    res.status(201).json({ message: 'File uploaded and queued for processing', resume });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Server error during file upload' });
  }
};

export const getAllResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await Resume.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user?.id) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'analyses',
          localField: '_id',
          foreignField: 'resumeId',
          as: 'analysis'
        }
      },
      {
        $addFields: {
          analysis: { $arrayElemAt: ['$analysis', 0] }
        }
      }
    ]);
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching resumes' });
  }
};

export const getResumeById = async (req: Request, res: Response) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching resume' });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Delete associated AI Analysis
    await Analysis.findOneAndDelete({ resumeId: resume._id });

    // Delete physical file
    if (resume.filePath && fs.existsSync(resume.filePath)) {
        fs.unlinkSync(resume.filePath);
    }
    
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Server error deleting resume' });
  }
};
