import React from "react";

interface SkillsGapChartProps {
    present: string[];
    missing: string[];
}

const SkillsGapChart: React.FC<SkillsGapChartProps> = ({ present, missing }) => {
    return (
        <div className="skills-gap-card">
            <div className="skills-gap-header">
                <span className="skills-gap-icon">🧩</span>
                <h3 className="skills-gap-title">Skills Analysis</h3>
            </div>

            <div className="skills-gap-grid">
                {/* Present Skills */}
                <div className="skills-col skills-present">
                    <div className="skills-col-header">
                        <span className="skills-col-dot present-dot" />
                        <h4>You Have ({present.length})</h4>
                    </div>
                    <div className="skills-chips">
                        {present.map((skill, i) => (
                            <span key={i} className="skill-chip skill-chip-present">
                                ✓ {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="skills-col skills-missing">
                    <div className="skills-col-header">
                        <span className="skills-col-dot missing-dot" />
                        <h4>Missing ({missing.length})</h4>
                    </div>
                    <div className="skills-chips">
                        {missing.length > 0 ? (
                            missing.map((skill, i) => (
                                <span key={i} className="skill-chip skill-chip-missing">
                                    + {skill}
                                </span>
                            ))
                        ) : (
                            <span className="skills-none">🎉 No major gaps found!</span>
                        )}
                    </div>
                </div>
            </div>

            {missing.length > 0 && (
                <p className="skills-gap-tip">
                    💡 Add these missing skills to your resume or LinkedIn to improve visibility.
                </p>
            )}
        </div>
    );
};

export default SkillsGapChart;
