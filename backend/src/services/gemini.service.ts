import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import { config } from '../config/env';
import { geminiResponseSchema } from '../schemas/ai.schema';

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

export const analyzeResumeContent = async (filePath: string, jobDescription?: string) => {
  try {
    const fileBytes = fs.readFileSync(filePath);
    const fileBase64 = Buffer.from(fileBytes).toString('base64');

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
      Extract information from the attached resume${jobDescription ? ' against the following job description: ' + jobDescription : ''}.
      
      Return ONLY a valid JSON object with the exact following structure:
      {
        "extractedKeywords": string[] (list of keywords found in the resume relevant to the job),
        "extractedSkills": string[] (list of skills found in the resume),
        "hasExperienceSection": boolean (true if resume has a work experience section),
        "hasEducationSection": boolean (true if resume has an education section),
        "hasSkillsSection": boolean (true if resume has a skills section),
        "yearsOfExperience": number (total years of professional experience, 0 if none),
        "semanticScore": number (0-20, representing the AI's subjective evaluation of the writing quality and impact),
        "summary": string (2-3 sentences summarizing the candidate),
        "strengths": string[] (list of 3-5 strengths),
        "weaknesses": string[] (list of 3-5 areas of improvement),
        "missingKeywords": string[] (list of important keywords missing from the JD, e.g. "React (Required for frontend)"),
        "suggestions": string[] (3 actionable tips to improve the resume),
        "coverLetter": string (A professional, engaging cover letter drafted based on the resume),
        "interviewQuestions": object[] (5 targeted interview questions to prepare for, each object must have { "category": "Technical" | "Behavioral", "question": string, "rationale": string })
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: fileBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);
    
    // Strict Zod Validation (Throws error and triggers BullMQ retry if critical fields fail)
    return geminiResponseSchema.parse(parsedData);
  } catch (error) {
    console.error('Error analyzing resume with Gemini or validating output:', error);
    throw error;
  }
};
