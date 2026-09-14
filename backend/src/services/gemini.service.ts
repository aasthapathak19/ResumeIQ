import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeResumeContent = async (filePath: string, jobDescription?: string) => {
  try {
    // Basic implementation reading PDF as base64 and passing to Gemini
    // For a production app, we would use the File API for larger files, but for resumes this works.
    const fileBytes = fs.readFileSync(filePath);
    const fileBase64 = Buffer.from(fileBytes).toString('base64');

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
      Analyze the attached resume${jobDescription ? ' against the following job description: ' + jobDescription : ''}.
      
      Return ONLY a valid JSON object with the following structure:
      {
        "atsScore": number (0-100),
        "summary": string (2-3 sentences),
        "strengths": string[] (list of 3-5 strengths),
        "weaknesses": string[] (list of 3-5 areas of improvement),
        "missingKeywords": string[] (list of important keywords missing),
        "sectionScores": {
          "summary": number (0-100),
          "experience": number (0-100),
          "skills": number (0-100),
          "education": number (0-100)
        },
        "suggestions": string[] (3 actionable tips to improve the resume)
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using Gemini 2.5 Flash as it is fast and handles documents well
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
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    throw error;
  }
};
