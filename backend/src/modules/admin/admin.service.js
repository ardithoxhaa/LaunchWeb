import { pool } from '../../config/db.js';
import { notFound } from '../../utils/httpError.js';

async function count(table) {
  const [rows] = await pool.query(`SELECT COUNT(*) AS c FROM ${table}`);
  return Number(rows?.[0]?.c ?? 0);
}

export const adminService = {
  async overview() {
    const [users, businesses, websites, templates] = await Promise.all([
      count('users'),
      count('businesses'),
      count('websites'),
      count('templates'),
    ]);

    return {
      stats: {
        users,
        businesses,
        websites,
        templates,
      },
    };
  },

  async listUsers() {
    const [rows] = await pool.query(
      'SELECT u.id, u.email, u.name, r.name AS role, u.created_at, u.updated_at FROM users u JOIN roles r ON r.id = u.role_id ORDER BY u.created_at DESC'
    );
    return rows;
  },

  async listBusinesses() {
    const [rows] = await pool.query(
      'SELECT b.id, b.user_id, b.name, b.industry, b.created_at, b.updated_at, u.email AS owner_email FROM businesses b JOIN users u ON u.id = b.user_id ORDER BY b.created_at DESC'
    );
    return rows;
  },

  async listWebsites() {
    const [rows] = await pool.query(
      'SELECT w.id, w.business_id, w.template_id, w.name, w.slug, w.status, w.created_at, w.updated_at, w.published_at, b.user_id AS owner_user_id FROM websites w JOIN businesses b ON b.id = w.business_id ORDER BY w.created_at DESC'
    );
    return rows;
  },

  async listTemplates() {
    const [rows] = await pool.query(
      'SELECT id, name, category, preview_image_url, created_at, updated_at FROM templates ORDER BY created_at DESC'
    );
    return rows;
  },

  async getTemplateById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, category, preview_image_url, structure_json, created_at, updated_at FROM templates WHERE id = :id',
      { id }
    );
    const tpl = rows?.[0];
    if (!tpl) throw notFound('Template not found');
    return tpl;
  },

  async createTemplate({ name, category, previewImageUrl, structure }) {
    const [result] = await pool.query(
      'INSERT INTO templates (name, category, preview_image_url, structure_json) VALUES (:name, :category, :previewImageUrl, :structureJson)',
      {
        name,
        category,
        previewImageUrl: previewImageUrl ?? null,
        structureJson: JSON.stringify(structure),
      }
    );

    const [rows] = await pool.query(
      'SELECT id, name, category, preview_image_url, created_at, updated_at FROM templates WHERE id = :id',
      { id: result.insertId }
    );
    return rows?.[0] ?? null;
  },

  async updateTemplate(id, { name, category, previewImageUrl, structure }) {
    const updates = [];
    const params = { id };

    if (name !== undefined) {
      updates.push('name = :name');
      params.name = name;
    }
    if (category !== undefined) {
      updates.push('category = :category');
      params.category = category;
    }
    if (previewImageUrl !== undefined) {
      updates.push('preview_image_url = :previewImageUrl');
      params.previewImageUrl = previewImageUrl;
    }
    if (structure !== undefined) {
      updates.push('structure_json = :structureJson');
      params.structureJson = JSON.stringify(structure);
    }

    if (!updates.length) {
      return this.getTemplateById(id);
    }

    const [res] = await pool.query(`UPDATE templates SET ${updates.join(', ')} WHERE id = :id`, params);
    if (!res.affectedRows) throw notFound('Template not found');
    return this.getTemplateById(id);
  },
};
