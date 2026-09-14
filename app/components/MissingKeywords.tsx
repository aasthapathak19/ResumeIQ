import React from "react";

interface MissingKeywordsProps {
    keywords: string[];
}

const MissingKeywords: React.FC<MissingKeywordsProps> = ({ keywords }) => {
    if (!keywords || keywords.length === 0) {
        return (
            <div className="keywords-card keywords-clear">
                <div className="keywords-header">
                    <span>🔑</span>
                    <h3>Missing Keywords</h3>
                </div>
                <p>✅ No critical missing keywords detected for this role.</p>
            </div>
        );
    }

    return (
        <div className="keywords-card">
            <div className="keywords-header">
                <span className="keywords-icon">🔑</span>
                <h3 className="keywords-title">Missing Keywords</h3>
            </div>
            <p className="keywords-subtitle">
                These keywords appear in the job description but are missing from your resume. Adding them (honestly) can significantly boost your ATS score.
            </p>
            <div className="keywords-chips">
                {keywords.map((kw, i) => (
                    <span key={i} className="keyword-chip">
                        + {kw}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MissingKeywords;
