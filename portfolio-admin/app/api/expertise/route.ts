import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Expertise } from '@/lib/models/Expertise';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
    await connectDB();
    const data = await Expertise.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const doc = await Expertise.create(body);
    return NextResponse.json(doc, { status: 201 });
}
