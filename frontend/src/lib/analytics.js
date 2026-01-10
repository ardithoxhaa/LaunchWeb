// Simple analytics tracker for websites
class WebsiteAnalytics {
  constructor(websiteId) {
    this.websiteId = websiteId;
    this.tracked = false;
  }

  trackPageView(pagePath = '/') {
    if (this.tracked) return; // Only track once per page load
    
    try {
      // Get API base URL from environment or use current origin
      const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 
                       (window.location.origin === 'http://localhost:5173' ? 'http://localhost:5000' : window.location.origin);

      fetch(`${apiBaseUrl}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: this.websiteId,
          pagePath: pagePath,
        }),
      }).catch(err => {
        // Silently fail - don't break the website if analytics fails
        console.debug('Analytics tracking failed:', err);
      });

      this.tracked = true;
    } catch (error) {
      console.debug('Analytics tracking error:', error);
    }
  }
}

// Export for use in website renderer
export { WebsiteAnalytics };
