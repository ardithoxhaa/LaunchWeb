import { publicService } from './public.service.js';

export async function getPublishedWebsiteStructureBySlug(req, res) {
  const { slug } = req.params;
  const structure = await publicService.getPublishedWebsiteStructureBySlug({ slug });
  res.json(structure);
}
