import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    role: { type: String, enum: ['student','teacher','admin'] },
    subjects: [String],
    exams: [String],
    experience: String,
    price: Number,
    bio: String
    
}, { timestamps: true });

export default mongoose.model('User', userSchema);