import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { api } from "~/lib/api";

import ATS from "~/components/ATS";
import StrengthsWeaknesses from "~/components/StrengthsWeaknesses";
import MissingKeywords from "~/components/MissingKeywords";
import ScoreCircle from "~/components/ScoreCircle";

export const meta = () => [
    { title: "ResumeIQ | Resume Review" },
    { name: "description", content: "Detailed AI-powered review of your resume" },
];

type Tab = "analysis" | "cover-letter" | "interview";

const Resume = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { id } = useParams();
    const [resumeData, setResumeData] = useState<any | null>(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("analysis");
    const [shareLink, setShareLink] = useState("");
    const [shareCopied, setShareCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated)
            navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, isAuthenticated, id, navigate]);

    useEffect(() => {
        const loadResume = async () => {
            if (!id || !isAuthenticated) return;
            
            try {
                // Fetch resume metadata
                const resumeRes = await api.resumes.getById(id);
                if (resumeRes.error) return;
                setResumeData(resumeRes);
                
                // Construct URL to static file served by Node backend
                setResumeUrl(`http://localhost:5000/uploads/resumes/${resumeRes.userId}/${resumeRes.fileName}`);

                // Fetch AI analysis
                const analysisRes = await api.ai.getAnalysis(id);
                if (!analysisRes.error) {
                    setFeedback(analysisRes);
                }

                setShareLink(`${window.location.origin}/share/${id}`);
            } catch (err) {
                console.error("Failed to load resume details:", err);
            }
        };

        if (isAuthenticated) {
            loadResume();
        }
    }, [id, isAuthenticated]);

    const handlePrint = () => {
        window.print();
    };

    const handleShareCopy = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2500);
        });
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: "analysis", label: "Analysis", icon: "📊" },
        { id: "cover-letter", label: "Cover Letter", icon: "✉️" },
        { id: "interview", label: "Interview Prep", icon: "🎯" },
    ];

    return (
        <main className="resume-page !pt-0">
            {/* Top Nav */}
            <nav className="resume-nav no-print">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Dashboard</span>
                </Link>
                <div className="resume-nav-actions">
                    <button
                        className="action-btn action-btn-share"
                        onClick={handleShareCopy}
                        id="share-btn"
                        title="Copy shareable link"
                    >
                        {shareCopied ? "✓ Copied!" : "🔗 Share"}
                    </button>
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
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center no-print">
                    {resumeUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <iframe
                                src={resumeUrl}
                                className="w-[400px] h-full rounded-2xl"
                                title="Resume Preview"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading..." />
                        </div>
                    )}
                </section>

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
                        <div className="result-tabs no-print">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`result-tab ${activeTab === tab.id ? "result-tab-active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    id={`tab-${tab.id}`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
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
                            <div className="summary-match-row flex items-center justify-between">
                                <div className="summary-match-scores flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">ATS Score</h3>
                                    <ScoreCircle score={feedback.atsScore} />
                                </div>
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
                                <h2 className="text-2xl font-bold mb-4">Cover Letter Generation</h2>
                                <p>Cover letter API endpoints are under construction. Stay tuned!</p>
                            </div>
                        </div>
                    )}

                    {/* Interview Tab */}
                    {activeTab === "interview" && resumeData && (
                        <div className="tab-content animate-in fade-in duration-500">
                             <div className="p-8 bg-white rounded-2xl gradient-border">
                                <h2 className="text-2xl font-bold mb-4">Interview Preparation</h2>
                                <p>Interview prep endpoints are under construction. Stay tuned!</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;
