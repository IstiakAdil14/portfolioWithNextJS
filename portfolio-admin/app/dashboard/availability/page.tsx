'use client';
import { useEffect, useState } from 'react';

export default function AvailabilityPage() {
    const [available, setAvailable] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/meta?key=availability').then(r => r.json()).then(d => { if (d !== null) setAvailable(d); });
    }, []);

    const save = async () => {
        setSaving(true);
        await fetch('/api/meta', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'availability', value: available }) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-lg">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-Snow">Availability</h1>
                <p className="text-LightGray text-sm mt-1">Controls the availability badge on your portfolio homepage</p>
            </div>
            <div className="card-bg border border-EveningBlack p-6 space-y-6">
                {/* Toggle row */}
                <div className="flex items-center justify-between p-4 bg-EveningBlack rounded-xl">
                    <div>
                        <p className="text-Snow font-medium text-sm">Available for freelance work</p>
                        <p className="text-LightGray text-xs mt-0.5">Currently {available ? 'accepting' : 'not accepting'} new projects</p>
                    </div>
                    <button onClick={() => setAvailable(!available)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${available ? 'bg-Green' : 'bg-SlateGray'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-Snow rounded-full shadow transition-transform duration-300 ${available ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Preview badge */}
                <div>
                    <p className="text-xs text-LightGray uppercase tracking-widest mb-3">Preview</p>
                    <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-full border ${available ? 'border-Green/30 bg-Green/10' : 'border-red-500/30 bg-red-500/10'}`}>
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${available ? 'bg-Green' : 'bg-red-500'}`} />
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${available ? 'bg-Green' : 'bg-red-500'}`} />
                        </span>
                        <span className={`text-sm font-medium ${available ? 'text-Green' : 'text-red-400'}`}>
                            {available ? 'Available for freelance work' : 'Currently not available'}
                        </span>
                    </div>
                </div>

                <button onClick={save} disabled={saving} className="btn-green px-6 py-2.5 text-sm">
                    {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
