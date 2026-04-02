'use client';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    type?: 'submit' | 'button';
    onClick?: () => void;
    className?: string;
}

export function MagneticButton({
    children,
    disabled,
    loading,
    type = 'submit',
    onClick,
    className = '',
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [hovered, setHovered] = useState(false);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 280, damping: 18, mass: 0.6 });
    const sy = useSpring(my, { stiffness: 280, damping: 18, mass: 0.6 });

    const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current || disabled) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width  / 2)) * 0.28);
        my.set((e.clientY - (r.top  + r.height / 2)) * 0.28);
    };

    const onLeave = () => {
        mx.set(0);
        my.set(0);
        setHovered(false);
    };

    return (
        <motion.button
            ref={ref}
            type={type}
            disabled={disabled}
            aria-label="Sign in to dashboard"
            style={{ x: sx, y: sy }}
            onMouseMove={onMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onLeave}
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className={`relative w-40 h-9 rounded-xl text-sm font-semibold overflow-hidden cursor-none
                        disabled:opacity-50 disabled:cursor-none
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-[#1fdf64] focus-visible:ring-offset-2
                        focus-visible:ring-offset-black ${className}`}
        >
            {/* gradient fill */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1fdf64] to-[#34d399]" />

            {/* shimmer sweep */}
            <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent
                            transition-transform duration-700
                            ${hovered ? 'translate-x-full' : '-translate-x-full'}`}
            />

            {/* hover / loading glow */}
            <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-xl"
                animate={{
                    boxShadow: loading
                        ? ['0 0 0px rgba(31,223,100,0)', '0 0 40px rgba(31,223,100,0.75)', '0 0 0px rgba(31,223,100,0)']
                        : hovered
                            ? '0 0 28px rgba(31,223,100,0.5)'
                            : '0 0 0px rgba(31,223,100,0)',
                }}
                transition={{ duration: loading ? 0.9 : 0.3, repeat: loading ? Infinity : 0 }}
            />

            <span className="relative z-10 flex items-center justify-center gap-2 text-[#0a0a0a]">
                {children}
            </span>
        </motion.button>
    );
}
