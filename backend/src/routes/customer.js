const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { verifyToken } = require('../middleware/auth');
const { generateCustomerId } = require('../utils/idGenerator');

// Create new customer
router.post('/createcustomer', verifyToken, async (req, res) => {
  try {
    const {
      name, email, phone, address, city,
      state, zip, country, dob, gender,
      aadhar, pan, drivingLicense
    } = req.body;
    
    console.log('Received customer data:', req.body);

    const existingCustomer = await Customer.findOne({ 
      $or: [
        { email },
        { aadhar },
        { pan },
        { drivingLicense }
      ]
    });

    if (existingCustomer) {
      return res.status(400).json({ 
        message: 'Customer already exists',
        details: 'A customer with this email, Aadhar, PAN, or driving license already exists'
      });
    }

    const customerId = await generateCustomerId();
    console.log('Generated customer ID:', customerId);
    
    const newCustomer = new Customer({
      customerId,
      name, email, phone, address, city,
      state, zip, country, dob, gender,
      aadhar, pan, drivingLicense
    });

    console.log('Customer object before save:', newCustomer);
    const savedCustomer = await newCustomer.save();
    console.log('Customer saved successfully:', savedCustomer);
    res.status(201).json(savedCustomer);

  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message 
    });
  }
});

// Get all customers
router.get('/customers', verifyToken, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get customer by ID
router.get('/customer/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update customer
router.put('/customer/:id', verifyToken, async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
});

// Delete customer
router.delete('/customer/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ customerId: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 