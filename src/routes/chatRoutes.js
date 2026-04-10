import express from 'express';
import { getChats, sendMessage, markAsRead } from '../controllers/chatController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', auth, getChats);
router.post('/send', auth, sendMessage);
router.put('/read/:userId', auth, markAsRead);

export default router;