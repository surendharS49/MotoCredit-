const express = require('express');
const router = express.Router();
const Loan = require('./loan');
const Guarantor = require('../Guarantor/Guarantor');
const Customer = require('../src/customer');
const Vehicle = require('../vehicle/vehicle');

async function createLoanId() {
    // Find the latest loan by loanId in descending order
    const latestLoan = await Loan.findOne({}).sort({ loanId: -1 }).lean();
    if (!latestLoan) {
        return 'LO-0001';
    }
    // Extract the numeric part after 'LO-'
    const lastIdNum = parseInt(latestLoan.loanId.replace('LO-', ''), 10);
    const nextIdNum = lastIdNum + 1;
    // Pad with leading zeros to always have 4 digits
    const nextIdStr = String(nextIdNum).padStart(4, '0');
    return `LO-${nextIdStr}`;
}

async function createGuarantorId() {
    // Find the latest guarantor by guarantorId in descending order
    const latestGuarantor = await Guarantor.findOne({}).sort({ guarantorId: -1 }).lean();
    if (!latestGuarantor) {
        return 'GU-0001';
    }
    // Extract the numeric part after 'GU-'
    const lastIdNum = parseInt(latestGuarantor.guarantorId.replace('GU-', ''), 10);
    const nextIdNum = lastIdNum + 1;
    // Pad with leading zeros to always have 4 digits
    const nextIdStr = String(nextIdNum).padStart(4, '0');
    return `GU-${nextIdStr}`;
}

router.post('/createloan', async (req, res) => {
    try {
        const { 
            customerId, 
            vehicleId, 
            loanAmount, 
            marketValue,
            tenure, 
            interestRate, 
            paymentFrequency, 
            emiAmount, 
            processingFee, 
            status,
            guarantorName,
            guarantorPhone,
            guarantorAddress,
            guarantorRelation
        } = req.body;

        const response = await fetch('http://localhost:3000/admin/getguarantor/' + guarantorPhone);
        const data = await response.json();
        let guarantorId;
        
        if(!data) {
            console.log("No guarantor found");
            const newGuarantorId = await createGuarantorId();
            const guarantor = new Guarantor({
                guarantorId: newGuarantorId,
                name: guarantorName,
                phone: guarantorPhone,
                address: guarantorAddress,
                relation: guarantorRelation,
                customerIds: [customerId]
            });
            await guarantor.save();
            guarantorId = newGuarantorId;
        } else {
            guarantorId = data[0].guarantorId;
        }
        
        const loanId = await createLoanId();
        const loan = new Loan({ 
            loanId,
            customerId, 
            vehicleId, 
            loanAmount, 
            marketValue, 
            tenure, 
            interestRate, 
            paymentFrequency, 
            emiAmount, 
            processingFee, 
            status, 
            guarantorId 
        });
        
        await loan.save();
        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getloans', async (req, res) => {
    try {
        const loans = await Loan.find().lean();
        
        // Get all unique customer and vehicle IDs
        const customerIds = [...new Set(loans.map(loan => loan.customerId))];
        const vehicleIds = [...new Set(loans.map(loan => loan.vehicleId))];
        
        // Fetch all customers and vehicles in bulk
        const customers = await Customer.find({ customerId: { $in: customerIds } }).lean();
        const vehicles = await Vehicle.find({ vehicleId: { $in: vehicleIds } }).lean();
        
        // Create lookup maps for quick access
        const customerMap = customers.reduce((map, customer) => {
            map[customer.customerId] = customer;
            return map;
        }, {});
        
        const vehicleMap = vehicles.reduce((map, vehicle) => {
            map[vehicle.vehicleId] = vehicle;
            return map;
        }, {});
        
        // Transform the data to match frontend expectations
        const transformedLoans = loans.map(loan => {
            const customer = customerMap[loan.customerId] || {};
            const vehicle = vehicleMap[loan.vehicleId] || {};
            
            return {
                loanId: loan.loanId,
                customerName: customer.name || 'Unknown Customer',
                vehicleDetails: vehicle.registrationNumber ? 
                    `${vehicle.registrationNumber} - ${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}` : 
                    'Unknown Vehicle',
                loanAmount: loan.loanAmount,
                emiAmount: loan.emiAmount,
                tenure: loan.tenure,
                disbursedDate: loan.createdAt.toLocaleDateString(),
                status: loan.status,
                interestRate: loan.interestRate,
                paymentFrequency: loan.paymentFrequency,
                processingFee: loan.processingFee,
                marketValue: loan.marketValue
            };
        });

        res.status(200).json(transformedLoans);
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;