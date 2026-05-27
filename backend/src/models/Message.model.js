import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Deterministically generates a conversation ID from two user IDs.
 * Sorting ensures the same ID regardless of argument order.
 * @param {string} userId1
 * @param {string} userId2
 * @returns {string}
 */
messageSchema.statics.generateConversationId = function (userId1, userId2) {
  return [userId1.toString(), userId2.toString()].sort().join('_');
};

const Message = mongoose.model('Message', messageSchema);
export default Message;
