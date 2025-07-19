const express = require('express');
const router = express.Router();
const AuditLog = require('../../../models/AuditLog');

router.post('/audit-logs', async (req, res) => {
    try{
    const { action, entity, entityId, loanId, details, performedBy } = req.body;
    const auditLog = new AuditLog({ action, entity, entityId, loanId, details, performedBy });
    await auditLog.save();
    res.status(201).json(auditLog);
    }catch(error){
        console.log("error in auditlogroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});

// Get all audit logs
router.get('/all', async (req, res) => {
    try {
        const auditLogs = await AuditLog.find();
        res.json(auditLogs);
    } catch (error) {
        console.log("error in auditlogroutes.js:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get payment and revert logs for a specific loan
router.get('/loan/:loanId', async (req, res) => {
    try {
        const { loanId } = req.params;
        
        // Find logs for this loan ID with payment created or reverted actions
        const paymentLogs = await AuditLog.find({
            loanId: loanId,
            action: { $in: ['PAYMENT_CREATED', 'PAYMENT_REVERTED'] }
        }).sort({ performedAt: -1 }); // Sort by most recent first
        
        res.json({
            success: true,
            data: paymentLogs
        });
    } catch (error) {
        console.error('Error fetching payment logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment logs',
            error: error.message
        });
    }
});

module.exports = router;