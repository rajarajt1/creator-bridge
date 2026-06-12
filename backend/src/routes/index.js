


import { Router } from 'express';
import authRoutes        from './auth.routes.js';
import userRoutes        from './user.routes.js';
import creatorRoutes     from './creator.routes.js';
import businessRoutes    from './business.routes.js';
import campaignRoutes    from './campaign.routes.js';
import applicationRoutes from './application.routes.js';
import messageRoutes     from './message.routes.js';
import reportRoutes      from './report.routes.js';
import adminRoutes       from './admin.routes.js';

const router = Router();

router.use('/auth',         authRoutes);
router.use('/users',        userRoutes);
router.use('/creators',     creatorRoutes);
router.use('/business',     businessRoutes);
router.use('/campaigns',    campaignRoutes);
router.use('/applications', applicationRoutes);
router.use('/messages',     messageRoutes);
router.use('/reports',      reportRoutes);
router.use('/admin',        adminRoutes);

export default router;
