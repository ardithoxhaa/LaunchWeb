// Performance monitoring utility
export class PerformanceMonitor {
  static trackPageLoad(pageName) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`📊 ${pageName} loaded in ${loadTime}ms`);
    
    // Send to analytics in production
    if (import.meta.env.PROD) {
      // gtag('event', 'page_load_time', { page_name: pageName, load_time: loadTime });
    }
  }

  static trackAPIResponse(endpoint, duration, status) {
    console.log(`⚡ ${endpoint} - ${duration}ms (${status})`);
    
    if (duration > 2000) {
      console.warn(`🐌 Slow API: ${endpoint} took ${duration}ms`);
    }
  }

  static trackUserAction(action) {
    console.log(`👤 User action: ${action}`);
  }
}

// Track page loads automatically
document.addEventListener('DOMContentLoaded', () => {
  const pageName = window.location.pathname;
  PerformanceMonitor.trackPageLoad(pageName);
});
