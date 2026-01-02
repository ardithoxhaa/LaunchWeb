import { websitesService } from './websites.service.js';

export async function listWebsitesForBusiness(req, res) {
  const businessId = Number(req.params.businessId);
  const websites = await websitesService.listWebsitesForBusiness({
    userId: req.auth.userId,
    businessId,
  });
  res.json({ websites });
}

export async function createWebsiteFromTemplate(req, res) {
  const { businessId, templateId, name, slug } = req.validated.body;
  const website = await websitesService.createWebsiteFromTemplate({
    userId: req.auth.userId,
    businessId,
    templateId,
    name,
    slug,
  });
  res.status(201).json({ website });
}

export async function getWebsite(req, res) {
  const id = Number(req.params.id);
  const website = await websitesService.getWebsite({ userId: req.auth.userId, websiteId: id });
  res.json({ website });
}

export async function getWebsiteStructure(req, res) {
  const id = Number(req.params.id);
  const structure = await websitesService.getWebsiteStructure({ userId: req.auth.userId, websiteId: id });
  res.json(structure);
}

export async function updateWebsiteStructure(req, res) {
  const id = Number(req.params.id);
  const { pages } = req.validated.body;
  const structure = await websitesService.replaceWebsiteStructure({
    userId: req.auth.userId,
    websiteId: id,
    pages,
  });
  res.json(structure);
}

export async function updateWebsiteSeo(req, res) {
  const id = Number(req.params.id);
  const { seo } = req.validated.body;
  const website = await websitesService.updateWebsiteSeo({ userId: req.auth.userId, websiteId: id, seo });
  res.json({ website });
}

export async function updateWebsiteSettings(req, res) {
  const id = Number(req.params.id);
  const { settings } = req.validated.body;
  const website = await websitesService.updateWebsiteSettings({
    userId: req.auth.userId,
    websiteId: id,
    settings,
  });
  res.json({ website });
}

export async function publishWebsite(req, res) {
  const id = Number(req.params.id);
  const website = await websitesService.publishWebsite({ userId: req.auth.userId, websiteId: id });
  res.json({ website });
}

export async function unpublishWebsite(req, res) {
  const id = Number(req.params.id);
  const website = await websitesService.unpublishWebsite({ userId: req.auth.userId, websiteId: id });
  res.json({ website });
}

export async function listWebsiteVersions(req, res) {
  const id = Number(req.params.id);
  const versions = await websitesService.listWebsiteVersions({ userId: req.auth.userId, websiteId: id });
  res.json({ versions });
}

export async function restoreWebsiteVersion(req, res) {
  const id = Number(req.params.id);
  const versionId = Number(req.params.versionId);
  const structure = await websitesService.restoreWebsiteVersion({
    userId: req.auth.userId,
    websiteId: id,
    versionId,
  });
  res.json(structure);
}
