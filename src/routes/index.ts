import { Router } from 'express';
import authRoutes from './AuthRouter';
import userRoutes from './UserRoutes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);

export default router;