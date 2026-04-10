export const verifyTeacher = async (req, res) => {
    try {
        // Admin verification for teachers
        const teacher = await User.findByIdAndUpdate(
            req.params.id, 
            { isVerified: true },
            { new: true }
        );
        
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        
        res.json({ msg: 'Teacher verified successfully', teacher });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};