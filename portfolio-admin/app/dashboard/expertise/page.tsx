'use client';
import { useEffect, useState } from 'react';
import CrudTable from '@/components/dashboard/CrudTable';
import Modal from '@/components/dashboard/Modal';

interface Expertise { _id: string; title: string; desc: string; }
const empty = { title: '', desc: '' };

export default function ExpertisePage() {
    const [data, setData] = useState<Expertise[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Expertise | null>(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = () => fetch('/api/expertise').then(r => r.json()).then(setData);
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
    const openEdit = (row: Expertise) => { setEditing(row); setForm({ title: row.title, desc: row.desc }); setOpen(true); };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        if (editing) {
            await fetch(`/api/expertise/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        } else {
            await fetch('/api/expertise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        }
        setSaving(false); setOpen(false); load();
    };

    const del = async (id: string) => { await fetch(`/api/expertise/${id}`, { method: 'DELETE' }); load(); };

    return (
        <>
            <CrudTable title="Expertise" subtitle="Manage your expertise cards shown on the homepage"
                data={data}
                columns={[
                    { key: 'title', label: 'Title' },
                    { key: 'desc', label: 'Description', render: r => <span className="line-clamp-1 text-LightGray">{r.desc}</span> },
                ]}
                onAdd={openAdd} onEdit={openEdit} onDelete={del}
            />
            <Modal title={editing ? 'Edit Expertise' : 'Add Expertise'} open={open} onClose={() => setOpen(false)}>
                <form onSubmit={save} className="space-y-4">
                    <div>
                        <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">Title</label>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="input-style" />
                    </div>
                    <div>
                        <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">Description</label>
                        <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} required rows={4}
                            className="input-style resize-none" />
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
