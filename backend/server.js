const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/database');
const PORT = process.env.PORT || 3000;

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://moto-credit.netlify.app', 'https://motocredit.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests
// app.options('/*', cors(corsOptions));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  console.log("Health check route hit");
  res.send('API running ✅');
});

// Mount routes
const adminRoutes = require('./src/routes/admin');
const customerRoutes = require('./src/routes/customer');
const vehicleRoutes = require('./src/routes/vehicle');
const loanRoutes = require('./src/routes/loan');
const paymentRoutes = require('./src/features/admin/payments/paymentsroutes');
const settingsRoutes = require('./src/routes/settings');
const auditLogRoutes = require('./src/features/admin/payments/auditlogroutes');

app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/audit-logs', auditLogRoutes);
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
    process.exit(1); 
  });
