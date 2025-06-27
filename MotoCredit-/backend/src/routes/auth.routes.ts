import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// TODO: Import auth controller once created
// import { login, register, logout } from '../controllers/auth.controller';

// Auth routes
router.post('/register', async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/login', async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/logout', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 