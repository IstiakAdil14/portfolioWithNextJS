'use client';
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface Props {
    title: string;
    subtitle?: string;
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ title, subtitle, open, onClose, children }: Props) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}>
            <div className="absolute inset-0 bg-Black/80 backdrop-blur-sm" />
            <div className="relative bg-DeepNightBlack border border-EveningBlack rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-green"
                onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-EveningBlack">
                    <div>
                        <h2 className="text-Snow font-bold">{title}</h2>
                        {subtitle && <p className="text-LightGray text-xs mt-0.5">{subtitle}</p>}
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-EveningBlack hover:bg-DarkGray flex items-center justify-center text-LightGray hover:text-Snow transition shrink-0 ml-4">
                        <FiX className="text-sm" />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
