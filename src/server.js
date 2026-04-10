import express from 'express';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';
// import errorHandler from './middleware/errorHandler.js';
// import auth from './middleware/authMiddleware.js';

// dotenv.config();

const app = express()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/chats', chatRoutes);
// app.use('/api/admin', auth, adminRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler (should be last)
// app.use(errorHandler);

export { app };