import mongoose, { Schema, models } from 'mongoose';

const ProjectSchema = new Schema({
    projectName: { type: String, required: true },
    projectDetail: String,
    image: String,
    url: String,
    githubUrl: String,
    technologiesUsed: [{ tech: String }],
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const Project = models.Project ?? mongoose.model('Project', ProjectSchema);
