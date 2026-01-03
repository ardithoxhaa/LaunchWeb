import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';

import {
  createWebsiteSchema,
  createBlankWebsiteSchema,
  updateWebsiteSeoSchema,
  updateWebsiteSettingsSchema,
  updateWebsiteStructureSchema,
} from './websites.validation.js';

import {
  createBlankWebsite,
  createWebsiteFromTemplate,
  getWebsite,
  getWebsiteStructure,
  listWebsitesForBusiness,
  publishWebsite,
  unpublishWebsite,
  updateWebsiteSeo,
  updateWebsiteSettings,
  updateWebsiteStructure,
  listWebsiteVersions,
  restoreWebsiteVersion,
} from './websites.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/business/:businessId', asyncHandler(listWebsitesForBusiness));
router.post('/', validate(createWebsiteSchema), asyncHandler(createWebsiteFromTemplate));
router.post('/blank', validate(createBlankWebsiteSchema), asyncHandler(createBlankWebsite));
router.get('/:id', asyncHandler(getWebsite));
router.get('/:id/structure', asyncHandler(getWebsiteStructure));
router.put('/:id/structure', validate(updateWebsiteStructureSchema), asyncHandler(updateWebsiteStructure));
router.put('/:id/seo', validate(updateWebsiteSeoSchema), asyncHandler(updateWebsiteSeo));
router.put('/:id/settings', validate(updateWebsiteSettingsSchema), asyncHandler(updateWebsiteSettings));
router.post('/:id/publish', asyncHandler(publishWebsite));
router.post('/:id/unpublish', asyncHandler(unpublishWebsite));
router.get('/:id/versions', asyncHandler(listWebsiteVersions));
router.post('/:id/versions/:versionId/restore', asyncHandler(restoreWebsiteVersion));

export default router;
