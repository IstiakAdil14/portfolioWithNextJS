'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    FiHome, FiUser, FiStar, FiBriefcase, FiBook,
    FiCode, FiActivity, FiBarChart2, FiToggleLeft, FiLogOut, FiExternalLink
} from 'react-icons/fi';

const navGroups = [
    {
        label: 'General',
        links: [
            { href: '/dashboard', label: 'Overview', icon: FiHome },
            { href: '/dashboard/profile', label: 'Profile', icon: FiUser },
            { href: '/dashboard/availability', label: 'Availability', icon: FiToggleLeft },
        ],
    },
    {
        label: 'Content',
        links: [
            { href: '/dashboard/expertise', label: 'Expertise', icon: FiStar },
            { href: '/dashboard/projects', label: 'Projects', icon: FiBriefcase },
            { href: '/dashboard/background', label: 'Background', icon: FiBook },
            { href: '/dashboard/skills', label: 'Skills', icon: FiCode },
        ],
    },
    {
        label: 'Widgets',
        links: [
            { href: '/dashboard/currently', label: 'Currently Doing', icon: FiActivity },
            { href: '/dashboard/funstats', label: 'Fun Stats', icon: FiBarChart2 },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <aside className="w-64 shrink-0 bg-DeepNightBlack border-r border-EveningBlack flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-EveningBlack">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-Green flex items-center justify-center shrink-0">
                        <span className="text-MidNightBlack font-bold text-sm">P</span>
                    </div>
                    <div>
                        <p className="text-Snow font-bold text-sm leading-none">Portfolio</p>
                        <p className="text-LightGray text-xs mt-0.5">Admin Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
                {navGroups.map(group => (
                    <div key={group.label}>
                        <p className="text-[10px] font-semibold text-SlateGray uppercase tracking-widest px-3 mb-2">{group.label}</p>
                        <div className="space-y-0.5">
                            {group.links.map(({ href, label, icon: Icon }) => {
                                const active = pathname === href;
                                return (
                                    <Link key={href} href={href}
                                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                            active
                                                ? 'bg-Green/10 text-Green font-medium'
                                                : 'text-LightGray hover:text-Snow hover:bg-EveningBlack'
                                        }`}>
                                        {active && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-Green rounded-r-full" />
                                        )}
                                        <Icon className="text-base shrink-0" />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-EveningBlack space-y-0.5">
                <a href={process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? '#'} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-LightGray hover:text-Snow hover:bg-EveningBlack transition w-full">
                    <FiExternalLink className="text-base" /> View Portfolio
                </a>
                <button onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-LightGray hover:text-red-400 hover:bg-red-500/10 w-full transition">
                    <FiLogOut className="text-base" /> Logout
                </button>
            </div>
        </aside>
    );
}
