import { connectDB, Meta } from '../../lib/mongodb';

export default async function handler(req, res) {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key required' });
    await connectDB();
    const doc = await Meta.findOne({ key }).lean();
    res.status(200).json(doc?.value ?? null);
}
