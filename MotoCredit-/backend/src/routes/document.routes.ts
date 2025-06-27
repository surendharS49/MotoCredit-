import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

// TODO: Import document controller once created
// import { getAllDocuments, getDocument, uploadDocument, updateDocument, deleteDocument } from '../controllers/document.controller';

// Document routes
router.get('/', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', authMiddleware, uploadSingle('document'), async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/:id', authMiddleware, uploadSingle('document'), async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

// Additional document-specific routes
router.get('/customer/:customerId', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/vehicle/:vehicleId', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/loan/:loanId', authMiddleware, async (req, res) => {
  // Temporary response until controller is implemented
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 