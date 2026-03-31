import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NAME, DESIGNATION, CONTACTS, TECH_STACK, SOCIAL_LINKS } from '../../constants/constants';

const COMMANDS = {
    whoami: `${NAME} — ${DESIGNATION}`,
    skills: TECH_STACK.join(' · '),
    contact: `Email: ${CONTACTS.EMAIL} | Phone: ${CONTACTS.PHONE}`,
    social: `GitHub: ${SOCIAL_LINKS.GITHUB}\nLinkedIn: ${SOCIAL_LINKS.LINKEDIN}`,
    help: 'Available commands: whoami, skills, contact, social, clear',
    clear: '__CLEAR__',
};

const TUTORIAL = [
    { type: 'info',   text: '👋 Welcome to my interactive terminal!' },
    { type: 'info',   text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
    { type: 'info',   text: '📌 Click the input below and type a command.' },
    { type: 'info',   text: '⌨️  Then press Enter to run it.' },
    { type: 'info',   text: '' },
    { type: 'info',   text: '💡 Try these commands:' },
    { type: 'hint',   text: '  > whoami   — who is this developer?' },
    { type: 'hint',   text: '  > skills   — tech stack & expertise' },
    { type: 'hint',   text: '  > contact  — email & phone' },
    { type: 'hint',   text: '  > social   — GitHub & LinkedIn links' },
    { type: 'hint',   text: '  > clear    — clear the terminal' },
    { type: 'info',   text: '' },
    { type: 'info',   text: '─────────────────────────────────────' },
];

const InteractiveTerminal = () => {
    const [history, setHistory] = useState(TUTORIAL);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (e) => {
        if (e.key !== 'Enter') return;
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        const result = COMMANDS[cmd];
        if (result === '__CLEAR__') {
            setHistory(TUTORIAL);
        } else {
            setHistory(prev => [
                ...prev,
                { type: 'input', text: cmd },
                { type: result ? 'output' : 'error', text: result || `Command not found: "${cmd}". Type "help".` },
            ]);
        }
        setInput('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="px-2 md:px-8 py-6"
        >
            <div className="text-lg font-bold text-Snow mb-4">Terminal</div>
            <div className="bg-DeepNightBlack rounded-xl overflow-hidden border border-SlateGray">
                {/* title bar */}
                <div className="flex items-center gap-2 px-4 py-2 bg-DarkGray">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-Green" />
                    <span className="text-xs text-LightGray ml-2 font-cascadia-normal">portfolio ~ terminal</span>
                </div>
                {/* output */}
                <div className="h-64 overflow-y-auto p-4 font-cascadia-normal text-xs space-y-1">
                    {history.map((line, i) => (
                        <div key={i} className={
                            line.type === 'input' ? 'text-Green' :
                            line.type === 'hint'  ? 'text-yellow-400' :
                            line.type === 'error' ? 'text-red-400' : 'text-SilverGray whitespace-pre-wrap'
                        }>
                            {line.type === 'input' ? `> ${line.text}` : line.text}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                {/* input */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-SlateGray">
                    <span className="text-Green text-xs font-cascadia-normal">{'>'}</span>
                    <input
                        className="flex-1 bg-transparent text-Snow text-xs font-cascadia-normal outline-none"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        placeholder="type a command..."
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default InteractiveTerminal;
