import React from "react";

interface RewriteSuggestion {
    original: string;
    improved: string;
    reason: string;
}

interface RewriteSuggestionsProps {
    suggestions: RewriteSuggestion[];
}

const RewriteSuggestions: React.FC<RewriteSuggestionsProps> = ({ suggestions }) => {
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        });
    };

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="rewrites-card">
            <div className="rewrites-header">
                <span className="rewrites-icon">✏️</span>
                <h3 className="rewrites-title">Rewrite Suggestions</h3>
            </div>
            <p className="rewrites-subtitle">
                AI-improved versions of your existing bullet points. Copy and use them in your resume.
            </p>

            <div className="rewrites-list">
                {suggestions.map((s, i) => (
                    <div key={i} className="rewrite-item">
                        {/* Original */}
                        <div className="rewrite-original">
                            <div className="rewrite-label rewrite-label-before">
                                <span>✕ Before</span>
                            </div>
                            <p className="rewrite-text rewrite-text-before">{s.original}</p>
                        </div>

                        {/* Arrow */}
                        <div className="rewrite-arrow">↓</div>

                        {/* Improved */}
                        <div className="rewrite-improved">
                            <div className="rewrite-label rewrite-label-after">
                                <span>✓ After</span>
                                <button
                                    className="copy-btn"
                                    onClick={() => handleCopy(s.improved, i)}
                                    title="Copy improved version"
                                >
                                    {copiedIndex === i ? "✓ Copied!" : "📋 Copy"}
                                </button>
                            </div>
                            <p className="rewrite-text rewrite-text-after">{s.improved}</p>
                        </div>

                        {/* Reason */}
                        <div className="rewrite-reason">
                            <span>💡</span>
                            <span>{s.reason}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RewriteSuggestions;
