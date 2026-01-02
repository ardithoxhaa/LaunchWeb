import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { getTemplate, listTemplates } from './templates.controller.js';

const router = Router();

router.get('/', asyncHandler(listTemplates));
router.get('/:id', asyncHandler(getTemplate));

export default router;
