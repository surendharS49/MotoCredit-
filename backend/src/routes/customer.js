const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const mailTrigger = require('../email/mailTrigger');
const { verifyToken } = require('../middleware/auth');
const { generateCustomerId } = require('../utils/idGenerator');
const jwt = require('jsonwebtoken');

// Create new customer
router.post('/createcustomer', verifyToken, async (req, res) => {
  try {
    const {
      name, email, phone, address, city,
      state, zip, country, dob, gender,
      aadhar, pan, drivingLicense, role
    } = req.body;
    
    console.log('Received customer data:', req.body);

    const query = { $or: [] };
    if (email) query.$or.push({ email });
    if (aadhar) query.$or.push({ aadhar });
    if (pan) query.$or.push({ pan });
    if (drivingLicense) query.$or.push({ drivingLicense });

    const existingCustomer = query.$or.length > 0 ? await Customer.findOne(query) : null;

    if (existingCustomer) {
      return res.status(400).json({ 
        message: 'Customer already exists',
        details: 'A customer with this email, Aadhar, PAN, or driving license already exists'
      });
    }

    const customerId = await generateCustomerId();
    const password = 'password@12345'; // Set a default password or handle it as needed
    console.log('Generated password:', password);
    console.log('Customer data before saving:', {
      customerId, name, email, phone, address, city,
      state, zip, country , dob, gender, password, 
      aadhar, pan, drivingLicense,
    });
    console.log('Generated customer ID:', customerId);
    
    const newCustomer = new Customer({
      customerId,
      name, email, phone, password,address, city,
      state, zip, country, dob, gender,
      aadhar, pan, drivingLicense,
      role: 'customer'
    });

    console.log('Customer object before save:', newCustomer);
    const savedCustomer = await newCustomer.save();
    console.log('Customer saved successfully:', savedCustomer);
    // Email trigger: Registration
    try {
      await mailTrigger.triggerRegistrationEmail(savedCustomer.email, savedCustomer.name);
      console.log(`[EMAIL] Sending registration email to: ${savedCustomer.email}`);
      console.log(`[EMAIL] Registration email sent to: ${savedCustomer.email}`);
    } catch (e) { console.log('Failed to send registration email:', e); }
    res.status(201).json(savedCustomer);

  } catch (err) {
    console.log("error in customer.js:",err);  
    console.error('Error creating customer:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message 
    });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (customer.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: customer._id, email: customer.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, customer });
    } catch (err) {
        console.log("error in customer.js:",err);  
        res.status(500).json({ message: err.message });
    }
});

router.post('/changepassword/:customerId', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const customer = await Customer.findOne({ customerId: req.params.customerId });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (customer.password !== oldPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        customer.password = newPassword;
        await customer.save();
        // Email trigger: Password Changed
        try {
          await mailTrigger.triggerPasswordChangeEmail(customer.email, customer.name);
          console.log(`[EMAIL] Password change email sent to: ${customer.email}`);
        } catch (e) { console.log('Failed to send password change email:', e); }
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.log("error in customer.js:",err);  
        res.status(500).json({ message: err.message });
    }
});
// Get all customers
router.get('/getallcustomers', verifyToken, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.log("error in customer.js:",err);  
      res.status(500).json({ message: err.message });
  }
});

// Get customer by ID
router.get('/getcustomer/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.log("error in customer.js:",err);  
    res.status(500).json({ message: err.message });
  }
});

// Update customer
router.put('/updatecustomer/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
       { customerId: req.params.id },
       { ...req.body, updatedAt: Date.now() },
       { new: true }
     );
     if (!customer) {
       return res.status(404).json({ message: 'Customer not found' });
     }
     // Email trigger: Account Update
      try {
        await mailTrigger.triggerAccountUpdateEmail(customer.email, customer.name, req.body);
        console.log(`[EMAIL] Account update email sent to: ${customer.email}`);
      } catch (e) { console.log('Failed to send account update email:', e); }
     res.json(customer);
  } catch (err) {
    console.log("error in customer.js:",err);  
    res.status(500).json({ message: err.message });
  }
});

// Delete customer
router.delete('/deletecustomer/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ customerId: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Email trigger: Account Deletion
    try {
      console.log(`[DEBUG] Customer found for account deletion:`, customer);
      if (customer && customer.email) {
        console.log(`[EMAIL] Attempting to send account deletion email to: ${customer.email}`);
        const subject = 'Your MotoCredit Account Has Been Deleted';
        const html = `<h1>Account Deleted</h1><p>Dear ${customer.name},</p><p>Your account with MotoCredit has been successfully deleted. We are sorry to see you go.</p>`;
        await mailTrigger.triggerCustomEmail(customer.email, subject, html);
        console.log(`[EMAIL] Account deletion email successfully triggered for: ${customer.email}`);
      } else {
        console.log('[ERROR] Customer email not found, cannot send account deletion email.');
      }
    } catch (e) { 
      console.log('[ERROR] Failed to send account deletion email:', e); 
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.log("error in customer.js:",err);  
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 