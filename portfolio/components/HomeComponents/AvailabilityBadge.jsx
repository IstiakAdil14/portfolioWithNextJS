import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SkeletonBlock from '../Common/SkeletonBlock';

const AvailabilityBadge = () => {
    const [available, setAvailable] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meta?key=availability`)
            .then(r => r.json())
            .then(d => { if (d !== null) setAvailable(d); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="px-2 md:px-8 py-4">
            <SkeletonBlock className="w-52 h-10 rounded-full" />
        </div>
    );

    if (available === null) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="px-2 md:px-8 py-4"
        >
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-full border ${available ? 'border-Green/30 bg-Green/10' : 'border-red-500/30 bg-red-500/10'}`}>
                <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${available ? 'bg-Green' : 'bg-red-500'}`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${available ? 'bg-Green' : 'bg-red-500'}`} />
                </span>
                <span className={`text-sm font-medium ${available ? 'text-Green' : 'text-red-400'}`}>
                    {available ? 'Available for freelance work' : 'Currently not available'}
                </span>
            </div>
        </motion.div>
    );
};

export default AvailabilityBadge;
