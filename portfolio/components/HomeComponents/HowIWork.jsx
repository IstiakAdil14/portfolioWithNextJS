import { motion } from 'framer-motion';
import { FaSearch, FaPencilAlt, FaCode, FaRocket } from 'react-icons/fa';

const steps = [
    { icon: <FaSearch />, title: 'Understand', desc: 'Deep dive into your requirements, goals, and target audience.' },
    { icon: <FaPencilAlt />, title: 'Design', desc: 'Plan the architecture, UI/UX wireframes and tech stack.' },
    { icon: <FaCode />, title: 'Build', desc: 'Write clean, scalable code with best practices and testing.' },
    { icon: <FaRocket />, title: 'Deploy', desc: 'Ship to production with CI/CD, monitoring and documentation.' },
];

const HowIWork = () => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="px-2 md:px-8 py-6"
    >
        <div className="text-lg font-bold text-Snow mb-6">How I Work</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map(({ icon, title, desc }, i) => (
                <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-EveningBlack rounded-xl p-5 card_stylings relative"
                >
                    <span className="absolute top-3 right-4 text-xs text-LightGray font-bold">0{i + 1}</span>
                    <div className="text-Green text-2xl mb-3">{icon}</div>
                    <p className="text-Snow font-semibold text-sm mb-1">{title}</p>
                    <p className="text-LightGray text-xs leading-relaxed">{desc}</p>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

export default HowIWork;
