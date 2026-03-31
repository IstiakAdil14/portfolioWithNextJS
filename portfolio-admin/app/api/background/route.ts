import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Background } from '@/lib/models/Background';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
    await connectDB();
    const data = await Background.findOne();
    return NextResponse.json(data ?? { eduCards: [], expCards: [] });
}

export async function PUT(req: NextRequest) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const doc = await Background.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json(doc);
}
