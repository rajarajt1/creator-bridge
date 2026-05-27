import mongoose from 'mongoose';
import Application from '../models/Application.model.js';
import Campaign from '../models/Campaign.model.js';
import Notification from '../models/Notification.model.js';
import CreatorProfile from '../models/CreatorProfile.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// ─── shared helper ────────────────────────────────────────────────────────────

/**
 * Persist a notification and, if the recipient is connected via Socket.io,
 * emit it immediately.  Failures are non-fatal — logged but not propagated.
 */
const notify = async ({ userId, type, title, message, relatedId, relatedModel, io, userSocketMap }) => {
  try {
    const notification = await Notification.create({ userId, type, title, message, relatedId, relatedModel });

    const socketId = userSocketMap?.get(userId.toString());
    if (io && socketId) {
      io.to(socketId).emit('notification', notification);
    }
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

// ─── controllers ─────────────────────────────────────────────────────────────

// POST /api/applications
export const applyToCampaign = catchAsync(async (req, res) => {
  const { campaignId, coverLetter, proposedRate } = req.body;

  if (!campaignId || !mongoose.Types.ObjectId.isValid(campaignId)) {
    throw new AppError('Valid campaignId is required', 400);
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new AppError('Campaign not found', 404);
  if (campaign.status !== 'active') throw new AppError('Campaign is not accepting applications', 400);

  const existing = await Application.findOne({ campaignId, creatorId: req.user._id });
  if (existing) throw new AppError('You have already applied to this campaign', 409);

  const application = await Application.create({
    campaignId,
    creatorId: req.user._id,
    businessId: campaign.businessId,
    coverLetter,
    proposedRate,
  });

  await Campaign.findByIdAndUpdate(campaignId, { $inc: { applicationsCount: 1 } });

  const { io, userSocketMap } = await import('../../server.js');
  await notify({
    userId: campaign.businessId,
    type: 'application_received',
    title: 'New Application',
    message: `${req.user.name} applied to "${campaign.title}"`,
    relatedId: application._id,
    relatedModel: 'Application',
    io,
    userSocketMap,
  });

  return res.status(201).json({ success: true, application });
});

// GET /api/applications/my
export const getMyApplications = catchAsync(async (req, res) => {
  const { status } = req.query;

  const query = { creatorId: req.user._id };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate('campaignId', 'title description budget deadline status category')
    .populate({ path: 'businessId', select: 'name avatar' })
    .sort({ createdAt: -1 })
    .lean();

  const businessIds = [...new Set(applications.map((a) => a.businessId?._id?.toString()).filter(Boolean))];
  const profiles = await mongoose.model('BusinessProfile').find(
    { userId: { $in: businessIds } },
    'userId businessName logo'
  ).lean();

  const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
  const enriched = applications.map((a) => ({
    ...a,
    businessProfile: profileMap.get(a.businessId?._id?.toString()) ?? null,
  }));

  return res.json({ success: true, applications: enriched });
});

// GET /api/applications/campaign/:campaignId
export const getCampaignApplications = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  const { status } = req.query;

  if (!mongoose.Types.ObjectId.isValid(campaignId)) throw new AppError('Invalid campaign id', 400);

  const campaign = await Campaign.findById(campaignId, 'businessId');
  if (!campaign) throw new AppError('Campaign not found', 404);
  if (campaign.businessId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to view these applications', 403);
  }

  const query = { campaignId };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate('creatorId', 'name email avatar isVerified')
    .sort({ createdAt: -1 })
    .lean();

  const creatorIds = applications.map((a) => a.creatorId?._id).filter(Boolean);
  const creatorProfiles = await CreatorProfile.find(
    { userId: { $in: creatorIds } },
    'userId niche totalReach averageEngagement rating pricing availability'
  ).lean();

  const profileMap = new Map(creatorProfiles.map((p) => [p.userId.toString(), p]));
  const enriched = applications.map((a) => ({
    ...a,
    creatorProfile: profileMap.get(a.creatorId?._id?.toString()) ?? null,
  }));

  return res.json({ success: true, applications: enriched });
});

// PATCH /api/applications/:id/status
export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, businessNotes } = req.body;

  const ALLOWED = ['accepted', 'rejected', 'reviewing'];
  if (!status || !ALLOWED.includes(status)) {
    throw new AppError(`Status must be one of: ${ALLOWED.join(', ')}`, 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid application id', 400);

  const application = await Application.findById(id).populate('campaignId', 'title businessId');
  if (!application) throw new AppError('Application not found', 404);
  if (application.campaignId.businessId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this application', 403);
  }

  application.status = status;
  if (businessNotes !== undefined) application.businessNotes = businessNotes;
  await application.save();

  if (status === 'accepted') {
    await Campaign.findByIdAndUpdate(application.campaignId._id, {
      $addToSet: { selectedCreators: application.creatorId },
    });
  }

  const { io, userSocketMap } = await import('../../server.js');
  const notifType  = status === 'accepted' ? 'application_accepted' : 'application_rejected';
  const notifTitle = status === 'accepted' ? 'Application Accepted 🎉' : 'Application Update';
  const notifMsg   =
    status === 'accepted'
      ? `Your application for "${application.campaignId.title}" was accepted!`
      : `Your application for "${application.campaignId.title}" was ${status}.`;

  await notify({
    userId: application.creatorId,
    type: notifType,
    title: notifTitle,
    message: notifMsg,
    relatedId: application._id,
    relatedModel: 'Application',
    io,
    userSocketMap,
  });

  return res.json({ success: true, application });
});

// DELETE /api/applications/:id
export const withdrawApplication = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid application id', 400);

  const application = await Application.findById(id);
  if (!application) throw new AppError('Application not found', 404);
  if (application.creatorId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to withdraw this application', 403);
  }

  const WITHDRAWABLE = ['pending', 'reviewing'];
  if (!WITHDRAWABLE.includes(application.status)) {
    throw new AppError(`Cannot withdraw an application with status '${application.status}'`, 400);
  }

  application.status = 'withdrawn';
  await application.save();

  await Campaign.findByIdAndUpdate(application.campaignId, { $inc: { applicationsCount: -1 } });

  return res.json({ success: true, message: 'Application withdrawn successfully' });
});
