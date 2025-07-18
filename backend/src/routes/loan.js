const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Guarantor = require('../models/Guarantor');
const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const { verifyToken } = require('../middleware/auth');
const { generateLoanId, generateGuarantorId } = require('../utils/idGenerator');

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

        const response = await fetch('http://localhost:3000/admin/getguarantor/' + guarantorPhone);
        const data = await response.json();
        let guarantorId;

        if (!Array.isArray(data) || data.length === 0) {
            console.log("No guarantor found");
            const newGuarantorId = await generateGuarantorId();
            const guarantor = new Guarantor({
                guarantorId: newGuarantorId,
                name: guarantorName,
                phone: guarantorPhone,
                address: guarantorAddress,
                relation: guarantorRelation,
                customerIds: [customerId]
            });
            await guarantor.save();
            guarantorId = newGuarantorId;
        } else {
            guarantorId = data[0].guarantorId;
        }

        let nextPaymentDate = new Date(req.body.startDate);
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

        const loanId = await generateLoanId();
        
        const loan = new Loan({
            loanId,
            customerId,
            vehicleId,
            loanAmount,
            marketValue,
            tenure,
            interestRate,
            paymentFrequency,
            nextPaymentDate,
            emiAmount,
            processingFee,
            status,
            guarantorId
        });

        const savedLoan = await loan.save();
        res.status(201).json(savedLoan);
    } catch (error) {
        console.error('Error creating loan:', error);
        res.status(500).json({ 
            message: 'Error creating loan',
            error: error.message 
        });
    }
});

// Get all loans
router.get('/loans', verifyToken, async (req, res) => {
    try {
        const loans = await Loan.find();
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get loan by ID
router.get('/loan/:id', verifyToken, async (req, res) => {
    try {
        const loan = await Loan.findOne({ loanId: req.params.id });
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update loan
router.put('/loan/:id', verifyToken, async (req, res) => {
    try {
        const loan = await Loan.findOneAndUpdate(
            { loanId: req.params.id },
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 