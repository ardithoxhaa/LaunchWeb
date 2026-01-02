import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { forbidden, unauthorized } from '../utils/httpError.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(unauthorized());

  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.auth = {
      userId: Number(payload.sub),
      role: payload.role,
    };
    next();
  } catch {
    next(unauthorized());
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth?.role) return next(unauthorized());
    if (!roles.includes(req.auth.role)) return next(forbidden());
    next();
  };
}
