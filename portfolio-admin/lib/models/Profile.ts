import mongoose, { Schema, models } from 'mongoose';

const ProfileSchema = new Schema({
    name: String,
    designation: String,
    bio: String,
    photo: String,
    residence: String,
    city: String,
    age: String,
    email: String,
    phone: String,
    github: String,
    linkedin: String,
    twitter: String,
    facebook: String,
    availability: { type: Boolean, default: true },
}, { timestamps: true });

export const Profile = models.Profile ?? mongoose.model('Profile', ProfileSchema);
