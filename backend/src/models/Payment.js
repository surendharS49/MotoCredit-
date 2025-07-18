const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    loanId: {
        type: String,
        required: true
    },
    installmentNumber: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paidDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Payment', paymentSchema); 