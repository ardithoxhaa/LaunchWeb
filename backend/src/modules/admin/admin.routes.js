import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';

import {
  overview,
  listUsers,
  listBusinesses,
  listWebsites,
  listTemplates,
  createTemplate,
  getTemplate,
  updateTemplate,
} from './admin.controller.js';
import { createTemplateSchema, templateIdParamSchema, updateTemplateSchema } from './admin.validation.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/overview', asyncHandler(overview));
router.get('/users', asyncHandler(listUsers));
router.get('/businesses', asyncHandler(listBusinesses));
router.get('/websites', asyncHandler(listWebsites));
router.get('/templates', asyncHandler(listTemplates));
router.post('/templates', validate(createTemplateSchema), asyncHandler(createTemplate));
router.get('/templates/:id', validate(templateIdParamSchema), asyncHandler(getTemplate));
router.put('/templates/:id', validate(updateTemplateSchema), asyncHandler(updateTemplate));

export default router;
