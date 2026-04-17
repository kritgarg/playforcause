import express from 'express';
import { addScore, getScores } from '../controllers/scoreController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/', authMiddleware, addScore);
router.get('/', authMiddleware, getScores);

export default router;
