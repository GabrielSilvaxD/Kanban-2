import { Router } from 'express';
import ticketRoutes from './api/ticket-routes.js';
import userRoutes from './api/user-routes.js';
import authRoutes from './auth-routes.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes (no authentication required)
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use('/tickets', authenticateToken, ticketRoutes);
router.use('/users', authenticateToken, userRoutes);

export default router;