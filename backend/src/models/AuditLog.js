const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['PAYMENT_CREATED', 'PAYMENT_REVERTED', 'PAYMENT_UPDATED', 'PAYMENT_DELETED']
    },
    entityType: {
        type: String,
        required: true
    },
    entityId: {
        type: String,
        required: true
    },
    loanId: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    performedBy: {
        type: String,
        required: true
    },
    performedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema); 