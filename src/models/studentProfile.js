import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true 
    },
    interestedSubjects: [{
        subject: String,
        level: String,
        priority: Number // 1 for high, 2 for medium, 3 for low
    }],
    targetExams: [{
        exam: String,
        targetDate: Date,
        preparationLevel: String
    }],
    currentClass: String,
    board: String,
    school: String,
    parentDetails: {
        name: String,
        phone: String,
        email: String
    },
    learningPreferences: {
        preferredTimeSlots: [String],
        preferredDays: [String],
        maxBudget: Number,
        currency: { type: String, default: 'INR' }
    },
    enrolledCourses: [{
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        subject: String,
        enrolledDate: Date,
        status: String
    }],
    watchlist: [{
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        addedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentProfileSchema);