import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { api } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeIQ | ATS Resume Optimization" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      if (!isAuthenticated) return;
      
      setLoadingResumes(true);
      try {
        const data = await api.resumes.getAll();
        if (!data.error) {
          setResumes(data || []);
        }
      } catch (err) {
        console.error("Failed to load resumes", err);
      }
      setLoadingResumes(false);
    }

    if (isAuthenticated) {
        loadResumes();
    }
  }, [isAuthenticated]);

  if (isLoading) return null;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section pt-16">
        <div className="page-heading">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Optimize your resume for <br className="hidden md:block" />
            the <span className="text-[#0066cc] dark:text-[#60a5fa]">exact ATS</span>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mb-12 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Review your submissions and check AI-powered feedback tailored to specific parsing rules, keywords, and ranking weights.
          </p>
        </div>

        {loadingResumes && (
            <div className="flex flex-col items-center justify-center mb-10">
              <img src="/images/resume-scan-2.gif" className="w-[150px]" alt="Loading..." />
            </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="w-full max-w-[1200px]">
            <div className="flex items-center justify-between w-full mb-8 px-4">
               <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Your Uploaded Resumes</h2>
               <Link to="/upload" className="primary-button text-sm">
                 + New Scan
               </Link>
            </div>
            <div className="resumes-section justify-start gap-8">
              {resumes.map((resume) => (
                  <ResumeCard key={resume._id} resume={resume} />
              ))}
            </div>
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-6 gap-6 w-full max-w-2xl p-10 rounded-2xl shadow-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="text-6xl mb-2">📄</div>
              <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>No resumes scanned yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Upload your first resume to get detailed AI feedback and ATS scoring.</p>
              <Link to="/upload" className="primary-button text-lg w-full max-w-md text-center py-4 rounded-xl mt-4">
                Scan Your Resume For Free
              </Link>
            </div>
        )}
      </section>
    </main>
  );
}
