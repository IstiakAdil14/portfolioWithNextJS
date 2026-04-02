import type { Metadata } from 'next';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';

export const metadata: Metadata = {
    title: 'Portfolio of Adil',
    description: 'Admin dashboard for portfolio management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-Black text-Snow" style={{ cursor: 'none' }} suppressHydrationWarning>
                <CustomCursor />
                {children}
            </body>
        </html>
    );
}
