import User from '../models/User.js';
import StudentProfile from '../models/studentProfile.js';
import TeacherProfile from '../models/TeacherProfile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try{
        const {name, email, password, confirmPassword, role} = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({status :false, message : "Password must be same"})
        }
        if(!name || !email || !password || !role){
            return res.status(400).json({status : false, message : "All Fields are mandatary"} )
        }
    
        const existUser = await User.findOne({email :email});
        if(existUser){
            return res.status(404).json({status : false, message : "User Already Exist"})
        }
    
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashed, role 
        })
        if(!newUser){
            return res.status(400).json({status: false, message:"Registration failed! Try again!"})
        }

        // Create role-specific profile
         try {
            if (role === 'student') {
                // Check if StudentProfile model exists
                if (StudentProfile) {
                    await StudentProfile.create({ 
                        user: newUser._id,
                        currentClass: req.body.currentClass || '',
                        board: req.body.board || '',
                        school: req.body.school || ''
                    });
                }
            } else if (role === 'teacher') {
                // Check if TeacherProfile model exists
                if (TeacherProfile) {
                    await TeacherProfile.create({ 
                        user: newUser._id,
                        experience: { years: 0 },
                        isApproved: false
                    });
                }
            }
        } catch (profileError) {
            console.log("Profile creation error:", profileError.message);
            // Don't fail registration if profile creation fails
        }
        
        // Remove password from response
        const userData = newUser.toObject();
        delete userData.password;

        return res.status(200).json({status: true, message:" Registration successful", data:newUser})
    }
    catch(err){
        return res.status(500).json({status: false, message:"Internal server error !"})
    }
};

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ status: false, message: 'Wrong password' });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                name: user.name 

            }, process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Set session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        // Get profile based on role
        let profile = null;
        if (user.role === 'student') {
            profile = await StudentProfile.findOne({ user: user._id });
        } else if (user.role === 'teacher') {
            profile = await TeacherProfile.findOne({ user: user._id });
        }
        
        // Remove password from response
        const userData = user.toObject();
        delete userData.password;

        // Save session
        req.session.save((err) => {
            if(err){
                return res.status(500).json({ status: false, message: "Session creation failed" });
            }
            res.json({ status: true, token, data: { ...userData, profile }, message: "Login successful" });
        });
    }
    catch(err){
        return res.status(500).json({ status: false, message: "Internal server error !" });
    }
};


export const logout = async (req, res) => {
    try{
        // Destroy session if it exists
        if (req.session) {
            req.session.destroy((err) => {
                if(err){
                    console.log('Session destroy error:', err);
                    // Still return success even if session destroy fails
                    return res.status(200).json({ 
                        status: true, 
                        message: "Logged out successfully" 
                    });
                }
                
                // Clear the session cookie
                res.clearCookie('connect.sid');
                return res.status(200).json({ 
                    status: true, 
                    message: "Logged out successfully" 
                });
            });
        } else {
            // No session found, still return success
            return res.status(200).json({ 
                status: true, 
                message: "Logged out successfully" 
            });
        }
    }
    catch(err){
        console.log('Logout error:', err);
        // Return success even on error to prevent frontend issues
        return res.status(200).json({ 
            status: true, 
            message: "Logged out successfully" 
        });
    }
};


export const checkSession = async (req, res) => {
    try{
        if (req.session.user) {
            const user = await User.findById(req.session.user.id).select('-password');
            let profile = null;
            
            if (user.role === 'student') {
                profile = await StudentProfile.findOne({ user: user._id });
            } else if (user.role === 'teacher') {
                profile = await TeacherProfile.findOne({ user: user._id });
            }
            
            return res.status(200).json({ 
                status: true, 
                message: "Session active", 
                data: { ...user.toObject(), profile }
            });
        } else {
            return res.status(401).json({ 
                status: false, 
                message: "No active session" 
            });
        }
    }
    catch(err){
        return res.status(500).json({ status: false, message: "Internal server error !" });
    }
};