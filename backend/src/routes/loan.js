// If you want to use ES modules, replace with:
// import express from 'express';
// import Loan from '../models/Loan.js';
// import sendEmail from '../email/mail.js';
// import Guarantor from '../models/Guarantor.js';
// import { verifyToken } from '../middleware/auth.js';
// import { generateLoanId, generateGuarantorId } from '../utils/idGenerator.js';

const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const mailTrigger = require('../email/mailTrigger');
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

    // Email trigger: Loan Application Approved
    
      try {
        console.log(`[DEBUG] Loan created:`, savedLoan);
        const customer = await require('../models/Customer').findOne({ customerId });
        console.log(`[DEBUG] Found customer for loan approval:`, customer);
        if (customer && customer.email) {
          console.log(`[EMAIL] Attempting to send loan approval email to: ${customer.email}`);
          await mailTrigger.triggerLoanApprovalEmail(customer.email, customer.name, savedLoan);
          console.log(`[EMAIL] Loan approval email successfully triggered for: ${customer.email}`);
        } else {
          console.log('[ERROR] Customer or customer email not found, cannot send loan approval email.');
        }
      } catch (e) { 
        console.log('[ERROR] Failed to send loan approval email:', e); 
      }
    
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
      const existingLoan = await Loan.findOne({ loanId: req.params.id });
      if (!existingLoan) return res.status(404).json({ message: 'Loan not found' });
      const updatedLoan = await Loan.findOneAndUpdate({ loanId: req.params.id }, req.body, { new: true });
      const customer = await require('../models/Customer').findOne({ customerId: existingLoan.customerId });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      console.log(`[DEBUG] Loan updated:`, updatedLoan);
      console.log(`[DEBUG] Found customer for loan update:`, customer);
      if (customer && customer.email) {
        console.log(`[EMAIL] Attempting to send loan update email to: ${customer.email}`);
        // Determine which fields were updated
        const updatedFields = Object.keys(req.body || {});
        let updatesTable = '';
        if (updatedFields.length > 0) {
          updatesTable = `<h3>Updated Fields:</h3><table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">`;
          for (const field of updatedFields) {
            updatesTable += `<tr><th align="left">${field}</th><td>${req.body[field]}</td></tr>`;
          }
          updatesTable += `</table>`;
        }
        const subject = `Loan Updated: ${updatedLoan.loanId}`;
        const html = `
          <h1>Your MotoCredit Loan Has Been Updated</h1>
          <p>Dear ${customer.name},</p>
          <p>Your loan (ID: <b>${updatedLoan.loanId}</b>) has been updated. Please find the details below.</p>
          ${updatesTable}
          <p>If you did not request this update or have questions, please contact our support team.</p>
          <p>Thank you for choosing MotoCredit!</p>
        `;
        await mailTrigger.triggerCustomEmail(customer.email, subject, html);
        console.log(`[EMAIL] Loan update email successfully triggered for: ${customer.email}`);
      } else {
        console.log('[ERROR] Customer or customer email not found, cannot send loan update email.');
      }
      res.json({ message: 'Loan updated successfully', loan: updatedLoan });
    } catch (e) { 
      console.log('[ERROR] Failed to update loan:', e); 
      res.status(500).json({ message: 'Failed to update loan', error: e.message });
    }
  }
);

module.exports = router;
