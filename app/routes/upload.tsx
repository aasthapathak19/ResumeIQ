import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { api } from "~/lib/api";

export const meta = () => [
    { title: "ResumeIQ | Analyze Resume" },
    { name: "description", content: "Upload your resume for AI-powered ATS analysis and improvement suggestions" },
];

interface ProgressStep {
    id: string;
    label: string;
    status: "pending" | "active" | "done" | "error";
}

const Upload = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [steps, setSteps] = useState<ProgressStep[]>([]);
    const [errorMsg, setErrorMsg] = useState("");

    const handleFileSelect = (file: File | null) => {
        setFile(file);
        setErrorMsg("");
    };

    const handleAnalyze = async ({
        companyName,
        jobTitle,
        jobDescription,
        file,
    }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        setIsProcessing(true);
        setErrorMsg("");

        const initialSteps: ProgressStep[] = [
            { id: "upload", label: "Uploading resume...", status: "pending" },
            { id: "analyze", label: "AI analyzing your resume...", status: "pending" },
            { id: "save", label: "Saving results...", status: "pending" },
        ];
        setSteps(initialSteps);

        const setStep = (id: string, status: ProgressStep["status"]) => {
            setSteps((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status } : s))
            );
        };

        try {
            // Step 1: Upload PDF
            setStep("upload", "active");
            const formData = new FormData();
            formData.append("resumeFile", file);
            formData.append("companyName", companyName);
            formData.append("jobTitle", jobTitle);
            formData.append("jobDescription", jobDescription);

            const uploadRes = await api.resumes.upload(formData);
            if (uploadRes.error) {
                throw new Error(uploadRes.error);
            }
            const resumeId = uploadRes.resume._id;
            setStep("upload", "done");

            // Step 2: Poll AI Analysis status
            setStep("analyze", "active");
            
            const pollAnalysis = async (): Promise<any> => {
                while(true) {
                    const statusRes = await api.ai.getAnalysis(resumeId);
                    
                    if (statusRes.error && statusRes.error !== 'Analysis not found' && statusRes.error !== 'Resume not found or unauthorized') {
                        throw new Error(statusRes.error);
                    }
                    
                    // If backend returns status 202 indicating it's still in progress
                    if (statusRes.status && (statusRes.status === 'analyzing' || statusRes.status === 'uploaded' || statusRes.status === 'processing')) {
                        await new Promise(r => setTimeout(r, 2000));
                        continue;
                    }
                    if (statusRes.status === 'failed') {
                        throw new Error("AI analysis failed.");
                    }
                    
                    // If it returned the analysis object (no status string)
                    if (statusRes._id) {
                        return statusRes;
                    }
                    
                    await new Promise(r => setTimeout(r, 2000));
                }
            };

            await pollAnalysis();
            setStep("analyze", "done");
            setStep("save", "done");

            navigate(`/resume/${resumeId}`);
        } catch (error: any) {
            setStep("analyze", "error");
            setErrorMsg(error.message || "Failed to process resume. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file) {
            setErrorMsg("Please select a resume PDF file first.");
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    const stepIcons = {
        pending: "○",
        active: "⟳",
        done: "✓",
        error: "✕",
    };

    const stepColors = {
        pending: "text-gray-400",
        active: "text-blue-500 animate-pulse",
        done: "text-green-500",
        error: "text-red-500",
    };

    return (
        <main className="upload-main">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart Feedback for Your Dream Job</h1>

                    {isProcessing ? (
                        <div className="processing-container">
                            <h2 className="processing-title">Analyzing your resume with AI...</h2>
                            <div className="progress-steps">
                                {steps.map((step) => (
                                    <div key={step.id} className={`progress-step ${step.status}`}>
                                        <span className={`step-icon ${stepColors[step.status]}`}>
                                            {stepIcons[step.status]}
                                        </span>
                                        <span className="step-label">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                            {errorMsg && (
                                <div className="upload-error">
                                    <span>⚠</span> {errorMsg}
                                    <button
                                        className="retry-btn"
                                        onClick={() => { setIsProcessing(false); setSteps([]); setErrorMsg(""); }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                            {!errorMsg && (
                                <p className="processing-note">
                                    This usually takes 15–30 seconds. Please don't close this tab.
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            <h2>Drop your resume — get ATS score, keyword gaps, rewrite suggestions & more</h2>
                            {errorMsg && (
                                <div className="upload-error">
                                    <span>⚠</span> {errorMsg}
                                </div>
                            )}
                            <form
                                id="upload-form"
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4 mt-8"
                            >
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input
                                        type="text"
                                        name="company-name"
                                        placeholder="e.g. Google, Microsoft"
                                        id="company-name"
                                    />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input
                                        type="text"
                                        name="job-title"
                                        placeholder="e.g. Frontend Developer"
                                        id="job-title"
                                    />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-description">
                                        Job Description{" "}
                                        <span className="label-hint">
                                            (Paste full JD for better keyword matching)
                                        </span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        name="job-description"
                                        placeholder="Paste the job description here for best results..."
                                        id="job-description"
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume (PDF)</label>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <button
                                    className="primary-button"
                                    type="submit"
                                    disabled={!file}
                                    id="analyze-btn"
                                >
                                    ✨ Analyze Resume
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;
