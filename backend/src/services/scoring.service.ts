import { GeminiResponse } from '../schemas/ai.schema';

export const SCORING_WEIGHTS = {
  keywordMatch: 25,
  skillsMatch: 25,
  structure: 15,
  experience: 15,
  semanticMatch: 20,
};

export const SCORING_VERSION = 'v2.0-deterministic';

export const calculateATSScore = (aiExtraction: GeminiResponse, jobDescription?: string) => {
  let keywordScore = 0;
  let skillsScore = 0;
  let structureScore = 0;
  let experienceScore = 0;
  let semanticScore = Math.min(aiExtraction.semanticScore, SCORING_WEIGHTS.semanticMatch);

  // 1. Keyword Match (Max 25)
  // In a real deterministic engine, we'd compare aiExtraction.extractedKeywords with JD keywords.
  // Since we rely on Gemini to tell us missingKeywords, we can score based on the ratio.
  const missingK = aiExtraction.missingKeywords.length;
  const foundK = aiExtraction.extractedKeywords.length;
  const totalK = missingK + foundK;
  
  if (totalK > 0) {
    keywordScore = Math.round((foundK / totalK) * SCORING_WEIGHTS.keywordMatch);
  } else {
    // If no keywords found or missing, give partial default
    keywordScore = Math.round(SCORING_WEIGHTS.keywordMatch * 0.5);
  }

  // 2. Skills Match (Max 25)
  // Since we don't have the hard JD skills array without another LLM call, 
  // we estimate based on the extracted skills list length (assuming more relevant skills = better).
  // A robust approach would extract JD skills and intersect. For now, we scale it.
  const foundSkills = aiExtraction.extractedSkills.length;
  if (foundSkills > 15) skillsScore = SCORING_WEIGHTS.skillsMatch;
  else if (foundSkills > 10) skillsScore = 20;
  else if (foundSkills > 5) skillsScore = 15;
  else if (foundSkills > 0) skillsScore = 10;
  else skillsScore = 0;

  // 3. Structure (Max 15)
  let structurePoints = 0;
  if (aiExtraction.hasExperienceSection) structurePoints += 5;
  if (aiExtraction.hasEducationSection) structurePoints += 5;
  if (aiExtraction.hasSkillsSection) structurePoints += 5;
  structureScore = structurePoints;

  // 4. Experience (Max 15)
  if (aiExtraction.yearsOfExperience >= 5) experienceScore = SCORING_WEIGHTS.experience;
  else if (aiExtraction.yearsOfExperience >= 3) experienceScore = 10;
  else if (aiExtraction.yearsOfExperience >= 1) experienceScore = 5;
  else experienceScore = 0;

  // Ensure bounds
  keywordScore = Math.min(keywordScore, SCORING_WEIGHTS.keywordMatch);
  skillsScore = Math.min(skillsScore, SCORING_WEIGHTS.skillsMatch);
  
  const totalScore = keywordScore + skillsScore + structureScore + experienceScore + semanticScore;

  return {
    overallScore: totalScore,
    breakdown: {
      keywordMatch: keywordScore,
      skillsMatch: skillsScore,
      structure: structureScore,
      experience: experienceScore,
      semanticMatch: semanticScore,
    },
    version: SCORING_VERSION,
  };
};
