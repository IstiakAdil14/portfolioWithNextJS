'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Cpu, Sparkles, FolderKanban } from 'lucide-react';
import { LiquidBackground } from './LiquidBackground';
import { GridLines } from './Overlays';
import { EASE, leftContainer, item, featureContainer, featureVariant } from './variants';
import type { MotionValue } from 'framer-motion';

// ── Logo mark ─────────────────────────────────────────────────────────────────
function LogoMark() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2z" fill="#0a0a0a" />
            <path d="M9 9h5v5H9z" fill="#0a0a0a" opacity="0.35" />
        </svg>
    );
}

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ className, dur, delay, size = 'lg' }: {
    className: string; dur: number; delay: number; size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
    const sizes = { sm: 'w-32 h-32', md: 'w-56 h-56', lg: 'w-96 h-96', xl: 'w-[560px] h-[560px]' };
    return (
        <motion.div
            aria-hidden="true"
            className={`absolute rounded-full pointer-events-none ${sizes[size]} ${className}`}
            animate={{
                scale:   [1, 1.15, 0.95, 1],
                opacity: [0.4, 0.7, 0.35, 0.4],
                x:       [0, 12, -8, 0],
                y:       [0, -10, 6, 0],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        />
    );
}

// ── Tick ──────────────────────────────────────────────────────────────────────
function Tick({ active }: { active: boolean }) {
    return (
        <motion.div
            className={`w-[3px] h-6 rounded-full transition-all duration-500 ${active ? 'bg-[#1fdf64]' : 'bg-[#1e1e1e]'}`}
            animate={active ? { boxShadow: '0 0 8px rgba(31,223,100,0.7)' } : { boxShadow: 'none' }}
        />
    );
}

// ── Feature row ───────────────────────────────────────────────────────────────
function Feature({ icon: Icon, label, sub, index }: {
    icon: React.ElementType; label: string; sub: string; index: number;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            variants={featureVariant}
            className="flex items-start gap-5 group cursor-default select-none"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <div className="flex flex-col items-center gap-1 pt-0.5 w-6 shrink-0">
                <span className="text-[10px] font-mono text-[#2a2a2a] group-hover:text-[#1fdf64]/60 transition-colors">0{index}</span>
                <Tick active={hovered} />
            </div>
            <motion.div
                className="mt-0.5 w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                animate={{
                    backgroundColor: hovered ? 'rgba(31,223,100,0.12)' : 'rgba(255,255,255,0.02)',
                    borderColor:      hovered ? 'rgba(31,223,100,0.3)'  : 'rgba(255,255,255,0.04)',
                    boxShadow:        hovered ? '0 0 20px rgba(31,223,100,0.2)' : 'none',
                }}
                transition={{ duration: 0.25 }}
            >
                <Icon className={`w-5 h-5 transition-colors duration-200 ${hovered ? 'text-[#1fdf64]' : 'text-[#303030]'}`} aria-hidden="true" />
            </motion.div>
            <div className="flex-1 min-w-0">
                <p className={`text-[14.5px] font-semibold leading-none mb-2 transition-colors duration-200 ${hovered ? 'text-white' : 'text-white/50'}`}>
                    {label}
                </p>
                <p className="text-[12.5px] leading-snug" style={{ color: '#5a6a7a' }}>{sub}</p>
            </div>
        </motion.div>
    );
}

// ── Stat ──────────────────────────────────────────────────────────────────────
function Stat({ val, label, delay }: { val: string; label: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ delay, duration: 0.6, ease: EASE }}
            className="group text-center"
        >
            <p className="font-black text-[1.65rem] leading-none tracking-tighter text-white group-hover:text-[#1fdf64] transition-colors duration-300">
                {val}
            </p>
            <p className="text-[10px] text-[#383838] mt-2 tracking-[0.18em] uppercase font-medium">{label}</p>
        </motion.div>
    );
}

// ── Left Panel ────────────────────────────────────────────────────────────────
interface LeftPanelProps {
    orbX: MotionValue<number>;
    orbY: MotionValue<number>;
}

export function LeftPanel({ orbX, orbY }: LeftPanelProps) {
    return (
        <motion.section
            aria-label="Branding"
            className="hidden lg:flex w-[52%] relative overflow-hidden flex-col justify-between py-14 pr-14 "
            style={{ paddingLeft: '5rem' }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1,  x: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
        >
            <LiquidBackground />
            <GridLines />

            {/* orbs */}
            <motion.div aria-hidden="true" style={{ x: orbX, y: orbY }} className="absolute inset-0 pointer-events-none">
                <Orb className="bg-[#1fdf64]/8  blur-[90px]  top-[5%]  left-[2%]"    dur={22} delay={0}  size="xl" />
                <Orb className="bg-[#34d399]/10 blur-[60px]  bottom-[15%] right-[8%]" dur={28} delay={3}  size="lg" />
                <Orb className="bg-[#1fdf64]/14 blur-[40px]  top-[48%] left-[46%]"    dur={18} delay={7}  size="md" />
            </motion.div>

            {/* divider */}
            <div aria-hidden="true" className="absolute right-0 top-16 bottom-16 w-px">
                <div className="h-full bg-gradient-to-b from-transparent via-[#1fdf64]/12 to-transparent" />
            </div>
            <motion.div
                aria-hidden="true"
                className="absolute right-0 top-1/2 w-6 h-px bg-[#1fdf64]/40"
                animate={{ width: ['24px', '48px', '24px'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Logo */}
            <motion.div
                className="relative z-10 flex items-center gap-3"
                style={{ marginTop: '2rem' }}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.55, ease: EASE }}
            >
                <motion.div
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1fdf64] to-[#059669] flex items-center justify-center"
                    animate={{ boxShadow: ['0 0 14px rgba(31,223,100,0.2)', '0 0 36px rgba(31,223,100,0.55)', '0 0 14px rgba(31,223,100,0.2)'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <LogoMark />
                </motion.div>
                <div>
                    <p className="text-white font-bold text-[18px] leading-none tracking-tight">Portfolio Admin</p>
                    <p className="text-[13px] mt-0.5 tracking-widest uppercase font-medium bg-gradient-to-r from-[#1fdf64] to-[#34d399] bg-clip-text text-transparent">
                        Content Management
                    </p>
                </div>
            </motion.div>

            {/* Middle: Hero + features */}
            <motion.div className="relative z-10 space-y-16" style={{ paddingLeft: '2rem', marginTop: '1rem' }} variants={leftContainer} initial="hidden" animate="show">

                {/* badge */}
                <motion.div variants={item}>
                    <div className="inline-flex items-center gap-3 bg-[#0c0c0c] border border-[#1e1e1e] rounded-full px-5 py-2.5" style={{ width: '240px' }}>
                        <motion.span
                            aria-hidden="true"
                            className="w-2 h-2 rounded-full bg-[#1fdf64] "
                            animate={{ opacity: [1, 0.15, 1], scale: [1, 0.8, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            style={{ marginLeft: '0.5rem' }}
                        />
                        <span className="text-[#1fdf64] text-[12px] font-semibold tracking-[0.2em] uppercase">Admin Portal</span>
                        <span className="text-[#222] text-[12px]">·</span>
                        <span className="text-[#2e2e2e] text-[12px] tracking-widest uppercase font-medium"
                        style={{ marginRight: '0.5rem' }}
                        >v2.0</span>
                    </div>
                </motion.div>
                <motion.div variants={item} className="space-y-3">
                    <p className="text-[13px] tracking-[0.22em] uppercase font-semibold mb-5 text-[#1fdf64]/60">Manage</p>
                    <h1 className="text-[3.8rem] font-black text-white leading-[1.02] tracking-[-0.03em]">
                        Your portfolio
                    </h1>
                    <h1
                        className="text-[3.8rem] font-black leading-[1.02] tracking-[-0.03em]"
                        style={{ WebkitTextStroke: '1.5px rgba(31,223,100,0.6)', color: 'transparent' }}
                    >
                        in real time.
                    </h1>
                    <p className="text-[0.95rem] leading-relaxed max-w-[320px] pt-4 font-light" style={{ color: '#7c8a9e' }}>
                        The complete control center for your work, skills, and expertise.
                    </p>
                </motion.div>

                {/* features */}
                <motion.div variants={featureContainer} className="space-y-6 pl-2 border-l border-[#1fdf64]/10 ml-1">
                    <Feature icon={FolderKanban} label="Projects & Case Studies" sub="Add, edit and reorder your work"        index={1} />
                    <Feature icon={Cpu}          label="Skills & Technologies"   sub="Manage your tech stack visually"        index={2} />
                    <Feature icon={Layers}       label="Expertise Sections"      sub="Control what the world sees about you"  index={3} />
                    <Feature icon={Sparkles}     label="Live Portfolio Sync"     sub="Changes reflect instantly on your site" index={4} />
                </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
            >
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent mb-8" />
                <div className="grid grid-cols-4 gap-4">
                    <Stat val="10+" label="Projects"  delay={1.15} />
                    <Stat val="13+" label="Skills"    delay={1.22} />
                    <Stat val="3+"  label="Expertise" delay={1.29} />
                    <Stat val="∞"   label="Updates"   delay={1.36} />
                </div>
            </motion.div>
        </motion.section>
    );
}
