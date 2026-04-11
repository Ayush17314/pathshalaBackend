import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true 
    },
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
        degree: String,
        institution: String,
        year: Number,
        specialization: String
    }],
    experience: {
        years: Number,
        description: String,
        achievements: [String]
    },
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
    totalReviews: { type: Number, default: 0 },
    languages: [String],
    videoIntro: String,
    certificates: [{
        name: String,
        url: String,
        issuedBy: String,
        issueDate: Date
    }],
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('TeacherProfile', teacherProfileSchema);