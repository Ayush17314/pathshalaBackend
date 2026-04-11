import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, unique: true },
    category: { type: String, required: true }, // Science, Maths, Languages, Commerce, etc.
    description: String,
    icon: String,
    color: String,
    isActive: { type: Boolean, default: true },
    popularity: { type: Number, default: 0 } // For recommendations
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);