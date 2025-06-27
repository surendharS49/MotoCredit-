import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// TODO: Import EMI controller once created
// import { getAllEMIs, getEMI, createEMI, updateEMI, deleteEMI } from '../controllers/emi.controller';

// EMI routes
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

// Additional EMI-specific routes
router.post('/:id/pay', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/loan/:loanId', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 