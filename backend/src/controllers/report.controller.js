import mongoose from 'mongoose';
import Report from '../models/Report.model.js';
import Application from '../models/Application.model.js';
import Campaign from '../models/Campaign.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// POST /api/reports
export const submitReport = catchAsync(async (req, res) => {
  const { campaignId, type, metrics, summary } = req.body;

  if (!campaignId || !mongoose.Types.ObjectId.isValid(campaignId)) {
    throw new AppError('Valid campaignId is required', 400);
  }

  if (!['weekly', 'monthly'].includes(type)) {
    throw new AppError('Type must be either weekly or monthly', 400);
  }

  // Ensure the creator has an accepted application for this campaign
  const hasAccess = await Application.exists({
    campaignId,
    creatorId: req.user._id,
    status: 'accepted',
  });

  if (!hasAccess) {
    throw new AppError('You are not authorized to submit reports for this campaign', 403);
  }

  const report = await Report.create({
    campaignId,
    creatorId: req.user._id,
    type,
    metrics: {
      views: Number(metrics?.views) || 0,
      reach: Number(metrics?.reach) || 0,
      likes: Number(metrics?.likes) || 0,
      comments: Number(metrics?.comments) || 0,
      shares: Number(metrics?.shares) || 0,
    },
    summary: summary || '',
  });

  return res.status(201).json({ success: true, report });
});

// GET /api/reports/campaign/:campaignId
export const getCampaignReports = catchAsync(async (req, res) => {
  const { campaignId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(campaignId)) {
    throw new AppError('Invalid campaign ID', 400);
  }

  // Find the campaign to verify roles
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new AppError('Campaign not found', 404);

  // Authorize: user must be the campaign owner or an accepted creator on this campaign, or admin
  const isOwner = campaign.businessId.toString() === req.user._id.toString();
  const isAcceptedCreator = await Application.exists({
    campaignId,
    creatorId: req.user._id,
    status: 'accepted',
  });
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAcceptedCreator && !isAdmin) {
    throw new AppError('Not authorized to view these reports', 403);
  }

  const reports = await Report.find({ campaignId })
    .populate('creatorId', 'name avatar')
    .sort({ createdAt: -1 });

  return res.json({ success: true, reports });
});
