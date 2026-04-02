'use client';
import { motion } from 'framer-motion';

export function Noise() {
    return (
        <svg className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-[0.028]" aria-hidden="true">
            <filter id="noise-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise-filter)" />
        </svg>
    );
}

export function Scanlines() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[59] opacity-[0.018]"
            style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)',
                backgroundSize: '100% 2px',
            }}
        />
    );
}

export function GridLines() {
    return (
        <motion.div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.025]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.025 }}
            transition={{ duration: 2 }}
            style={{
                backgroundImage: `
                    linear-gradient(rgba(31,223,100,0.6) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(31,223,100,0.6) 1px, transparent 1px)
                `,
                backgroundSize: '52px 52px',
            }}
        />
    );
}
