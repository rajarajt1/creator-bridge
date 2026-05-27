import express from 'express';
import {
  createOrUpdateProfile,
  getMyProfile,
  getCreatorById,
  searchCreators,
  uploadAvatar,
  addPortfolioItem,
  deletePortfolioItem,
} from '../controllers/creator.controller.js';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { avatarUpload } from '../middleware/upload.middleware.js';
import { creatorProfileSchema } from '../validators/creator.validator.js';

const router = express.Router();

// Public (viewer optionally authenticated)
router.get('/', optionalAuth, searchCreators);

// Authenticated creator routes (order matters: specific before :id)
router.get('/profile', protect, restrictTo('creator'), getMyProfile);
router.put('/profile', protect, restrictTo('creator'), validate(creatorProfileSchema), createOrUpdateProfile);
router.post('/avatar', protect, restrictTo('creator'), ...avatarUpload, uploadAvatar);
router.post('/portfolio', protect, restrictTo('creator'), addPortfolioItem);
router.delete('/portfolio/:itemId', protect, restrictTo('creator'), deletePortfolioItem);

// Public profile by userId
router.get('/:id', getCreatorById);

export default router;
