import { authService } from './auth.service.js';

export async function register(req, res) {
  const { email, password, name } = req.validated.body;
  const result = await authService.register({ email, password, name });
  res.status(201).json(result);
}

export async function login(req, res) {
  const { email, password } = req.validated.body;
  const result = await authService.login({ email, password, res });
  res.json(result);
}

export async function refresh(req, res) {
  const result = await authService.refresh({ req, res });
  res.json(result);
}

export async function logout(req, res) {
  await authService.logout({ req, res });
  res.status(204).send();
}

export async function me(req, res) {
  const user = await authService.me({ userId: req.auth.userId });
  res.json({ user });
}
