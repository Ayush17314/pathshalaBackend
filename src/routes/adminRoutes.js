import express from 'express';
import { verifyTeacher } from '../controllers/adminController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/verify-teacher/:id', auth, verifyTeacher);

export default router;