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

// import { body, validationResult } from 'express-validator';

// export const validateRegistration = [
//     body('name').notEmpty().withMessage('Name is required'),
//     body('email').isEmail().withMessage('Please enter a valid email'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//     body('confirmPassword').custom((value, { req }) => {
//         if (value !== req.body.password) {
//             throw new Error('Passwords do not match');
//         }
//         return true;
//     }),
//     body('role').isIn(['student', 'teacher', 'admin']).withMessage('Role must be student, teacher, or admin')
// ];

// export const validateLogin = [
//     body('email').isEmail().withMessage('Please enter a valid email'),
//     body('password').notEmpty().withMessage('Password is required')
// ];

// export const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ 
//             status: false, 
//             errors: errors.array() 
//         });
//     }
//     next();
// };