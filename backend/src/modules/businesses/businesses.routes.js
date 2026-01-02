import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';

import { createBusinessSchema } from './businesses.validation.js';
import { createBusiness, listBusinesses } from './businesses.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listBusinesses));
router.post('/', validate(createBusinessSchema), asyncHandler(createBusiness));

export default router;
