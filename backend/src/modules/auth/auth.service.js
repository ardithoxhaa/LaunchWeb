import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { nanoid } from 'nanoid';

import { pool } from '../../config/db.js';
import { env } from '../../config/env.js';
import { badRequest, unauthorized } from '../../utils/httpError.js';

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

function signRefreshToken(payload) {
  return jwt.sign({ ...payload, jti: nanoid() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

function setRefreshCookie(res, token) {
  const isProd = env.NODE_ENV === 'production';
  res.cookie(env.REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  const isProd = env.NODE_ENV === 'production';
  res.clearCookie(env.REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  });
}

async function getRoleIdByName(name) {
  const [rows] = await pool.query('SELECT id FROM roles WHERE name = :name', {
    name,
  });
  return rows?.[0]?.id ?? null;
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT u.id, u.email, u.name, u.password_hash, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.email = :email',
    { email }
  );
  return rows?.[0] ?? null;
}

async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT u.id, u.email, u.name, u.password_hash, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = :id',
    { id }
  );
  return rows?.[0] ?? null;
}

async function revokeAllRefreshTokensForUser(userId) {
  await pool.query(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = :userId AND revoked_at IS NULL',
    { userId }
  );
}

async function insertRefreshToken({ userId, token, expiresAt }) {
  const tokenHash = sha256(token);
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (:userId, :tokenHash, :expiresAt)',
    { userId, tokenHash, expiresAt }
  );
}

async function revokeRefreshTokenByHash(tokenHash) {
  await pool.query(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = :tokenHash AND revoked_at IS NULL',
    { tokenHash }
  );
}

async function findActiveRefreshToken(tokenHash) {
  const [rows] = await pool.query(
    'SELECT id, user_id, expires_at, revoked_at FROM refresh_tokens WHERE token_hash = :tokenHash',
    { tokenHash }
  );
  const token = rows?.[0];
  if (!token) return null;
  if (token.revoked_at) return null;
  if (new Date(token.expires_at).getTime() <= Date.now()) return null;
  return token;
}

export const authService = {
  async me({ userId }) {
    const user = await getUserById(userId);
    if (!user) throw unauthorized('User not found');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },

  async register({ email, password, name }) {
    const existing = await getUserByEmail(email);
    if (existing) throw badRequest('Email already in use');

    const userRoleId = await getRoleIdByName('USER');
    if (!userRoleId) throw new Error('Missing roles seed (USER)');

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      'INSERT INTO users (role_id, email, name, password_hash) VALUES (:roleId, :email, :name, :passwordHash)',
      { roleId: userRoleId, email, name, passwordHash }
    );

    return {
      user: {
        id: result.insertId,
        email,
        name,
        role: 'USER',
      },
    };
  },

  async login({ email, password, res }) {
    const user = await getUserByEmail(email);
    if (!user) throw unauthorized('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw unauthorized('Invalid credentials');

    const accessToken = signAccessToken({
      sub: String(user.id),
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      sub: String(user.id),
      role: user.role,
    });

    const decoded = jwt.decode(refreshToken);
    await insertRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(decoded.exp * 1000),
    });

    setRefreshCookie(res, refreshToken);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  async refresh({ req, res }) {
    const token = req.cookies?.[env.REFRESH_COOKIE_NAME];
    if (!token) throw unauthorized('Missing refresh token');

    let payload;
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch {
      throw unauthorized('Invalid refresh token');
    }

    const tokenHash = sha256(token);
    const active = await findActiveRefreshToken(tokenHash);
    if (!active) throw unauthorized('Refresh token revoked');

    await revokeRefreshTokenByHash(tokenHash);

    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
    const nextRefresh = signRefreshToken({ sub: payload.sub, role: payload.role });

    const user = await getUserById(Number(payload.sub));
    if (!user) throw unauthorized('User not found');

    const decoded = jwt.decode(nextRefresh);
    await insertRefreshToken({
      userId: Number(payload.sub),
      token: nextRefresh,
      expiresAt: new Date(decoded.exp * 1000),
    });

    setRefreshCookie(res, nextRefresh);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  async logout({ req, res }) {
    const token = req.cookies?.[env.REFRESH_COOKIE_NAME];
    if (token) {
      await revokeRefreshTokenByHash(sha256(token));
    }
    clearRefreshCookie(res);
  },

  async updateProfile({ userId, email, name }) {
    const user = await getUserById(userId);
    if (!user) throw unauthorized('User not found');

    if (email !== undefined) {
      const existing = await getUserByEmail(email);
      if (existing && Number(existing.id) !== Number(userId)) {
        throw badRequest('Email already in use');
      }
    }

    const updates = [];
    const params = { id: userId };
    if (email !== undefined) {
      updates.push('email = :email');
      params.email = email;
    }
    if (name !== undefined) {
      updates.push('name = :name');
      params.name = name;
    }

    if (!updates.length) throw badRequest('No fields to update');
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = :id`, params);

    const updated = await getUserById(userId);
    return {
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
      },
    };
  },

  async changePassword({ userId, currentPassword, newPassword }) {
    const user = await getUserById(userId);
    if (!user) throw unauthorized('User not found');

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) throw unauthorized('Invalid current password');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = :passwordHash WHERE id = :id', {
      passwordHash,
      id: userId,
    });

    await revokeAllRefreshTokensForUser(userId);

    return { ok: true };
  },

  async logoutAll({ userId, res }) {
    await revokeAllRefreshTokensForUser(userId);
    clearRefreshCookie(res);
    return { ok: true };
  },
};
