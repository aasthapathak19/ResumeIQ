import React from "react";

interface MatchGaugeProps {
    matchPercentage: number;
}

const MatchGauge: React.FC<MatchGaugeProps> = ({ matchPercentage }) => {
    const pct = Math.max(0, Math.min(100, matchPercentage));

    const color =
        pct >= 70
            ? "#22c55e"
            : pct >= 50
            ? "#f59e0b"
            : "#ef4444";

    const label =
        pct >= 70
            ? "Strong Match"
            : pct >= 50
            ? "Partial Match"
            : "Low Match";

    // SVG arc math
    const r = 54;
    const cx = 70;
    const cy = 70;
    const circumference = Math.PI * r; // half circle
    const progress = (pct / 100) * circumference;

    return (
        <div className="match-gauge-card">
            <div className="match-gauge-header">
                <span className="match-gauge-icon">🎯</span>
                <h3 className="match-gauge-title">Job Match Score</h3>
            </div>

            <div className="match-gauge-body">
                <svg viewBox="0 0 140 80" className="match-gauge-svg">
                    {/* Background arc */}
                    <path
                        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    {/* Progress arc */}
                    <path
                        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${progress} ${circumference}`}
                        style={{ transition: "stroke-dasharray 1s ease-in-out" }}
                    />
                    {/* Percentage text */}
                    <text
                        x={cx}
                        y={cy - 4}
                        textAnchor="middle"
                        fontSize="22"
                        fontWeight="bold"
                        fill={color}
                    >
                        {pct}%
                    </text>
                    <text
                        x={cx}
                        y={cy + 14}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#6b7280"
                    >
                        {label}
                    </text>
                </svg>
            </div>

            <p className="match-gauge-description">
                {pct >= 70
                    ? "Your resume aligns well with this job's requirements."
                    : pct >= 50
                    ? "Your resume partially matches. Add missing keywords to improve."
                    : "Low alignment. Study the job description and tailor your resume."}
            </p>
        </div>
    );
};

export default MatchGauge;
