import express from 'express';
import { submitReport, getCampaignReports } from '../controllers/report.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('creator'), submitReport);
router.get('/campaign/:campaignId', getCampaignReports);

export default router;
