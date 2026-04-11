import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String }, // e.g., Science, Maths, Languages
    description: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('subject', subjectSchema);