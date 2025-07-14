// routes.js (Router)
const express = require('express');
const Customer = require('./customer.js');
const router = express.Router();

// Create new customer
router.post('/createcustomer', async (req, res) => {
  try {
    const {
      name, email, phone, address, city,
      state, zip, country, dob, gender,
      aadhar, pan, drivingLicense
    } = req.body;
    
    console.log('Received customer data:', req.body);

    // Check if customer already exists
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

    // Create new customer
    const newCustomer = new Customer({
      name, email, phone, address, city,
      state, zip, country, dob, gender,
      aadhar, pan, drivingLicense
    });

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
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer by ID
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer
router.put('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete customer
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
