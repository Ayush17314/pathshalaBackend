import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, unique: true, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    
    // Payment Gateway
    gateway: { type: String, enum: ['razorpay', 'stripe', 'paypal'], required: true },
    gatewayPaymentId: String,
    gatewayOrderId: String,
    gatewaySignature: String,
    
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
        default: 'created'
    },
    
    // For refunds
    refundId: String,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    
    // Commission
    platformFee: { type: Number, default: 0 },
    teacherEarning: { type: Number, default: 0 },
    
    paymentMethod: String,
    paymentDetails: mongoose.Schema.Types.Mixed,
    
    paidAt: Date
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);