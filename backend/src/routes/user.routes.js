import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  choosePlan,
} from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/subscribe', choosePlan);
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

export default router;
