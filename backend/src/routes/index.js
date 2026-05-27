import { Router } from 'express';
import authRoutes        from './auth.routes.js';
import userRoutes        from './user.routes.js';
import creatorRoutes     from './creator.routes.js';
import campaignRoutes    from './campaign.routes.js';
import applicationRoutes from './application.routes.js';
import messageRoutes     from './message.routes.js';

const router = Router();

router.use('/auth',         authRoutes);
router.use('/users',        userRoutes);
router.use('/creators',     creatorRoutes);
router.use('/campaigns',    campaignRoutes);
router.use('/applications', applicationRoutes);
router.use('/messages',     messageRoutes);

export default router;
