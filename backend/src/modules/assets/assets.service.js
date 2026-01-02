import fs from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';

import { pool } from '../../config/db.js';
import { forbidden, notFound } from '../../utils/httpError.js';

function parseJsonMaybe(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

async function assertWebsiteOwned({ conn, userId, websiteId }) {
  const [rows] = await conn.query(
    'SELECT w.id, b.user_id AS owner_user_id FROM websites w JOIN businesses b ON b.id = w.business_id WHERE w.id = :websiteId',
    { websiteId }
  );
  const website = rows?.[0];
  if (!website) throw notFound('Website not found');
  if (Number(website.owner_user_id) !== Number(userId)) throw forbidden();
  return website;
}

export const assetsService = {
  async listAssets({ userId, websiteId }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });

    const [rows] = await conn.query(
      'SELECT id, website_id, user_id, type, url, meta_json, created_at FROM assets WHERE website_id = :websiteId AND user_id = :userId ORDER BY created_at DESC',
      { websiteId, userId }
    );

    return rows.map((r) => ({
      id: r.id,
      websiteId: r.website_id,
      userId: r.user_id,
      type: r.type,
      url: r.url,
      meta: parseJsonMaybe(r.meta_json, {}),
      createdAt: r.created_at,
    }));
  },

  async createImageAsset({ userId, websiteId, originalName, mimeType, size, storedFilename }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });

    const url = `/uploads/${storedFilename}`;
    const meta = {
      originalName,
      mimeType,
      size,
    };

    const [result] = await conn.query(
      'INSERT INTO assets (website_id, user_id, type, url, meta_json) VALUES (:websiteId, :userId, :type, :url, :metaJson)',
      {
        websiteId,
        userId,
        type: 'IMAGE',
        url,
        metaJson: JSON.stringify(meta),
      }
    );

    return {
      id: result.insertId,
      websiteId,
      userId,
      type: 'IMAGE',
      url,
      meta,
    };
  },

  async ensureUploadsDir(uploadsDir) {
    await fs.mkdir(uploadsDir, { recursive: true });
  },

  makeStoredFilename(originalName) {
    const safeExt = path.extname(originalName || '').slice(0, 12);
    return `${Date.now()}_${nanoid(10)}${safeExt}`;
  },
};
