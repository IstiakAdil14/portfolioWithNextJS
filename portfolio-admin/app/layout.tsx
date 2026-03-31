import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Portfolio Admin',
    description: 'Admin dashboard for portfolio management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-Black text-Snow" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
