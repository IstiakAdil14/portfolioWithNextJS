import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCodeBranch, FaGithub } from 'react-icons/fa';

const OpenSource = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [githubUrl, setGithubUrl] = useState('');

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`).then(r => r.json()).then(profile => {
            if (!profile?.github) { setLoading(false); return; }
            setGithubUrl(profile.github);
            const username = profile.github.replace('https://github.com/', '').replace(/\/$/, '');
            fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=6`)
                .then(r => r.json())
                .then(data => { setRepos(Array.isArray(data) ? data : []); setLoading(false); })
                .catch(() => setLoading(false));
        }).catch(() => setLoading(false));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="px-2 md:px-8 py-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold text-Snow">Open Source</div>
                {githubUrl && (
                    <a href={githubUrl} target="_blank" rel="noreferrer" className="text-xs text-Green hover:underline flex items-center gap-1">
                        <FaGithub /> View All
                    </a>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                    ? [1, 2, 3].map(i => <div key={i} className="bg-EveningBlack rounded-xl h-24 animate-pulse" />)
                    : repos.map(repo => (
                        <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                            className="bg-EveningBlack rounded-xl p-4 card_stylings group flex flex-col justify-between">
                            <p className="text-Snow text-sm font-medium group-hover:text-Green transition-colors truncate">{repo.name}</p>
                            <p className="text-LightGray text-xs mt-1 line-clamp-2">{repo.description || 'No description'}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="flex items-center gap-1 text-xs text-SilverGray"><FaStar className="text-yellow-400" />{repo.stargazers_count}</span>
                                <span className="flex items-center gap-1 text-xs text-SilverGray"><FaCodeBranch className="text-Green" />{repo.forks_count}</span>
                                {repo.language && <span className="text-xs text-Green">{repo.language}</span>}
                            </div>
                        </a>
                    ))
                }
            </div>
        </motion.div>
    );
};

export default OpenSource;
