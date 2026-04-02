import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CodingActivity = () => {
    const [github, setGithub] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`).then(r => r.json()).then(profile => {
            if (profile?.github) {
                const username = profile.github.replace('https://github.com/', '').replace(/\/$/, '');
                setGithub({ username, url: profile.github });
            }
        }).catch(() => {});
    }, []);

    if (!github) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="px-2 md:px-8 py-6"
        >
            <div className="text-lg font-bold text-Snow mb-4">Coding Activity</div>
            <div className="bg-EveningBlack rounded-xl p-4 overflow-x-auto">
                <img
                    src={`https://ghchart.rshah.org/1fdf64/${github.username}`}
                    alt="GitHub Contribution Chart"
                    className="w-full min-w-[600px] rounded"
                />
                <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-LightGray">GitHub Contributions</span>
                    <a href={github.url} target="_blank" rel="noreferrer" className="text-xs text-Green hover:underline">
                        View Profile →
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default CodingActivity;
