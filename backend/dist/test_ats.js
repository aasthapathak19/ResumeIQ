"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scoring_service_1 = require("./services/scoring.service");
const test1 = {
    extractedKeywords: ['react', 'node', 'typescript', 'aws', 'docker'],
    extractedSkills: ['react', 'node', 'typescript', 'aws', 'docker', 'git', 'sql', 'mongodb', 'express', 'css', 'html', 'jest', 'bullmq', 'redis', 'linux', 'ci/cd'],
    hasExperienceSection: true,
    hasEducationSection: true,
    hasSkillsSection: true,
    yearsOfExperience: 5,
    semanticScore: 19,
    summary: '', strengths: [], weaknesses: [], missingKeywords: [], suggestions: [], coverLetter: null, interviewQuestions: []
};
const test2 = {
    extractedKeywords: ['react', 'node'],
    extractedSkills: ['react', 'node', 'javascript', 'css', 'html', 'git'],
    hasExperienceSection: true,
    hasEducationSection: false,
    hasSkillsSection: true,
    yearsOfExperience: 2,
    semanticScore: 12,
    summary: '', strengths: [], weaknesses: [], missingKeywords: ['typescript', 'aws', 'docker'], suggestions: [], coverLetter: null, interviewQuestions: []
};
const test3 = {
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
console.dir((0, scoring_service_1.calculateATSScore)(test1, "React Node Typescript AWS Docker").breakdown);
console.log("=== Partial Match ===");
console.dir((0, scoring_service_1.calculateATSScore)(test2, "React Node Typescript AWS Docker").breakdown);
console.log("=== Poor Match ===");
console.dir((0, scoring_service_1.calculateATSScore)(test3, "React Node Typescript AWS Docker").breakdown);
