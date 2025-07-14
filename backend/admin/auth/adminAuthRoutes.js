const express = require('express');
const router = express.Router();
const Admin = require('./Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register admin
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(409).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, username, email, password: hashedPassword, role });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Find admin by username OR email (either is acceptable for login)
    let   admins = await Admin.find();
    let adminFound = false;
    let foundAdmin;
    if (!admins) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    admins.forEach((admin) => {
      if (admin.username === username || admin.email === email) {
        console.log("admin found");
        adminFound = true;
        foundAdmin = admin;
      }
    });
    
    if (!adminFound) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, foundAdmin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: foundAdmin._id, username: foundAdmin.username, role: foundAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Protected route (dashboard)
const { verifyToken } = require('./middleware');

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.admin.username}`, role: req.admin.role });
});

module.exports = router;
