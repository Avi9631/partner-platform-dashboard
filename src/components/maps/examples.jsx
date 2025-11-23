/**
 * Google Maps Components - Usage Examples
 * Demonstrates various ways to use the Google Maps integration
 */

import { useState } from 'react';
import { LocationPicker, GoogleMapSearch, GoogleMapViewer, MapErrorBoundary } from '@/components/maps';

/**
 * Example 1: Basic LocationPicker (Most Common Use Case)
 * Combines search + map in a single component
 */
export function BasicLocationPickerExample() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Basic Location Picker</h2>
      
      <LocationPicker
        onChange={(location) => {
          setSelectedLocation(location);
          console.log('Selected:', location);
        }}
        height="450px"
      />

      {selectedLocation && (
        <div className="p-4 bg-muted rounded">
          <h3 className="font-semibold">Selected Location:</h3>
          <pre className="text-sm mt-2">
            {JSON.stringify(selectedLocation, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Separate Search and Map
 * For custom layouts
 */
export function SeparateSearchMapExample() {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [marker, setMarker] = useState(null);

  const handlePlaceSelect = (place) => {
    if (place.coordinates) {
      setMapCenter(place.coordinates);
      setMarker({
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
        draggable: true,
      });
    }
  };

  const handleMapInteraction = (data) => {
    setMarker({
      lat: data.lat,
      lng: data.lng,
      draggable: true,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Separate Search & Map</h2>
      
      <GoogleMapSearch
        onPlaceSelect={handlePlaceSelect}
        placeholder="Search for a location..."
      />

      <GoogleMapViewer
        center={mapCenter}
        zoom={15}
        marker={marker}
        onMapClick={handleMapInteraction}
        onMarkerDragEnd={handleMapInteraction}
        height="400px"
      />
    </div>
  );
}

/**
 * Example 3: Map with Multiple Markers
 * Display multiple locations at once
 */
export function MultipleMarkersExample() {
  const markers = [
    {
      id: 1,
      lat: 28.6139,
      lng: 77.2090,
      popup: 'Location 1',
      strokeColor: '#ea580c',
    },
    {
      id: 2,
      lat: 28.6200,
      lng: 77.2100,
      popup: 'Location 2',
      strokeColor: '#3b82f6',
    },
    {
      id: 3,
      lat: 28.6100,
      lng: 77.2150,
      popup: 'Location 3',
      strokeColor: '#10b981',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Multiple Markers</h2>
      
      <GoogleMapViewer
        center={{ lat: 28.6139, lng: 77.2090 }}
        zoom={14}
        markers={markers}
        interactive={false}
        showCurrentLocation={false}
        height="500px"
      />
    </div>
  );
}

/**
 * Example 4: With Error Boundary
 * Wrap components in error boundary for better error handling
 */
export function WithErrorBoundaryExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">With Error Boundary</h2>
      
      <MapErrorBoundary onReset={() => console.log('Map reset')}>
        <LocationPicker
          onChange={(location) => console.log('Selected:', location)}
          height="400px"
        />
      </MapErrorBoundary>
    </div>
  );
}

/**
 * Example 5: Pre-filled Location
 * Initialize with existing location data
 */
export function PrefilledLocationExample() {
  const [location, setLocation] = useState({
    coordinates: { lat: 28.6139, lng: 77.2090 },
    formattedAddress: 'Connaught Place, New Delhi, Delhi, India',
    city: 'New Delhi',
    locality: 'Connaught Place',
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pre-filled Location</h2>
      
      <LocationPicker
        value={location}
        onChange={setLocation}
        height="400px"
      />
    </div>
  );
}

/**
 * Example 6: Using Service Functions Directly
 */
export function ServiceFunctionsExample() {
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    const { searchPlaces, geocodeAddress, reverseGeocode } = await import('@/services/googleMapsService');
    
    // Search for places
    const places = await searchPlaces('Connaught Place Delhi');
    console.log('Places:', places);
    
    // Geocode an address
    const geocoded = await geocodeAddress('India Gate, New Delhi');
    console.log('Geocoded:', geocoded);
    
    // Reverse geocode coordinates
    const reversed = await reverseGeocode(28.6129, 77.2295);
    console.log('Reversed:', reversed);
    
    setResults({ places, geocoded, reversed });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Service Functions</h2>
      
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Test Service Functions
      </button>

      {results && (
        <pre className="text-xs bg-muted p-4 rounded overflow-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
}

// Export all examples
export default {
  BasicLocationPickerExample,
  SeparateSearchMapExample,
  MultipleMarkersExample,
  WithErrorBoundaryExample,
  PrefilledLocationExample,
  ServiceFunctionsExample,
};
