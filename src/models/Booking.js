import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: String,
    exam: String,
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    dateTime: Date,
    duration: Number, // in minutes
    price: Number,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);