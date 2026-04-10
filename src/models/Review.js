import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);