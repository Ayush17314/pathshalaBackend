import express from 'express';
import { 
    updateStudentProfile, 
    getCurrentStudent, 
    getStudentById 
} from '../controllers/studentController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.put('/profile', auth, updateStudentProfile);
router.get('/me', auth, getCurrentStudent);
router.get('/:id', auth, getStudentById);

export default router;