const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { verifyToken } = require('../middleware/auth');
const { generateVehicleId } = require('../utils/idGenerator');
const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const mailTrigger = require('../email/mailTrigger');

router.post('/addvehicle', verifyToken, async (req, res) => {
    try {
        console.log('Received vehicle data:', req.body);

        const requiredFields = ['registrationNumber', 'manufacturer', 'model', 'year', 'engineNumber', 'chassisNumber', 'color', 'status'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const {registrationNumber, manufacturer, model, year,
             engineNumber, chassisNumber, color, status } = req.body;

        const existingVehicle = await Vehicle.findOne({
            $or: [
                { registrationNumber },
                { engineNumber },
                { chassisNumber }
            ]
        });

        if (existingVehicle) {
            return res.status(400).json({
                message: 'Vehicle with the same registration, engine, or chassis number already exists.'
            });
        }

        const vehicleId = await generateVehicleId();
        
        const vehicle = new Vehicle({
            vehicleId,
            registrationNumber,
            manufacturer,
            model,
            year,
            engineNumber,
            chassisNumber,
            color,
            status
        });

        console.log('Attempting to save vehicle:', vehicle);

        const savedVehicle = await vehicle.save();
        console.log('Vehicle saved successfully:', savedVehicle);
        res.status(201).json(savedVehicle);
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        console.error('Error in /addvehicle:', error);
        res.status(500).json({
            message: 'Error adding vehicle',
            error: error.message,
            details: error.stack
        });
    }
});

// Get all vehicles
router.get('/getallvehicles', verifyToken, async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        res.status(500).json({ message: error.message });
    }
});


router.get('/getvehicles/:customerId', verifyToken, async (req, res) => {
    try {
        const loans = await Loan.find({ customerId: req.params.customerId });
        const vehicles = await Vehicle.find({
            vehicleId: { $in: loans.map(loan => loan.vehicleId) }
        });
        res.json(vehicles);
    } catch (error) {
        console.log("error in vehicle.js:", error);  
        res.status(500).json({ message: error.message });
    }
});

router.get('/getvehicle/:vehicleId', verifyToken, async (req, res) => {
    try {
        let vehicle = await Vehicle.findOne({ vehicleId: req.params.vehicleId });
        if (!vehicle) {
            vehicle=await Vehicle.findOne({ _id: req.params.id });
        }
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found error in get vehicle by vehicleId'});
        }
        res.json(vehicle);
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

// Get vehicle by ID
router.get('/getvehiclebyid/:id', verifyToken, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found error in get vehicle by id' });
        }
        res.json(vehicle);
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

// Update vehicle
router.put('/updatevehicle/:id', verifyToken, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id },
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found error in update vehicle' });
        }

        // Email trigger: Vehicle Update
        try {
            console.log(`[DEBUG] Vehicle updated:`, vehicle);
            const loan = await Loan.findOne({ vehicleId: vehicle.vehicleId });
            console.log(`[DEBUG] Found loan associated with vehicle:`, loan);
            if (loan && loan.customerId) {
                const customer = await Customer.findOne({ customerId: loan.customerId });
                console.log(`[DEBUG] Found customer associated with loan:`, customer);
                if (customer && customer.email) {
                    console.log(`[EMAIL] Attempting to send vehicle update email to: ${customer.email}`);
                    const subject = 'Your Vehicle Details Have Been Updated';
                    const html = `<h1>Vehicle Updated</h1><p>Dear ${customer.name},</p><p>The details for your vehicle with registration number ${vehicle.registrationNumber} have been updated.</p><p>If you did not authorize this change, please contact us immediately.</p>`;
                    await mailTrigger.triggerCustomEmail(customer.email, subject, html);
                    console.log(`[EMAIL] Vehicle update email successfully triggered for: ${customer.email}`);
                } else {
                    console.log('[ERROR] Customer or customer email not found, cannot send vehicle update email.');
                }
            } else {
                console.log('[ERROR] Loan not found for this vehicle, cannot send vehicle update email.');
            }
        } catch (e) {
            console.log('[ERROR] Failed to send vehicle update email:', e);
        }

        res.json(vehicle);
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

// Delete vehicle
router.delete('/deletevehicle/:id', verifyToken, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found error in delete vehicle' });
        }

        // Email trigger: Vehicle Deletion
        try {
            console.log(`[DEBUG] Vehicle deleted:`, vehicle);
            const loan = await Loan.findOne({ vehicleId: vehicle.vehicleId });
            console.log(`[DEBUG] Found loan associated with vehicle for deletion:`, loan);
            if (loan && loan.customerId) {
                const customer = await Customer.findOne({ customerId: loan.customerId });
                console.log(`[DEBUG] Found customer for vehicle deletion:`, customer);
                if (customer && customer.email) {
                    console.log(`[EMAIL] Attempting to send vehicle deletion email to: ${customer.email}`);
                    const subject = 'A Vehicle Has Been Removed From Your Account';
                    const html = `<h1>Vehicle Deleted</h1><p>Dear ${customer.name},</p><p>Your vehicle with registration number ${vehicle.registrationNumber} has been deleted from our records.</p><p>If you believe this is an error, please contact us immediately.</p>`;
                    await mailTrigger.triggerCustomEmail(customer.email, subject, html);
                    console.log(`[EMAIL] Vehicle deletion email successfully triggered for: ${customer.email}`);
                } else {
                    console.log('[ERROR] Customer or customer email not found, cannot send vehicle deletion email.');
                }
            } else {
                console.log('[ERROR] Loan not found for this vehicle, cannot send vehicle deletion email.');
            }
        } catch (e) {
            console.log('[ERROR] Failed to send vehicle deletion email:', e);
        }

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 