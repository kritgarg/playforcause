import express from 'express';
import { register, login, getProfile, updateUserCharity } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.patch('/charity', authMiddleware, updateUserCharity);

export default router;
