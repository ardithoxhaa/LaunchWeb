import { adminService } from './admin.service.js';
import { badRequest } from '../../utils/httpError.js';

export async function overview(req, res) {
  const data = await adminService.overview();
  res.json(data);
}

export async function listUsers(req, res) {
  const users = await adminService.listUsers();
  res.json({ users });
}

export async function listBusinesses(req, res) {
  const businesses = await adminService.listBusinesses();
  res.json({ businesses });
}

export async function listWebsites(req, res) {
  const websites = await adminService.listWebsites();
  res.json({ websites });
}

export async function listTemplates(req, res) {
  const templates = await adminService.listTemplates();
  res.json({ templates });
}

export async function createTemplate(req, res) {
  const { name, category, previewImageUrl, structure } = req.validated.body;
  const template = await adminService.createTemplate({ name, category, previewImageUrl, structure });
  res.status(201).json({ template });
}

export async function getTemplate(req, res) {
  const id = req.validated.params.id;
  const template = await adminService.getTemplateById(id);
  res.json({ template });
}

export async function updateTemplate(req, res) {
  const id = req.validated.params.id;
  const { name, category, previewImageUrl, structure } = req.validated.body;
  const template = await adminService.updateTemplate(id, { name, category, previewImageUrl, structure });
  res.json({ template });
}

export async function updateUserRole(req, res) {
  const targetUserId = req.validated.params.id;
  const { role } = req.validated.body;
  if (Number(targetUserId) === Number(req.auth.userId)) {
    throw badRequest('You cannot change your own role.');
  }
  const user = await adminService.updateUserRole(targetUserId, role);
  res.json({ user });
}

export async function updateUser(req, res) {
  const id = req.validated.params.id;
  const { email, name } = req.validated.body;
  const user = await adminService.updateUser(id, { email, name });
  res.json({ user });
}

export async function deleteUser(req, res) {
  const id = req.validated.params.id;
  if (Number(id) === Number(req.auth.userId)) {
    throw badRequest('You cannot delete your own user.');
  }
  await adminService.deleteUser(id);
  res.status(204).send();
}

export async function updateBusiness(req, res) {
  const id = req.validated.params.id;
  const { name, industry } = req.validated.body;
  const business = await adminService.updateBusiness(id, { name, industry });
  res.json({ business });
}

export async function deleteBusiness(req, res) {
  const id = req.validated.params.id;
  await adminService.deleteBusiness(id);
  res.status(204).send();
}

export async function updateWebsite(req, res) {
  const id = req.validated.params.id;
  const { name, slug, status } = req.validated.body;
  const website = await adminService.updateWebsite(id, { name, slug, status });
  res.json({ website });
}

export async function deleteWebsite(req, res) {
  const id = req.validated.params.id;
  await adminService.deleteWebsite(id);
  res.status(204).send();
}

export async function deleteTemplate(req, res) {
  const id = req.validated.params.id;
  await adminService.deleteTemplate(id);
  res.status(204).send();
}
