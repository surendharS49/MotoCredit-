const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
//const { body, validationResult } = require('express-validator');
//const { isAuthenticated } = require('../utils/auth');\
const { verifyToken } = require('../middleware/auth');
const {generateFeedbackId} = require('../utils/idGenerator');
// Create new feedback
router.post('/create', verifyToken, async (req, res) => {
    const feedbackId = await generateFeedbackId();
    const feedback = new Feedback({
        feedbackId,
        ...req.body
    });
    await feedback.save();
    res.json(feedback);
});

// Get all feedback
router.get('/getallfeedback', verifyToken, async (req, res) => {
    const feedback = await Feedback.find();
    res.json(feedback);
});

// Get feedback by ID
router.get('/getfeedback/:id', verifyToken, async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
});

// Update feedback
router.put('/updatefeedback/:id', verifyToken, async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    feedback.name = req.body.name;
    feedback.email = req.body.email;
    feedback.phone = req.body.phone;
    feedback.message = req.body.message;
    feedback.status = req.body.status;
    await feedback.save();
    res.json(feedback);
});

// Delete feedback
router.delete('/deletefeedback/:id', verifyToken, async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    await feedback.remove();
    res.json({ message: 'Feedback deleted' });
});

module.exports = router;
