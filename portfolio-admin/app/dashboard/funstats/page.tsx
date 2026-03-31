'use client';
import { useEffect, useState } from 'react';

const defaultForm = { coffee: 847, bugs: 2341, linesOfCode: 10, daysCoding: 365 };
const fields = [
    { key: 'coffee' as const, label: '☕ Cups of Coffee', desc: 'fueled by caffeine' },
    { key: 'bugs' as const, label: '🐛 Bugs Fixed', desc: 'and counting...' },
    { key: 'linesOfCode' as const, label: '⌨️ Lines of Code (k)', desc: 'written with love' },
    { key: 'daysCoding' as const, label: '📅 Days Coding', desc: 'no days off' },
];

export default function FunStatsPage() {
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/meta?key=funstats').then(r => r.json()).then(d => { if (d) setForm(d); });
    }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await fetch('/api/meta', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'funstats', value: form }) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-lg">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-Snow">Fun Stats</h1>
                <p className="text-LightGray text-sm mt-1">Update the animated counters shown on your homepage</p>
            </div>
            <form onSubmit={save} className="card-bg border border-EveningBlack p-6 space-y-3">
                {fields.map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center gap-4 p-4 bg-EveningBlack rounded-xl">
                        <div className="flex-1">
                            <label className="text-xs text-LightGray mb-1 block">{label}</label>
                            <p className="text-LightGray text-xs">{desc}</p>
                        </div>
                        <input type="number" value={form[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))}
                            className="input-style w-28 text-right text-Green font-bold text-lg" />
                    </div>
                ))}
                <div className="pt-2">
                    <button type="submit" disabled={saving} className="btn-green px-6 py-2.5 text-sm">
                        {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
