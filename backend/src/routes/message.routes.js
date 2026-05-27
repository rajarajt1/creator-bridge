import express from 'express';
import {
  sendMessage,
  getConversation,
  getConversationList,
  markAsRead,
  deleteMessage,
} from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Specific routes before param routes to prevent path collisions
router.get('/conversations', getConversationList);
router.patch('/read', markAsRead);

router.post('/', sendMessage);
router.get('/:userId', getConversation);
router.delete('/:messageId', deleteMessage);

export default router;
