import { connectDB, Skill } from '../../lib/mongodb';

export default async function handler(req, res) {
    await connectDB();
    const data = await Skill.find().sort({ order: 1 }).lean();
    res.status(200).json(data);
}
