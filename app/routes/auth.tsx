import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { api } from "~/lib/api";

export const meta = () => ([
    { title: 'ResumeIQ | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isAuthenticated, login, logout, isLoading } = useAuth();
    const location = useLocation();
    const next = location.search.split('next=')[1] || '/';
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate(next);
        }
    }, [isAuthenticated, isLoading, next, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let res;
            if (isLogin) {
                res = await api.auth.login({ email, password });
            } else {
                res = await api.auth.register({ name, email, password });
            }

            if (res.error) {
                setError(res.error);
            } else if (res.token && res.user) {
                login(res.token, res.user);
                navigate(next);
            }
        } catch (err) {
            setError('An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg max-w-md w-full">
                <section className="flex flex-col gap-6 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <h2 className="text-gray-600">{isLogin ? 'Log In to Continue' : 'Sign up to start analyzing'}</h2>
                    </div>
                    
                    {isAuthenticated ? (
                        <button className="primary-button" onClick={logout}>Log Out</button>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {!isLogin && (
                                <div className="form-div">
                                    <label>Name</label>
                                    <input type="text" required value={name} onChange={e => setName(e.target.value)} />
                                </div>
                            )}
                            <div className="form-div">
                                <label>Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-div">
                                <label>Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            
                            <button className="primary-button" type="submit" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                            </button>

                            <button type="button" className="text-sm text-blue-600 mt-2" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Auth;
