import { connectDB, Background } from '../../lib/mongodb';

export default async function handler(req, res) {
    await connectDB();
    const data = await Background.findOne().lean();
    if (!data) return res.status(200).json([{ eduCards: [] }, { expCards: [] }]);
    res.status(200).json([{ eduCards: data.eduCards }, { expCards: data.expCards }]);
}
