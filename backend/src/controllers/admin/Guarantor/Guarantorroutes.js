const express = require('express');
const router = express.Router();
const Guarantor = require('./Guarantor');


async function createGuarantorId() {
    const guarantor = await Guarantor.findOne({});
    if (!guarantor) {
        return 'GU001';
    }
    return `GU00${guarantor.guarantorId.slice(2) + 1}`;
}
router.post('/addguarantor', async (req, res) => {
    try {
        const { name, phone, address, relation } = req.body;
        const guarantorId = await createGuarantorId();
        const guarantor = new Guarantor({guarantorId, name, phone, address, relation });
        await guarantor.save();
        res.status(201).json(guarantor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getguarantor', async (req, res) => {
    try {
        const guarantor = await Guarantor.find();
        res.status(200).json(guarantor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getguarantor/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findOne({ phone: req.params.phone });
        res.status(200).json(guarantor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.patch('/updateguarantor/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findOneAndUpdate({ phone: req.params.phone }, req.body, { new: true });
        res.status(200).json(guarantor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/getguarantor/:guarantorId', async (req, res) => {
    try {
        const guarantor = await Guarantor.findOne({ guarantorId: req.params.guarantorId });
        res.status(200).json(guarantor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/updateguarantor/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(guarantor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/deleteguarantor/:phone', async (req, res) => {
    try {
        const guarantor = await Guarantor.findByIdAndDelete(req.params.id);
        res.status(200).json(guarantor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
