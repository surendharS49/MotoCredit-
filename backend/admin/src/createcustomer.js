// routes.js (Router)
const express = require('express');
const Customer = require('./customer.js');
const router = express.Router();

// Function to generate a unique customer ID
async function generateCustomerId() {
  let customerId;
  let exists = true;
  while (exists) {
    // Generate a random 9-digit number and pad with zeros if needed
    const randomNum = Math.floor(100000000 + Math.random() * 900000000);
    customerId = `CUST-${randomNum}`;
    // Check if this ID already exists
    exists = await Customer.findOne({ customerId });
  }
  return customerId;
}

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

    // Generate a unique customer ID
    const customerId = await generateCustomerId();
    console.log('Generated customer ID:', customerId);
    
    // Create new customer
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
// Get customer by customer ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ message: 'Server error' });
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
router.delete('/deletecustomer/:customerid', async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ customerid: req.params.customerid });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/deletecustomer', async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await Customer.findOneAndDelete({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/deletecustomers', async (req, res) => {
  try {
    //const { email } = req.body;
    const customer = await Customer.deleteMany();
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
