import express from 'express';
import { getMyWinnings, getAllWinnersAdmin, updateWinnerStatusAdmin } from '../controllers/winnerController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, getMyWinnings);
router.get('/admin', authMiddleware, adminMiddleware, getAllWinnersAdmin);
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, updateWinnerStatusAdmin);

export default router;
