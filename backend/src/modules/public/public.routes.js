import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { getPublishedWebsiteStructureBySlug } from './public.controller.js';

const router = Router();

router.get('/websites/:slug/structure', asyncHandler(getPublishedWebsiteStructureBySlug));

export default router;
