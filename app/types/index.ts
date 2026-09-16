export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Resume {
  _id: string;
  userId: string;
  originalName: string;
  fileName: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  uploadDate: string;
  jobDescription?: string;
  jobTitle?: string;
  companyName?: string;
}

export interface ScoreBreakdown {
  keywordMatch: number;
  skillsMatch: number;
  structure: number;
  experience: number;
  semanticMatch: number;
}

export interface Analysis {
  _id: string;
  resumeId: string;
  atsScore: number;
  scoreBreakdown?: ScoreBreakdown;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
  coverLetter?: string;
  interviewQuestions?: {
    category: string;
    question: string;
    rationale: string;
  }[];
  createdAt: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  error?: string;
  details?: any;
}
