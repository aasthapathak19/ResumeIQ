import { calculateATSScore } from '../scoring.service';
import { GeminiResponse } from '../../schemas/ai.schema';

describe('Scoring Service', () => {
  it('should return a high score for a perfect match', () => {
    const aiResult: GeminiResponse = {
      summary: "Great candidate",
      hasExperienceSection: true,
      hasEducationSection: true,
      hasSkillsSection: true,
      yearsOfExperience: 5,
      extractedKeywords: ["React", "TypeScript", "Node.js"],
      extractedSkills: ["React", "TypeScript", "Node.js", "Docker", "MongoDB", "Express", "AWS", "Git", "Jest", "CI/CD", "HTML", "CSS", "SQL", "Redis", "BullMQ", "Linux"],
      strengths: ["Great experience"],
      weaknesses: [],
      missingKeywords: [],
      suggestions: [],
      semanticScore: 20, // Max AI score is 20
      coverLetter: "",
      interviewQuestions: []
    };

    const result = calculateATSScore(aiResult, "Looking for 4+ years of React and Node.js experience.");

    expect(result.overallScore).toBeGreaterThan(85);
    expect(result.breakdown.structure).toBe(15);
    expect(result.breakdown.semanticMatch).toBe(20);
  });

  it('should penalize for missing structure', () => {
    const aiResult: GeminiResponse = {
      summary: "Poor candidate",
      hasExperienceSection: false,
      hasEducationSection: false,
      hasSkillsSection: false,
      yearsOfExperience: 0,
      extractedKeywords: [],
      extractedSkills: ["HTML"],
      strengths: [],
      weaknesses: ["No experience"],
      missingKeywords: ["React", "TypeScript"],
      suggestions: [],
      semanticScore: 5, 
      coverLetter: "",
      interviewQuestions: []
    };

    const result = calculateATSScore(aiResult, "Looking for 4+ years of React and Node.js experience.");

    expect(result.overallScore).toBeLessThan(40);
    expect(result.breakdown.structure).toBe(0);
  });
});
