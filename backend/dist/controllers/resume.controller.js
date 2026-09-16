"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedResumeFile = exports.getSharedResume = exports.getResumeFile = exports.deleteResume = exports.getResumeById = exports.getAllResumes = exports.uploadResume = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const Resume_1 = __importDefault(require("../models/Resume"));
const Analysis_1 = __importDefault(require("../models/Analysis"));
const redis_1 = require("../config/redis");
const storage_service_1 = require("../services/storage.service");
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { originalname, filename, path, size, mimetype } = req.file;
        const { companyName, jobTitle, jobDescription } = req.body;
        const resume = new Resume_1.default({
            userId: req.user?.id,
            originalName: originalname,
            fileName: filename,
            filePath: path,
            fileSize: size,
            mimeType: mimetype,
            status: 'uploaded',
            shareToken: crypto_1.default.randomUUID(),
        });
        await resume.save();
        // Trigger AI processing job via BullMQ
        const aiQueue = (0, redis_1.getAiQueue)();
        const jobId = `analyze-${resume._id.toString()}`; // Idempotency key
        await aiQueue.add('analyze-resume', {
            resumeId: resume._id.toString(),
            filePath: resume.filePath,
            userId: req.user?.id,
            jobDescription
        }, {
            jobId, // Prevent duplicate jobs if the exact same resume is queued
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000, // 5s, 10s, 20s
            },
            removeOnComplete: true,
        });
        res.status(201).json({ message: 'File uploaded and queued for processing', resume });
    }
    catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ error: 'Server error during file upload' });
    }
};
exports.uploadResume = uploadResume;
const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume_1.default.aggregate([
            { $match: { userId: new mongoose_1.default.Types.ObjectId(req.user?.id) } },
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
    }
    catch (error) {
        res.status(500).json({ error: 'Server error fetching resumes' });
    }
};
exports.getAllResumes = getAllResumes;
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume_1.default.findOne({ _id: req.params.id, userId: req.user?.id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        res.status(200).json(resume);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error fetching resume' });
    }
};
exports.getResumeById = getResumeById;
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume_1.default.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        // Delete associated AI Analysis
        await Analysis_1.default.findOneAndDelete({ resumeId: resume._id });
        // Delete physical file
        if (resume.filePath) {
            await storage_service_1.StorageService.deleteFile(resume.filePath).catch(e => console.error(e));
        }
        res.status(200).json({ message: 'Resume deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ error: 'Server error deleting resume' });
    }
};
exports.deleteResume = deleteResume;
const getResumeFile = async (req, res) => {
    try {
        const resume = await Resume_1.default.findOne({ _id: req.params.id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        // Check if the user is authorized to download this file
        if (resume.userId.toString() !== req.user?.id) {
            return res.status(403).json({ message: 'Not authorized to download this file' });
        }
        const fileStream = storage_service_1.StorageService.getFileStream(resume.filePath);
        fileStream.on('error', (err) => {
            console.error('File stream error:', err);
            res.status(404).json({ message: 'File not found on server' });
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error('Error streaming resume file:', error);
        res.status(500).json({ error: 'Server error streaming resume file' });
    }
};
exports.getResumeFile = getResumeFile;
const getSharedResume = async (req, res) => {
    try {
        const resume = await Resume_1.default.findOne({ shareToken: req.params.token });
        if (!resume) {
            return res.status(404).json({ error: 'Shared resume not found' });
        }
        const analysis = await Analysis_1.default.findOne({ resumeId: resume._id });
        // We shouldn't leak the original _id or userId here, but for simplicity we will just return the resume object and analysis.
        res.status(200).json({ resume, analysis });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error fetching shared resume' });
    }
};
exports.getSharedResume = getSharedResume;
const getSharedResumeFile = async (req, res) => {
    try {
        const resume = await Resume_1.default.findOne({ shareToken: req.params.token });
        if (!resume) {
            return res.status(404).json({ error: 'Shared resume not found' });
        }
        const fileStream = storage_service_1.StorageService.getFileStream(resume.filePath);
        fileStream.on('error', (err) => {
            console.error('File stream error:', err);
            res.status(404).json({ message: 'File not found on server' });
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error('Error streaming shared resume file:', error);
        res.status(500).json({ error: 'Server error streaming resume file' });
    }
};
exports.getSharedResumeFile = getSharedResumeFile;
