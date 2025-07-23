const express = require('express');
const router = express.Router();
const Payment = require('../../../models/Payment');
const Loan = require('../../../models/Loan');
const AuditLog = require('../../../models/AuditLog');
const { verifyToken } = require('../../../middleware/auth');

async function generatePaymentId() {
    // Use findOneAndUpdate with $inc to atomically get and increment the counter
    const latestPayment = await Payment.find();
    if(latestPayment.length === 0){
        const timestamp = Date.now();
    //const lastId = parseInt(latestPayment.paymentId.replace('PY-', ''), 10) || 0;
    let nextId = 1 + Math.floor(Math.random() * 1000)*parseInt(timestamp.slice(-3)); 
        return `PY-${nextId.toString().padStart(4, '0')}`;
    }
    const timestamp = Date.now();
    let nextId = 1 + Math.floor(Math.random() * 1000)*parseInt(timestamp.toString().slice(-3));

    if (!latestPayment.map((payment) => payment.paymentId).includes(`PY-${nextId.toString().padStart(4, '0')}`)) {
        nextId = 1 + Math.floor(Math.random() * 1000)*parseInt(timestamp.toString().slice(-3));
    }
    return `PY-${nextId.toString().padStart(4, '0')}`;
}

// Get all payments
router.get('/all', verifyToken, async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get payment by loanId and installmentNumber
router.get('/:loanId/installment/:installmentNumber', verifyToken, async (req, res) => {
    try {
        const { loanId, installmentNumber } = req.params;
        const payment = await Payment.findOne({ loanId, installmentNumber });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get audit log for a loan
router.get('/:loanId/audit', verifyToken, async (req, res) => {
    try {
        const { loanId } = req.params;
        const auditLogs = await AuditLog.find({
            loanId,
            entityType: 'Payment'
        }).sort({ performedAt: -1 });
        res.json(auditLogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment audit logs', error: error.message });
    }
});

// Create or update payment
router.post('/:loanId', verifyToken, async (req, res) => {
    const { loanId } = req.params;
    const { installmentNumber, amount, status, paidDate, dueDate, penaltyAmount, paymentMethod } = req.body;

    try {
        let payment = await Payment.findOne({ loanId, installmentNumber });

        if (payment) {
            payment.amount = amount;
            payment.status = status;
            payment.paidDate = paidDate;
            payment.dueDate = dueDate;
            payment.penaltyAmount = penaltyAmount;
            payment.paymentMethod = paymentMethod;
            payment.totalAmount = amount + penaltyAmount;
            payment.createdAt = new Date();
            payment.updatedAt = new Date();
            await payment.save();

            const auditLog = new AuditLog({
                action: 'PAYMENT_UPDATED',
                entityType: 'Payment',
                entityId: payment.paymentId,
                loanId,
                details: { amount, installmentNumber, updatedPaymentDate: paidDate },
                performedBy: req.admin?.username || 'system',
                performedAt: new Date()
            });
            await auditLog.save();

            return res.status(200).json({ message: 'Payment updated successfully', payment });
        } else {
            const paymentId = await generatePaymentId();
            const totalAmount = amount + penaltyAmount;
            const newPayment = new Payment({
                paymentId,
                loanId,
                installmentNumber,
                amount,
                status,
                paidDate,
                dueDate,
                penaltyAmount,
                paymentMethod,
                totalAmount,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await newPayment.save();

            const loandetail = await Loan.findOne({ loanId });
            if (loandetail) {
                let nextPaymentDate = new Date(loandetail.nextPaymentDate);
                nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
                await Loan.findOneAndUpdate({ loanId }, { nextPaymentDate ,amountPaid: loandetail.amountPaid + amount});
            }

            await Loan.findOneAndUpdate({ loanId }, { $push: { payments: paymentId } });

            const auditLog = new AuditLog({
                action: 'PAYMENT_CREATED',
                entityType: 'Payment',
                entityId: paymentId,
                loanId,
                details: { amount, installmentNumber, originalPaymentDate: paidDate },
                performedBy: req.admin?.username || 'system',
                performedAt: new Date()
            });
            await auditLog.save();

            return res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
});

// Update payment
router.put('/:loanId', verifyToken, async (req, res) => {
    try {
        const { loanId } = req.params;
        const { installmentNumber, amount, status, paidDate, dueDate, paymentMethod ,penaltyAmount } = req.body;
        const totalAmount = amount + penaltyAmount;
        const payment = await Payment.findOneAndUpdate(
            { loanId, installmentNumber },
            { amount, status, paidDate, dueDate, paymentMethod,penaltyAmount,totalAmount,updatedAt: new Date() },
                        { new: true }
        );

        const auditLog = new AuditLog({
            action: 'PAYMENT_UPDATED',
            entityType: 'Payment',
            entityId: payment._id,
            loanId,
            details: { amount, installmentNumber, originalPaymentDate: paidDate },
            performedBy: req.admin?.username || 'system',
            performedAt: new Date()
        });
        await auditLog.save();

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete all payments for a loan
router.delete('/:loanId', verifyToken, async (req, res) => {
    try {
        const { loanId } = req.params;
        await Payment.deleteMany({ loanId });
        await Loan.findOneAndUpdate({ loanId }, { amountPaid: 0 ,payments: []});
        res.json({ message: 'All payments deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete specific payment
router.delete(`/revertpayment/:paymentId`, verifyToken, async (req, res) => {
    try {
        const { paymentId } = req.params;
        console.log("request body",req);
       // const { loanId } = req.body;
       const loan = await Loan.findOne({ payments: paymentId });
       const loanId=loan.loanId;
        const deletedPayment = await Payment.findOneAndDelete({ paymentId });

        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        await Loan.findOneAndUpdate({ loanId }, { $pull: { payments: paymentId } ,amountPaid: loan.amountPaid - deletedPayment.amount});

        const auditLog = new AuditLog({
            action: 'PAYMENT_REVERTED',
            entityType: 'Payment',
            entityId: paymentId,
            loanId,
            details: {
                amount: deletedPayment.amount,
                installmentNumber: deletedPayment.installmentNumber,
                originalPaymentDate: deletedPayment.paidDate
            },
            performedBy: req.admin?.username || 'system',
            performedAt: new Date()
        });
        await auditLog.save();

        res.json({ message: 'Payment reverted successfully', deletedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error reverting payment', error: error.message });
    }
});

router.delete('/:loanId/payment/:paymentId', verifyToken, async (req, res) => {
    try {
        const { loanId, paymentId } = req.params;

        const deletedPayment = await Payment.findOneAndDelete({ loanId, paymentId });

        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        await Loan.findOneAndUpdate({ loanId }, { $pull: { payments: paymentId } ,amountPaid: loan.amountPaid - deletedPayment.amount});

        const auditLog = new AuditLog({
            action: 'PAYMENT_REVERTED',
            entityType: 'Payment',
            entityId: paymentId,
            loanId,
            details: {
                amount: deletedPayment.amount,
                installmentNumber: deletedPayment.installmentNumber,
                originalPaymentDate: deletedPayment.paidDate
            },
            performedBy: req.admin?.username || 'system',
            performedAt: new Date()
        });
        await auditLog.save();

        res.json({ message: 'Payment reverted successfully', deletedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error reverting payment', error: error.message });
    }
});

// Get payments by loanId (MUST BE LAST!)
router.get('/:loanId', verifyToken, async (req, res) => {
    try {
        const { loanId } = req.params;
        const payments = await Payment.find({ loanId });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
