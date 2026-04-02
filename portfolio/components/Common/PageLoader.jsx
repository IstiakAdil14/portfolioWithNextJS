import { motion } from 'framer-motion';

const PAGE_NAMES = {
    '/': 'Opening HOME — make yourself comfortable',
    '/portfolio': 'Exploring PORTFOLIO — good stuff ahead',
    '/background': 'Setting the stage — BACKGROUND loading',
    '/contact': 'Connecting to CONTACT — say hi 👋',
};

const getPageName = (url) => {
    const path = url?.split('?')[0];
    return PAGE_NAMES[path] || `${path?.replace('/', '') || 'page'}...`;
};

const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    delay: i * 0.08,
    radius: 80 + (i % 3) * 20,
}));

const PageLoader = ({ destination }) => {
    const pageName = getPageName(destination);
    return (
    <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-MidNightBlack overflow-hidden"
    >
        {/* Scanline overlay */}
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(31,223,100,0.015) 2px, rgba(31,223,100,0.015) 4px)',
                zIndex: 1,
            }}
        />

        {/* Background radial glow */}
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(31,223,100,0.08) 0%, transparent 70%)',
            }}
        />

        {/* Orbiting particles */}
        <div className="absolute w-64 h-64" style={{ zIndex: 2 }}>
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-Green"
                    style={{
                        top: '50%',
                        left: '50%',
                        marginTop: -3,
                        marginLeft: -3,
                        boxShadow: '0 0 6px rgba(31,223,100,0.9)',
                    }}
                    animate={{
                        x: [
                            Math.cos((p.angle * Math.PI) / 180) * p.radius,
                            Math.cos(((p.angle + 360) * Math.PI) / 180) * p.radius,
                        ],
                        y: [
                            Math.sin((p.angle * Math.PI) / 180) * p.radius,
                            Math.sin(((p.angle + 360) * Math.PI) / 180) * p.radius,
                        ],
                        opacity: [0.2, 1, 0.2],
                        scale: [0.6, 1.2, 0.6],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>

        {/* Outer spinning ring */}
        <motion.div
            className="absolute rounded-full border border-Green/20"
            style={{ width: 200, height: 200, zIndex: 2 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-Green"
                style={{ marginTop: -4, boxShadow: '0 0 10px rgba(31,223,100,1)' }}
            />
        </motion.div>

        {/* Inner spinning ring (reverse) */}
        <motion.div
            className="absolute rounded-full border border-Green/10"
            style={{ width: 140, height: 140, zIndex: 2 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        >
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-Green/70"
                style={{ marginBottom: -3, boxShadow: '0 0 8px rgba(31,223,100,0.8)' }}
            />
        </motion.div>

        {/* Center logo with glitch */}
        <div className="relative z-10 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'backOut' }}
                className="relative"
            >
                {/* Glitch layers */}
                <motion.div
                    className="absolute inset-0 text-2xl font-bold tracking-widest text-Green/30 font-cascadia-normal select-none"
                    animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.6, 0, 0] }}
                    transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }}
                    style={{ clipPath: 'inset(30% 0 40% 0)' }}
                >
                    &lt;<span className="text-Snow/30">Adil</span> /&gt;
                </motion.div>
                <motion.div
                    className="absolute inset-0 text-2xl font-bold tracking-widest text-Green/20 font-cascadia-normal select-none"
                    animate={{ x: [2, -2, 1, 0], opacity: [0, 0.5, 0, 0] }}
                    transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5, delay: 0.05 }}
                    style={{ clipPath: 'inset(60% 0 10% 0)' }}
                >
                    &lt;<span className="text-Snow/20">Adil</span> /&gt;
                </motion.div>

                {/* Main text */}
                <span className="text-2xl font-bold tracking-widest font-cascadia-normal text-Green">
                    &lt;<span className="text-Snow">Adil</span> /&gt;
                </span>
            </motion.div>

            {/* Typing dots */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1 mt-6"
            >
                {[0, 1, 2].map(i => (
                    <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-Green"
                        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        style={{ boxShadow: '0 0 6px rgba(31,223,100,0.8)' }}
                    />
                ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 180 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-5 h-[1px] bg-Green/10 rounded-full overflow-hidden"
                style={{ width: 180 }}
            >
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, #1fdf64, transparent)' }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* Status text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                className="text-Green/50 text-[10px] mt-3 tracking-[0.15em] font-cascadia-normal text-center px-4"
            >
             {pageName}...
            </motion.p>
        </div>
    </motion.div>
    );
};

export default PageLoader;
