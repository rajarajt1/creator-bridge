import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: [50, 'Cover letter must be at least 50 characters'],
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters'],
    },
    proposedRate: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    businessNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent a creator from applying to the same campaign twice
applicationSchema.index({ campaignId: 1, creatorId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
