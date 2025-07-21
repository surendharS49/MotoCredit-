const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

const verifyToken = async (req, res, next) => {
    try {
        console.log('Auth middleware triggered');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        
        if (!authHeader) {
            console.error('No authorization header found');
            return res.status(401).json({ message: 'No token provided' });
        }

        let token;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader; // In case token is sent without 'Bearer' prefix
        }

        console.log('Token received:', token ? `${token.substring(0, 10)}...` : 'No token');
        
        if (!token) {
            console.error('No token found in authorization header');
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log('Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);
        
        let user = await Admin.findById(decoded.id);
        if (!user) {
            user = await Customer.findById(decoded.id);
            if (!user) {
                console.error('User not found for ID:', decoded.id);
                return res.status(401).json({ message: 'Invalid token - user not found' });
            }
            console.log('Customer found:', user.email);
        } else {
            console.log('Admin found:', user.email);
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error in auth.js:",error);
        console.error('Token verification error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { verifyToken };