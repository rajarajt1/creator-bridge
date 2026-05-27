import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already in use', 400);

  const user = await User.create({ name, email, password, role });

  const accessToken  = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: serializeUser(user),
    accessToken,
  });
});

// POST /api/auth/login
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Account is deactivated', 403);

  const accessToken  = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  return res.json({
    success: true,
    message: 'Logged in successfully',
    user: serializeUser(user),
    accessToken,
  });
});

// POST /api/auth/refresh-token
export const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (!token) throw new AppError('No refresh token provided', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findOne({ _id: decoded.id }).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Refresh token mismatch', 401);
  }

  // Rotate refresh token on each use
  const newAccessToken  = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateModifiedOnly: true });

  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

  return res.json({ success: true, accessToken: newAccessToken });
});

// POST /api/auth/logout
export const logout = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: '' } });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
export const getMe = catchAsync(async (req, res) => {
  return res.json({ success: true, user: req.user });
});
