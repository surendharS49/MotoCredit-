import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// TODO: Import customer controller once created
// import { getAllCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller';

// Customer routes
router.get('/', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/:id', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 