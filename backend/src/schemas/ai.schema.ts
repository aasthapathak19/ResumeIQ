import { z } from 'zod';

export const geminiResponseSchema = z.object({
  // Extraction fields for deterministic scoring
  extractedKeywords: z.array(z.string()),
  extractedSkills: z.array(z.string()),
  hasExperienceSection: z.boolean(),
  hasEducationSection: z.boolean(),
  hasSkillsSection: z.boolean(),
  yearsOfExperience: z.number().default(0),
  semanticScore: z.number().min(0).max(20), // 0-20 AI quality score
  
  // Qualitative fields
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
  // Non-critical fields gracefully fallback instead of crashing the whole analysis
  coverLetter: z.string().nullable().catch(null),
  interviewQuestions: z.array(z.string()).catch([]),
});

export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
