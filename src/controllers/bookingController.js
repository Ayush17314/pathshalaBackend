import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Subject from '../models/subject.js';

export const createBooking = async (req, res) => {
    try {
        console.log("Create booking request:", req.body);
        console.log("User:", req.user);
        
        const { teacher, subject, dateTime, duration, price } = req.body;
        
        // Validate teacher exists
        const teacherExists = await User.findOne({ _id: teacher, role: 'teacher' });
        if (!teacherExists) {
            return res.status(404).json({ status: false, message: 'Teacher not found' });
        }
        
        // Validate subject exists
        const subjectExists = await Subject.findById(subject);
        if (!subjectExists) {
            return res.status(404).json({ status: false, message: 'Subject not found' });
        }
        
        const booking = new Booking({
            student: req.user.id,
            teacher,
            subject,
            dateTime,
            duration,
            price,
            status: 'pending'
        });
        
        await booking.save();
        await booking.populate('student', 'name email');
        await booking.populate('teacher', 'name email');
        await booking.populate('subject', 'name');
        
        console.log("Booking created:", booking);
        
        res.status(201).json({ 
            status: true, 
            message: 'Booking created successfully', 
            data: booking 
        });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            $or: [
                { student: req.user.id },
                { teacher: req.user.id }
            ]
        })
        .populate('student', 'name email phone')
        .populate('teacher', 'name email phone')
        .populate('subject', 'name')
        .sort({ createdAt: -1 });
        
        res.json({ 
            status: true, 
            count: bookings.length,
            data: bookings 
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                status: false, 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ status: false, message: 'Booking not found' });
        }
        
        // Only teacher can update status (except cancellation)
        if (booking.teacher.toString() !== req.user.id) {
            return res.status(401).json({ status: false, message: 'Not authorized' });
        }
        
        booking.status = status;
        await booking.save();
        
        res.json({ 
            status: true, 
            message: 'Booking status updated successfully', 
            data: booking 
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { reason } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ status: false, message: 'Booking not found' });
        }
        
        // Student or teacher can cancel
        if (booking.student.toString() !== req.user.id && 
            booking.teacher.toString() !== req.user.id) {
            return res.status(401).json({ status: false, message: 'Not authorized' });
        }
        
        booking.status = 'cancelled';
        booking.cancelledBy = req.user.id;
        booking.cancellationReason = reason || 'No reason provided';
        booking.cancellationDate = new Date();
        
        await booking.save();
        
        res.json({ 
            status: true, 
            message: 'Booking cancelled successfully', 
            data: booking 
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};