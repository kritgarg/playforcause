import express from 'express';
import { subscribe, getStatus, getAllUsersAdmin, updateUserAdmin, updateUserCharity } from '../controllers/subscriptionController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/subscribe', authMiddleware, subscribe);
router.get('/status', authMiddleware, getStatus);
router.patch('/admin/users/:id', authMiddleware, adminMiddleware, updateUserAdmin);
router.get('/admin/users', authMiddleware, adminMiddleware, getAllUsersAdmin);
router.patch('/user/charity', authMiddleware, updateUserCharity);

export default router;
