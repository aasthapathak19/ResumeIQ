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
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
