const express = require('express');
router = express.Router();
const mailTrigger = require('../email/mailTrigger');
const dotenv = require('dotenv');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
dotenv.config();

router.post('/send-registration-email', async (req, res) => {
    try {
        const { to, username, password } = req.body;
        await mailTrigger.triggerRegistrationEmail(to, username);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

router.post('/send-loan-approval-email', async (req, res) => {
    try {
        const { to, name, loanId } = req.body;
        const loan = await Loan.findById(loanId);
        await mailTrigger.triggerLoanApprovalEmail(to, name, loan);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

router.post('/send-payment-status-email', async (req, res) => {
    try {
        const { to, name, loanId, paymentId, paymentStatus, revertReason } = req.body;
        const subject = "Payment Status";
        const loan = await Loan.findById(loanId);
        let paymentDetailsHtml = '';

        // If paymentId is provided, fetch payment details
        if (paymentId) {
            const payment = await Payment.findOne({ paymentId });
            if (payment) {
                paymentDetailsHtml = `<h3>Payment Details:</h3>
                <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
                    <tr><th align="left">Payment ID</th><td>${payment.paymentId}</td></tr>
                    <tr><th align="left">Installment Number</th><td>${payment.installmentNumber}</td></tr>
                    <tr><th align="left">Amount</th><td>₹${payment.amount.toLocaleString()}</td></tr>
                    <tr><th align="left">Penalty Amount</th><td>₹${payment.penaltyAmount?.toLocaleString() || 0}</td></tr>
                    <tr><th align="left">Status</th><td>${payment.status}</td></tr>
                    <tr><th align="left">Paid Date</th><td>${payment.paidDate ? payment.paidDate.toISOString().split('T')[0] : ''}</td></tr>
                    <tr><th align="left">Due Date</th><td>${payment.dueDate ? payment.dueDate.toISOString().split('T')[0] : ''}</td></tr>
                    <tr><th align="left">Payment Method</th><td>${payment.paymentMethod}</td></tr>
                    <tr><th align="left">Total Amount</th><td>₹${payment.totalAmount?.toLocaleString() || payment.amount.toLocaleString()}</td></tr>
                </table>`;
            }
        }

        let mainMessage = `<h1>Payment Status</h1><p>Dear ${name},</p>`;
        if (paymentStatus === 'COMPLETED') {
            mainMessage += `<p>Your payment has been received successfully. Here are your payment and loan details:</p>`;
        } else if (paymentStatus === 'REVERTED') {
            mainMessage += `<p>Your payment has been reverted. Reason: <b>${revertReason || 'N/A'}</b></p>`;
        } else {
            mainMessage += `<p>Your MotoCredit loan has been updated. Here are your details:</p>`;
        }

        const loanDetailsHtml = `<h3>Loan Details:</h3>
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
                <tr><th align="left">Loan ID</th><td>${loan.loanId}</td></tr>
                <tr><th align="left">Loan Amount</th><td>₹${loan.loanAmount.toLocaleString()}</td></tr>
                <tr><th align="left">Market Value</th><td>₹${loan.marketValue.toLocaleString()}</td></tr>
                <tr><th align="left">Tenure</th><td>${loan.tenure} months</td></tr>
                <tr><th align="left">Interest Rate</th><td>${loan.interestRate}%</td></tr>
                <tr><th align="left">EMI Amount</th><td>₹${loan.emiAmount.toLocaleString()}</td></tr>
                <tr><th align="left">Payment Frequency</th><td>${loan.paymentFrequency}</td></tr>
                <tr><th align="left">Next Payment Date</th><td>${loan.nextPaymentDate}</td></tr>
                <tr><th align="left">Start Date</th><td>${loan.startDate}</td></tr>
                <tr><th align="left">Processing Fee</th><td>₹${loan.processingFee.toLocaleString()}</td></tr>
                <tr><th align="left">Status</th><td>${loan.status}</td></tr>
            </table>`;

        const html = `${mainMessage}${paymentDetailsHtml}${loanDetailsHtml}<p>Please keep this information safe. For any queries, contact our support team.</p><p>Thank you for choosing MotoCredit!</p>`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});
// 1. Loan Rejection Email
router.post('/send-loan-rejection-email', async (req, res) => {
    try {
        const { to, name, reason, loanId } = req.body;
        const subject = "Loan Application Rejected";
        const html = `<h1>Loan Application Update</h1><p>Dear ${name},</p><p>We regret to inform you that your loan application (ID: <b>${loanId}</b>) has been rejected.</p><p>Reason: <b>${reason || 'Not specified'}</b></p><p>For further information, please contact our support team.</p><p>Thank you for considering MotoCredit.</p>`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 2. Password Reset Email
router.post('/send-password-reset-email', async (req, res) => {
    try {
        const { to, name, resetLink } = req.body;
        const subject = "Password Reset Request";
        const html = `<h1>Password Reset</h1><p>Dear ${name},</p><p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>If you did not request this, please ignore this email.</p>`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 3. Profile/Account Update Email
router.post('/send-account-update-email', async (req, res) => {
    try {
        const { to, name, changes } = req.body;
        await mailTrigger.triggerAccountUpdateEmail(to, name, changes);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 4. Admin Notification Email
router.post('/send-admin-notification-email', async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        const html = `<h1>Admin Notification</h1><p>${message}</p>`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 5. Document Verification Email
router.post('/send-document-verification-email', async (req, res) => {
    try {
        const { to, name, status, remarks } = req.body;
        const subject = "Document Verification Status";
        const html = `<h1>Document Verification</h1><p>Dear ${name},</p><p>Your submitted documents have been <b>${status}</b>.</p>${remarks ? `<p>Remarks: ${remarks}</p>` : ''}`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 6. Loan Closure/Foreclosure Email
router.post('/send-loan-closure-email', async (req, res) => {
    try {
        const { to, name, loanId, closureType, closureDate } = req.body;
        const subject = `Loan ${closureType === 'foreclosure' ? 'Foreclosure' : 'Closure'} Confirmation`;
        const html = `<h1>Loan ${closureType === 'foreclosure' ? 'Foreclosure' : 'Closure'} Confirmed</h1><p>Dear ${name},</p><p>Your loan (ID: <b>${loanId}</b>) has been ${closureType === 'foreclosure' ? 'foreclosed' : 'closed'} on ${closureDate}.</p><p>Thank you for being a valued MotoCredit customer.</p>`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 7. Payment Reminder Email
router.post('/send-payment-reminder-email', async (req, res) => {
    try {
        const { to, name, dueDate, amount, loanId } = req.body;
        const subject = "Upcoming Payment Reminder";
        const html = `<h1>Payment Reminder</h1><p>Dear ${name},</p><p>This is a reminder that your next payment of <b>₹${amount}</b> for loan <b>${loanId}</b> is due on <b>${dueDate}</b>.</p><p>Please ensure timely payment to avoid penalties.</p>`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 8. Overdue Payment Alert Email
router.post('/send-overdue-alert-email', async (req, res) => {
    try {
        const { to, name, overdueAmount, dueDate, loanId } = req.body;
        const subject = "Overdue Payment Alert";
        const html = `<h1>Overdue Payment Alert</h1><p>Dear ${name},</p><p>Your payment of <b>₹${overdueAmount}</b> for loan <b>${loanId}</b> was due on <b>${dueDate}</b> and is now overdue.</p><p>Please pay as soon as possible to avoid further penalties.</p>`;
        await mailTrigger.triggerCustomEmail(to, subject, html);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// 9. Custom User Message Email
router.post('/send-custom-message-email', async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        await mailTrigger.triggerCustomEmail(to, subject, message);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

module.exports = router;
