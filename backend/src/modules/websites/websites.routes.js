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
  updateWebsiteBuilderSchema,
  updateWebsiteSlugSchema,
  addPageSchema,
  updatePageSchema,
} from './websites.validation.js';

import {
  createBlankWebsite,
  createWebsiteFromTemplate,
  getWebsite,
  getWebsiteStructure,
  getWebsiteBuilder,
  listWebsitesForBusiness,
  publishWebsite,
  unpublishWebsite,
  updateWebsiteSeo,
  updateWebsiteSettings,
  updateWebsiteStructure,
  updateWebsiteBuilder,
  listWebsiteVersions,
  restoreWebsiteVersion,
  checkSlugAvailability,
  updateWebsiteSlug,
  addPage,
  deletePage,
  updatePage,
  getWebsiteAnalytics,
  exportWebsite,
  deleteWebsite,
} from './websites.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/business/:businessId', asyncHandler(listWebsitesForBusiness));
router.post('/', validate(createWebsiteSchema), asyncHandler(createWebsiteFromTemplate));
router.post('/blank', validate(createBlankWebsiteSchema), asyncHandler(createBlankWebsite));
router.get('/:id', asyncHandler(getWebsite));
router.get('/:id/structure', asyncHandler(getWebsiteStructure));
router.put('/:id/structure', validate(updateWebsiteStructureSchema), asyncHandler(updateWebsiteStructure));
router.get('/:id/builder', asyncHandler(getWebsiteBuilder));
router.put('/:id/builder', validate(updateWebsiteBuilderSchema), asyncHandler(updateWebsiteBuilder));
router.put('/:id/seo', validate(updateWebsiteSeoSchema), asyncHandler(updateWebsiteSeo));
router.put('/:id/settings', validate(updateWebsiteSettingsSchema), asyncHandler(updateWebsiteSettings));
router.post('/:id/publish', asyncHandler(publishWebsite));
router.post('/:id/unpublish', asyncHandler(unpublishWebsite));
router.get('/:id/versions', asyncHandler(listWebsiteVersions));
router.post('/:id/versions/:versionId/restore', asyncHandler(restoreWebsiteVersion));
router.get('/check-slug/:slug', asyncHandler(checkSlugAvailability));
router.put('/:id/slug', validate(updateWebsiteSlugSchema), asyncHandler(updateWebsiteSlug));
router.post('/:id/pages', validate(addPageSchema), asyncHandler(addPage));
router.put('/:id/pages/:pageId', validate(updatePageSchema), asyncHandler(updatePage));
router.delete('/:id/pages/:pageId', asyncHandler(deletePage));
router.get('/:id/analytics', asyncHandler(getWebsiteAnalytics));
router.get('/:id/export', asyncHandler(exportWebsite));
router.delete('/:id', asyncHandler(deleteWebsite));

export default router;
