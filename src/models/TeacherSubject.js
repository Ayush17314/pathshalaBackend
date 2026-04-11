import mongoose from 'mongoose';

const teacherSubjectSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    experience: Number,
    price: Number,
    expertise: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index to ensure unique teacher-subject pair
teacherSubjectSchema.index({ teacher: 1, subject: 1 }, { unique: true });

export default mongoose.model('TeacherSubject', teacherSubjectSchema);