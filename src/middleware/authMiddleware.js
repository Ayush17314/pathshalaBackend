import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }
    
    // Check if it has Bearer prefix
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;
    
    if (!token) {
        return res.status(401).json({ status: false, message: 'Invalid token format' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, message: 'Token expired. Please login again.' });
        }
        
        return res.status(401).json({ status: false, message: 'Invalid token' });
    }
};

export default auth;