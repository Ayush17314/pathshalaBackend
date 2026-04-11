import User from '../models/User.js';
import StudentProfile from '../models/studentProfile.js';
import Subject from '../models/subject.js';
import TeacherSubject from '../models/TeacherSubject.js';

export const updateStudentProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData.password;
        delete updateData.role;
        
        // Update User common fields
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        
        // Update Student Profile
        const profileData = { ...req.body };
        delete profileData.name;
        delete profileData.email;
        delete profileData.phone;
        delete profileData.address;
        
        await StudentProfile.findOneAndUpdate(
            { user: req.user.id },
            profileData,
            { new: true, upsert: true }
        );

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

         // Get student profile
        const profile = await StudentProfile.findOne({ user: user._id });

        res.json({ status: true, 
            data: {...user.toObject(),
            profile
        }
         });
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
        


       // Get student profile
        const profile = await StudentProfile.findOne({ user: student._id });
        
        res.json({ 
            status: true, 
            data: {
                ...student.toObject(),
                profile
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const addInterestedSubject = async (req, res) => {
    try {
        const { subjectId, level, priority } = req.body;
        
        // Check if subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ status: false, message: 'Subject not found' });
        }
        
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ status: false, message: 'Student profile not found' });
        }
        
        // Check if subject already added
        const alreadyAdded = profile.interestedSubjects.some(
            s => s.subject.toString() === subjectId
        );
        
        if (alreadyAdded) {
            return res.status(400).json({ status: false, message: 'Subject already added' });
        }
        
        profile.interestedSubjects.push({
            subject: subjectId,
            level: level || 'beginner',
            priority: priority || 3
        });
        
        await profile.save();
        
        res.json({ 
            status: true, 
            message: 'Subject added to interests', 
            data: profile 
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const removeInterestedSubject = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ status: false, message: 'Student profile not found' });
        }
        
        profile.interestedSubjects = profile.interestedSubjects.filter(
            s => s.subject.toString() !== req.params.subjectId
        );
        
        await profile.save();
        
        res.json({ status: true, message: 'Subject removed from interests' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};