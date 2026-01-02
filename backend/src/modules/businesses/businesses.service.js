import { pool } from '../../config/db.js';

export const businessesService = {
  async listBusinesses({ userId }) {
    const [rows] = await pool.query(
      'SELECT id, user_id, name, industry, created_at, updated_at FROM businesses WHERE user_id = :userId ORDER BY created_at DESC',
      { userId }
    );
    return rows;
  },

  async createBusiness({ userId, name, industry }) {
    const [result] = await pool.query(
      'INSERT INTO businesses (user_id, name, industry) VALUES (:userId, :name, :industry)',
      { userId, name, industry }
    );

    return {
      id: result.insertId,
      user_id: userId,
      name,
      industry,
    };
  },
};
