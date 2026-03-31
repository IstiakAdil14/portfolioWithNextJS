import mongoose, { Schema, models } from 'mongoose';

const ExpertiseSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const Expertise = models.Expertise ?? mongoose.model('Expertise', ExpertiseSchema);
