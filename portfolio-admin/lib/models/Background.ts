import mongoose, { Schema, models } from 'mongoose';

const EduSchema = new Schema({
    title: String, degree: String, detail: String, year: String, order: { type: Number, default: 0 },
});

const ExpSchema = new Schema({
    title: String, role: String, url: String, desc: String, year: String, location: String, order: { type: Number, default: 0 },
});

const BackgroundSchema = new Schema({
    eduCards: [EduSchema],
    expCards: [ExpSchema],
}, { timestamps: true });

export const Background = models.Background ?? mongoose.model('Background', BackgroundSchema);
