import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';

const posts = [
    {
        title: 'How I Structure My MERN Stack Projects',
        tag: 'Architecture',
        date: 'Jul 2025',
        link: 'https://dev.to/istiakadil',
    },
    {
        title: 'Next.js vs React: When to Use What',
        tag: 'Next.js',
        date: 'Jun 2025',
        link: 'https://dev.to/istiakadil',
    },
    {
        title: 'Building REST APIs with Node.js & Express',
        tag: 'Backend',
        date: 'May 2025',
        link: 'https://dev.to/istiakadil',
    },
];

const BlogNotes = () => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="px-2 md:px-8 py-6"
    >
        <div className="text-lg font-bold text-Snow mb-4">Dev Notes</div>
        <div className="flex flex-col gap-3">
            {posts.map(({ title, tag, date, link }) => (
                <a
                    key={title}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between bg-EveningBlack rounded-xl px-5 py-4 card_stylings group"
                >
                    <div>
                        <span className="text-xs text-Green font-medium mr-2">{tag}</span>
                        <span className="text-xs text-LightGray">{date}</span>
                        <p className="text-sm text-Snow mt-1 group-hover:text-Green transition-colors">{title}</p>
                    </div>
                    <FaExternalLinkAlt className="text-LightGray group-hover:text-Green text-xs flex-shrink-0 ml-4" />
                </a>
            ))}
        </div>
    </motion.div>
);

export default BlogNotes;
