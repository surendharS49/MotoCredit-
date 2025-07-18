const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { verifyToken } = require('../middleware/auth');
const { generateVehicleId } = require('../utils/idGenerator');

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

        const vehicleId = await generateVehicleId();
        const {registrationNumber, manufacturer, model, year,
             engineNumber, chassisNumber, color, status } = req.body;
        
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
        console.error('Error in /addvehicle:', error);
        res.status(500).json({
            message: 'Error adding vehicle',
            error: error.message,
            details: error.stack
        });
    }
});

// Get all vehicles
router.get('/vehicles', verifyToken, async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get vehicle by ID
router.get('/vehicle/:id', verifyToken, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ vehicleId: req.params.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update vehicle
router.put('/vehicle/:id', verifyToken, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { vehicleId: req.params.id },
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete vehicle
router.delete('/vehicle/:id', verifyToken, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ vehicleId: req.params.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 