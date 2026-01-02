import { pool } from '../../config/db.js';
import { notFound } from '../../utils/httpError.js';

export const templatesService = {
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
};
