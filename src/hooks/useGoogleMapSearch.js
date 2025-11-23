/**
 * useGoogleMapSearch Hook
 * Custom hook for managing Google Maps search functionality with debouncing
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchPlaces, getPlaceDetails, geocodeAddress } from '@/services/googleMapsService';
import { SEARCH_CONFIG, ERROR_MESSAGES } from '@/lib/constants/maps';

/**
 * @typedef {Object} SearchState
 * @property {string} searchQuery - Current search query
 * @property {Array} suggestions - Array of search suggestions
 * @property {boolean} isLoading - Loading state
 * @property {boolean} showSuggestions - Whether to show suggestions dropdown
 * @property {number} selectedIndex - Currently selected suggestion index
 * @property {string|null} error - Error message if any
 */

/**
 * @typedef {Object} SearchHandlers
 * @property {(e: Event) => void} handleSearchChange - Handle search input change
 * @property {(place: Object) => Promise<void>} handlePlaceSelect - Handle place selection
 * @property {(e: KeyboardEvent) => void} handleKeyDown - Handle keyboard navigation
 * @property {() => void} handleClear - Clear search
 * @property {() => void} setShowSuggestions - Set suggestions visibility
 */

/**
 * Custom hook for Google Maps search functionality
 * @param {Object} options - Hook options
 * @param {(place: Object) => void} options.onPlaceSelect - Callback when place is selected
 * @param {string} options.initialValue - Initial search value
 * @returns {[SearchState, SearchHandlers]}
 */
export function useGoogleMapSearch({ onPlaceSelect, initialValue = '' } = {}) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);
  
  const debounceTimer = useRef(null);

  // Update search query when initialValue changes
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  // Debounced search function
  const performSearch = useCallback(async (query) => {
    if (!query || query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchPlaces(query);
      setSuggestions(results.slice(0, SEARCH_CONFIG.MAX_SUGGESTIONS));
      setShowSuggestions(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(ERROR_MESSAGES.SEARCH_FAILED);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);
    setError(null);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, SEARCH_CONFIG.DEBOUNCE_DELAY);
  }, [performSearch]);

  // Handle place selection
  const handlePlaceSelect = useCallback(async (place) => {
    setSearchQuery(place.description);
    setShowSuggestions(false);
    setSuggestions([]);
    setError(null);
    
    try {
      // Try to get place details first
      const placeDetails = await getPlaceDetails(place.place_id);
      
      let coordinates = null;
      let formattedAddress = place.description;
      let addressComponents = [];
      
      // Extract coordinates from place details
      if (placeDetails?.geometry?.location) {
        const loc = placeDetails.geometry.location;
        if (typeof loc.lat === 'function' && typeof loc.lng === 'function') {
          // Google Maps LatLng object with functions
          coordinates = { lat: loc.lat(), lng: loc.lng() };
        } else if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
          // Plain object with coordinates
          coordinates = { lat: loc.lat, lng: loc.lng };
        }
        
        if (coordinates) {
          formattedAddress = placeDetails.formatted_address || place.description;
          addressComponents = placeDetails.address_components || [];
        }
      }
      
      // If no coordinates from place details, try geocoding
      if (!coordinates) {
        const geocoded = await geocodeAddress(place.description);
        if (geocoded && typeof geocoded.lat === 'number' && typeof geocoded.lng === 'number') {
          coordinates = { lat: geocoded.lat, lng: geocoded.lng };
          formattedAddress = geocoded.formattedAddress || place.description;
          addressComponents = geocoded.addressComponents || [];
        }
      }
      
      if (!coordinates) {
        setError(ERROR_MESSAGES.GEOCODE_FAILED);
        console.error('Failed to get coordinates for:', place.description);
      }
      
      if (onPlaceSelect) {
        onPlaceSelect({
          placeId: place.place_id,
          description: place.description,
          formattedAddress,
          coordinates,
          addressComponents,
        });
      }
    } catch (err) {
      console.error('Error selecting place:', err);
      setError(ERROR_MESSAGES.GEOCODE_FAILED);
      
      if (onPlaceSelect) {
        onPlaceSelect({
          placeId: place.place_id,
          description: place.description,
          formattedAddress: place.description,
          coordinates: null,
          addressComponents: [],
        });
      }
    }
  }, [onPlaceSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handlePlaceSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setError(null);
        break;
      default:
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, handlePlaceSelect]);

  // Clear search
  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const state = {
    searchQuery,
    suggestions,
    isLoading,
    showSuggestions,
    selectedIndex,
    error,
  };

  const handlers = {
    handleSearchChange,
    handlePlaceSelect,
    handleKeyDown,
    handleClear,
    setShowSuggestions,
  };

  return [state, handlers];
}
