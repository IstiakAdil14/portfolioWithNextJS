import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaBook, FaMusic } from 'react-icons/fa';

const icons = {
    building: <FaCode className="text-Green" />,
    learning: <FaBook className="text-Green" />,
    listening: <FaMusic className="text-Green" />,
};

const CurrentlyDoing = () => {
    const [data, setData] = useState({ building: '', learning: '', listening: '' });

    useEffect(() => {
        fetch('/api/meta?key=currently').then(r => r.json()).then(d => { if (d) setData(d); }).catch(() => {});
    }, []);

    const items = [
        { key: 'building', label: 'Building', value: data.building },
        { key: 'learning', label: 'Learning', value: data.learning },
        { key: 'listening', label: 'Listening', value: data.listening },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="px-2 md:px-8 py-6"
        >
            <div className="text-lg font-bold text-Snow mb-4">Currently</div>
            <div className="flex flex-wrap gap-4">
                {items.map(({ key, label, value }) => (
                    <div key={key} className="flex items-center gap-3 bg-EveningBlack rounded-xl px-5 py-3 card_stylings">
                        <span className="text-xl">{icons[key]}</span>
                        <div>
                            <p className="text-xs text-LightGray">{label}</p>
                            <p className="text-sm text-Snow font-medium">{value || '...'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default CurrentlyDoing;
