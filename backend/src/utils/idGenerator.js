const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Guarantor = require('../models/Guarantor');

const generateCustomerId = async () => {
    let customerId;
    let exists = true;
    while (exists) {
        const randomNum = Math.floor(100000000 + Math.random() * 900000000);
        customerId = `CUST-${randomNum}`;
        exists = await Customer.findOne({ customerId });
    }
    return customerId;
};

const generateVehicleId = async () => {
    let vehicleId;
    let exists = true;
    while (exists) {
        vehicleId = 'VEH-'+Math.floor(10000 + Math.random() * 90000);
        exists = await Vehicle.findOne({ vehicleId });
    }
    return vehicleId;
};

const generateLoanId = async () => {
    const latestLoan = await Loan.findOne({}).sort({ loanId: -1 }).lean();
    if (!latestLoan) {
        return 'LO-0001';
    }
    const lastIdNum = parseInt(latestLoan.loanId.replace('LO-', ''), 10);
    const nextIdNum = lastIdNum + 1;
    const nextIdStr = String(nextIdNum).padStart(4, '0');
    return `LO-${nextIdStr}`;
};

const generatePaymentId = async () => {
    let paymentId;
    let exists = true;
    while (exists) {
        paymentId = 'PAY-'+Math.floor(10000 + Math.random() * 90000);
        exists = await Payment.findOne({ paymentId });
    }
    return paymentId;
};

const generateGuarantorId = async () => {
    let guarantorId;
    let exists = true;
    while (exists) {
        guarantorId = 'GUA-'+Math.floor(10000 + Math.random() * 90000);
        exists = await Guarantor.findOne({ guarantorId });
    }
    return guarantorId;
};

module.exports = {
    generateCustomerId,
    generateVehicleId,
    generateLoanId,
    generatePaymentId,
    generateGuarantorId
}; 