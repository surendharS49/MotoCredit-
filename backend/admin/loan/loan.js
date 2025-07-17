const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    loanId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    marketValue: {
        type: Number,
        required: true
    },
    tenure: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    paymentFrequency: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Semi-Annual'],
        required: true
    },
    emiAmount: {
        type: Number,
        required: true
    },
    processingFee: {
        type: Number,
        required: true
    },
    status: { 
        type: String,
        enum: ['Pending', 'Closed'],
        default: 'Pending'
    },
    guarantorId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;