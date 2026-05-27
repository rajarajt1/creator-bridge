import express from 'express';
import {
  applyToCampaign,
  getMyApplications,
  getCampaignApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/application.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { applySchema } from '../validators/application.validator.js';

const router = express.Router();

// Creator routes
router.post(
  '/',
  protect,
  restrictTo('creator'),
  validate(applySchema),
  applyToCampaign
);
router.get('/my', protect, restrictTo('creator'), getMyApplications);
router.delete('/:id', protect, restrictTo('creator'), withdrawApplication);

// Business routes
router.get(
  '/campaign/:campaignId',
  protect,
  restrictTo('business'),
  getCampaignApplications
);
router.patch(
  '/:id/status',
  protect,
  restrictTo('business'),
  updateApplicationStatus
);

export default router;
