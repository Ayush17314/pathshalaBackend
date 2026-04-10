import express from 'express';
import { updateProfile, getTeacher, searchTeachers, getCurrentUser } from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.get('/teachers/search', searchTeachers);
router.get('/teachers/:id', getTeacher);

export default router;