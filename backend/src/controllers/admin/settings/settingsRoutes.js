const express = require('express');
const router = express.Router();
const Admin = require('../auth/Admin');
const Customer = require('../src/customer');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../auth/middleware');

// Get admin profile
router.get('/profile', async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin).select('-password');
    res.json(admin);
  } catch (err) {
    console.log("error in settingsRoutes.js:",err);
    res.status(500).json({ error: err.message });
  }
});

// Update admin profile
router.put('/profile', async (req, res) => {
  try {
    // You should have authentication middleware to set req.admin (admin id)
    // If not, you need to get the admin id from the token or session
    // For now, let's assume req.admin is set (e.g., by verifyToken middleware)
    // If not, you may need to extract it from the request (e.g., from token)
    // If you want to use verifyToken, add it as middleware: router.put('/profile', verifyToken, async ...)

    // If req.admin is not set, return error
    if (!req.body.admin) {
      return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
    }

    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findOne({email:req.body.email});

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    await admin.save();

    // Remove password from response
    const adminObj = admin.toObject();
    delete adminObj.password;

    res.json({ message: 'Profile updated successfully', admin: adminObj });
  } catch (err) {
    console.log("error in settingsRoutes.js:",err);
    res.status(500).json({ error: err.message });
  }
});

// Get all admins (for super admin)
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    console.log("error in settingsRoutes.js:",err);
    res.status(500).json({ error: err.message });
  }
});

// Update admin (for super admin)
router.put('/admins/:adminId', async (req, res) => {
  try {
    
    const { name, email, role } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.adminId,
      { name, email, role },
      { new: true }
    ).select('-password');
    res.json(admin);
  } catch (err) {
    console.log("error in settingsRoutes.js:",err);
    res.status(500).json({ error: err.message });
  }
});

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find().select('name email');
    res.json(customers);
  } catch (err) {
    console.log("error in settingsRoutes.js:",err);
    res.status(500).json({ error: err.message });
  }
});

// Reset customer password (generates OTP - implementation pending)
router.post('/customers/:customerId/reset-password', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Here you would implement OTP generation and sending
    // For now, just return success message
    res.json({ message: 'Password reset initiated. OTP would be sent to customer.' });
  } catch (err) {
    console.log("error in settingsRoutes.js:",err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 