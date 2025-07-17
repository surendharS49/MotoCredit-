const express = require('express');
const router = express.Router();
const Vehicle = require('./vehicle');

async function generateVehicleId() {
    let vehicleId;
    let exists = true;
    while (exists) {
        vehicleId = 'VEH-'+Math.floor(10000 + Math.random() * 90000);
        exists = await Vehicle.findOne({ vehicleId });
    }
    return vehicleId;
}

router.post('/addvehicle', async (req, res) => {
    try {
        // Log the incoming request
        console.log('Received vehicle data:', req.body);

        // Validate required fields
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

        // Log the vehicle object before saving
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

router.get('/getvehicles', async (req, res) => {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
    if (!vehicles) {
        res.status(404).json({ message: 'No vehicles found' });
    }
});

router.get('/getvehicle/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findOne({ vehicleId });
    res.status(200).json(vehicle);
    if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
    }
});

router.put('/updatevehicle/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;
    const { registrationNumber, manufacturer, model, year, engineNumber, chassisNumber, color, status } = req.body;
    const vehicle = await Vehicle.findOneAndUpdate({ vehicleId }, { registrationNumber, manufacturer, model, year, engineNumber, chassisNumber, color, status }, { new: true });
    res.status(200).json(vehicle);
    if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
    }
});

router.delete('/deletevehicle/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findOneAndDelete({ vehicleId });
    res.status(200).json(vehicle);
    if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
    }
}); 

router.delete('/deleteallvehicles', async (req, res) => {
    const vehicles = await Vehicle.deleteMany();
    res.status(200).json(vehicles);
    if (!vehicles) {
        res.status(404).json({ message: 'No vehicles found' });
    }
});





module.exports = router;