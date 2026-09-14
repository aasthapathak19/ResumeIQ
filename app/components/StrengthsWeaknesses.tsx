import React from "react";

interface StrengthsWeaknessesProps {
    strengths: string[];
    weaknesses: string[];
}

const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
    strengths,
    weaknesses,
}) => {
    return (
        <div className="sw-card">
            <div className="sw-header">
                <span>⚡</span>
                <h3>Strengths & Weaknesses</h3>
            </div>
            <div className="sw-grid">
                <div className="sw-col sw-strengths">
                    <h4 className="sw-col-title">
                        <span>💪</span> Strengths
                    </h4>
                    <ul className="sw-list">
                        {strengths?.map((s, i) => (
                            <li key={i} className="sw-item sw-strength-item">
                                <span className="sw-bullet">✓</span>
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="sw-col sw-weaknesses">
                    <h4 className="sw-col-title">
                        <span>🎯</span> Areas to Improve
                    </h4>
                    <ul className="sw-list">
                        {weaknesses?.map((w, i) => (
                            <li key={i} className="sw-item sw-weakness-item">
                                <span className="sw-bullet">→</span>
                                <span>{w}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StrengthsWeaknesses;
