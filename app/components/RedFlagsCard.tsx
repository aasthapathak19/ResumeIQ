import React from "react";

interface RedFlagsCardProps {
    redFlags: string[];
}

const RedFlagsCard: React.FC<RedFlagsCardProps> = ({ redFlags }) => {
    if (!redFlags || redFlags.length === 0) {
        return (
            <div className="red-flags-card red-flags-clear">
                <div className="red-flags-header">
                    <span>✅</span>
                    <h3>No Red Flags Detected</h3>
                </div>
                <p>Great job! Your resume doesn't have any obvious red flags.</p>
            </div>
        );
    }

    return (
        <div className="red-flags-card">
            <div className="red-flags-header">
                <span className="red-flags-icon">🚩</span>
                <h3 className="red-flags-title">Red Flags to Fix</h3>
            </div>
            <p className="red-flags-subtitle">
                These issues may cause recruiters or ATS systems to skip your resume.
            </p>
            <ul className="red-flags-list">
                {redFlags.map((flag, i) => (
                    <li key={i} className="red-flag-item">
                        <span className="red-flag-bullet">⚠</span>
                        <span>{flag}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RedFlagsCard;
