import Chat from '..src/models/Chat.js';

export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 }); // Sort by oldest first (ascending)

        res.json(chats);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Optional: Send a new message
export const sendMessage = async (req, res) => {
    try {
        const { receiver, message } = req.body;
        
        const newMessage = new Chat({
            sender: req.user.id,
            receiver,
            message
        });
        
        await newMessage.save();
        
        // Populate sender and receiver info
        await newMessage.populate('sender', 'name email');
        await newMessage.populate('receiver', 'name email');
        
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Optional: Mark messages as read
export const markAsRead = async (req, res) => {
    try {
        await Chat.updateMany(
            { 
                sender: req.params.userId, 
                receiver: req.user.id,
                read: false 
            },
            { read: true }
        );
        
        res.json({ msg: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};