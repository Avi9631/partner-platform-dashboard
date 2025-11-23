/**
 * Google Maps Service
 * Provides integration with Google Maps API for geocoding, search, and map functionalities
 * Uses Google Places API, Geocoding API, and Maps JavaScript API
 */

// Google Maps API Configuration
const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  placesApiUrl: 'https://maps.googleapis.com/maps/api/place',
  geocodingApiUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
  libraries: ['places', 'geometry'],
};

/**
 * Load Google Maps JavaScript API
 * @returns {Promise<void>}
 */
export const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve(window.google);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', reject);
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Set up callback
    window.initGoogleMaps = () => {
      resolve(window.google);
    };

    script.addEventListener('error', () => {
      reject(new Error('Failed to load Google Maps API'));
    });

    document.head.appendChild(script);
  });
};

/**
 * Search for places using Google Places Autocomplete API
 * @param {string} query - Search query string
 * @param {Object} options - Additional search options
 * @returns {Promise<Array>} Array of place predictions
 */
export const searchPlaces = async (query, options = {}) => {
  try {
    if (!query || query.length < 3) {
      return [];
    }

    // Ensure Google Maps is loaded
    await loadGoogleMapsAPI();

    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.AutocompleteService();
      
      const request = {
        input: query,
        ...options,
      };

      service.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(predictions || []);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

/**
 * Get place details by place_id
 * @param {string} placeId - Google Maps place ID
 * @returns {Promise<Object>} Place details with coordinates
 */
export const getPlaceDetails = async (placeId) => {
  try {
    // Ensure Google Maps is loaded
    await loadGoogleMapsAPI();

    return new Promise((resolve, reject) => {
      // Create a temporary div for the PlacesService
      const tempDiv = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(tempDiv);

      const request = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'geometry', 'address_components', 'place_id'],
      };

      service.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(new Error(`Get place details failed: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
};

/**
 * Geocode an address to coordinates using Google Geocoding API
 * @param {string} address - Address string to geocode
 * @returns {Promise<Object>} Coordinates and formatted address
 */
export const geocodeAddress = async (address) => {
  try {
    const params = new URLSearchParams({
      address: address,
      key: GOOGLE_MAPS_CONFIG.apiKey,
    });

    const response = await fetch(`${GOOGLE_MAPS_CONFIG.geocodingApiUrl}?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        addressComponents: result.address_components,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to address using Google Geocoding API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address details
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const params = new URLSearchParams({
      latlng: `${lat},${lng}`,
      key: GOOGLE_MAPS_CONFIG.apiKey,
    });

    const response = await fetch(`${GOOGLE_MAPS_CONFIG.geocodingApiUrl}?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        formattedAddress: result.formatted_address,
        addressComponents: result.address_components,
        placeId: result.place_id,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

/**
 * Extract city from address components
 * @param {Array} addressComponents - Address components from geocoding result
 * @returns {string} City name
 */
export const extractCityFromComponents = (addressComponents) => {
  if (!addressComponents) return '';
  
  const cityComponent = addressComponents.find(
    (component) =>
      component.types.includes('locality') ||
      component.types.includes('administrative_area_level_2')
  );
  
  return cityComponent ? cityComponent.long_name : '';
};

/**
 * Extract locality from address components
 * @param {Array} addressComponents - Address components from geocoding result
 * @returns {string} Locality name
 */
export const extractLocalityFromComponents = (addressComponents) => {
  if (!addressComponents) return '';
  
  const localityComponent = addressComponents.find(
    (component) =>
      component.types.includes('sublocality') ||
      component.types.includes('sublocality_level_1') ||
      component.types.includes('neighborhood')
  );
  
  return localityComponent ? localityComponent.long_name : '';
};

/**
 * Get current user location
 * @returns {Promise<Object>} Current coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export default {
  searchPlaces,
  getPlaceDetails,
  geocodeAddress,
  reverseGeocode,
  extractCityFromComponents,
  extractLocalityFromComponents,
  getCurrentLocation,
  loadGoogleMapsAPI,
  config: GOOGLE_MAPS_CONFIG,
};
