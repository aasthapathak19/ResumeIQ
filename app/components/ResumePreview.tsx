import React from 'react';

interface ResumePreviewProps {
    resumeUrl: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeUrl }) => {
    return (
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
    );
};

export default ResumePreview;
