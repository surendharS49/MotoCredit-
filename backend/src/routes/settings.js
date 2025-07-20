const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
// Get settings
router.get('/', verifyToken, async (req, res) => {
    try {
        // Placeholder for settings implementation
        res.json({
            message: 'Settings endpoint'
        });
    } catch (error) {
        console.log("error in settings.js:",error);  
        res.status(500).json({ message: error.message });
    }
});
router.post('/customers/:id/reset-password', verifyToken, async (req, res) => {
    try {
        console.log("reset password called:", req.body);
        const { id } = req.params;
        const { password } = req.body;
        const customer = await Customer.findByIdAndUpdate(id, { password }, { new: true });
        res.json(customer);
    } catch (error) {
        console.log("error in settings.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

// Update admin
router.put('/updateadmin/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const admin = await Admin.findByIdAndUpdate(id, { name, email, role }, { new: true });
        res.json(admin);
    } catch (error) {
        console.log("error in settings.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 