import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  originalName: string;
  fileName: string;
  filePath: string;
  previewPath?: string;
  shareToken?: string;
  fileSize: number;
  mimeType: string;
  status: 'uploaded' | 'processing' | 'analyzing' | 'completed' | 'failed';
  createdAt: Date;
}

const ResumeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  previewPath: { type: String },
  shareToken: { type: String, unique: true, index: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  status: { type: String, enum: ['uploaded', 'processing', 'analyzing', 'completed', 'failed'], default: 'uploaded' },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Compound index for getting user's resumes sorted by date (used in getAllResumes)
ResumeSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IResume>('Resume', ResumeSchema);
