'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { PasswordInput } from './PasswordInput';
import { MagneticButton } from './MagneticButton';
import { EASE, rightContainer, item } from './variants';

interface RightPanelProps {
    password: string;
    setPassword: (v: string) => void;
    show: boolean;
    setShow: (fn: (s: boolean) => boolean) => void;
    error: string;
    loading: boolean;
    shake: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function RightPanel({
    password, setPassword, show, setShow,
    error, loading, shake, onSubmit,
}: RightPanelProps) {
    return (
        <motion.section
            aria-label="Login"
            className="flex-1 flex flex-col items-center justify-center px-12 py-16 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
        >
            {/* ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1fdf64]/[0.05] rounded-full blur-[140px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#1fdf64]/[0.07] rounded-full blur-[80px]" />
            </div>

            {/* card wrapper (HEIGHT FIX) */}
            <motion.div
                className="w-full max-w-[520px] flex"
                initial={{ opacity: 0, y: 36, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.78, delay: 0.46, ease: EASE }}
            >
                <GlassCard shake={shake}>

                    {/* FULL HEIGHT FLEX SYSTEM */}
                    <motion.div
                        variants={rightContainer}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col justify-between h-full"
                    >

                        {/* TOP CONTENT */}
                        <div className="space-y-12">

                            {/* Header */}
                            <motion.div variants={item} className="space-y-6" style={{ marginLeft: '1rem', marginTop: '1rem' }}>
                                
                                <div className="flex items-center gap-4 ">
                                    <motion.div
                                        className="w-14 h-14 rounded-2xl border border-[#1fdf64]/20 bg-[#1fdf64]/6 flex items-center justify-center"
                                        animate={{
                                            boxShadow: [
                                                '0 0 0 rgba(31,223,100,0)',
                                                '0 0 30px rgba(31,223,100,0.28)',
                                                '0 0 0 rgba(31,223,100,0)'
                                            ]
                                        }}
                                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Lock className="w-6 h-6 text-[#1fdf64]" />
                                    </motion.div>

                                    <div className="flex items-center gap-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-full px-8 py-2"
                                    style={{ width: '100px' }}
                                    >
                                        <motion.span
                                            className="w-2 h-2 rounded-full bg-[#1fdf64]"
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            style={{ marginLeft: '0.5rem' }}
                                        />
                                        <span className="text-[#1fdf64]/70 text-[11px] font-medium tracking-widest uppercase">
                                            Secure
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-[2.2rem] font-black text-white tracking-tight leading-tight">
                                        Welcome back
                                    </h1>
                                    <p className="text-[#484848] text-[14.5px] mt-3 leading-relaxed">
                                        Sign in to access your portfolio dashboard
                                    </p>
                                </div>
                            </motion.div>

                            {/* Divider */}
                            <motion.div variants={item} className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-[#141414]" />
                                <span className="text-[11px] text-[#252525] tracking-[0.2em] uppercase font-medium">
                                    Credentials
                                </span>
                                <div className="flex-1 h-px bg-[#141414]" />
                            </motion.div>

                            {/* Form */}
                            <motion.div variants={item}>
                                <form onSubmit={onSubmit} className="space-y-6" noValidate>

                                    <div className="space-y-2.5" style={{ paddingLeft: '1rem', paddingRight: '1rem', marginBottom: '1rem' }}>
                                        <label style={{ paddingLeft: '1rem' }} className="text-[11.5px] text-[#484848] font-semibold uppercase tracking-[0.18em]">
                                            Enter into your empire
                                        </label>

                                        <PasswordInput
                                            value={password}
                                            onChange={setPassword}
                                            show={show}
                                            onToggle={() => setShow(s => !s)}
                                        />
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                key="error"
                                                initial={{ opacity: 0, y: -6, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, y: -4, height: 0 }}
                                                className="flex items-center gap-3 bg-red-500/6 border border-red-500/15 rounded-2xl px-4 py-3.5"
                                            >
                                                <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                </div>
                                                <p className="text-red-400/90 text-[13px] font-medium">{error}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex justify-center mb-10">
                                    <MagneticButton disabled={loading} className="max-w-[220px] mb-10">
                                        {loading ? (
                                            <>
                                                <motion.span
                                                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                                                />
                                                Signing in…
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </MagneticButton>
                                    </div>
                                </form>
                            </motion.div>
                        </div>

                        {/* FOOTER (BOTTOM LOCKED) */}
                        <motion.div variants={item} className="space-y-4 pt-8 mt-10">
                            <div className="w-full h-px bg-[#0f0f0f]" />
                            <div className="flex items-center justify-between">
                                {['256-bit encrypted', 'Admin only', 'Session-scoped'].map(label => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#222]" />
                                        <span className="text-[11px] text-[#303030] tracking-wide">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </motion.div>
                </GlassCard>
            </motion.div>

            <motion.p
                className="mt-8 text-[#1c1c1c] text-[11px] tracking-[0.16em] uppercase text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                Portfolio Admin · Restricted Access
            </motion.p>
        </motion.section>
    );
}