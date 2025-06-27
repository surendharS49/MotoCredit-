import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import vehicleRoutes from './routes/vehicle.routes';
import loanRoutes from './routes/loan.routes';
import emiRoutes from './routes/emi.routes';
import documentRoutes from './routes/document.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/vehicles', authMiddleware, vehicleRoutes);
app.use('/api/loans', authMiddleware, loanRoutes);
app.use('/api/emis', authMiddleware, emiRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);

// Error handling
app.use(errorHandler);

export default app; 