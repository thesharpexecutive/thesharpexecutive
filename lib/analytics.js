// Google Analytics 4 implementation
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize GA4
export const initGA = () => {
  if (typeof window !== 'undefined' && !window.gtag) {
    // Don't load GA when in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Google Analytics disabled in development');
      return;
    }
    
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics ID not found');
      return;
    }
  }
};

// Log page views
export const logPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Log events
export const logEvent = (action, params) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};
