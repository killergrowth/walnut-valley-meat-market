import { useEffect } from 'react';

const APP_ID = '698b6dbe800d8d5b491da8d8';
const MONITOR_BASE_URL = 'https://your-monitor-app-domain.base44.app';

export default function PerformanceMonitor() {
  useEffect(() => {
    const page = window.location.pathname;
    const userAgent = navigator.userAgent;
    const sessionStart = Date.now();
    const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

    // Track page load performance
    const trackPageLoad = () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        if (loadTime > 0) {
          fetch(`${MONITOR_BASE_URL}/functions/trackMetric`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              app_id: APP_ID,
              metric_type: 'page_load',
              value: loadTime,
              details: { page, user_agent: userAgent }
            })
          }).catch(err => console.error('Failed to log page load:', err));
        }
      }
    };

    // Track INP (Interaction to Next Paint)
    const trackINP = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.interactionId) {
                fetch(`${MONITOR_BASE_URL}/functions/trackMetric`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    app_id: APP_ID,
                    metric_type: 'inp',
                    value: entry.duration,
                    details: { page, user_agent: userAgent }
                  })
                }).catch(err => console.error('Failed to log INP:', err));
              }
            }
          });
          observer.observe({ type: 'event', buffered: true, durationThreshold: 0 });
          return observer;
        } catch (err) {
          console.error('Failed to set up INP observer:', err);
        }
      }
      return null;
    };

    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      [25, 50, 75, 100].forEach(milestone => {
        if (scrollPercent >= milestone && !scrollMilestones[milestone]) {
          scrollMilestones[milestone] = true;
          fetch(`${MONITOR_BASE_URL}/functions/trackEvent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              app_id: APP_ID,
              event_name: 'scroll_depth',
              event_type: 'engagement',
              element_id: page,
              metadata: { depth: milestone, user_agent: userAgent }
            })
          }).catch(err => console.error('Failed to log scroll depth:', err));
        }
      });
    };

    // Track session duration
    const trackSessionDuration = () => {
      const duration = Date.now() - sessionStart;
      fetch(`${MONITOR_BASE_URL}/functions/trackEvent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: APP_ID,
          event_name: 'session_duration',
          event_type: 'engagement',
          element_id: page,
          metadata: { duration_ms: duration, user_agent: userAgent }
        })
      }).catch(err => console.error('Failed to log session duration:', err));
    };

    // Track errors
    const trackError = (event) => {
      fetch(`${MONITOR_BASE_URL}/functions/trackMetric`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: APP_ID,
          metric_type: 'error',
          value: 1,
          details: {
            page,
            error_message: event.message || 'Unknown error',
            stack_trace: event.error?.stack || '',
            user_agent: userAgent
          }
        })
      }).catch(err => console.error('Failed to log error:', err));
    };

    // Wait for page load to complete
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    // Set up INP tracking
    const inpObserver = trackINP();

    // Listen for errors
    window.addEventListener('error', trackError);

    // Track scroll depth
    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Track session duration on visibility change and beforeunload
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackSessionDuration();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', trackSessionDuration);

    return () => {
      window.removeEventListener('load', trackPageLoad);
      window.removeEventListener('error', trackError);
      window.removeEventListener('scroll', trackScrollDepth);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', trackSessionDuration);
      if (inpObserver) {
        inpObserver.disconnect();
      }
    };
  }, []);

  return null;
}

// Helper function to track custom events
export const trackCustomEvent = async (eventName, eventType, properties = {}) => {
  try {
    await fetch(`${MONITOR_BASE_URL}/functions/trackEvent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: APP_ID,
        event_name: eventName,
        event_type: eventType,
        element_id: window.location.pathname,
        metadata: { ...properties, user_agent: navigator.userAgent }
      })
    });
  } catch (err) {
    console.error('Failed to track custom event:', err);
  }
};