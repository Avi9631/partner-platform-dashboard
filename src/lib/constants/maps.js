/**
 * Map Constants
 * Centralized configuration and magic numbers for map functionality
 * Updated for Google Maps integration
 */

// Default Map Settings
export const MAP_DEFAULTS = {
  CENTER: {
    lat: 28.6139,
    lng: 77.2090, // Delhi, India
  },
  ZOOM: 15,
  MIN_ZOOM: 3,
  MAX_ZOOM: 20,
  HEIGHT: '400px',
};

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 3,
  DEBOUNCE_DELAY: 300,
  MAX_SUGGESTIONS: 10,
};

// Geolocation Options
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

// Google Maps Libraries
export const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry'];

// Map Styles for Google Maps
export const MAP_STYLES = {
  // Hide some POI categories for cleaner look
  DEFAULT_STYLE: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
  ],
  
  // Custom styles can be added here
  MINIMAL_STYLE: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

// Marker Configuration
export const MARKER_CONFIG = {
  DEFAULT_ICON: {
    width: 32,
    height: 32,
    color: '#ea580c', // orange-600
    strokeColor: '#fff',
    strokeWidth: 2,
    scale: 8,
  },
  MULTIPLE_MARKERS_ICON: {
    width: 24,
    height: 24,
    color: '#ea580c', // orange-600
    strokeColor: '#fff',
    strokeWidth: 2,
    scale: 6,
  },
};

// API Error Messages
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file',
  SDK_LOAD_FAILED: 'Failed to load Google Maps API from CDN',
  SDK_NOT_AVAILABLE: 'Google Maps API loaded but google object not available',
  MAP_INIT_FAILED: 'Failed to initialize Google Maps',
  GEOLOCATION_NOT_SUPPORTED: 'Geolocation is not supported by your browser',
  GEOLOCATION_FAILED: 'Unable to get your current location. Please check your browser settings.',
  SEARCH_FAILED: 'Search failed. Please try again.',
  GEOCODE_FAILED: 'Failed to get coordinates for the location',
  REVERSE_GEOCODE_FAILED: 'Failed to get address for the coordinates',
  PLACES_API_ERROR: 'Google Places API error occurred',
  BILLING_NOT_ENABLED: 'Google Cloud billing not enabled for this project',
  API_RESTRICTIONS: 'API key restrictions prevent access from this domain',
};

// Address Component Types
export const ADDRESS_TYPES = {
  LOCALITY: 'locality',
  SUBLOCALITY: 'sublocality',
  SUBLOCALITY_LEVEL_1: 'sublocality_level_1',
  NEIGHBORHOOD: 'neighborhood',
  ADMIN_AREA_LEVEL_1: 'administrative_area_level_1',
  ADMIN_AREA_LEVEL_2: 'administrative_area_level_2',
  COUNTRY: 'country',
  POSTAL_CODE: 'postal_code',
};

// Map Events
export const MAP_EVENTS = {
  LOAD: 'load',
  ERROR: 'error',
  CLICK: 'click',
  DRAG_END: 'dragend',
  ZOOM_END: 'zoomend',
  MOVE_END: 'moveend',
};
