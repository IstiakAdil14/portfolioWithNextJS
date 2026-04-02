'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
}

export function PasswordInput({ value, onChange, show, onToggle }: PasswordInputProps) {
    const [focused, setFocused] = useState(false);
    const strength = value.length === 0 ? 0 : value.length < 6 ? 1 : value.length < 12 ? 2 : 3;
    const strengthColors = ['bg-transparent', 'bg-red-500', 'bg-amber-400', 'bg-[#1fdf64]'];

    return (
        <div className="space-y-2">
            <div className="relative">
                <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                        boxShadow: focused
                            ? '0 0 0 1.5px rgba(31,223,100,0.7), 0 0 24px rgba(31,223,100,0.12)'
                            : '0 0 0 1px rgba(30,30,30,1)',
                    }}
                    transition={{ duration: 0.18 }}
                />
                <div className="relative flex items-center rounded-2xl overflow-hidden bg-[#0c0c0c]">
                    <motion.div
                        aria-hidden="true"
                        className="absolute left-4 w-4 h-4 pointer-events-none z-10"
                        animate={{ color: focused ? '#1fdf64' : '#2e2e2e' }}
                        transition={{ duration: 0.2 }}
                    >
                        <Lock className="w-4 h-4" />
                    </motion.div>
                    <input
                        id="password"
                        type={show ? 'text' : 'password'}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Whats the password?"
                        autoComplete="current-password"
                        autoFocus
                        required
                        className="w-full bg-transparent text-[#888] focus:text-white text-[13.5px] outline-none border-none placeholder:text-[#252525] placeholder:text-center transition-colors duration-200 font-mono tracking-wide" style={{ paddingLeft: '3rem', paddingRight: '3rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                    />
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        className="absolute right-4 text-[#303030] hover:text-[#1fdf64] transition-colors duration-200 z-10 focus-visible:outline-none rounded"
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {value.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex gap-1.5 px-0.5"
                >
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${strength >= i ? strengthColors[strength] : 'bg-[#1c1c1c]'}`}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
