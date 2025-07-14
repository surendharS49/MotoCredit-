const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
console.log("mongoUri",mongoUri);

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');

    // Load and mount routes AFTER the connection is ready
  const createCustomerRoutes = require('./admin/src/createcustomer');
  const adminRoutes = require('./admin/auth/adminAuthRoutes');
  // const createcustomer = require('./admin/src/createcustomer');
  app.use('/admin', adminRoutes);
  app.use('/admin', createCustomerRoutes);

  // app.get('/', (req, res) => res.send('API running'));
  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  app.get('/', (req, res) => res.send('API running'));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
