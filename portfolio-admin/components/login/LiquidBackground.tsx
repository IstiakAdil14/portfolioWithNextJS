'use client';
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const BLOBS = [
    { cls: 'w-[600px] h-[600px] bg-[#1fdf64]/[0.18] top-[-8%] left-[-8%]',    dur: 22, delay: 0,  x: [-40, 60],  y: [-30, 50]  },
    { cls: 'w-[500px] h-[500px] bg-[#34d399]/[0.13] bottom-[-5%] right-[-5%]', dur: 28, delay: 4,  x: [-50, 30],  y: [-40, 40]  },
    { cls: 'w-[380px] h-[380px] bg-[#059669]/[0.18] top-[35%] left-[38%]',     dur: 19, delay: 7,  x: [-60, 60],  y: [-50, 50]  },
    { cls: 'w-[260px] h-[260px] bg-[#1fdf64]/[0.10] bottom-[18%] left-[8%]',   dur: 25, delay: 10, x: [-30, 70],  y: [-60, 30]  },
    { cls: 'w-[200px] h-[200px] bg-[#34d399]/[0.22] top-[58%] right-[18%]',    dur: 21, delay: 13, x: [-70, 40],  y: [-30, 60]  },
] as const;

export function LiquidBackground() {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const px = useSpring(rawX, { stiffness: 38, damping: 24, mass: 1.2 });
    const py = useSpring(rawY, { stiffness: 38, damping: 24, mass: 1.2 });

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            rawX.set((e.clientX - window.innerWidth  / 2) * 0.035);
            rawY.set((e.clientY - window.innerHeight / 2) * 0.035);
        };
        window.addEventListener('mousemove', fn);
        return () => window.removeEventListener('mousemove', fn);
    }, [rawX, rawY]);

    return (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* base radial */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(31,223,100,0.07),transparent)]" />

            {BLOBS.map((b, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full blur-[90px] mix-blend-screen pointer-events-none ${b.cls}`}
                    animate={{
                        x: [b.x[0], b.x[1], b.x[0]],
                        y: [b.y[0], b.y[1], b.y[0]],
                        scale: [1, 1.1, 0.94, 1.07, 1],
                    }}
                    transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ x: px, y: py }}
                />
            ))}

            {/* vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
        </div>
    );
}
