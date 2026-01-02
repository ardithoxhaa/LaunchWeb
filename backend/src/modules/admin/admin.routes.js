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
  updateUserRole,
  updateUser,
  deleteUser,
  updateBusiness,
  deleteBusiness,
  updateWebsite,
  deleteWebsite,
  deleteTemplate,
} from './admin.controller.js';
import {
  createTemplateSchema,
  deleteByIdParamSchema,
  templateIdParamSchema,
  updateBusinessSchema,
  updateTemplateSchema,
  updateUserSchema,
  updateUserRoleSchema,
  updateWebsiteSchema,
} from './admin.validation.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/overview', asyncHandler(overview));
router.get('/users', asyncHandler(listUsers));
router.put('/users/:id/role', validate(updateUserRoleSchema), asyncHandler(updateUserRole));
router.put('/users/:id', validate(updateUserSchema), asyncHandler(updateUser));
router.delete('/users/:id', validate(deleteByIdParamSchema), asyncHandler(deleteUser));
router.get('/businesses', asyncHandler(listBusinesses));
router.put('/businesses/:id', validate(updateBusinessSchema), asyncHandler(updateBusiness));
router.delete('/businesses/:id', validate(deleteByIdParamSchema), asyncHandler(deleteBusiness));
router.get('/websites', asyncHandler(listWebsites));
router.put('/websites/:id', validate(updateWebsiteSchema), asyncHandler(updateWebsite));
router.delete('/websites/:id', validate(deleteByIdParamSchema), asyncHandler(deleteWebsite));
router.get('/templates', asyncHandler(listTemplates));
router.post('/templates', validate(createTemplateSchema), asyncHandler(createTemplate));
router.get('/templates/:id', validate(templateIdParamSchema), asyncHandler(getTemplate));
router.put('/templates/:id', validate(updateTemplateSchema), asyncHandler(updateTemplate));
router.delete('/templates/:id', validate(templateIdParamSchema), asyncHandler(deleteTemplate));

export default router;
