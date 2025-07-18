const express = require('express');
const router = express.Router();
const Payment = require('./payment');
const Loan = require('../loan/loan');   
const AuditLog = require('./auditLog'); // Added AuditLog import

async function generatePaymentId() {
    const latestPayment = await Payment.find({paymentId:{$regex:/^PY-/}});
    const lastIdNum = "PY-";
    let nextIdNum = Math.floor(1000 + Math.random() * 9000);
    const paymentIds = latestPayment.map(payment=>payment.paymentId.replace('PY-',''));
    while(paymentIds.includes(nextIdNum.toString())){
        nextIdNum = Math.floor(1000 + Math.random() * 9000);
    }
    return `${lastIdNum}${nextIdNum}`;
}

router.post('/payments/:loanId', async (req, res) => {
    const paymentId = await generatePaymentId();
    const { loanId, installmentNumber, amount, status, paidDate, dueDate, paymentMethod } = req.body;
    const payment = new Payment({paymentId, loanId, installmentNumber, amount, status, paidDate, dueDate, paymentMethod });
    await payment.save();

    const loandetail=await Loan.findOne({loanId});
    let nextPaymentDate=loandetail.nextPaymentDate;
    nextPaymentDate=new Date(nextPaymentDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
    
    await Loan.findOneAndUpdate({ loanId }, { nextPaymentDate }, { new: true });    

    const loan = await Loan.findOneAndUpdate({ loanId }, { $push: { payments: paymentId } }, { new: true });
    const auditLog = new AuditLog({
        action: 'PAYMENT_CREATED',
        entityType: 'Payment',
        entityId: paymentId,
        loanId: loanId,
        details: {
            amount: amount,
            installmentNumber: installmentNumber,
            originalPaymentDate: paidDate
        },
        performedBy: req.admin?.username || 'system', // Assuming you have admin info in request
        performedAt: new Date()
    });
    await auditLog.save();
    if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
    }
    res.status(201).json({ message: 'Payment created successfully', payment });
});

router.get('/payments', async (req, res) => {
    try{
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/payments/:loanId', async (req, res) => {
    const { loanId } = req.params;
    const payments = await Payment.find({ loanId });
    res.json(payments);
});

router.put('/payments/:loanId', async (req, res) => {
    const { loanId } = req.params;
    const { installmentNumber, amount, status, paidDate, dueDate, paymentMethod } = req.body;
    const payment = await Payment.findOneAndUpdate({ loanId, installmentNumber }, { amount, status, paidDate, dueDate, paymentMethod }, { new: true });
    const auditLog = new AuditLog({
        action: 'PAYMENT_UPDATED',
        entityType: 'Payment',
        entityId: payment._id,
        loanId: loanId,
        details: {
            amount: amount,
            installmentNumber: installmentNumber,
            originalPaymentDate: paidDate
        },
        performedBy: req.admin?.username || 'system', // Assuming you have admin info in request
        performedAt: new Date()
    });
    await auditLog.save();
    res.json(payment);
});

router.delete('/payments/:loanId', async (req, res) => {
    const { loanId } = req.params;
    await Payment.deleteMany({ loanId });
    res.json({ message: 'All payments deleted' });
});

router.delete('/payments/:loanId/:paymentId', async (req, res) => {
    const { loanId, paymentId } = req.params;
    const deletedPayment = await Payment.findOneAndDelete({ loanId, paymentId });
    await Loan.findOneAndUpdate({ loanId }, { $pull: { payments: paymentId } });
    const auditLog = new AuditLog({
        action: 'PAYMENT_DELETED',
        entityType: 'Payment',
        entityId: paymentId,
        loanId: loanId,
        details: {
            amount: deletedPayment.amount,
            installmentNumber: deletedPayment.installmentNumber,
            originalPaymentDate: deletedPayment.paidDate
        },
        performedBy: req.admin?.username || 'system', // Assuming you have admin info in request
        performedAt: new Date()
    });
    await auditLog.save();
    res.json({ message: 'Payment deleted' });
});

router.get('/payments/:loanId/:installmentNumber', async (req, res) => {
    const { loanId, installmentNumber } = req.params;
    const payment = await Payment.findOne({ loanId, installmentNumber });
    res.json(payment);
});

// Delete/Revert a specific payment
router.delete('/payments/:loanId/:paymentId', async (req, res) => {
    try {
        const { loanId, paymentId } = req.params;
        
        // Find and delete the payment
        const deletedPayment = await Payment.findOneAndDelete({ 
            loanId, 
            paymentId 
        });

        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update the loan's payments array
        await Loan.findOneAndUpdate(
            { loanId },
            { $pull: { payments: paymentId } }
        );

        // Add an audit log entry
        const auditLog = new AuditLog({
            action: 'PAYMENT_REVERTED',
            entityType: 'Payment',
            entityId: paymentId,
            loanId: loanId,
            details: {
                amount: deletedPayment.amount,
                installmentNumber: deletedPayment.installmentNumber,
                originalPaymentDate: deletedPayment.paidDate
            },
            performedBy: req.admin?.username || 'system', // Assuming you have admin info in request
            performedAt: new Date()
        });
        await auditLog.save();

        res.json({ 
            message: 'Payment reverted successfully',
            deletedPayment 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error reverting payment',
            error: error.message 
        });
    }
});

// Get audit log for a loan's payments
router.get('/payments/:loanId/audit', async (req, res) => {
    try {
        const { loanId } = req.params;
        const auditLogs = await AuditLog.find({
            loanId,
            entityType: 'Payment'
        }).sort({ performedAt: -1 });
        
        res.json(auditLogs);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching payment audit logs',
            error: error.message 
        });
    }
});


module.exports = router;