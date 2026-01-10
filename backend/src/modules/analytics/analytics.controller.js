import { analyticsService } from './analytics.service.js';

export async function trackPageView(req, res) {
  try {
    const { websiteId, pagePath } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referrer');

    await analyticsService.trackPageView({
      websiteId,
      pagePath: pagePath || '/',
      ipAddress,
      userAgent,
      referrer,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ error: 'Failed to track page view' });
  }
}

export async function getWebsiteAnalytics(req, res) {
  try {
    const { websiteId } = req.params;
    const { days = 30 } = req.query;

    const analytics = await analyticsService.getWebsiteAnalytics(websiteId, parseInt(days));
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching website analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
