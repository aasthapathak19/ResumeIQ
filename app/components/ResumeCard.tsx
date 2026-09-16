import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({ resume, onDelete }: { resume: any; onDelete: (id: string) => void }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this resume?")) {
            onDelete(resume._id);
        }
    };

    return (
        <Link to={`/resume/${resume._id}`} className="group relative bg-white dark:bg-[#1e2130] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
            <div className="absolute top-4 right-4 z-10 transition-opacity">
                <button 
                    onClick={handleDelete}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    title="Delete Resume"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2" style={{ wordBreak: 'break-word' }}>
                        {resume.originalName || 'Resume'}
                    </h2>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">
                        {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : ''}
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={resume.analysis?.atsScore || 0} />
                </div>
            </div>
            
            {resume.analysis?.summary ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mt-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                    {resume.analysis.summary}
                </p>
            ) : (
                <div className="flex items-center gap-2 mt-2 border-t border-gray-100 dark:border-gray-800 pt-4 text-gray-400">
                    <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Processing Analysis...</span>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard
