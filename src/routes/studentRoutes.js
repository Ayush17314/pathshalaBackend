import express from 'express';
import { 
    updateStudentProfile, 
    getCurrentStudent, 
    getStudentById,
    addInterestedSubject,
    removeInterestedSubject
} from '../controllers/studentController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.put('/profile', auth, updateStudentProfile);
router.get('/me', auth, getCurrentStudent);
router.get('/:id', auth, getStudentById);
router.post('/interests', auth, addInterestedSubject);
router.delete('/interests/:subjectId', auth, removeInterestedSubject);

export default router;