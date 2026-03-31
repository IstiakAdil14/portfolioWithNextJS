'use client';
import { useEffect, useState } from 'react';
import { FaCode, FaBook, FaMusic } from 'react-icons/fa';

const defaultForm = { building: '', learning: '', listening: '' };
const icons = { building: <FaCode className="text-Green" />, learning: <FaBook className="text-Green" />, listening: <FaMusic className="text-Green" /> };

export default function CurrentlyPage() {
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/meta?key=currently').then(r => r.json()).then(d => { if (d) setForm(d); });
    }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await fetch('/api/meta', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'currently', value: form }) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-lg">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-Snow">Currently Doing</h1>
                <p className="text-LightGray text-sm mt-1">Update the live status widget on your homepage</p>
            </div>
            <form onSubmit={save} className="card-bg border border-EveningBlack p-6 space-y-4">
                {(['building', 'learning', 'listening'] as const).map(key => (
                    <div key={key} className="flex items-center gap-4 p-4 bg-EveningBlack rounded-xl">
                        <div className="text-xl shrink-0">{icons[key]}</div>
                        <div className="flex-1">
                            <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">{key}</label>
                            <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                placeholder={key === 'building' ? 'MERN Stack Portfolio' : key === 'learning' ? 'Docker & DevOps' : 'Lo-fi Beats'}
                                className="input-style" />
                        </div>
                    </div>
                ))}
                <button type="submit" disabled={saving} className="btn-green px-6 py-2.5 text-sm">
                    {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
}
