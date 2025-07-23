const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { verifyToken } = require('../middleware/auth');
const { generateVehicleId } = require('../utils/idGenerator');
const Loan = require('../models/Loan');
const Customer = require('../models/Customer');

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
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

// Get vehicle by ID
router.get('/getvehicle/:id', verifyToken, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
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
            return res.status(404).json({ message: 'Vehicle not found' });
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
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.log("error in vehicle.js:",error);  
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 