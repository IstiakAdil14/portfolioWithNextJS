import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-Black">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto bg-MidNightBlack min-h-screen">
                {children}
            </main>
        </div>
    );
}
