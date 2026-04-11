import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    fileUrl: String,
    read: { type: Boolean, default: false },
    readAt: Date,
    delivered: { type: Boolean, default: false },
    deliveredAt: Date,
    
    // For group chats (future)
    roomId: String,
    
    // For deleted messages
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Index for faster queries
chatSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
chatSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.model('Chat', chatSchema);