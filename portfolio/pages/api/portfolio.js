import { connectDB, Project } from '../../lib/mongodb';

export default async function handler(req, res) {
    await connectDB();
    const data = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    res.status(200).json(data);
}
