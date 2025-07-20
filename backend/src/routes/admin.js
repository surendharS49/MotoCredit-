const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');

// Utility function to compare plain and hashed passwords
async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

router.put('/update-password', verifyToken, async (req, res) => {
  try {
        const { currentPassword, newPassword } = req.body;
    const { email } = req.user; // Get email from the authenticated user's token

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Enforce password hashing for all admins
    const isMatch = await comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } 
  catch (err) {
    console.log("error in admin.js:",err);
    res.status(500).json({ error: err.message });
  }
});

// Register admin
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, username, email, password, and role are required' });
    }

    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) return res.status(409).json({ message: 'Username already exists' });

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) return res.status(409).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, username, email, password: hashedPassword, role });
    await admin.save();
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
    }
    const token = jwt.sign(
      { name: admin.name, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (err) {
    console.log("error in admin.js:",err);
    res.status(500).json({ error: err.message });
  }
});

// Login admin
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt received');
    console.log(req.body);
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
      console.log('Login failed: Email or password missing');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`Login failed: Admin not found with email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(`Admin found: ${admin.email}`);
    
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`Login successful: Password matched for email: ${email}`);

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
    }
    const token = jwt.sign(
      { 
        id: admin._id, // Include admin ID for easy lookup
        name: admin.name, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`Token generated for admin: ${admin.email}`);
    res.status(200).json({ 
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.log("error in admin.js:",err);  
    console.error(`Admin login error for email: ${req.body.email}`, err);
    res.status(500).json({ error: err.message });
  }
});

// Verify admin token and get admin info
router.get('/verify', verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.user.email })
      .select('-password') // Exclude password from the response
      .lean();

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Token is valid',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.log("error in admin.js:",err);  
    console.error('Verify token error:', err);
    res.status(500).json({ error: 'Server error during token verification' });
  }
});

// Get all admins
router.get('/getalladmins', verifyToken, async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch(err) {
    console.log("error in admin.js:",err);  
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile',verifyToken, async (req,res)=>{
    try {
      const {email}=req.user;
      const admin=await Admin.findOne({
        email:email
      });
      if(!admin){
        return res.status(404).json({message:"Admin not found"});
      }
      res.json(admin);
    } catch (error) {
        console.log("error in admin.js:",error);  
        res.status(500).json({ error: error.message });
    }
} )

module.exports = router;
