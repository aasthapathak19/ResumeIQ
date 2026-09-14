import React from "react";

interface OverallSummaryProps {
    summary: string;
    companyName?: string;
    jobTitle?: string;
}

const OverallSummary: React.FC<OverallSummaryProps> = ({
    summary,
    companyName,
    jobTitle,
}) => {
    return (
        <div className="overall-summary-card">
            <div className="overall-summary-header">
                <div className="summary-icon">💡</div>
                <div>
                    <h3 className="overall-summary-title">AI Analysis Summary</h3>
                    {(companyName || jobTitle) && (
                        <p className="overall-summary-meta">
                            {jobTitle && <span>{jobTitle}</span>}
                            {companyName && jobTitle && <span> at </span>}
                            {companyName && <span className="company-highlight">{companyName}</span>}
                        </p>
                    )}
                </div>
            </div>
            <p className="overall-summary-text">{summary}</p>
        </div>
    );
};

export default OverallSummary;
