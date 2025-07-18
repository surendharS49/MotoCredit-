const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/database');

const app = express();

// More detailed CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  // Load routes
  const adminRoutes = require('./src/routes/admin');
  const customerRoutes = require('./src/routes/customer');
  const vehicleRoutes = require('./src/routes/vehicle');
  const loanRoutes = require('./src/routes/loan');
  const paymentRoutes = require('./src/features/admin/payments/paymentsroutes');
  const settingsRoutes = require('./src/routes/settings');

  // Mount routes
  app.use('/api/admin', adminRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/vehicles', vehicleRoutes);
  app.use('/api/loans', loanRoutes);
  app.use('/admin', paymentRoutes);
  app.use('/api/settings', settingsRoutes);

  app.get('/', (req, res) => res.send('API running'));

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
