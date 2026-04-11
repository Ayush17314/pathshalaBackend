import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true 
    },
    teacherId: { type: String, unique: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    subjects: [{
        subject: { type: String, required: true },
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
        experience: Number // years of experience in this subject
    }],
    exams: [{
        exam: { type: String, required: true },
        board: String,
        yearsOfExperience: Number
    }],
    classes: [{
        class: { type: String, required: true }, // e.g., "Class 10", "Class 12", "College"
        board: String, // CBSE, ICSE, State Board, etc.
        subjects: [String] // Subjects for this class
    }],
    qualifications: [{
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: Number, required: true },
        specialization: String
    }],
    experience: {
        years: { type: Number, default: 0 },
        description: String,
        previousEmployers: [String],
        achievements: [String]
    },

    // Teaching Details
    teachingStyle: String,
    bio: { type: String, maxLength: 500 },
    languages: [String],
    videoIntro: String,

    price: {
        amount: Number,
        currency: { type: String, default: 'INR' },
        per: { type: String, enum: ['hour', 'session', 'month'], default: 'hour' }
    },
    bio: String,
    teachingStyle: String,
    availability: [{
        day: String, // Monday, Tuesday, etc.
        slots: [{
            start: String, // "09:00"
            end: String    // "17:00"
        }]
    }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalStudents: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    languages: [String],
    videoIntro: String,
    certificates: [{
        name: String,
        url: String,
        issuedBy: String,
        issueDate: Date
    }],
    isApproved: { type: Boolean, default: false },
    approvalDate: Date,
    rejectedReason: String
}, { timestamps: true });

// Auto-generate teacher ID
teacherProfileSchema.pre('save', async function(next) {
    if (!this.teacherId) {
        const year = new Date().getFullYear();
        const count = await mongoose.model('TeacherProfile').countDocuments();
        this.teacherId = `TCH${year}${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});
export default mongoose.model('TeacherProfile', teacherProfileSchema);