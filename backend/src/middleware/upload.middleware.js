import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

// ─── Multer: keep files in memory so we can pipe to Cloudinary ───────────────

const storage = multer.memoryStorage();

const imageFileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// ─── Cloudinary helper ────────────────────────────────────────────────────────

/**
 * Upload a Buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder  e.g. 'creators-bridge/avatars'
 * @param {object} [options]  extra cloudinary upload options
 * @returns {Promise<import('cloudinary').UploadApiResponse>}
 */
export const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ─── Avatar upload ────────────────────────────────────────────────────────────
// Single image, max 2 MB

const avatarMulter = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

/**
 * Express middleware: accepts a single avatar file, uploads it to
 * Cloudinary and attaches the secure URL to req.fileUrl.
 */
export const avatarUpload = [
  avatarMulter.single('avatar'),
  async (req, res, next) => {
    if (!req.file) return next();
    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'creators-bridge/avatars',
        { transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] }
      );
      req.fileUrl = result.secure_url;
      next();
    } catch (error) {
      next(error);
    }
  },
];

// ─── Portfolio upload ─────────────────────────────────────────────────────────
// Single image, max 5 MB

const portfolioMulter = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/**
 * Express middleware: accepts a single portfolio image, uploads it to
 * Cloudinary and attaches the secure URL to req.fileUrl.
 */
export const portfolioUpload = [
  portfolioMulter.single('image'),
  async (req, res, next) => {
    if (!req.file) return next();
    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'creators-bridge/portfolio'
      );
      req.fileUrl = result.secure_url;
      next();
    } catch (error) {
      next(error);
    }
  },
];
