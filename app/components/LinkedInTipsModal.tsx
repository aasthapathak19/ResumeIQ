import React from "react";

interface LinkedInTipsModalProps {
    resumePath?: string;
    onClose: () => void;
}

const LinkedInTipsModal: React.FC<LinkedInTipsModalProps> = ({
    onClose,
}) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container modal-linkedin" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-row">
                        <span className="modal-icon">💼</span>
                        <h3 className="modal-title">LinkedIn Profile Optimization</h3>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body text-center p-8">
                    <h4 className="text-xl font-bold mb-2">Coming Soon!</h4>
                    <p className="text-gray-600">
                        Our AI-powered LinkedIn optimization feature is currently being migrated to our new backend infrastructure.
                        Stay tuned for updates!
                    </p>
                    <button className="primary-button mt-6" onClick={onClose}>
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkedInTipsModal;
