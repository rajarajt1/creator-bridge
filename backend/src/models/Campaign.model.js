import mongoose from 'mongoose';

const NICHES = [
  'tech', 'fashion', 'food', 'travel', 'fitness',
  'gaming', 'beauty', 'education', 'lifestyle',
  'finance', 'entertainment', 'other',
];

const campaignSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: NICHES,
    },
    requirements: {
      minFollowers: { type: Number, default: 0 },
      platforms: [
        {
          type: String,
          enum: ['instagram', 'youtube', 'twitter', 'tiktok'],
        },
      ],
      contentType: [
        {
          type: String,
          enum: ['post', 'story', 'reel', 'video', 'review'],
        },
      ],
      location: { type: String, default: '' },
    },
    budget: {
      type: {
        type: String,
        enum: ['fixed', 'negotiable', 'product-based'],
      },
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
      default: 'draft',
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    selectedCreators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [{ type: String, trim: true }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
