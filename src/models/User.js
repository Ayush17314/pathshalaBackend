import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'],
        required: true
    },
    profilePicture: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bio: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date }
}, { timestamps: true });

export default mongoose.model('User', userSchema);