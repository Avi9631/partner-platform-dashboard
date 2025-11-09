/**
 * Ola Maps SDK Loader
 * Ensures Ola Maps SDK is loaded only once and provides loading state
 * Uses the official Ola Maps Web SDK from CDN
 */

let isLoading = false;
let isLoaded = false;
let loadError = null;
const listeners = [];

/**
 * Load Ola Maps SDK
 * @returns {Promise<void>}
 */
export const loadOlaMapsSDK = () => {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (isLoaded && window.OlaMaps) {
      resolve();
      return;
    }

    // Already errored
    if (loadError) {
      reject(loadError);
      return;
    }

    // Add to listeners queue
    listeners.push({ resolve, reject });

    // Already loading
    if (isLoading) {
      return;
    }

    isLoading = true;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="olamaps-web-sdk"]');
    if (existingScript) {
      if (window.OlaMaps) {
        isLoaded = true;
        isLoading = false;
        listeners.forEach(listener => listener.resolve());
        listeners.length = 0;
        return;
      }
    }

    // Verify API key exists
    const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
    if (!apiKey) {
      const error = new Error('Ola Maps API key not found. Please add VITE_OLA_MAPS_API_KEY to your .env file');
      loadError = error;
      isLoading = false;
      listeners.forEach(listener => listener.reject(error));
      listeners.length = 0;
      return;
    }

    // Load the official Ola Maps Web SDK from CDN
    const script = document.createElement('script');
    script.src = 'https://www.unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js';
    script.async = true;

    script.onload = () => {
      // Wait a bit for OlaMaps to be available on window
      setTimeout(() => {
        console.log('Ola Maps SDK script loaded. Checking window object:', {
          hasOlaMaps: !!window.OlaMaps,
          hasOlaMapsSDK: !!window.OlaMapsSDK,
          windowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('ola'))
        });
        
        if (window.OlaMaps || window.OlaMapsSDK) {
          isLoaded = true;
          isLoading = false;
          listeners.forEach(listener => listener.resolve());
          listeners.length = 0;
        } else {
          const error = new Error('OlaMaps SDK loaded but OlaMaps object not available');
          loadError = error;
          isLoading = false;
          listeners.forEach(listener => listener.reject(error));
          listeners.length = 0;
        }
      }, 100);
    };

    script.onerror = () => {
      const error = new Error('Failed to load Ola Maps SDK from CDN');
      loadError = error;
      isLoading = false;
      listeners.forEach(listener => listener.reject(error));
      listeners.length = 0;
    };

    document.head.appendChild(script);
  });
};

/**
 * Check if SDK is loaded
 * @returns {boolean}
 */
export const isOlaMapsLoaded = () => {
  return isLoaded && window.OlaMaps;
};

/**
 * Get loading state
 * @returns {boolean}
 */
export const isOlaMapsLoading = () => {
  return isLoading;
};

/**
 * Reset state (for testing)
 */
export const resetOlaMapsLoader = () => {
  isLoading = false;
  isLoaded = false;
  loadError = null;
  listeners.length = 0;
};
