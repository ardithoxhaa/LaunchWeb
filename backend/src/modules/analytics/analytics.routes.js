import { Router } from 'express';
import { trackPageView, getWebsiteAnalytics } from './analytics.controller.js';

const router = Router();

// Track page view (public endpoint)
router.post('/track', trackPageView);

// Get website analytics (protected - website owner only)
router.get('/website/:websiteId', getWebsiteAnalytics);

export default router;
