'use client';
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiInbox } from 'react-icons/fi';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface Props<T extends { _id: string }> {
    title: string;
    subtitle?: string;
    data: T[];
    columns: Column<T>[];
    onAdd: () => void;
    onEdit: (row: T) => void;
    onDelete: (id: string) => void;
}

export default function CrudTable<T extends { _id: string }>({ title, subtitle, data, columns, onAdd, onEdit, onDelete }: Props<T>) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this?')) return;
        setDeletingId(id);
        await onDelete(id);
        setDeletingId(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-Snow">{title}</h1>
                    {subtitle && <p className="text-LightGray text-sm mt-1">{subtitle}</p>}
                </div>
                <button onClick={onAdd}
                    className="btn-green flex items-center gap-2 text-sm px-4 py-2 shrink-0">
                    <FiPlus className="text-base" /> Add New
                </button>
            </div>

            {/* Table */}
            <div className="card-bg overflow-hidden border border-EveningBlack">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-EveningBlack border border-SlateGray/30 flex items-center justify-center mb-4">
                            <FiInbox className="text-LightGray text-xl" />
                        </div>
                        <p className="text-SilverGray font-medium text-sm">No records yet</p>
                        <p className="text-LightGray text-xs mt-1">Click "Add New" to create your first entry</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-EveningBlack">
                                {columns.map(col => (
                                    <th key={String(col.key)} className="text-left px-5 py-3.5 text-[11px] font-semibold text-LightGray uppercase tracking-wider">
                                        {col.label}
                                    </th>
                                ))}
                                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-LightGray uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-EveningBlack">
                            {data.map(row => (
                                <tr key={row._id} className="hover:bg-EveningBlack transition group">
                                    {columns.map(col => (
                                        <td key={String(col.key)} className="px-5 py-4 text-SilverGray text-sm">
                                            {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                                        </td>
                                    ))}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => onEdit(row)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-LightGray hover:text-Green hover:bg-Green/10 transition font-medium">
                                                <FiEdit2 /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(row._id)} disabled={deletingId === row._id}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-LightGray hover:text-red-400 hover:bg-red-400/10 transition font-medium disabled:opacity-50">
                                                <FiTrash2 /> {deletingId === row._id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {data.length > 0 && (
                <p className="text-LightGray text-xs mt-3 px-1">{data.length} record{data.length !== 1 ? 's' : ''} total</p>
            )}
        </div>
    );
}
