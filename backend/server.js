const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/database');
const PORT = process.env.PORT || 3000;

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://motocredit.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => res.send('API running ✅'));

// Mount routes
const adminRoutes = require('./src/routes/admin');
const customerRoutes = require('./src/routes/customer');
const vehicleRoutes = require('./src/routes/vehicle');
const loanRoutes = require('./src/routes/loan');
const paymentRoutes = require('./src/features/admin/payments/paymentsroutes');
const settingsRoutes = require('./src/routes/settings');

app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/loans', loanRoutes);
app.use('/admin', paymentRoutes);
app.use('/api/settings', settingsRoutes);

// Connect to MongoDB (non-blocking)
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
    process.exit(1); // Kill process so Render knows it's broken
  });
// ✅ Start server after setting up routes
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
