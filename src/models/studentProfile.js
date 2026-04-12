import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true 
    },

    enrollmentNo: { type: String, unique: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },

    interestedSubjects: [{
        subject: String,
        level: String,
        priority:Number // 1 for high, 2 for medium, 3 for low
    }],
    targetExams: [{
        exam: String,
        targetDate: Date,
        preparationLevel: String
    }],

    currentClass: { type: String, required: false }, // e.g., "Class 10", "Class 12", "Graduation"
    board: { type: String }, // CBSE, ICSE, State Board, etc.
    school: { type: String },
    medium: { type: String },

    parentDetails: {
        name: String,
        phone: String,
        email: String,
        relationship: String
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

// Auto-generate enrollment number
studentProfileSchema.pre('save', async function(next) {
    if (!this.enrollmentNo) {
        const year = new Date().getFullYear();
        const count = await mongoose.model('StudentProfile').countDocuments();
        this.enrollmentNo = `STU${year}${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

export default mongoose.model('StudentProfile', studentProfileSchema);