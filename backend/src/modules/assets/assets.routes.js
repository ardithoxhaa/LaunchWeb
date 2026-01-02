import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { badRequest } from '../../utils/httpError.js';

import { assetsService } from './assets.service.js';
import { listAssetsSchema, uploadAssetSchema } from './assets.validation.js';
import { listAssets, uploadImage } from './assets.controller.js';

const router = Router();

router.use(requireAuth);

const uploadsDir = path.resolve(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await assetsService.ensureUploadsDir(uploadsDir);
      cb(null, uploadsDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (_req, file, cb) => {
    try {
      cb(null, assetsService.makeStoredFilename(file.originalname));
    } catch (err) {
      cb(err);
    }
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) {
      return cb(badRequest('Only image uploads are supported'));
    }
    cb(null, true);
  },
});

router.get('/', validate(listAssetsSchema), asyncHandler(listAssets));
router.post(
  '/upload',
  upload.single('file'),
  validate(uploadAssetSchema),
  (req, _res, next) => {
    if (!req.file) return next(badRequest('Missing file'));
    next();
  },
  asyncHandler(uploadImage)
);

export default router;
