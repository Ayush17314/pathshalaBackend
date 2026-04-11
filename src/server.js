import express from 'express';
// import dotenv from 'dotenv';
// import session from 'express-session';
// import { connectDB } from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';  
// import teacherRoutes from './routes/teacherRoutes.js'; 
// import chatRoutes from './routes/chatRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';
// import errorHandler from './middleware/errorHandler.js';
// import auth from './middleware/authMiddleware.js';

// dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your_session_secret_key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: process.env.NODE_ENV === 'production',
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000
//     }
// }));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/students', studentRoutes); 
// app.use('/api/teachers', teacherRoutes);  
// app.use('/api/chats', chatRoutes);
// app.use('/api/admin', auth, adminRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
// app.use(errorHandler);

export { app };