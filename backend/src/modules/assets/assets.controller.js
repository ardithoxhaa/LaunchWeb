import { assetsService } from './assets.service.js';

export async function listAssets(req, res) {
  const websiteId = req.validated.query.websiteId;
  const assets = await assetsService.listAssets({ userId: req.auth.userId, websiteId });
  res.json({ assets });
}

export async function uploadImage(req, res) {
  const websiteId = req.validated.body.websiteId;
  const file = req.file;

  const asset = await assetsService.createImageAsset({
    userId: req.auth.userId,
    websiteId,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    storedFilename: file.filename,
  });

  res.status(201).json({ asset });
}
