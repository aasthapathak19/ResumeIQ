interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
    createdAt?: string;
}

interface FeedbackTip {
    type: "good" | "improve";
    tip: string;
    explanation: string;
}

interface FeedbackCategory {
    score: number;
    tips: FeedbackTip[];
}

interface RewriteSuggestion {
    original: string;
    improved: string;
    reason: string;
}

interface SkillsGap {
    present: string[];
    missing: string[];
}

interface Feedback {
    overallScore: number;
    overallSummary?: string;
    matchPercentage?: number;
    redFlags?: string[];
    missingKeywords?: string[];
    strengths?: string[];
    weaknesses?: string[];
    skillsGap?: SkillsGap;
    rewriteSuggestions?: RewriteSuggestion[];
    ATS: FeedbackCategory;
    toneAndStyle: FeedbackCategory;
    content: FeedbackCategory;
    structure: FeedbackCategory;
    skills: FeedbackCategory;
}

interface PuterUser {
    username: string;
    uuid: string;
    email?: string;
}

interface FSItem {
    name: string;
    path: string;
    type: string;
    size?: number;
}

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content:
        | string
        | {
              type: string;
              text?: string;
              puter_path?: string;
              image_url?: { url: string };
          }[];
}

interface AIResponse {
    message: {
        content:
            | string
            | {
                  type: string;
                  text: string;
              }[];
        role: string;
    };
    index: number;
}

interface PuterChatOptions {
    model?: string;
    stream?: boolean;
    temperature?: number;
    max_tokens?: number;
}

interface KVItem {
    key: string;
    value: string;
}
