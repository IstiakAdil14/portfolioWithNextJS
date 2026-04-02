'use client';
import { motion } from 'framer-motion';

export function GlassCard({ children, shake }: { children: React.ReactNode; shake: boolean }) {
    return (
        <div className="relative w-full h-full">

            {/* animated border */}
            <motion.div
                className="absolute -inset-[1px] rounded-3xl"
                animate={{
                    background: [
                        'conic-gradient(from 0deg, #1fdf6400 0%, #1fdf64 15%, #1fdf6400 30%, #1fdf6400 60%, #34d399 75%, #1fdf6400 90%)',
                        'conic-gradient(from 360deg, #1fdf6400 0%, #1fdf64 15%, #1fdf6400 30%, #1fdf6400 60%, #34d399 75%, #1fdf6400 90%)',
                    ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            {/* main card */}
            <motion.div
                className="relative rounded-3xl bg-[#070707]/80 backdrop-blur-3xl border border-white/[0.04] overflow-hidden w-full h-full flex flex-col justify-between shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
                animate={shake ? { x: [0, -12, 14, -9, 9, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.44, ease: 'easeInOut' }}
            >

                {/* top light */}
                <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* subtle vertical lighting */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#1fdf64]/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1fdf64]/10 to-transparent" />
                </div>

                {/* content */}
                <div className="px-20 py-20 flex flex-col justify-between h-full">
                    {children}
                </div>

            </motion.div>
        </div>
    );
}