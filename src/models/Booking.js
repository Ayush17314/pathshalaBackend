import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    
    // Session Details
    title: String,
    description: String,
    dateTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    price: { type: Number, required: true },
    
    // Status
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no-show'],
        default: 'pending'
    },
    
    // Payment
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    paymentId: String,
    paymentMethod: String,
    
    // Meeting
    meetingLink: String,
    meetingId: String,
    
    // Reschedule Info
    rescheduleRequest: {
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        newDateTime: Date,
        reason: String,
        status: { type: String, enum: ['pending', 'approved', 'rejected'] }
    },
    
    // Cancellation
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancellationReason: String,
    cancellationDate: Date,
    refundAmount: Number,
    
    // Completion
    completedAt: Date,
    feedback: {
        fromStudent: String,
        fromTeacher: String,
        studentRating: { type: Number, min: 1, max: 5 },
        teacherRating: { type: Number, min: 1, max: 5 }
    }
}, { timestamps: true });

// Auto-generate booking ID
bookingSchema.pre('save', async function(next) {
    if (!this.bookingId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await mongoose.model('Booking').countDocuments();
        this.bookingId = `BKG${year}${month}${(count + 1).toString().padStart(6, '0')}`;
    }
    next();
});

export default mongoose.model('Booking', bookingSchema);