import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Resume from '../models/Resume';
import Analysis from '../models/Analysis';
import { getAiQueue } from '../config/redis';
import { StorageService } from '../services/storage.service';

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
      shareToken: crypto.randomUUID(),
    });

    await resume.save();

    // Trigger AI processing job via BullMQ
    const aiQueue = getAiQueue();
    const jobId = `analyze-${resume._id.toString()}`; // Idempotency key
    await aiQueue.add(
      'analyze-resume',
      {
        resumeId: resume._id.toString(),
        filePath: resume.filePath,
        userId: req.user?.id,
        jobDescription
      },
      {
        jobId, // Prevent duplicate jobs if the exact same resume is queued
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000, // 5s, 10s, 20s
        },
        removeOnComplete: true,
      }
    );

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
    if (resume.filePath) {
        await StorageService.deleteFile(resume.filePath).catch(e => console.error(e));
    }
    
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Server error deleting resume' });
  }
};

export const getResumeFile = async (req: Request, res: Response) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Check if the user is authorized to download this file
    if (resume.userId.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to download this file' });
    }

    const fileStream = StorageService.getFileStream(resume.filePath);
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      res.status(404).json({ message: 'File not found on server' });
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error streaming resume file:', error);
    res.status(500).json({ error: 'Server error streaming resume file' });
  }
};

export const getSharedResume = async (req: Request, res: Response) => {
  try {
    const resume = await Resume.findOne({ shareToken: req.params.token });
    if (!resume) {
      return res.status(404).json({ error: 'Shared resume not found' });
    }
    
    const analysis = await Analysis.findOne({ resumeId: resume._id });
    
    // We shouldn't leak the original _id or userId here, but for simplicity we will just return the resume object and analysis.
    res.status(200).json({ resume, analysis });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching shared resume' });
  }
};

export const getSharedResumeFile = async (req: Request, res: Response) => {
  try {
    const resume = await Resume.findOne({ shareToken: req.params.token });
    if (!resume) {
      return res.status(404).json({ error: 'Shared resume not found' });
    }

    const fileStream = StorageService.getFileStream(resume.filePath);
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      res.status(404).json({ message: 'File not found on server' });
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error streaming shared resume file:', error);
    res.status(500).json({ error: 'Server error streaming resume file' });
  }
};
