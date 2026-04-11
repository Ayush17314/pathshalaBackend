import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
    
    // Detailed ratings
    ratings: {
        teachingQuality: { type: Number, min: 1, max: 5 },
        punctuality: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        valueForMoney: { type: Number, min: 1, max: 5 }
    },
    
    isVerified: { type: Boolean, default: false }, // Verified purchase
    isAnonymous: { type: Boolean, default: false },
    
    // Response from teacher
    teacherResponse: {
        comment: String,
        respondedAt: Date
    },
    
    // Helpful votes
    helpful: { type: Number, default: 0 },
    
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

// Update teacher rating when review is added/updated
reviewSchema.post('save', async function() {
    const TeacherProfile = mongoose.model('TeacherProfile');
    const result = await mongoose.model('Review').aggregate([
        { $match: { teacher: this.teacher, status: 'approved' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    
    if (result.length > 0) {
        await TeacherProfile.findOneAndUpdate(
            { user: this.teacher },
            { rating: result[0].avgRating, totalReviews: result[0].count }
        );
    }
});

export default mongoose.model('Review', reviewSchema);