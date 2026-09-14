import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({ resume }: { resume: any }) => {
    // In our new backend structure:
    // resume.analysis contains the Gemini JSON output
    // resume._id is the ObjectId string

    return (
        <Link to={`/resume/${resume._id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words">
                        {resume.originalName || 'Resume'}
                    </h2>
                    <h3 className="text-lg break-words text-gray-500">
                        {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : ''}
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={resume.analysis?.atsScore || 0} />
                </div>
            </div>
            
            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center p-8">
                    <div className="text-center text-gray-500 flex flex-col items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>PDF Document</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default ResumeCard
