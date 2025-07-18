const mongoose = require('mongoose');

const guarantorSchema = new mongoose.Schema({
    guarantorId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    },
    customerIds: [{
        type: String,
        ref: 'Customer',
        required: true
    }],
    createdAt: { 
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Guarantor', guarantorSchema); 