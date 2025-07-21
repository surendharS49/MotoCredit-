const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
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
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.log("error in customer.js:",err);  
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 