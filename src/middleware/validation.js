import { body, validationResult } from 'express-validator';

export const validateRegistration = [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['student', 'teacher', 'admin'])
];

// Optional: Add validation for login
export const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// Optional: Helper middleware to check validation results
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};