import express from 'express';
import {
  createOrUpdateProfile,
  getMyProfile,
  getBusinessById,
} from '../controllers/business.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// Authenticated business routes
router.get('/profile', protect, restrictTo('business'), getMyProfile);
router.put('/profile', protect, restrictTo('business'), createOrUpdateProfile);

// Public business profile details by user ID
router.get('/:id', getBusinessById);

export default router;
