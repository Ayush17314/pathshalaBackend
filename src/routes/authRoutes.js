import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRegistration, validateLogin, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

export default router;