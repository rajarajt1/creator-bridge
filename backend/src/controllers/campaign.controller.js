import mongoose from 'mongoose';
import Campaign from '../models/Campaign.model.js';
import Application from '../models/Application.model.js';
import BusinessProfile from '../models/BusinessProfile.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

const IMMUTABLE_STATUSES = new Set(['completed', 'cancelled']);

const assertOwner = (campaign, userId) => {
  if (campaign.businessId.toString() !== userId.toString()) {
    throw new AppError('Not authorized to modify this campaign', 403);
  }
};

// ─── controllers ─────────────────────────────────────────────────────────────

// POST /api/campaigns
export const createCampaign = catchAsync(async (req, res) => {
  const campaign = await Campaign.create({
    ...req.body,
    businessId: req.user._id,
  });

  return res.status(201).json({ success: true, campaign });
});

// GET /api/campaigns
export const getCampaigns = catchAsync(async (req, res) => {
  const {
    category,
    platform,
    budgetMin,
    budgetMax,
    status = 'active',
    location,
    search,
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
  } = req.query;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = {};

  if (status)   query.status = status;
  if (category) query.category = category;
  if (location) query['requirements.location'] = { $regex: location, $options: 'i' };
  if (platform) query['requirements.platforms'] = platform;

  if (budgetMin || budgetMax) {
    query['budget.amount'] = {};
    if (budgetMin) query['budget.amount'].$gte = Number(budgetMin);
    if (budgetMax) query['budget.amount'].$lte = Number(budgetMax);
  }

  if (search) {
    const pattern = { $regex: search, $options: 'i' };
    query.$or = [{ title: pattern }, { description: pattern }];
  }

  const ALLOWED_SORT = ['createdAt', 'deadline', 'views', 'applicationsCount', 'budget.amount'];
  const sortField = ALLOWED_SORT.includes(sortBy) ? sortBy : 'createdAt';

  const [total, campaigns] = await Promise.all([
    Campaign.countDocuments(query),
    Campaign.find(query)
      .populate('businessId', 'name avatar isVerified')
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  // Attach business profile name/logo in a single batch query
  const bizIds = [...new Set(campaigns.map((c) => c.businessId?._id).filter(Boolean))];
  if (bizIds.length) {
    const profiles = await BusinessProfile.find(
      { userId: { $in: bizIds } },
      'userId businessName logo'
    ).lean();
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
    campaigns.forEach((c) => {
      if (c.businessId?._id) {
        c.businessId.businessProfile = profileMap.get(c.businessId._id.toString()) ?? null;
      }
    });
  }

  return res.json({
    success: true,
    campaigns,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// GET /api/campaigns/:id
export const getCampaignById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid campaign id', 400);

  const campaign = await Campaign.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('businessId', 'name email avatar isVerified')
    .lean();

  if (!campaign) throw new AppError('Campaign not found', 404);

  const businessProfile = await BusinessProfile.findOne(
    { userId: campaign.businessId._id },
    'businessName logo industry'
  ).lean();

  if (businessProfile) {
    campaign.businessId.businessProfile = businessProfile;
  }

  let hasApplied = false;
  if (req.user?.role === 'creator') {
    hasApplied = await Application.exists({
      campaignId: id,
      creatorId: req.user._id,
    });
  }

  return res.json({ success: true, campaign, hasApplied: Boolean(hasApplied) });
});

// GET /api/campaigns/my
export const getMyBusinessCampaigns = catchAsync(async (req, res) => {
  const { status } = req.query;

  const query = { businessId: req.user._id };
  if (status) query.status = status;

  const campaigns = await Campaign.find(query)
    .sort({ createdAt: -1 })
    .lean();

  const campaignIds = campaigns.map((c) => c._id);
  const appCounts = await Application.aggregate([
    { $match: { campaignId: { $in: campaignIds } } },
    { $group: { _id: '$campaignId', count: { $sum: 1 } } },
  ]);

  const countMap = new Map(appCounts.map(({ _id, count }) => [_id.toString(), count]));
  const enriched = campaigns.map((c) => ({
    ...c,
    applicationsCount: countMap.get(c._id.toString()) ?? 0,
  }));

  return res.json({ success: true, campaigns: enriched });
});

// PUT /api/campaigns/:id
export const updateCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid campaign id', 400);

  const campaign = await Campaign.findById(id);
  if (!campaign) throw new AppError('Campaign not found', 404);

  assertOwner(campaign, req.user._id);

  if (IMMUTABLE_STATUSES.has(campaign.status)) {
    throw new AppError(`Cannot update a campaign with status '${campaign.status}'`, 400);
  }

  const updated = await Campaign.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res.json({ success: true, campaign: updated });
});

// DELETE /api/campaigns/:id  (soft delete)
export const deleteCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid campaign id', 400);

  const campaign = await Campaign.findById(id);
  if (!campaign) throw new AppError('Campaign not found', 404);

  assertOwner(campaign, req.user._id);

  campaign.status = 'cancelled';
  await campaign.save();

  return res.json({ success: true, message: 'Campaign cancelled successfully' });
});

// PATCH /api/campaigns/:id/toggle-status
export const toggleCampaignStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid campaign id', 400);

  const campaign = await Campaign.findById(id);
  if (!campaign) throw new AppError('Campaign not found', 404);

  assertOwner(campaign, req.user._id);

  if (IMMUTABLE_STATUSES.has(campaign.status)) {
    throw new AppError(`Cannot toggle status of a '${campaign.status}' campaign`, 400);
  }

  campaign.status = campaign.status === 'active' ? 'paused' : 'active';
  await campaign.save();

  return res.json({ success: true, campaign });
});
