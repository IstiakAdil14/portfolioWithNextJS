import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const FunStats = () => {
    const [stats, setStats] = useState({ coffee: 0, bugs: 0, linesOfCode: 0, daysCoding: 0 });
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        fetch('/api/meta?key=funstats').then(r => r.json()).then(d => { if (d) setStats(d); }).catch(() => {});
    }, []);

    const items = [
        { value: stats.coffee, suffix: '', label: '☕ Cups of Coffee', desc: 'fueled by caffeine' },
        { value: stats.bugs, suffix: '+', label: '🐛 Bugs Fixed', desc: 'and counting...' },
        { value: stats.linesOfCode, suffix: 'k+', label: '⌨️ Lines of Code', desc: 'written with love' },
        { value: stats.daysCoding, suffix: '', label: '📅 Days Coding', desc: 'no days off' },
    ];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="px-2 md:px-8 py-6"
        >
            <div className="text-lg font-bold text-Snow mb-4">Fun Stats</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map(({ value, suffix, label, desc }) => (
                    <div key={label} className="bg-EveningBlack rounded-xl p-5 card_stylings text-center">
                        <p className="text-2xl font-bold text-Green">
                            {inView ? <CountUp end={value} duration={2} suffix={suffix} /> : '0'}
                        </p>
                        <p className="text-Snow text-sm font-medium mt-1">{label}</p>
                        <p className="text-LightGray text-xs mt-1">{desc}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default FunStats;
