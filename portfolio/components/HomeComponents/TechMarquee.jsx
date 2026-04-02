import { useEffect, useState } from 'react';
import SkeletonBlock from '../Common/SkeletonBlock';

const TechMarquee = () => {
    const [techStack, setTechStack] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meta?key=techStack`)
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setTechStack(d); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const doubled = [...techStack, ...techStack];

    return (
        <div className="py-6 overflow-hidden">
            <div className="text-lg font-bold text-Snow px-2 md:px-8 mb-4">Tech Stack</div>
            {loading ? (
                <div className="flex gap-4 px-2 md:px-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <SkeletonBlock key={i} className="w-20 h-8 rounded-full flex-shrink-0" />
                    ))}
                </div>
            ) : (
                <div className="relative flex overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap gap-4">
                        {doubled.map((tech, i) => (
                            <span key={i}
                                className="inline-flex items-center px-4 py-2 bg-EveningBlack rounded-full text-sm text-Snow border border-SlateGray hover:border-Green hover:text-Green transition-colors cursor-default flex-shrink-0">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechMarquee;
