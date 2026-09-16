import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { api } from "~/lib/api";

import StrengthsWeaknesses from "~/components/StrengthsWeaknesses";
import MissingKeywords from "~/components/MissingKeywords";
import ScoreCircle from "~/components/ScoreCircle";
import ScoreBreakdown from "~/components/ScoreBreakdown";
import ResumePreview from "~/components/ResumePreview";
import ResultTabs from "~/components/ResultTabs";

import { Resume as ResumeType, Analysis } from "~/types";

export const meta = () => [
    { title: "ResumeIQ | Shared Resume Review" },
    { name: "description", content: "Detailed AI-powered review of a resume" },
];

type Tab = "analysis" | "cover-letter" | "interview";

const SharedResume = () => {
    const { token } = useParams();
    const [resumeData, setResumeData] = useState<ResumeType | null>(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Analysis | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("analysis");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSharedResume = async () => {
            if (!token) return;
            
            try {
                // Fetch shared resume & analysis metadata
                const res = await api.share.getSharedAnalysis(token);
                setResumeData(res.resume);
                setFeedback(res.analysis);
                
                // Fetch physical file via public API
                try {
                    const blob = await api.share.getSharedFile(token);
                    const url = URL.createObjectURL(blob);
                    setResumeUrl(url);
                } catch (fileErr) {
                    console.error("Failed to load resume file:", fileErr);
                }
            } catch (err) {
                console.error("Failed to load shared resume details:", err);
                setError("This shared link is invalid or has expired.");
            }
        };

        loadSharedResume();
    }, [token]);

    const handlePrint = () => {
        window.print();
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: "analysis", label: "Analysis", icon: "📊" },
        { id: "cover-letter", label: "Cover Letter", icon: "✉️" },
        { id: "interview", label: "Interview Prep", icon: "🎯" },
    ];

    if (error) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f1117]">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">{error}</p>
                <Link to="/" className="mt-6 text-blue-500 underline">Return to Home</Link>
            </main>
        );
    }

    return (
        <main className="resume-page !pt-0">
            {/* Top Nav */}
            <nav className="resume-nav no-print">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Build Your Own Resume</span>
                </Link>
                <div className="resume-nav-actions">
                    <button
                        className="action-btn action-btn-print"
                        onClick={handlePrint}
                        id="download-btn"
                        title="Download/print analysis report"
                    >
                        🖨️ Download Report
                    </button>
                </div>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                {/* Left: Resume Preview */}
                <ResumePreview resumeUrl={resumeUrl} />

                {/* Right: Feedback */}
                <section className="feedback-section">
                    <div className="feedback-header">
                        <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                        {resumeData && (
                            <p className="feedback-meta">
                                {resumeData.originalName}
                            </p>
                        )}

                        {/* Tabs */}
                        <ResultTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    {!feedback && (
                        <img src="/images/resume-scan-2.gif" className="w-full" alt="Loading analysis..." />
                    )}

                    {feedback && activeTab === "analysis" && (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            {/* Overall Summary */}
                            <div className="gradient-border bg-white p-6 rounded-2xl shadow-sm">
                                <h3 className="text-xl font-bold mb-4">Overall Summary</h3>
                                <p className="text-gray-700">{feedback.summary}</p>
                            </div>

                            {/* Score Summary + Match Gauge */}
                            <div className="flex flex-col gap-6">
                                <div className="summary-match-scores flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">Overall Match Score</h3>
                                    <ScoreCircle score={feedback.atsScore} />
                                </div>
                                {feedback.scoreBreakdown && (
                                    <ScoreBreakdown breakdown={feedback.scoreBreakdown} />
                                )}
                            </div>

                            {/* Strengths & Weaknesses */}
                            {feedback.strengths && feedback.weaknesses && (
                                <StrengthsWeaknesses
                                    strengths={feedback.strengths}
                                    weaknesses={feedback.weaknesses}
                                />
                            )}

                            {/* Missing Keywords */}
                            {feedback.missingKeywords && (
                                <MissingKeywords keywords={feedback.missingKeywords} />
                            )}
                            
                            {/* Detailed Suggestions */}
                            {feedback.suggestions && feedback.suggestions.length > 0 && (
                                <div className="gradient-border bg-white p-6 rounded-2xl shadow-sm mt-4">
                                    <h3 className="text-xl font-bold mb-4 text-purple-700">Actionable Suggestions</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        {feedback.suggestions.map((s: string, i: number) => (
                                            <li key={i} className="text-gray-700">{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cover Letter Tab */}
                    {activeTab === "cover-letter" && resumeData && (
                        <div className="tab-content animate-in fade-in duration-500">
                            <div className="p-8 bg-white rounded-2xl gradient-border">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">AI Generated Cover Letter</h2>
                                </div>
                                
                                {feedback?.coverLetter ? (
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">
                                        {feedback.coverLetter}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No cover letter generated yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Interview Tab */}
                    {activeTab === "interview" && resumeData && (
                        <div className="tab-content animate-in fade-in duration-500">
                             <div className="p-8 bg-white rounded-2xl gradient-border">
                                <h2 className="text-2xl font-bold mb-6">Targeted Interview Questions</h2>
                                
                                {feedback?.interviewQuestions && feedback.interviewQuestions.length > 0 ? (
                                    <ul className="space-y-6">
                                        {feedback.interviewQuestions.map((q: string, i: number) => (
                                            <li key={i} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full">
                                                    {i + 1}
                                                </span>
                                                <p className="text-gray-800 font-medium text-lg pt-1">{q}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No interview questions generated yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default SharedResume;
