'use client';
import { useEffect, useState } from 'react';
import CrudTable from '@/components/dashboard/CrudTable';
import Modal from '@/components/dashboard/Modal';

interface Skill { _id: string; title: string; level: string; }
const empty = { title: '', level: '' };

export default function SkillsPage() {
    const [data, setData] = useState<Skill[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Skill | null>(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = () => fetch('/api/skills').then(r => r.json()).then(setData);
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
    const openEdit = (row: Skill) => { setEditing(row); setForm({ title: row.title, level: row.level }); setOpen(true); };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        if (editing) {
            await fetch(`/api/skills/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        } else {
            await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        }
        setSaving(false); setOpen(false); load();
    };

    const del = async (id: string) => { await fetch(`/api/skills/${id}`, { method: 'DELETE' }); load(); };

    return (
        <>
            <CrudTable title="Skills" subtitle="Manage skill bars displayed on your portfolio"
                data={data}
                columns={[
                    { key: 'title', label: 'Skill' },
                    { key: 'level', label: 'Level', render: r => (
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-EveningBlack rounded-full h-1.5 w-32">
                                <div className="bg-Green h-1.5 rounded-full transition-all" style={{ width: r.level }} />
                            </div>
                            <span className="text-xs text-LightGray w-8">{r.level}</span>
                        </div>
                    )},
                ]}
                onAdd={openAdd} onEdit={openEdit} onDelete={del}
            />
            <Modal title={editing ? 'Edit Skill' : 'Add Skill'} open={open} onClose={() => setOpen(false)}>
                <form onSubmit={save} className="space-y-4">
                    <div>
                        <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">Skill Name</label>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="input-style" />
                    </div>
                    <div>
                        <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">Level (e.g. 85%)</label>
                        <input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} required placeholder="75%" className="input-style" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setOpen(false)}
                            className="flex-1 border border-SlateGray text-LightGray hover:text-Snow hover:border-LightGray py-2.5 rounded-xl transition text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-green flex-1 py-2.5 text-sm">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
