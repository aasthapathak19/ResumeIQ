"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiResponseSchema = void 0;
const zod_1 = require("zod");
exports.geminiResponseSchema = zod_1.z.object({
    // Extraction fields for deterministic scoring
    extractedKeywords: zod_1.z.array(zod_1.z.string()),
    extractedSkills: zod_1.z.array(zod_1.z.string()),
    hasExperienceSection: zod_1.z.boolean(),
    hasEducationSection: zod_1.z.boolean(),
    hasSkillsSection: zod_1.z.boolean(),
    yearsOfExperience: zod_1.z.number().default(0),
    semanticScore: zod_1.z.number().min(0).max(20), // 0-20 AI quality score
    // Qualitative fields
    summary: zod_1.z.string(),
    strengths: zod_1.z.array(zod_1.z.string()),
    weaknesses: zod_1.z.array(zod_1.z.string()),
    missingKeywords: zod_1.z.array(zod_1.z.string()),
    suggestions: zod_1.z.array(zod_1.z.string()),
    // Non-critical fields gracefully fallback instead of crashing the whole analysis
    coverLetter: zod_1.z.string().nullable().catch(null),
    interviewQuestions: zod_1.z.array(zod_1.z.object({
        category: zod_1.z.string(),
        question: zod_1.z.string(),
        rationale: zod_1.z.string()
    })).catch([]),
});
