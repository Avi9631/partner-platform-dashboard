import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchPlaces, getPlaceDetails, geocodeAddress } from '@/services/olaMapsService';
import { cn } from '@/lib/utils';

/**
 * OlaMapSearch Component
 * Provides autocomplete search functionality using Ola Maps API
 */
export default function OlaMapSearch({ 
  onPlaceSelect, 
  placeholder = "Search for location...",
  className = "",
  initialValue = ""
}) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Update search query when initialValue changes
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const performSearch = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchPlaces(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle place selection
  const handlePlaceSelect = async (place) => {
    setSearchQuery(place.description);
    setShowSuggestions(false);
    setSuggestions([]);
    
    try {
      // Try to get place details first
      const placeDetails = await getPlaceDetails(place.place_id);
      
      let coordinates = null;
      let formattedAddress = place.description;
      let addressComponents = [];
      
      // Extract coordinates from place details
      if (placeDetails?.geometry?.location) {
        const loc = placeDetails.geometry.location;
        if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
          coordinates = { lat: loc.lat, lng: loc.lng };
        }
      }
      
      // If no coordinates, try geocoding
      if (!coordinates) {
        const geocoded = await geocodeAddress(place.description);
        if (geocoded && typeof geocoded.lat === 'number' && typeof geocoded.lng === 'number') {
          coordinates = { lat: geocoded.lat, lng: geocoded.lng };
          formattedAddress = geocoded.formattedAddress || place.description;
        }
      } else {
        formattedAddress = placeDetails.formatted_address || place.description;
        addressComponents = placeDetails.address_components || [];
      }
      
      if (!coordinates) {
        console.error('Failed to get coordinates for:', place.description);
      } else {
        console.log('Selected location:', formattedAddress, coordinates);
      }
      
      if (onPlaceSelect) {
        onPlaceSelect({
          placeId: place.place_id,
          description: place.description,
          formattedAddress: formattedAddress,
          coordinates: coordinates,
          addressComponents: addressComponents,
        });
      }
    } catch (error) {
      console.error('Error selecting place:', error);
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
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
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
        break;
      default:
        break;
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-11 text-sm border-2 focus:border-orange-500 transition-all"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          ) : searchQuery ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={handleClear}
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border-2 border-muted rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id || index}
                type="button"
                onClick={() => handlePlaceSelect(suggestion)}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-md transition-colors flex items-start gap-3 hover:bg-orange-50 dark:hover:bg-orange-950/30",
                  selectedIndex === index && "bg-orange-50 dark:bg-orange-950/30"
                )}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {suggestion.structured_formatting?.main_text || suggestion.description}
                  </p>
                  {suggestion.structured_formatting?.secondary_text && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {suggestion.structured_formatting.secondary_text}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && !isLoading && searchQuery.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border-2 border-muted rounded-lg shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            No locations found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
