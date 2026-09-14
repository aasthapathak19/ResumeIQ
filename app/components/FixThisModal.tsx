import React from "react";

interface FixThisModalProps {
    tip: {
        tip: string;
        explanation: string;
        type: "good" | "improve";
    };
    resumePath?: string;
    onClose: () => void;
}

const FixThisModal: React.FC<FixThisModalProps> = ({ tip, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-row">
                        <span className="modal-icon">🔧</span>
                        <h3 className="modal-title">Fix This: {tip.tip}</h3>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-tip-context">
                    <p>{tip.explanation}</p>
                </div>

                {/* Content */}
                <div className="modal-body text-center p-8">
                    <h4 className="text-xl font-bold mb-2">Coming Soon!</h4>
                    <p className="text-gray-600">
                        Our interactive AI fix generator is currently being migrated to our new backend infrastructure.
                        Check back later for automated improvement suggestions!
                    </p>
                    <button className="primary-button mt-6" onClick={onClose}>
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FixThisModal;
