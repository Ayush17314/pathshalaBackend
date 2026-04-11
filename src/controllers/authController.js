import User from '../models/User.js';
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        // Set session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        // Save session
        req.session.save((err) => {
            if(err){
                return res.status(500).json({ status: false, message: "Session creation failed" });
            }
            res.json({ status: true, token, data: user, message: "Login successful" });
        });
    }
    catch(err){
        return res.status(500).json({ status: false, message: "Internal server error !" });
    }
};

export const logout = async (req, res) => {
    try{
        // Check if session exists
        if (!req.session.user) {
            return res.status(400).json({ status: false, message: "No active session found" });
        }
        
        // Destroy the session
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json({ status: false, message: "Logout failed! Please try again" });
            }
            
            // Clear the session cookie
            res.clearCookie('connect.sid');
            
            return res.status(200).json({ status: true, message: "Logout successful" });
        });
    }
    catch(err){
        return res.status(500).json({ status: false, message: "Internal server error !" });
    }
};