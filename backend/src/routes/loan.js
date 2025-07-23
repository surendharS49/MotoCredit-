const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Guarantor = require('../models/Guarantor');
const { verifyToken } = require('../middleware/auth');
const { generateLoanId, generateGuarantorId } = require('../utils/idGenerator');

// Create a loan
router.post('/createloan', verifyToken, async (req, res) => {
  try {
    const {
      customerId,
      vehicleId,
      loanAmount,
      marketValue,
      tenure,
      interestRate,
      paymentFrequency,
      emiAmount,
      processingFee,
      status,
      guarantorName,
      guarantorPhone,
      guarantorAddress,
      guarantorRelation
    } = req.body;

    const startDate=req.body.startDate.split('T')[0];

    let guarantor = await Guarantor.findOne({ phone: guarantorPhone });
    let guarantorId;

    if (!guarantor) {
      guarantorId = await generateGuarantorId();
      guarantor = new Guarantor({
        guarantorId,
        name: guarantorName,
        phone: guarantorPhone,
        address: guarantorAddress,
        relation: guarantorRelation,
        customerIds: [customerId]
      });
      await guarantor.save();
    } else {
      guarantorId = guarantor.guarantorId;
    }

    const loanId = await generateLoanId();
    const amountPaid = 0;
    let nextPaymentDate = new Date(startDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
    nextPaymentDate=nextPaymentDate.toISOString().split('T')[0]; 
    const totalInstallments = tenure / (paymentFrequency === 'Monthly' ? 1 : paymentFrequency === 'Quarterly' ? 3 : 6);

    const loan = new Loan({
      loanId,
      customerId,
      vehicleId,
      loanAmount,
      marketValue,
      tenure,
      interestRate,
      paymentFrequency,
      emiAmount,
      processingFee,
      status,
      nextPaymentDate,
      startDate,
      totalInstallments,
      guarantorId,
      amountPaid,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedLoan = await loan.save();
    res.status(201).json(savedLoan);
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ message: 'Error creating loan', error: error.message });
  }
});

// Get all loans
router.get('/getallloans', verifyToken, async (req, res) => {
  try {
    const loans = await Loan.find();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/getloansbycustomerid/:customerId', verifyToken, async (req, res) => {
  try {
    const loans = await Loan.find({ customerId: req.params.customerId });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get loan by ID
router.get('/getloan/:id', verifyToken, async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.id });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update loan
router.put('/updateloan/:id', verifyToken, async (req, res) => {
  try {
    const loan = await Loan.findOneAndUpdate(
      { loanId: req.params.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
