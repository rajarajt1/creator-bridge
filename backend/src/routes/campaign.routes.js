import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  getMyBusinessCampaigns,
  updateCampaign,
  deleteCampaign,
  toggleCampaignStatus,
} from '../controllers/campaign.controller.js';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCampaignSchema, updateCampaignSchema } from '../validators/campaign.validator.js';

const router = express.Router();

// Public (viewer optionally authenticated)
router.get('/', optionalAuth, getCampaigns);

// Authenticated business-only routes (specific before :id)
router.get('/my', protect, restrictTo('business'), getMyBusinessCampaigns);
router.post('/', protect, restrictTo('business'), validate(createCampaignSchema), createCampaign);

// Single campaign
router.get('/:id', optionalAuth, getCampaignById);
router.put('/:id', protect, restrictTo('business'), validate(updateCampaignSchema), updateCampaign);
router.delete('/:id', protect, restrictTo('business'), deleteCampaign);
router.patch('/:id/toggle-status', protect, restrictTo('business'), toggleCampaignStatus);

export default router;
