import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

let cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then(m => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// ── Models ────────────────────────────────────────────────
const ExpertiseSchema = new mongoose.Schema({ title: String, desc: String, order: Number }, { timestamps: true });
const ProjectSchema = new mongoose.Schema({ projectName: String, projectDetail: String, image: String, url: String, githubUrl: String, technologiesUsed: [{ tech: String }], order: Number }, { timestamps: true });
const BackgroundSchema = new mongoose.Schema({ eduCards: Array, expCards: Array }, { timestamps: true });
const SkillSchema = new mongoose.Schema({ title: String, level: String, order: Number }, { timestamps: true });
const MetaSchema = new mongoose.Schema({ key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed }, { timestamps: true });

export const Expertise = mongoose.models.Expertise || mongoose.model('Expertise', ExpertiseSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const Background = mongoose.models.Background || mongoose.model('Background', BackgroundSchema);
export const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export const Meta = mongoose.models.Meta || mongoose.model('Meta', MetaSchema);
