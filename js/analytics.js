/**
 * ScoreHigh Analytics Wrapper
 * This script provides helper functions to track custom events 
 * like downloads and AI study plan generation.
 */

const ScoreHighAnalytics = {
  /**
   * Track a generic event
   * @param {string} eventName 
   * @param {object} props 
   */
  trackEvent: (eventName, props = {}) => {
    console.log(`[Analytics] Event: ${eventName}`, props);
    
    // If Vercel Analytics is installed, this will push to their dashboard
    if (window.va) {
      window.va('event', { name: eventName, data: props });
    }
    
    // If Google Analytics is installed, we can also push there
    if (window.gtag) {
      window.gtag('event', eventName, props);
    }
  },

  /**
   * Specifically track resource downloads
   * @param {string} resourceName 
   */
  trackDownload: (resourceName) => {
    ScoreHighAnalytics.trackEvent('resource_download', { resource: resourceName });
  },

  /**
   * Track successful study plan generation
   * @param {string} level 
   * @param {number} weeks 
   */
  trackPlanGenerated: (level, weeks) => {
    ScoreHighAnalytics.trackEvent('ai_plan_generated', { 
      student_level: level, 
      plan_duration_weeks: weeks 
    });
  }
};

// Auto-bind to all download buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a.btn').forEach(btn => {
    if (btn.innerText.toLowerCase().includes('download')) {
      btn.addEventListener('click', (e) => {
        const cardHeader = btn.closest('.card')?.querySelector('h3')?.innerText || 'Unknown Resource';
        ScoreHighAnalytics.trackDownload(cardHeader);
      });
    }
  });
});

window.ScoreHighAnalytics = ScoreHighAnalytics;
