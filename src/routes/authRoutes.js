import express from 'express';
import { register, login, logout, checkSession } from '../controllers/authController.js';
import { validateRegistration, validateLogin, handleValidationErrors } from '../middleware/validation.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', auth, logout);
router.get('/check-session', auth, checkSession);

export default router;