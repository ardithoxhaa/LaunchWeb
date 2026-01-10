import { pool } from '../../config/db.js';

export const analyticsService = {
  async trackPageView({ websiteId, pagePath, ipAddress, userAgent, referrer }) {
    const [result] = await pool.query(
      `INSERT INTO website_analytics (website_id, page_path, ip_address, user_agent, referrer) 
       VALUES (:websiteId, :pagePath, :ipAddress, :userAgent, :referrer)`,
      {
        websiteId,
        pagePath,
        ipAddress,
        userAgent,
        referrer,
      }
    );
    return result.insertId;
  },

  async getWebsiteAnalytics(websiteId, days = 30) {
    // Page views over time
    const [viewsOverTime] = await pool.query(
      `SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS views,
        COUNT(DISTINCT ip_address) AS uniqueVisitors
       FROM website_analytics 
       WHERE website_id = :websiteId 
         AND created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT :days`,
      { websiteId, days }
    );

    // Most viewed pages
    const [pageViews] = await pool.query(
      `SELECT 
        page_path,
        COUNT(*) AS views,
        COUNT(DISTINCT ip_address) AS uniqueVisitors
       FROM website_analytics 
       WHERE website_id = :websiteId 
         AND created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
       GROUP BY page_path
       ORDER BY views DESC
       LIMIT 10`,
      { websiteId, days }
    );

    // Referrers
    const [referrers] = await pool.query(
      `SELECT 
        referrer,
        COUNT(*) AS views
       FROM website_analytics 
       WHERE website_id = :websiteId 
         AND referrer IS NOT NULL 
         AND referrer != ''
         AND created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
       GROUP BY referrer
       ORDER BY views DESC
       LIMIT 10`,
      { websiteId, days }
    );

    // Total stats
    const [totalStats] = await pool.query(
      `SELECT 
        COUNT(*) AS totalViews,
        COUNT(DISTINCT ip_address) AS uniqueVisitors,
        COUNT(DISTINCT DATE(created_at)) AS activeDays
       FROM website_analytics 
       WHERE website_id = :websiteId 
         AND created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)`,
      { websiteId, days }
    );

    return {
      viewsOverTime: viewsOverTime.reverse(), // Return in chronological order
      pageViews,
      referrers,
      totalStats: totalStats[0] || { totalViews: 0, uniqueVisitors: 0, activeDays: 0 },
    };
  },
};
