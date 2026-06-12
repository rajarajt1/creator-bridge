import mongoose from 'mongoose';

const NICHES = [
  'tech', 'fashion', 'food', 'travel', 'fitness',
  'gaming', 'beauty', 'education', 'lifestyle',
  'finance', 'entertainment', 'other',
];

const socialHandleSchema = (extra = {}) =>
  new mongoose.Schema({ ...extra }, { _id: false });

const creatorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    niche: [
      {
        type: String,
        enum: NICHES,
      },
    ],
    location: {
      type: String,
      default: '',
    },
    socialMedia: {
      instagram: socialHandleSchema({
        handle: String,
        followers: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        profileUrl: String,
      }),
      youtube: socialHandleSchema({
        channelName: String,
        subscribers: { type: Number, default: 0 },
        avgViews: { type: Number, default: 0 },
        channelUrl: String,
      }),
      twitter: socialHandleSchema({
        handle: String,
        followers: { type: Number, default: 0 },
        profileUrl: String,
      }),
      tiktok: socialHandleSchema({
        handle: String,
        followers: { type: Number, default: 0 },
        profileUrl: String,
      }),
    },
    totalReach: {
      type: Number,
      default: 0,
    },
    averageEngagement: {
      type: Number,
      default: 0,
    },
    portfolio: [
      {
        title: { type: String, required: true },
        description: String,
        imageUrl: String,
        projectUrl: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    pricing: {
      postRate: { type: Number, default: 0 },
      storyRate: { type: Number, default: 0 },
      videoRate: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    monthlyViews: {
      type: Number,
      default: 0,
    },
    monthlyUploads: {
      type: Number,
      default: 0,
    },
    avgReelViews: {
      type: Number,
      default: 0,
    },
    audienceDetails: {
      type: String,
      default: '',
    },
    packages: [
      {
        name: { type: String, required: true },
        reelsCount: { type: Number, default: 0 },
        expectedViews: { type: Number, default: 0 },
        durationDays: { type: Number, default: 30 },
        reportingFrequency: { type: String, enum: ['weekly', 'monthly'], default: 'weekly' },
        price: { type: Number, default: 0 },
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    completedCollaborations: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: populated user details accessible as profile.fullProfile
creatorProfileSchema.virtual('fullProfile', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;
