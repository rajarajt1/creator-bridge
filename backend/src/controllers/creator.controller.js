import mongoose from 'mongoose';
import CreatorProfile from '../models/CreatorProfile.model.js';
import User from '../models/User.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute totalReach as the sum of all platform follower counts.
 */
const calcTotalReach = (socialMedia = {}) => {
  const { instagram, youtube, twitter, tiktok } = socialMedia;
  return (
    (instagram?.followers ?? 0) +
    (youtube?.subscribers ?? 0) +
    (twitter?.followers ?? 0) +
    (tiktok?.followers ?? 0)
  );
};

// ─── controllers ─────────────────────────────────────────────────────────────

// PUT /api/creators/profile
export const createOrUpdateProfile = catchAsync(async (req, res) => {
  const update = { ...req.body };

  if (update.socialMedia) {
    update.totalReach = calcTotalReach(update.socialMedia);
  }

  const profile = await CreatorProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: update },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json({ success: true, profile });
});

// GET /api/creators/profile
export const getMyProfile = catchAsync(async (req, res) => {
  const profile = await CreatorProfile.findOne({ userId: req.user._id }).populate(
    'userId',
    'name email avatar isVerified verificationBadge'
  );

  if (!profile) throw new AppError('Profile not found', 404);

  return res.json({ success: true, profile });
});

// GET /api/creators/:id
export const getCreatorById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid creator id', 400);

  const creator = await CreatorProfile.findOne({ userId: id }).populate(
    'userId',
    'name email avatar isVerified verificationBadge'
  );

  if (!creator) throw new AppError('Creator not found', 404);

  if (!req.user || req.user._id.toString() !== id) {
    await CreatorProfile.findByIdAndUpdate(creator._id, { $inc: { 'rating.count': 0 } });
  }

  return res.json({ success: true, creator });
});

// GET /api/creators
export const searchCreators = async (req, res, next) => {
  try {
    const {
      niche,
      minFollowers,
      maxFollowers,
      location,
      availability,
      platform,
      page = 1,
      limit = 12,
      sortBy = 'totalReach',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // ── match stage ────────────────────────────────────────────────────────
    const matchProfile = {};

    if (niche) {
      matchProfile.niche = { $in: niche.split(',') };
    }
    if (availability !== undefined) {
      matchProfile.availability = availability === 'true';
    }
    if (location) {
      matchProfile.location = { $regex: location, $options: 'i' };
    }
    if (minFollowers || maxFollowers) {
      matchProfile.totalReach = {};
      if (minFollowers) matchProfile.totalReach.$gte = parseInt(minFollowers, 10);
      if (maxFollowers) matchProfile.totalReach.$lte = parseInt(maxFollowers, 10);
    }
    if (platform) {
      // Filter creators who have set at least one handle on the requested platform
      matchProfile[`socialMedia.${platform}.handle`] = { $exists: true, $ne: '' };
    }

    const ALLOWED_SORT = ['totalReach', 'averageEngagement', 'completedCollaborations', 'createdAt'];
    const sortField = ALLOWED_SORT.includes(sortBy) ? sortBy : 'totalReach';

    const pipeline = [
      { $match: matchProfile },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      // Keep only active, non-deleted accounts
      { $match: { 'user.isActive': true } },
      {
        $project: {
          userId: 1,
          bio: 1,
          niche: 1,
          location: 1,
          totalReach: 1,
          averageEngagement: 1,
          pricing: 1,
          availability: 1,
          completedCollaborations: 1,
          rating: 1,
          createdAt: 1,
          'socialMedia.instagram.followers': 1,
          'socialMedia.youtube.subscribers': 1,
          'socialMedia.twitter.followers': 1,
          'socialMedia.tiktok.followers': 1,
          'user.name': 1,
          'user.email': 1,
          'user.avatar': 1,
          'user.isVerified': 1,
          'user.verificationBadge': 1,
        },
      },
      { $sort: { [sortField]: -1 } },
    ];

    // Run count and paginated data in parallel
    const [countResult, creators] = await Promise.all([
      CreatorProfile.aggregate([...pipeline, { $count: 'total' }]),
      CreatorProfile.aggregate([...pipeline, { $skip: skip }, { $limit: limitNum }]),
    ]);

    const total = countResult[0]?.total ?? 0;

    return res.json({
      success: true,
      creators,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/creators/avatar
export const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.fileUrl) throw new AppError('No file uploaded', 400);

  await User.findByIdAndUpdate(req.user._id, { avatar: req.fileUrl });

  return res.json({ success: true, avatarUrl: req.fileUrl });
});

// POST /api/creators/portfolio
export const addPortfolioItem = catchAsync(async (req, res) => {
  const { title, description, projectUrl } = req.body;

  if (!title?.trim()) throw new AppError('Portfolio item title is required', 400);

  const newItem = {
    title:      title.trim(),
    description: description?.trim() ?? '',
    imageUrl:   req.fileUrl ?? '',
    projectUrl: projectUrl?.trim() ?? '',
    createdAt:  new Date(),
  };

  const profile = await CreatorProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $push: { portfolio: newItem } },
    { new: true, upsert: true }
  );

  return res.status(201).json({ success: true, portfolio: profile.portfolio });
});

// DELETE /api/creators/portfolio/:itemId
export const deletePortfolioItem = catchAsync(async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) throw new AppError('Invalid portfolio item id', 400);

  const profile = await CreatorProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { portfolio: { _id: new mongoose.Types.ObjectId(itemId) } } },
    { new: true }
  );

  if (!profile) throw new AppError('Profile not found', 404);

  return res.json({ success: true, message: 'Portfolio item deleted' });
});
