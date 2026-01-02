import { businessesService } from './businesses.service.js';

export async function listBusinesses(req, res) {
  const businesses = await businessesService.listBusinesses({ userId: req.auth.userId });
  res.json({ businesses });
}

export async function createBusiness(req, res) {
  const { name, industry } = req.validated.body;
  const business = await businessesService.createBusiness({
    userId: req.auth.userId,
    name,
    industry: industry ?? null,
  });
  res.status(201).json({ business });
}
