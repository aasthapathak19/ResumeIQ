import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysis extends Document {
  resumeId: mongoose.Types.ObjectId;
  jobDescriptionId?: mongoose.Types.ObjectId;
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  sectionScores: {
    summary?: number;
    experience?: number;
    skills?: number;
    education?: number;
  };
  suggestions: string[];
  coverLetter?: string;
  interviewQuestions?: string[];
  scoreBreakdown?: {
    keywordMatch: number;
    skillsMatch: number;
    structure: number;
    experience: number;
    semanticMatch: number;
  };
  scoringVersion?: string;
  aiModel?: string;
  promptVersion?: string;
  jobDescription?: string;
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
  jobDescriptionId: { type: Schema.Types.ObjectId, ref: 'JobDescription' },
  atsScore: { type: Number, required: true },
  summary: { type: String, required: true },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  missingKeywords: [{ type: String }],
  sectionScores: {
    summary: { type: Number },
    experience: { type: Number },
    skills: { type: Number },
    education: { type: Number },
  },
  scoreBreakdown: {
    keywordMatch: { type: Number },
    skillsMatch: { type: Number },
    structure: { type: Number },
    experience: { type: Number },
    semanticMatch: { type: Number },
  },
  scoringVersion: { type: String },
  aiModel: { type: String },
  promptVersion: { type: String },
  jobDescription: { type: String },
  suggestions: [{ type: String }],
  coverLetter: { type: String },
  interviewQuestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

// Index for fetching analysis by resumeId
AnalysisSchema.index({ resumeId: 1 });

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
