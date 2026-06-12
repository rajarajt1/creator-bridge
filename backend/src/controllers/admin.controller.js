import User from '../models/User.model.js';
import Campaign from '../models/Campaign.model.js';
import Application from '../models/Application.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// GET /api/admin/stats
export const getStats = catchAsync(async (req, res) => {
  const [totalCreators, totalBusinesses, totalCampaigns, activeCollaborations] = await Promise.all([
    User.countDocuments({ role: 'creator' }),
    User.countDocuments({ role: 'business' }),
    Campaign.countDocuments({}),
    Application.countDocuments({ status: 'accepted' }),
  ]);

  return res.json({
    success: true,
    stats: {
      totalCreators,
      totalBusinesses,
      totalCampaigns,
      activeCollaborations,
    },
  });
});

// GET /api/admin/users
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  return res.json({ success: true, users });
});

// PATCH /api/admin/users/:id/toggle-active
export const toggleUserActive = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);

  // Prevent admin from deactivating themselves
  if (user._id.toString() === req.user._id.toString()) {
    throw new AppError('Admin cannot deactivate themselves', 400);
  }

  user.isActive = !user.isActive;
  await user.save();

  return res.json({
    success: true,
    message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});
