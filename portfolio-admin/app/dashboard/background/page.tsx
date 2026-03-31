'use client';
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface EduCard { title: string; degree: string; detail: string; year: string; }
interface ExpCard { title: string; role: string; url: string; desc: string; year: string; location: string; }

const emptyEdu: EduCard = { title: '', degree: '', detail: '', year: '' };
const emptyExp: ExpCard = { title: '', role: '', url: '', desc: '', year: '', location: '' };

export default function BackgroundPage() {
    const [eduCards, setEduCards] = useState<EduCard[]>([]);
    const [expCards, setExpCards] = useState<ExpCard[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/background').then(r => r.json()).then(d => {
            if (d?.eduCards) setEduCards(d.eduCards);
            if (d?.expCards) setExpCards(d.expCards);
        });
    }, []);

    const save = async () => {
        setSaving(true);
        await fetch('/api/background', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eduCards, expCards }) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    const Section = ({ title, items, onAdd, onRemove, onChange, fields }: {
        title: string;
        items: Record<string, string>[];
        onAdd: () => void;
        onRemove: (i: number) => void;
        onChange: (i: number, k: string, v: string) => void;
        fields: { key: string; label: string; span?: boolean }[];
    }) => (
        <div className="card-bg border border-EveningBlack p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-Snow font-bold">{title}</h2>
                <button type="button" onClick={onAdd}
                    className="flex items-center gap-1.5 text-Green hover:text-Green/80 text-sm border border-Green/20 hover:border-Green/40 px-3 py-1.5 rounded-lg transition">
                    <FiPlus /> Add
                </button>
            </div>
            <div className="space-y-4">
                {items.length === 0 && <p className="text-LightGray text-sm text-center py-4">No entries yet. Click Add to start.</p>}
                {items.map((card, i) => (
                    <div key={i} className="bg-EveningBlack rounded-xl p-4 space-y-3">
                        <div className="flex justify-end">
                            <button type="button" onClick={() => onRemove(i)}
                                className="flex items-center gap-1 text-xs text-LightGray hover:text-red-400 transition">
                                <FiTrash2 /> Remove
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {fields.map(f => (
                                <div key={f.key} className={f.span ? 'col-span-2' : ''}>
                                    <label className="text-xs text-LightGray mb-1 block uppercase tracking-wider">{f.label}</label>
                                    <input value={card[f.key] ?? ''} onChange={e => onChange(i, f.key, e.target.value)} className="input-style" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-Snow">Background</h1>
                    <p className="text-LightGray text-sm mt-1">Manage education and experience entries</p>
                </div>
                <button onClick={save} disabled={saving} className="btn-green px-5 py-2 text-sm">
                    {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save All'}
                </button>
            </div>

            <Section title="Education" items={eduCards as Record<string, string>[]}
                onAdd={() => setEduCards(c => [...c, { ...emptyEdu }])}
                onRemove={i => setEduCards(c => c.filter((_, j) => j !== i))}
                onChange={(i, k, v) => setEduCards(c => c.map((x, j) => j === i ? { ...x, [k]: v } : x))}
                fields={[
                    { key: 'title', label: 'Institution' },
                    { key: 'degree', label: 'Degree' },
                    { key: 'year', label: 'Year' },
                    { key: 'detail', label: 'Detail', span: true },
                ]}
            />

            <Section title="Experience" items={expCards as Record<string, string>[]}
                onAdd={() => setExpCards(c => [...c, { ...emptyExp }])}
                onRemove={i => setExpCards(c => c.filter((_, j) => j !== i))}
                onChange={(i, k, v) => setExpCards(c => c.map((x, j) => j === i ? { ...x, [k]: v } : x))}
                fields={[
                    { key: 'title', label: 'Company' },
                    { key: 'role', label: 'Role' },
                    { key: 'year', label: 'Year' },
                    { key: 'location', label: 'Location' },
                    { key: 'url', label: 'URL', span: true },
                    { key: 'desc', label: 'Description', span: true },
                ]}
            />
        </div>
    );
}
