import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['booking', 'message', 'payment', 'review', 'system', 'reminder'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed, // Additional data
    
    isRead: { type: Boolean, default: false },
    readAt: Date,
    
    // For push notifications
    sentViaEmail: { type: Boolean, default: false },
    sentViaSMS: { type: Boolean, default: false },
    
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    expiresAt: Date
}, { timestamps: true });

// Auto-delete old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model('Notification', notificationSchema);