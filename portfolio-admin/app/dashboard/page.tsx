export const dynamic = 'force-dynamic';

import { connectDB } from '@/lib/mongodb';
import { Expertise } from '@/lib/models/Expertise';
import { Project } from '@/lib/models/Project';
import { Skill } from '@/lib/models/Meta';
import { FiStar, FiBriefcase, FiCode, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default async function DashboardPage() {
    let expertiseCount = 0, projectCount = 0, skillCount = 0;
    let dbError = false;

    try {
        await connectDB();
        [expertiseCount, projectCount, skillCount] = await Promise.all([
            Expertise.countDocuments(),
            Project.countDocuments(),
            Skill.countDocuments(),
        ]);
    } catch {
        dbError = true;
    }

    const stats = [
        { label: 'Expertise Cards', value: expertiseCount, icon: FiStar, color: 'text-yellow-400', href: '/dashboard/expertise' },
        { label: 'Projects', value: projectCount, icon: FiBriefcase, color: 'text-blue-400', href: '/dashboard/projects' },
        { label: 'Skills', value: skillCount, icon: FiCode, color: 'text-Green', href: '/dashboard/skills' },
    ];

    const quickActions = [
        { label: 'Add Project', href: '/dashboard/projects', desc: 'Showcase new work' },
        { label: 'Update Skills', href: '/dashboard/skills', desc: 'Keep stack current' },
        { label: 'Edit Profile', href: '/dashboard/profile', desc: 'Update your info' },
        { label: 'Toggle Availability', href: '/dashboard/availability', desc: 'Set work status' },
    ];

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-Snow">Good day, Adil 👋</h1>
                <p className="text-LightGray text-sm mt-1">Here's what's happening with your portfolio.</p>
            </div>

            {/* DB Error */}
            {dbError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-5 py-4 mb-6 text-sm">
                    <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">MongoDB not connected</p>
                        <p className="text-red-400/60 mt-0.5 text-xs">Add your real <code className="bg-red-500/10 px-1 rounded">MONGODB_URI</code> in <code className="bg-red-500/10 px-1 rounded">.env.local</code> and restart.</p>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {stats.map(({ label, value, icon: Icon, color, href }) => (
                    <Link key={label} href={href}
                        className="card-bg card-glow p-5 flex items-center gap-4 group transition-all hover:scale-[1.01]">
                        <div className={`${color} bg-EveningBlack p-3 rounded-xl text-xl shrink-0`}><Icon /></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-2xl font-bold text-Snow">{value}</p>
                            <p className="text-LightGray text-xs mt-0.5">{label}</p>
                        </div>
                        <FiArrowRight className="text-LightGray opacity-0 group-hover:opacity-100 group-hover:text-Green transition shrink-0" />
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card-bg p-6 mb-4">
                <p className="text-xs font-semibold text-LightGray uppercase tracking-widest mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map(({ label, href, desc }) => (
                        <Link key={label} href={href}
                            className="bg-EveningBlack hover:bg-DarkGray border border-SlateGray/30 hover:border-Green/30 rounded-xl p-4 transition group card-glow">
                            <p className="text-Snow text-sm font-medium group-hover:text-Green transition">{label}</p>
                            <p className="text-LightGray text-xs mt-1">{desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Portfolio link */}
            <div className="card-bg p-5 flex items-center justify-between">
                <div>
                    <p className="text-Snow text-sm font-medium">Your Portfolio</p>
                    <p className="text-LightGray text-xs mt-0.5">{process.env.NEXT_PUBLIC_PORTFOLIO_URL}</p>
                </div>
                <a href={process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? '#'} target="_blank" rel="noreferrer"
                    className="btn-green flex items-center gap-2 text-sm px-5 py-2">
                    Visit <FiArrowRight />
                </a>
            </div>
        </div>
    );
}
