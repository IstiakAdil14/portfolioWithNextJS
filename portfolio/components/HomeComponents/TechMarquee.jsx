import { useEffect, useState } from 'react';

const TechMarquee = () => {
    const [techStack, setTechStack] = useState([]);

    useEffect(() => {
        fetch('/api/meta?key=techStack').then(r => r.json()).then(d => { if (Array.isArray(d)) setTechStack(d); }).catch(() => {});
    }, []);

    const doubled = [...techStack, ...techStack];

    return (
        <div className="py-6 overflow-hidden">
            <div className="text-lg font-bold text-Snow px-2 md:px-8 mb-4">Tech Stack</div>
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
        </div>
    );
};

export default TechMarquee;
