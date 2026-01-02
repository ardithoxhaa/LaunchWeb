import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { getTemplate, getTemplatePreview, listTemplates } from './templates.controller.js';

const router = Router();

router.get('/', asyncHandler(listTemplates));
router.get('/:id/preview', asyncHandler(getTemplatePreview));
router.get('/:id', asyncHandler(getTemplate));

export default router;
