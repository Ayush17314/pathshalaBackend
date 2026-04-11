import User from '../models/User.js';
import Subject from '../models/subject.js';
import TeacherSubject from '../models/TeacherSubject.js';

export const updateTeacherProfile = async (req, res) => {
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

export const getCurrentTeacher = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ status: false, message: 'Teacher not found' });
        }
        
        // Get teacher's subjects
        const teacherSubjects = await TeacherSubject.find({ teacher: user._id })
            .populate('subject', 'name category');
        
        res.json({ 
            status: true, 
            data: {
                ...user.toObject(),
                subjects: teacherSubjects
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id).select('-password');
        
        if (!teacher) {
            return res.status(404).json({ status: false, message: 'Teacher not found' });
        }
        
        if (teacher.role !== 'teacher') {
            return res.status(400).json({ status: false, message: 'User is not a teacher' });
        }
        
        // Get teacher's subjects
        const teacherSubjects = await TeacherSubject.find({ teacher: teacher._id })
            .populate('subject', 'name category');
        
        res.json({ 
            status: true, 
            data: {
                ...teacher.toObject(),
                subjects: teacherSubjects
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const searchTeachers = async (req, res) => {
    try {
        const { subjectId, exam, maxPrice, minPrice, rating, name, page = 1, limit = 10 } = req.query;
        
        let filter = { role: 'teacher', isActive: true };
        
        // Search by name
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        
        // First find teachers based on basic filters
        let teachers = await User.find(filter).select('-password');
        
        // Filter teachers by subject using TeacherSubject model
        if (subjectId) {
            const teacherSubjects = await TeacherSubject.find({ 
                subject: subjectId,
                isActive: true 
            }).distinct('teacher');
            
            teachers = teachers.filter(teacher => 
                teacherSubjects.includes(teacher._id.toString())
            );
        }
        
        // Filter by price range
        if (maxPrice || minPrice) {
            const teachersWithPrice = await Promise.all(
                teachers.map(async (teacher) => {
                    const teacherSubjectsData = await TeacherSubject.find({ 
                        teacher: teacher._id 
                    });
                    const minTeacherPrice = Math.min(...teacherSubjectsData.map(ts => ts.price || Infinity));
                    const maxTeacherPrice = Math.max(...teacherSubjectsData.map(ts => ts.price || 0));
                    
                    return {
                        teacher,
                        minPrice: minTeacherPrice,
                        maxPrice: maxTeacherPrice
                    };
                })
            );
            
            let filtered = teachersWithPrice;
            if (minPrice) {
                filtered = filtered.filter(t => t.maxPrice >= parseFloat(minPrice));
            }
            if (maxPrice) {
                filtered = filtered.filter(t => t.minPrice <= parseFloat(maxPrice));
            }
            
            teachers = filtered.map(t => t.teacher);
        }
        
        // Get full teacher details with subjects
        const teachersWithSubjects = await Promise.all(
            teachers.map(async (teacher) => {
                const subjects = await TeacherSubject.find({ teacher: teacher._id })
                    .populate('subject', 'name category');
                return {
                    ...teacher.toObject(),
                    subjects: subjects.map(s => ({
                        subjectId: s.subject._id,
                        subjectName: s.subject.name,
                        category: s.subject.category,
                        price: s.price,
                        experience: s.experience,
                        expertise: s.expertise
                    }))
                };
            })
        );
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTeachers = teachersWithSubjects.slice(startIndex, endIndex);
        
        res.json({ 
            status: true, 
            count: teachersWithSubjects.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(teachersWithSubjects.length / limit),
            data: paginatedTeachers
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ isActive: true });
        res.json({ status: true, count: subjects.length, data: subjects });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const addTeacherSubject = async (req, res) => {
    try {
        const { subjectId, experience, price, expertise } = req.body;
        
        // Check if subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ status: false, message: 'Subject not found' });
        }
        
        // Check if teacher already has this subject
        const existing = await TeacherSubject.findOne({ 
            teacher: req.user.id, 
            subject: subjectId 
        });
        
        if (existing) {
            return res.status(400).json({ status: false, message: 'Teacher already teaches this subject' });
        }
        
        const teacherSubject = new TeacherSubject({
            teacher: req.user.id,
            subject: subjectId,
            experience,
            price,
            expertise
        });
        
        await teacherSubject.save();
        await teacherSubject.populate('subject', 'name category');
        
        res.status(201).json({ 
            status: true, 
            message: 'Subject added successfully', 
            data: teacherSubject 
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const updateTeacherSubject = async (req, res) => {
    try {
        const { experience, price, expertise } = req.body;
        
        const teacherSubject = await TeacherSubject.findOneAndUpdate(
            { 
                _id: req.params.id,
                teacher: req.user.id 
            },
            { experience, price, expertise },
            { new: true }
        ).populate('subject', 'name category');
        
        if (!teacherSubject) {
            return res.status(404).json({ status: false, message: 'Teacher subject not found' });
        }
        
        res.json({ 
            status: true, 
            message: 'Subject updated successfully', 
            data: teacherSubject 
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const removeTeacherSubject = async (req, res) => {
    try {
        const teacherSubject = await TeacherSubject.findOneAndDelete({
            _id: req.params.id,
            teacher: req.user.id
        });
        
        if (!teacherSubject) {
            return res.status(404).json({ status: false, message: 'Teacher subject not found' });
        }
        
        res.json({ status: true, message: 'Subject removed successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};