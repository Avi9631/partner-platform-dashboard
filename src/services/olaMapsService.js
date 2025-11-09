/**
 * Ola Maps Service
 * Provides integration with Ola Maps API for geocoding, search, and map functionalities
 */

// Ola Maps API Configuration
const OLA_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_OLA_MAPS_API_KEY || '',
  baseUrl: 'https://api.olamaps.io/places/v1',
  geocodeUrl: 'https://api.olamaps.io/places/v1/geocode',
  reverseGeocodeUrl: 'https://api.olamaps.io/places/v1/reverse-geocode',
  autocompleteUrl: 'https://api.olamaps.io/places/v1/autocomplete',
};

/**
 * Search for places using Ola Maps Autocomplete API
 * @param {string} query - Search query string
 * @param {Object} options - Additional search options
 * @returns {Promise<Array>} Array of place suggestions
 */
export const searchPlaces = async (query, options = {}) => {
  try {
    if (!query || query.length < 3) {
      return [];
    }

    const params = new URLSearchParams({
      input: query,
      api_key: OLA_MAPS_CONFIG.apiKey,
      ...options,
    });

    const response = await fetch(`${OLA_MAPS_CONFIG.autocompleteUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

/**
 * Get place details by place_id
 * @param {string} placeId - Ola Maps place ID
 * @returns {Promise<Object>} Place details with coordinates
 */
export const getPlaceDetails = async (placeId) => {
  try {
    const params = new URLSearchParams({
      place_id: placeId,
      api_key: OLA_MAPS_CONFIG.apiKey,
    });

    const response = await fetch(`${OLA_MAPS_CONFIG.baseUrl}/details?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Get place details failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Ola Maps API returns data in 'result' field
    const result = data.result || data;
    
    // Normalize the response to ensure consistent structure
    if (result) {
      return {
        formatted_address: result.formatted_address || result.name || '',
        address_components: result.address_components || [],
        geometry: {
          location: {
            lat: result.geometry?.location?.lat || result.lat,
            lng: result.geometry?.location?.lng || result.lng,
          }
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
};

/**
 * Geocode an address to coordinates
 * @param {string} address - Address string to geocode
 * @returns {Promise<Object>} Coordinates and formatted address
 */
export const geocodeAddress = async (address) => {
  try {
    const params = new URLSearchParams({
      address: address,
      api_key: OLA_MAPS_CONFIG.apiKey,
    });

    const response = await fetch(`${OLA_MAPS_CONFIG.geocodeUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address details
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const params = new URLSearchParams({
      latlng: `${lat},${lng}`,
      api_key: OLA_MAPS_CONFIG.apiKey,
    });

    const response = await fetch(`${OLA_MAPS_CONFIG.reverseGeocodeUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
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
  config: OLA_MAPS_CONFIG,
};
