import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OlaMapSearch from './OlaMapSearch';
import OlaMapViewer from './OlaMapViewer';
import {
  extractCityFromComponents,
  extractLocalityFromComponents,
  geocodeAddress,
} from '@/services/olaMapsService';

/**
 * LocationPicker Component
 * Integrated location selection with search and map
 */
export default function LocationPicker({
  value = null,
  onChange,
  initialCenter = { lat: 28.6139, lng: 77.2090 },
  height = '400px',
  showSearch = true,
  className = '',
}) {
  const [selectedLocation, setSelectedLocation] = useState(value);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [mapMarker, setMapMarker] = useState(null);

  // Update local state when value prop changes
  useEffect(() => {
    if (value && value.coordinates) {
      setSelectedLocation(value);
      setMapCenter(value.coordinates);
      setMapMarker({
        lat: value.coordinates.lat,
        lng: value.coordinates.lng,
        draggable: true,
      });
    }
  }, [value]);

  // Handle place selection from search
  const handlePlaceSelect = async (place) => {
    // Validate coordinates
    if (!place.coordinates || typeof place.coordinates.lat !== 'number' || typeof place.coordinates.lng !== 'number') {
      console.error('Invalid coordinates, attempting geocoding...');
      
      // Last resort: try geocoding
      try {
        const geocoded = await geocodeAddress(place.formattedAddress || place.description);
        if (geocoded && typeof geocoded.lat === 'number' && typeof geocoded.lng === 'number') {
          place.coordinates = { lat: geocoded.lat, lng: geocoded.lng };
        } else {
          console.error('Failed to get coordinates');
          return;
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        return;
      }
    }

    // At this point we have valid coordinates
    const locationData = {
      coordinates: place.coordinates,
      formattedAddress: place.formattedAddress || place.description,
      city: extractCityFromComponents(place.addressComponents),
      locality: extractLocalityFromComponents(place.addressComponents),
      placeId: place.placeId,
      addressComponents: place.addressComponents,
    };

    // Update all state
    setSelectedLocation(locationData);
    setMapCenter(place.coordinates);
    setMapMarker({
      lat: place.coordinates.lat,
      lng: place.coordinates.lng,
      draggable: true,
    });

    // Notify parent component
    if (onChange) {
      onChange(locationData);
    }
  };

  // Handle map click or marker drag
  const handleMapInteraction = (data) => {
    console.log('🗺️ Map interaction received:', data);
    
    const city = extractCityFromComponents(data.addressComponents);
    const locality = extractLocalityFromComponents(data.addressComponents);
    
    console.log('📍 Extracted location data:', {
      address: data.address,
      city,
      locality,
      hasAddressComponents: !!data.addressComponents?.length
    });
    
    const locationData = {
      coordinates: {
        lat: data.lat,
        lng: data.lng,
      },
      formattedAddress: data.address || 'Unknown location',
      city: city,
      locality: locality,
      addressComponents: data.addressComponents,
    };

    // Update all state to reflect the new location
    setSelectedLocation(locationData);
    setMapCenter({ lat: data.lat, lng: data.lng });
    setMapMarker({
      lat: data.lat,
      lng: data.lng,
      draggable: true,
    });

    console.log('✅ Calling onChange with:', locationData);

    // Notify parent component
    if (onChange) {
      onChange(locationData);
    }
  };

  // Clear selection
  const handleClear = () => {
    setSelectedLocation(null);
    setMapMarker(null);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={className}>
      {/* Search Bar */}
      {showSearch && (
        <div className="mb-4">
          <OlaMapSearch
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search for your property location..."
            initialValue={selectedLocation?.formattedAddress || ''}
          />
        </div>
      )}

      {/* Map */}
      <OlaMapViewer
        center={mapCenter}
        zoom={15}
        marker={mapMarker}
        onMarkerDragEnd={handleMapInteraction}
        onMapClick={handleMapInteraction}
        height={height}
        interactive={true}
        showCurrentLocation={true}
      />

      {/* Selected Location Info */}
      {selectedLocation && (
        <Card className="mt-4 p-4 border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100">
                  Selected Location
                </h4>
              </div>
              
              <p className="text-sm text-foreground mb-2">
                {selectedLocation.formattedAddress}
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedLocation.city && (
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedLocation.city}
                  </Badge>
                )}
                {selectedLocation.locality && (
                  <Badge variant="secondary" className="text-xs">
                    <Navigation className="w-3 h-3 mr-1" />
                    {selectedLocation.locality}
                  </Badge>
                )}
                {selectedLocation.coordinates && (
                  <Badge variant="outline" className="text-xs">
                    {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30"
            >
              Clear
            </Button>
          </div>
        </Card>
      )}

      {/* Instructions */}
      {!selectedLocation && (
        <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-start gap-3">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">How to select location:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Search for your property address using the search bar</li>
                <li>• Click on the map to place a marker</li>
                <li>• Drag the marker to fine-tune the exact location</li>
                <li>• Use the location button to select your current position</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
