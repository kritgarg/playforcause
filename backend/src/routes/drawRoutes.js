import express from 'express';
import { runDrawAdmin } from '../controllers/drawController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/admin/run', authMiddleware, adminMiddleware, runDrawAdmin);

export default router;
