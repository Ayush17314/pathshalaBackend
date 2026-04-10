import User from '../models/User.js';

export const updateProfile = async (req, res) => {
    try {
        // Remove password field from update data
        const updateData = { ...req.body };
        delete updateData.password;
        delete updateData.role; // Prevent role change through this route
        
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json({ msg: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTeacher = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id).select('-password');
        
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        
        if (teacher.role !== 'teacher') {
            return res.status(400).json({ msg: 'User is not a teacher' });
        }
        
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const searchTeachers = async (req, res) => {
    try {
        const { subject, exam, maxPrice, minPrice, rating } = req.query;

        const filter = { role: 'teacher' };
        
        if (subject) filter.subjects = { $in: [subject] };
        if (exam) filter.exams = { $in: [exam] };
        if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
        if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
        if (rating) filter.rating = { $gte: rating };

        const teachers = await User.find(filter)
            .select('-password')
            .sort({ price: 1 }); // Sort by price ascending
        
        res.json({ count: teachers.length, teachers });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Optional: Get current user profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};