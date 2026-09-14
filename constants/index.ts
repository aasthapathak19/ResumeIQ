export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            overallSummary:
                "This is a strong resume with clear project impact and relevant technical skills. The structure is clean and ATS-friendly. A few keyword gaps and vague bullet points can be tightened for even better results.",
            matchPercentage: 82,
            strengths: ["Strong project portfolio", "Quantified achievements", "Clean formatting"],
            weaknesses: ["Missing some core keywords", "Summary section generic", "Few soft skills mentioned"],
            redFlags: ["Uses 'team player' — too generic", "No quantified impact on 2 bullets"],
            missingKeywords: ["Next.js", "GraphQL", "Performance optimization"],
            skillsGap: {
                present: ["React", "TypeScript", "CSS", "JavaScript", "Git"],
                missing: ["Next.js", "GraphQL", "Docker", "CI/CD"],
            },
            rewriteSuggestions: [
                {
                    original: "Worked on improving the website performance",
                    improved: "Improved website load time by 40% through lazy loading and code splitting",
                    reason: "Quantify impact and use action verbs to make the bullet stronger",
                },
            ],
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            overallSummary:
                "This resume shows relevant cloud experience but lacks quantified results and key cloud certifications. The structure is acceptable but keyword density is low for ATS systems used by Microsoft.",
            matchPercentage: 52,
            strengths: ["Relevant cloud experience", "Mentions Azure explicitly"],
            weaknesses: ["No certifications listed", "Weak bullet points", "Low keyword density"],
            redFlags: ["No measurable outcomes", "Generic objective statement"],
            missingKeywords: ["Azure DevOps", "Terraform", "Kubernetes", "ARM templates"],
            skillsGap: {
                present: ["Azure", "Linux", "Python", "Networking"],
                missing: ["Terraform", "Kubernetes", "Azure DevOps", "ARM templates", "AZ-900"],
            },
            rewriteSuggestions: [
                {
                    original: "Managed cloud infrastructure for the company",
                    improved: "Managed and optimized Azure cloud infrastructure for 12 microservices, reducing monthly costs by 25%",
                    reason: "Specific service names and quantified savings demonstrate real impact",
                },
            ],
            ATS: { score: 60, tips: [] },
            toneAndStyle: { score: 55, tips: [] },
            content: { score: 50, tips: [] },
            structure: { score: 55, tips: [] },
            skills: { score: 55, tips: [] },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            overallSummary:
                "A solid iOS developer resume with good App Store mentions. The portfolio section is strong but the skills section needs better organization. More emphasis on SwiftUI and performance optimization will improve ATS ranking.",
            matchPercentage: 70,
            strengths: ["App Store published apps", "Swift expertise mentioned", "Good project descriptions"],
            weaknesses: ["SwiftUI underrepresented", "Testing skills not highlighted", "Missing CI/CD experience"],
            redFlags: ["Objective statement is too long", "'Passionate developer' is overused"],
            missingKeywords: ["SwiftUI", "XCTest", "Fastlane", "Core Data"],
            skillsGap: {
                present: ["Swift", "Objective-C", "UIKit", "Xcode", "Git"],
                missing: ["SwiftUI", "XCTest", "Fastlane", "Core Data", "Combine"],
            },
            rewriteSuggestions: [],
            ATS: { score: 75, tips: [] },
            toneAndStyle: { score: 80, tips: [] },
            content: { score: 70, tips: [] },
            structure: { score: 75, tips: [] },
            skills: { score: 75, tips: [] },
        },
    },
];

export const AIResponseFormat = `
{
  "overallScore": number,
  "overallSummary": "A 3-5 sentence honest paragraph about the resume's overall quality, main strengths and biggest areas to improve. Be specific and reference actual resume content.",
  "matchPercentage": number,
  "redFlags": ["string"],
  "missingKeywords": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "skillsGap": {
    "present": ["string"],
    "missing": ["string"]
  },
  "rewriteSuggestions": [
    {
      "original": "exact bullet point from the resume",
      "improved": "rewritten version with quantified impact and stronger verbs",
      "reason": "why this is better"
    }
  ],
  "ATS": {
    "score": number,
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "short title",
        "explanation": "detailed explanation, at least 2 sentences"
      }
    ]
  },
  "toneAndStyle": {
    "score": number,
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "short title",
        "explanation": "detailed explanation, at least 2 sentences"
      }
    ]
  },
  "content": {
    "score": number,
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "short title",
        "explanation": "detailed explanation, at least 2 sentences"
      }
    ]
  },
  "structure": {
    "score": number,
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "short title",
        "explanation": "detailed explanation, at least 2 sentences"
      }
    ]
  },
  "skills": {
    "score": number,
    "tips": [
      {
        "type": "good" or "improve",
        "tip": "short title",
        "explanation": "detailed explanation, at least 2 sentences"
      }
    ]
  }
}`;

export const prepareInstructions = ({
    jobTitle,
    jobDescription,
}: {
    jobTitle: string;
    jobDescription: string;
}) =>
    `You are an expert ATS (Applicant Tracking System) specialist, senior recruiter, and professional resume coach with 15+ years of experience.
    Carefully read and analyze the entire resume provided, word by word.
    Your task is to give honest, thorough, specific, and actionable feedback.

    CRITICAL RULES:
    - You MUST return a valid JSON object and NOTHING else. No markdown, no backticks, no extra text.
    - Every "tips" array in ATS, toneAndStyle, content, structure, and skills MUST contain exactly 4 items.
    - Every tip MUST have "type" ("good" or "improve"), a short "tip" title, and a detailed "explanation" (at least 2 sentences).
    - "overallSummary" must be a 3-5 sentence paragraph referencing specific resume content. No generic platitudes.
    - "matchPercentage" is 0-100 based on how well the resume matches the job description. If no JD provided, estimate based on general quality.
    - "redFlags" — list actual problems found: generic phrases ("team player", "hard worker"), lack of quantification, typos, etc.
    - "missingKeywords" — keywords from the job description NOT found in the resume. If no JD, list common keywords for this role.
    - "strengths" — exactly 3 specific strong points from this resume.
    - "weaknesses" — exactly 3 specific weak points from this resume.
    - "skillsGap.present" — technical skills explicitly mentioned in the resume.
    - "skillsGap.missing" — important skills for this role that are NOT in the resume.
    - "rewriteSuggestions" — provide 2-3 actual bullet points from the resume rewritten to be stronger. Quote the original text exactly.
    - Give realistic scores. A mediocre resume should score 40-65. Only excellent resumes score above 80.
    - Be brutally honest but constructive. Generic resumes score low.

    Job Title: ${jobTitle || "Not specified"}
    Job Description: ${jobDescription || "Not provided"}

    If a job description is provided, heavily weight keyword matching and job requirement alignment.
    If no JD is provided, evaluate against general industry standards for the implied role.

    Return ONLY the raw JSON object, strictly following this format:
    ${AIResponseFormat}

    IMPORTANT: Return ONLY the raw JSON. No explanation, no code blocks, no backticks. Raw JSON only.`;

export const prepareCoverLetterInstructions = ({
    jobTitle,
    jobDescription,
    companyName,
}: {
    jobTitle: string;
    jobDescription: string;
    companyName: string;
}) =>
    `You are an expert career coach and professional writer. Based on the resume provided, write a compelling, personalized cover letter.

    Job Title: ${jobTitle || "Not specified"}
    Company: ${companyName || "Not specified"}
    Job Description: ${jobDescription || "Not provided"}

    RULES:
    - Write in first person, professional tone
    - 3-4 paragraphs: opening hook, why you're qualified (cite specific resume points), why this company, closing CTA
    - Reference actual content from the resume — specific projects, skills, achievements
    - Make it sound human, not robotic
    - 250-350 words
    - Return ONLY the cover letter text, no JSON, no extra formatting

    Write the cover letter now:`;

export const prepareInterviewQuestionsInstructions = ({
    jobTitle,
    jobDescription,
}: {
    jobTitle: string;
    jobDescription: string;
}) =>
    `You are a senior technical interviewer and career coach. Based on the resume and job details provided, generate likely interview questions.

    Job Title: ${jobTitle || "Not specified"}
    Job Description: ${jobDescription || "Not provided"}

    Return a JSON object in this exact format:
    {
      "technical": [
        { "question": "string", "why": "why this might be asked based on the resume/JD", "tip": "how to answer well" }
      ],
      "behavioral": [
        { "question": "string", "why": "string", "tip": "string" }
      ],
      "roleSpecific": [
        { "question": "string", "why": "string", "tip": "string" }
      ]
    }

    Provide exactly 4 questions per category. Reference specific resume content when relevant. Return ONLY raw JSON.`;

export const prepareLinkedInInstructions = () =>
    `You are a LinkedIn optimization expert. Based on the resume provided, give specific LinkedIn profile improvement tips.

    Return a JSON array in this exact format:
    [
      {
        "section": "Headline" | "About" | "Experience" | "Skills" | "Featured" | "Recommendations",
        "tip": "short title",
        "explanation": "specific actionable advice, 2-3 sentences",
        "example": "optional example of what good looks like"
      }
    ]

    Provide exactly 6 tips covering different sections. Reference actual resume content. Return ONLY raw JSON array.`;

export const prepareFixThisInstructions = ({
    tipTitle,
    tipExplanation,
    tipType,
}: {
    tipTitle: string;
    tipExplanation: string;
    tipType: string;
}) =>
    `You are an expert resume writer. Based on the resume provided, address this specific feedback:

    Feedback: "${tipTitle}"
    Details: "${tipExplanation}"
    Type: ${tipType === "improve" ? "This needs improvement" : "This is a strength to emphasize more"}

    Task: Find the relevant section(s) in the resume and provide:
    1. Specific text changes or additions to make
    2. A concrete rewritten example if applicable

    Return a JSON object:
    {
      "summary": "2-3 sentence explanation of what specifically to change",
      "changes": [
        {
          "where": "which section/bullet to change",
          "original": "original text (quote from resume)",
          "improved": "improved version",
          "reason": "why this is better"
        }
      ]
    }

    Return ONLY raw JSON.`;
