const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema); 