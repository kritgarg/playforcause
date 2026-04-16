import express from 'express';
import { getCharities, createCharityAdmin, updateCharityAdmin, deleteCharityAdmin } from '../controllers/charityController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getCharities);
router.post('/admin', authMiddleware, adminMiddleware, createCharityAdmin);
router.put('/admin/:id', authMiddleware, adminMiddleware, updateCharityAdmin);
router.delete('/admin/:id', authMiddleware, adminMiddleware, deleteCharityAdmin);

export default router;
