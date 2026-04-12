import express from 'express';
import { 
    updateTeacherProfile,
    getCurrentTeacher,
    getTeacherById,
    searchTeachers,
    getAllSubjects,
    addTeacherSubject,
    updateTeacherSubject,
    removeTeacherSubject
} from '../controllers/teacherController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/search', searchTeachers);
router.get('/subjects/all', getAllSubjects);
router.get('/me', auth, getCurrentTeacher);
router.put('/profile', auth, updateTeacherProfile);
router.get('/:id', getTeacherById);

// Protected routes (require authentication and teacher role)
router.post('/subjects', auth, addTeacherSubject);
router.put('/subjects/:id', auth, updateTeacherSubject);
router.delete('/subjects/:id', auth, removeTeacherSubject);

export default router;