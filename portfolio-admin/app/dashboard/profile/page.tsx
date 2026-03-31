'use client';
import { useEffect, useState } from 'react';

const defaultProfile = { name: '', designation: '', bio: '', photo: '', residence: '', city: '', age: '', email: '', phone: '', github: '', linkedin: '', twitter: '', facebook: '', resumeUrl: '', fiverrUrl: '' };

export default function ProfilePage() {
    const [form, setForm] = useState(defaultProfile);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/meta?key=profile').then(r => r.json()).then(d => { if (d) setForm(d); });
    }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await fetch('/api/meta', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'profile', value: form }) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    const field = (key: keyof typeof form, label: string, type = 'text') => (
        <div key={key}>
            <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-style" />
        </div>
    );

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-Snow">Profile</h1>
                <p className="text-LightGray text-sm mt-1">Update your personal information shown on the portfolio</p>
            </div>
            <form onSubmit={save} className="card-bg border border-EveningBlack p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    {field('name', 'Full Name')}
                    {field('designation', 'Designation')}
                    {field('email', 'Email', 'email')}
                    {field('phone', 'Phone')}
                    {field('residence', 'Residence')}
                    {field('city', 'City')}
                    {field('age', 'Age')}
                    {field('photo', 'Photo URL')}
                </div>
                <div>
                    <label className="text-xs text-LightGray mb-1.5 block uppercase tracking-wider">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3}
                        className="input-style resize-none" />
                </div>
                <div className="border-t border-EveningBlack pt-4">
                    <p className="text-xs text-LightGray uppercase tracking-widest mb-4">Social Links</p>
                    <div className="grid grid-cols-2 gap-4">
                        {field('github', 'GitHub URL')}
                        {field('linkedin', 'LinkedIn URL')}
                        {field('twitter', 'Twitter URL')}
                        {field('facebook', 'Facebook URL')}
                        {field('fiverrUrl', 'Fiverr URL')}
                        {field('resumeUrl', 'Resume URL / Path')}
                    </div>
                </div>
                <button type="submit" disabled={saving} className="btn-green px-6 py-2.5 text-sm">
                    {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
}
