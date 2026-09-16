"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalysis = void 0;
const Analysis_1 = __importDefault(require("../models/Analysis"));
const Resume_1 = __importDefault(require("../models/Resume"));
const getAnalysis = async (req, res) => {
    try {
        const { resumeId } = req.params;
        // First ensure the user owns this resume
        const resume = await Resume_1.default.findOne({ _id: resumeId, userId: req.user?.id });
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
        const analysis = await Analysis_1.default.findOne({ resumeId });
        if (!analysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }
        res.status(200).json(analysis);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error fetching analysis' });
    }
};
exports.getAnalysis = getAnalysis;
