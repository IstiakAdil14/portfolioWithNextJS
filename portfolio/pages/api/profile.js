import { connectDB, Meta } from '../../lib/mongodb';

export default async function handler(req, res) {
    await connectDB();
    const doc = await Meta.findOne({ key: 'profile' }).lean();
    res.status(200).json(doc?.value ?? null);
}
