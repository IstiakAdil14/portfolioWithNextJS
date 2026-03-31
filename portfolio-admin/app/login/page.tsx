'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        setLoading(false);
        if (res.ok) router.push('/dashboard');
        else setError('Invalid password. Please try again.');
    };

    return (
        <div className="min-h-screen bg-Black flex">
            {/* Left decorative panel */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-DeepNightBlack border-r border-EveningBlack">
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
                {/* Green glow */}
                <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-Green/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-Green flex items-center justify-center">
                        <span className="text-MidNightBlack font-bold text-sm">P</span>
                    </div>
                    <span className="text-Snow font-bold">Portfolio Admin</span>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-Green/10 border border-Green/20 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 rounded-full bg-Green animate-pulse" />
                        <span className="text-Green text-xs font-medium">Dashboard Active</span>
                    </div>
                    <h1 className="text-4xl font-bold text-Snow leading-tight mb-4">
                        Manage your<br />
                        <span className="text-Green">portfolio</span> content
                    </h1>
                    <p className="text-LightGray text-sm leading-relaxed max-w-xs">
                        Full control over your projects, skills, expertise and everything displayed on your portfolio.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-8">
                    {[['10+', 'Projects'], ['13+', 'Skills'], ['3+', 'Expertise']].map(([val, label]) => (
                        <div key={label}>
                            <p className="text-Green font-bold text-xl">{val}</p>
                            <p className="text-LightGray text-xs mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center px-6 bg-Black">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-xl bg-Green/10 border border-Green/20 flex items-center justify-center mb-5">
                            <FaLock className="text-Green text-lg" />
                        </div>
                        <h2 className="text-2xl font-bold text-Snow">Welcome back</h2>
                        <p className="text-LightGray text-sm mt-1">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-LightGray font-medium mb-2 block uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-style pr-12"
                                    required
                                />
                                <button type="button" onClick={() => setShow(!show)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-LightGray hover:text-Snow transition">
                                    {show ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="btn-green w-full flex items-center justify-center gap-2 text-sm py-3">
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-MidNightBlack/30 border-t-MidNightBlack rounded-full animate-spin" /> Signing in...</>
                            ) : (
                                <>Sign In <FiArrowRight /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
