import mongoose from 'mongoose';
import BusinessProfile from '../models/BusinessProfile.model.js';
import User from '../models/User.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// PUT /api/business/profile
export const createOrUpdateProfile = catchAsync(async (req, res) => {
  const update = { ...req.body };

  // Map budgetMin and budgetMax from the frontend form to the budget schema structure
  if (update.budgetMin !== undefined || update.budgetMax !== undefined) {
    update.budget = {
      min: Number(update.budgetMin) || 0,
      max: Number(update.budgetMax) || 0,
      currency: 'INR',
    };
    delete update.budgetMin;
    delete update.budgetMax;
  }

  const profile = await BusinessProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: update },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json({ success: true, profile });
});

// GET /api/business/profile
export const getMyProfile = catchAsync(async (req, res) => {
  const profile = await BusinessProfile.findOne({ userId: req.user._id }).populate(
    'userId',
    'name email avatar isVerified verificationBadge'
  );

  if (!profile) throw new AppError('Business profile not found', 404);

  return res.json({ success: true, profile });
});

// GET /api/business/:id
export const getBusinessById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid business id', 400);

  const business = await BusinessProfile.findOne({ userId: id }).populate(
    'userId',
    'name email avatar isVerified verificationBadge'
  );

  if (!business) throw new AppError('Business profile not found', 404);

  return res.json({ success: true, business });
});
