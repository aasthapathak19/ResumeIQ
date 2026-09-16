import { Link } from "react-router";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "~/context/AuthContext";

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo" id="navbar-logo">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </div>
                <span className="logo-text ml-1">ResumeIQ</span>
            </Link>
            <div className="navbar-actions">
                <DarkModeToggle />
                {isAuthenticated ? (
                    <button onClick={logout} className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        Log Out
                    </button>
                ) : (
                    <div className="flex items-center gap-4 ml-2">
                        <Link to="/auth" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                            Log In
                        </Link>
                        <Link to="/auth?mode=signup" className="text-sm font-semibold bg-[#0066cc] text-white px-4 py-2 rounded-full hover:bg-[#0052a3] transition-colors">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
