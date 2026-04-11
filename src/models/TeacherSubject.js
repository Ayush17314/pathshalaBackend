import mongoose from 'mongoose';

const teacherSubjectSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    
    // Teaching details for this subject
    experience: { type: Number, default: 0 }, // Years of experience in this subject
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    expertise: { type: String, enum: ['beginner', 'intermediate', 'expert', 'master'], default: 'beginner' },
    
    // Availability for this subject
    availableClasses: [String], // Which classes they teach this subject for
    curriculum: [String], // CBSE, ICSE, IB, etc.
    
    isActive: { type: Boolean, default: true },
    totalStudents: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

// Compound index to ensure unique teacher-subject pair
teacherSubjectSchema.index({ teacher: 1, subject: 1 }, { unique: true });

export default mongoose.model('TeacherSubject', teacherSubjectSchema);