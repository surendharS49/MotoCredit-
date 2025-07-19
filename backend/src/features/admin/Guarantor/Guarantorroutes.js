const express = require('express');
const router = express.Router();
const Guarantor = require('./Guarantor');


async function createGuarantorId() {
    const lastGuarantor = await Guarantor.findOne().sort({ guarantorId: -1 });
    if (!lastGuarantor) {
        return 'GU001';
    }
    const lastId = parseInt(lastGuarantor.guarantorId.slice(2));
    const newId = lastId + 1;
    return `GU${String(newId).padStart(3, '0')}`;
}
router.post('/addguarantor', async (req, res) => {
    try {
        const { name, phone, address, relation } = req.body;
        const guarantorId = await createGuarantorId();
        const guarantor = new Guarantor({guarantorId, name, phone, address, relation });
        await guarantor.save();
        res.status(201).json(guarantor);
    } catch (error) {
        console.log("error in Guarantorroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/getguarantor', async (req, res) => {
    try {
        const guarantor = await Guarantor.find();
        res.status(200).json(guarantor);
    } catch (error) {
        console.log("error in Guarantorroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/getguarantor/by-phone/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findOne({ phone: req.params.phone });
        res.status(200).json(guarantor);
    } catch (error) {
        console.log("error in Guarantorroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});
router.patch('/updateguarantor/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findOneAndUpdate({ phone: req.params.phone }, req.body, { new: true });
        res.status(200).json(guarantor);
    } catch (error) {
        console.log("error in Guarantorroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});
router.get('/getguarantor/by-id/:guarantorId', async (req, res) => {
    try {
        const guarantor = await Guarantor.findOne({ guarantorId: req.params.guarantorId });
        res.status(200).json(guarantor);
    } catch (error) {
        console.log("error in Guarantorroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/updateguarantor/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findByIdAndUpdate(req.params.phone, req.body, { new: true });
        res.status(200).json(guarantor);
    } catch (error) {
        console.log("error in Guarantorroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/deleteguarantor/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findByIdAndDelete(req.params.phone);
        res.status(200).json(guarantor);
    } catch (error) {
        console.log("error in Guarantorroutes.js:",error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
