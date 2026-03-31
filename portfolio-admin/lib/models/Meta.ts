import mongoose, { Schema, models } from 'mongoose';

const SkillSchema = new Schema({
    title: { type: String, required: true },
    level: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const Skill = models.Skill ?? mongoose.model('Skill', SkillSchema);

// Meta stores: techStack, currentlyDoing, funStats, availability
const MetaSchema = new Schema({
    key: { type: String, unique: true, required: true },
    value: Schema.Types.Mixed,
}, { timestamps: true });

export const Meta = models.Meta ?? mongoose.model('Meta', MetaSchema);
