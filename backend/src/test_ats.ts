import { calculateATSScore } from './services/scoring.service';
import { GeminiResponse } from './schemas/ai.schema';

const test1: GeminiResponse = {
  extractedKeywords: ['react', 'node', 'typescript', 'aws', 'docker'],
  extractedSkills: ['react', 'node', 'typescript', 'aws', 'docker', 'git', 'sql', 'mongodb', 'express', 'css', 'html', 'jest', 'bullmq', 'redis', 'linux', 'ci/cd'],
  hasExperienceSection: true,
  hasEducationSection: true,
  hasSkillsSection: true,
  yearsOfExperience: 5,
  semanticScore: 19,
  summary: '', strengths: [], weaknesses: [], missingKeywords: [], suggestions: [], coverLetter: null, interviewQuestions: []
};

const test2: GeminiResponse = {
  extractedKeywords: ['react', 'node'],
  extractedSkills: ['react', 'node', 'javascript', 'css', 'html', 'git'],
  hasExperienceSection: true,
  hasEducationSection: false,
  hasSkillsSection: true,
  yearsOfExperience: 2,
  semanticScore: 12,
  summary: '', strengths: [], weaknesses: [], missingKeywords: ['typescript', 'aws', 'docker'], suggestions: [], coverLetter: null, interviewQuestions: []
};

const test3: GeminiResponse = {
  extractedKeywords: [],
  extractedSkills: ['html', 'css'],
  hasExperienceSection: false,
  hasEducationSection: false,
  hasSkillsSection: false,
  yearsOfExperience: 0,
  semanticScore: 5,
  summary: '', strengths: [], weaknesses: [], missingKeywords: ['react', 'node', 'typescript', 'aws', 'docker'], suggestions: [], coverLetter: null, interviewQuestions: []
};

console.log("=== Strong Match ===");
console.dir(calculateATSScore(test1, "React Node Typescript AWS Docker").breakdown);
console.log("=== Partial Match ===");
console.dir(calculateATSScore(test2, "React Node Typescript AWS Docker").breakdown);
console.log("=== Poor Match ===");
console.dir(calculateATSScore(test3, "React Node Typescript AWS Docker").breakdown);
