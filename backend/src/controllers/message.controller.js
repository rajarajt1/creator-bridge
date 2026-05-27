import mongoose from 'mongoose';
import Message from '../models/Message.model.js';
import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// ─── helper ───────────────────────────────────────────────────────────────────

const emitOrNotify = async ({ io, userSocketMap, receiverId, event, payload, notification }) => {
  const socketId = userSocketMap?.get(receiverId.toString());
  if (io && socketId) {
    io.to(socketId).emit(event, payload);
  } else {
    // Receiver is offline — persist a notification
    try {
      await Notification.create(notification);
    } catch (err) {
      console.error('Notification error:', err.message);
    }
  }
};

// ─── controllers ─────────────────────────────────────────────────────────────

// POST /api/messages
export const sendMessage = catchAsync(async (req, res) => {
  const { receiverId, content, messageType = 'text' } = req.body;

  if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new AppError('Valid receiverId is required', 400);
  }
  if (!content?.trim()) throw new AppError('Message content is required', 400);
  if (receiverId === req.user._id.toString()) throw new AppError('Cannot send a message to yourself', 400);

  const receiver = await User.findById(receiverId, '_id name');
  if (!receiver) throw new AppError('Receiver not found', 404);

  const conversationId = Message.generateConversationId(req.user._id, receiverId);

  const message = await Message.create({
    conversationId,
    senderId: req.user._id,
    receiverId,
    content: content.trim(),
    messageType,
  });

  const { io, userSocketMap } = await import('../../server.js');

  await emitOrNotify({
    io,
    userSocketMap,
    receiverId,
    event: 'new_message',
    payload: message,
    notification: {
      userId: receiverId,
      type: 'new_message',
      title: 'New Message',
      message: `${req.user.name} sent you a message`,
      relatedId: message._id,
      relatedModel: 'Message',
    },
  });

  return res.status(201).json({ success: true, message });
});

// GET /api/messages/:userId
export const getConversation = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 30 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) throw new AppError('Invalid user id', 400);

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const conversationId = Message.generateConversationId(req.user._id, userId);

  const [total, messages] = await Promise.all([
    Message.countDocuments({ conversationId }),
    Message.find({ conversationId })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  await Message.updateMany(
    { conversationId, receiverId: req.user._id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return res.json({
    success: true,
    messages,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// GET /api/messages/conversations
export const getConversationList = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Message.aggregate([
      // All messages involving this user
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      // Keep the latest message per conversation
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
      // Resolve the other participant's _id from the conversationId string
      {
        $addFields: {
          otherUserId: {
            $let: {
              vars: {
                parts: { $split: ['$_id', '_'] },
                myId: { $toString: new mongoose.Types.ObjectId(userId) },
              },
              in: {
                $cond: [
                  { $eq: [{ $arrayElemAt: ['$$parts', 0] }, '$$myId'] },
                  { $toObjectId: { $arrayElemAt: ['$$parts', 1] } },
                  { $toObjectId: { $arrayElemAt: ['$$parts', 0] } },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'otherUserId',
          foreignField: '_id',
          as: 'participant',
          pipeline: [{ $project: { name: 1, avatar: 1, isVerified: 1 } }],
        },
      },
      { $unwind: { path: '$participant', preserveNullAndEmpty: true } },
      {
        $project: {
          conversationId: '$_id',
          lastMessage: 1,
          unreadCount: 1,
          participant: 1,
        },
      },
    ]);

  return res.json({ success: true, conversations });
});

// PATCH /api/messages/read
export const markAsRead = catchAsync(async (req, res) => {
  const { conversationId } = req.body;

  if (!conversationId) throw new AppError('conversationId is required', 400);

  await Message.updateMany(
    { conversationId, receiverId: req.user._id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return res.json({ success: true });
});

// DELETE /api/messages/:messageId
export const deleteMessage = catchAsync(async (req, res) => {
  const { messageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(messageId)) throw new AppError('Invalid message id', 400);

  const message = await Message.findById(messageId);
  if (!message) throw new AppError('Message not found', 404);
  if (message.senderId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this message', 403);
  }

  await message.deleteOne();

  return res.json({ success: true });
});
