import User from '../models/User.js';
import Subject from '../models/subject.js';
import TeacherSubject from '../models/TeacherSubject.js';

export const updateStudentProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData.password;
        delete updateData.role;
        
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        
        res.json({ status: true, message: 'Profile updated successfully', data: user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const getCurrentStudent = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ status: false, message: 'Student not found' });
        }
        res.json({ status: true, data: user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select('-password');
        
        if (!student) {
            return res.status(404).json({ status: false, message: 'Student not found' });
        }
        
        if (student.role !== 'student') {
            return res.status(400).json({ status: false, message: 'User is not a student' });
        }
        
        res.json({ status: true, data: student });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};