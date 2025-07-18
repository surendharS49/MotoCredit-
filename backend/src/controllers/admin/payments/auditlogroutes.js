const express = require('express');
const router = express.Router();
const AuditLog = require('./auditLog');

router.post('/audit-logs', async (req, res) => {
    const { action, entity, entityId, loanId, details, performedBy } = req.body;
    const auditLog = new AuditLog({ action, entity, entityId, loanId, details, performedBy });
    await auditLog.save();
    res.status(201).json(auditLog);
});

router.get('/audit-logs', async (req, res) => {
    const auditLogs = await AuditLog.find();
    res.json(auditLogs);
});



module.exports = router;