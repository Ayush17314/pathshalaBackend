import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
    createBooking,
    getMyBookings,
    updateBookingStatus,
    cancelBooking
} from '../controllers/bookingController.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// All booking routes require authentication
router.use(auth);

// Create a booking
router.post('/', createBooking);

// Get my bookings
router.get('/my-bookings', getMyBookings);

// Update booking status
router.put('/:id/status', updateBookingStatus);

// Cancel booking
router.put('/:id/cancel', cancelBooking);
// // Create a booking
// router.post('/', auth, async (req, res) => {
//     try {
//         const { teacher, subject, exam, dateTime, duration, price } = req.body;
        
//         const booking = new Booking({
//             student: req.user.id,
//             teacher,
//             subject,
//             exam,
//             dateTime,
//             duration,
//             price,
//             status: 'pending'
//         });
        
//         await booking.save();
//         await booking.populate('student', 'name email');
//         await booking.populate('teacher', 'name email');
        
//         res.status(201).json(booking);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// // Get user's bookings
// router.get('/my-bookings', auth, async (req, res) => {
//     try {
//         const bookings = await Booking.find({
//             $or: [
//                 { student: req.user.id },
//                 { teacher: req.user.id }
//             ]
//         })
//         .populate('student', 'name email')
//         .populate('teacher', 'name email')
//         .sort({ createdAt: -1 });
        
//         res.json(bookings);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// // Update booking status (accept/reject/complete)
// router.put('/:id/status', auth, async (req, res) => {
//     try {
//         const { status } = req.body;
//         const booking = await Booking.findById(req.params.id);
        
//         if (!booking) {
//             return res.status(404).json({ msg: 'Booking not found' });
//         }
        
//         // Check if user is authorized (teacher can accept/reject, student can cancel)
//         if (booking.teacher.toString() !== req.user.id && 
//             booking.student.toString() !== req.user.id) {
//             return res.status(401).json({ msg: 'Not authorized' });
//         }
        
//         booking.status = status;
//         await booking.save();
        
//         res.json({ msg: 'Booking status updated', booking });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// // Get single booking
// router.get('/:id', auth, async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.id)
//             .populate('student', 'name email')
//             .populate('teacher', 'name email');
        
//         if (!booking) {
//             return res.status(404).json({ msg: 'Booking not found' });
//         }
        
//         res.json(booking);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

export default router;