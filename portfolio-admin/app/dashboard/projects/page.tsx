'use client';
import { useEffect, useState } from 'react';
import CrudTable from '@/components/dashboard/CrudTable';
import Modal from '@/components/dashboard/Modal';

interface Project { _id: string; projectName: string; url: string; image: string; projectDetail: string; technologiesUsed: { tech: string }[]; }
const empty = { projectName: '', url: '', githubUrl: '', image: '', projectDetail: '', technologiesUsed: '' };

export default function ProjectsPage() {
    const [data, setData] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = () => fetch('/api/projects').then(r => r.json()).then(setData);
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
    const openEdit = (row: Project) => {
        setEditing(row);
        setForm({ projectName: row.projectName, url: row.url, githubUrl: '', image: row.image, projectDetail: row.projectDetail, technologiesUsed: row.technologiesUsed.map(t => t.tech).join(', ') });
        setOpen(true);
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = { ...form, technologiesUsed: form.technologiesUsed.split(',').map(t => ({ tech: t.trim() })).filter(t => t.tech) };
        if (editing) {
            await fetch(`/api/projects/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } else {
            await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }
        setSaving(false); setOpen(false); load();
    };

    const del = async (id: string) => { await fetch(`/api/projects/${id}`, { method: 'DELETE' }); load(); };

    const field = (key: keyof typeof form, label: string, type = 'text', rows?: number) => (
        <div>
            <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">{label}</label>
            {rows ? (
                <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={rows}
                    className="input-style resize-none" />
            ) : (
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="input-style" />
            )}
        </div>
    );

    return (
        <>
            <CrudTable title="Projects" data={data}
                columns={[
                    { key: 'projectName', label: 'Name' },
                    { key: 'image', label: 'Image', render: r => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : '—' },
                    { key: 'url', label: 'Live URL', render: r => r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="text-green-400 hover:underline text-xs">{r.url}</a> : '—' },
                ]}
                onAdd={openAdd} onEdit={openEdit} onDelete={del}
            />
            <Modal title={editing ? 'Edit Project' : 'Add Project'} open={open} onClose={() => setOpen(false)}>
                <form onSubmit={save} className="space-y-4">
                    {field('projectName', 'Project Name')}
                    {field('image', 'Image URL')}
                    {field('url', 'Live URL')}
                    {field('githubUrl', 'GitHub URL')}
                    {field('projectDetail', 'Description', 'text', 3)}
                    {field('technologiesUsed', 'Technologies (comma separated)')}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-SlateGray text-LightGray hover:text-Snow py-2.5 rounded-xl transition text-sm">Cancel</button>
                        <button type="submit" disabled={saving} className="btn-green flex-1 py-2.5 text-sm">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
