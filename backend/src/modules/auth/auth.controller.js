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

export async function updateProfile(req, res) {
  const { email, name } = req.validated.body;
  const result = await authService.updateProfile({ userId: req.auth.userId, email, name });
  res.json(result);
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.validated.body;
  const result = await authService.changePassword({
    userId: req.auth.userId,
    currentPassword,
    newPassword,
  });
  res.json(result);
}

export async function logoutAll(req, res) {
  const result = await authService.logoutAll({ userId: req.auth.userId, res });
  res.json(result);
}
