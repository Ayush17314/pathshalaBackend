import express from 'express';
import auth from '../middleware/authMiddleware.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a review
router.post('/', auth, async (req, res) => {
    try {
        const { teacher, rating, comment, bookingId } = req.body;
        
        // Check if booking exists and is completed
        if (bookingId) {
            const booking = await Booking.findById(bookingId);
            if (!booking || booking.status !== 'completed') {
                return res.status(400).json({ msg: 'Can only review completed bookings' });
            }
            if (booking.student.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized' });
            }
        }
        
        const review = new Review({
            teacher,
            student: req.user.id,
            rating,
            comment,
            bookingId
        });
        
        await review.save();
        await review.populate('teacher', 'name');
        await review.populate('student', 'name');
        
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Get reviews for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const reviews = await Review.find({ teacher: req.params.teacherId })
            .populate('student', 'name')
            .sort({ createdAt: -1 });
        
        const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0;
        
        res.json({
            count: reviews.length,
            averageRating,
            reviews
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Update review (only by the student who wrote it)
router.put('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }
        
        if (review.student.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        await review.save();
        
        res.json({ msg: 'Review updated', review });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }
        
        if (review.student.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        await review.deleteOne();
        res.json({ msg: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

export default router;