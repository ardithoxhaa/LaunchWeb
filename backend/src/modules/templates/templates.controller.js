import { templatesService } from './templates.service.js';

export async function listTemplates(req, res) {
  const templates = await templatesService.listTemplates();
  res.json({ templates });
}

export async function getTemplate(req, res) {
  const id = Number(req.params.id);
  const template = await templatesService.getTemplateById(id);
  res.json({ template });
}
