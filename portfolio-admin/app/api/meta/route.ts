import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Meta } from '@/lib/models/Meta';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
    await connectDB();
    const key = req.nextUrl.searchParams.get('key');
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });
    const doc = await Meta.findOne({ key });
    return NextResponse.json(doc?.value ?? null);
}

export async function PUT(req: NextRequest) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { key, value } = await req.json();
    const doc = await Meta.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
    return NextResponse.json(doc.value);
}
