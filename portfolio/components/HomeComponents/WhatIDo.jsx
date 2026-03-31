import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const doList = [
    'Full-stack MERN web apps',
    'REST API development',
    'Next.js & React frontends',
    'MongoDB & MySQL databases',
    'Code reviews & consulting',
];

const dontList = [
    'Mobile apps (iOS / Android)',
    'WordPress / Wix sites',
    'Graphic design / branding',
    'Desktop software (C++/Java)',
    'Blockchain / Web3 projects',
];

const WhatIDo = () => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="px-2 md:px-8 py-6"
    >
        <div className="text-lg font-bold text-Snow mb-4">What I Do & Don't</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-EveningBlack rounded-xl p-5">
                <p className="text-Green font-semibold text-sm mb-3 flex items-center gap-2"><FaCheck /> I Do</p>
                <ul className="space-y-2">
                    {doList.map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs text-SilverGray">
                            <FaCheck className="text-Green flex-shrink-0" />{item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-EveningBlack rounded-xl p-5">
                <p className="text-red-400 font-semibold text-sm mb-3 flex items-center gap-2"><FaTimes /> I Don't</p>
                <ul className="space-y-2">
                    {dontList.map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs text-SilverGray">
                            <FaTimes className="text-red-400 flex-shrink-0" />{item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </motion.div>
);

export default WhatIDo;
