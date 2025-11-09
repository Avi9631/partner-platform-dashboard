/**
 * Ola Maps Integration - Usage Examples
 * This file demonstrates various ways to use the Ola Maps components
 */

import { useState } from 'react';
import { 
  LocationPicker, 
  OlaMapSearch, 
  OlaMapViewer 
} from '@/components/maps';
import { 
  searchPlaces, 
  geocodeAddress, 
  reverseGeocode,
  getCurrentLocation 
} from '@/services/olaMapsService';

// ========================================
// Example 1: Complete Location Picker
// ========================================
export function Example1_LocationPicker() {
  const [location, setLocation] = useState(null);

  return (
    <div>
      <h2>Select Property Location</h2>
      <LocationPicker
        value={location}
        onChange={(locationData) => {
          setLocation(locationData);
          console.log('Selected:', locationData);
          // locationData contains: coordinates, formattedAddress, city, locality
        }}
        height="500px"
        showSearch={true}
      />
      
      {location && (
        <div>
          <p>Coordinates: {location.coordinates.lat}, {location.coordinates.lng}</p>
          <p>Address: {location.formattedAddress}</p>
          <p>City: {location.city}</p>
        </div>
      )}
    </div>
  );
}

// ========================================
// Example 2: Search Only
// ========================================
export function Example2_SearchOnly() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <div>
      <h2>Search for a Location</h2>
      <OlaMapSearch
        onPlaceSelect={(place) => {
          setSelectedPlace(place);
          console.log('Selected place:', place);
        }}
        placeholder="Search for cities, landmarks, addresses..."
      />
      
      {selectedPlace && (
        <div>
          <p>Selected: {selectedPlace.description}</p>
          <p>Place ID: {selectedPlace.placeId}</p>
        </div>
      )}
    </div>
  );
}

// ========================================
// Example 3: Map with Custom Marker
// ========================================
export function Example3_MapWithMarker() {
  const [markerPosition, setMarkerPosition] = useState({
    lat: 28.6139,
    lng: 77.2090
  });

  return (
    <div>
      <h2>Interactive Map</h2>
      <OlaMapViewer
        center={markerPosition}
        zoom={15}
        marker={{
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          draggable: true
        }}
        onMarkerDragEnd={(data) => {
          setMarkerPosition({
            lat: data.lat,
            lng: data.lng
          });
          console.log('New position:', data);
          console.log('Address:', data.address);
        }}
        onMapClick={(data) => {
          setMarkerPosition({
            lat: data.lat,
            lng: data.lng
          });
        }}
        height="400px"
        interactive={true}
        showCurrentLocation={true}
      />
      
      <p>Current Position: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}</p>
    </div>
  );
}

// ========================================
// Example 4: Using Service Functions Directly
// ========================================
export function Example4_ServiceFunctions() {
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const places = await searchPlaces('Mumbai Airport');
    setResults(places);
  };

  const handleGeocode = async () => {
    const result = await geocodeAddress('Connaught Place, New Delhi');
    console.log('Coordinates:', result);
  };

  const handleReverseGeocode = async () => {
    const address = await reverseGeocode(28.6139, 77.2090);
    console.log('Address:', address);
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      console.log('Current location:', location);
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  return (
    <div>
      <h2>Service Functions</h2>
      <button onClick={handleSearch}>Search Places</button>
      <button onClick={handleGeocode}>Geocode Address</button>
      <button onClick={handleReverseGeocode}>Reverse Geocode</button>
      <button onClick={handleCurrentLocation}>Get Current Location</button>
      
      <ul>
        {results.map((place, index) => (
          <li key={index}>{place.description}</li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// Example 5: Form Integration
// ========================================
export function Example5_FormIntegration() {
  const [formData, setFormData] = useState({
    propertyName: '',
    city: '',
    locality: '',
    address: '',
    coordinates: null,
  });

  const handleLocationChange = (locationData) => {
    if (locationData) {
      setFormData({
        ...formData,
        city: locationData.city || formData.city,
        locality: locationData.locality || formData.locality,
        address: locationData.formattedAddress || formData.address,
        coordinates: locationData.coordinates,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Send to API
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Property Listing Form</h2>
      
      <input
        type="text"
        placeholder="Property Name"
        value={formData.propertyName}
        onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
      />

      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      />

      <input
        type="text"
        placeholder="Locality"
        value={formData.locality}
        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
      />

      <textarea
        placeholder="Full Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      <LocationPicker
        value={formData.coordinates ? {
          coordinates: formData.coordinates,
          formattedAddress: formData.address,
          city: formData.city,
          locality: formData.locality,
        } : null}
        onChange={handleLocationChange}
        height="400px"
      />

      <button type="submit">Submit</button>
    </form>
  );
}

// ========================================
// Example 6: Search and Map Combo
// ========================================
export function Example6_SearchAndMap() {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [marker, setMarker] = useState(null);

  const handlePlaceSelect = (place) => {
    if (place.coordinates) {
      setMapCenter(place.coordinates);
      setMarker({
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
        draggable: true
      });
    }
  };

  return (
    <div>
      <h2>Search and View on Map</h2>
      
      <OlaMapSearch
        onPlaceSelect={handlePlaceSelect}
        placeholder="Search for a location..."
      />

      <OlaMapViewer
        center={mapCenter}
        zoom={15}
        marker={marker}
        onMarkerDragEnd={(data) => {
          setMarker({
            lat: data.lat,
            lng: data.lng,
            draggable: true
          });
        }}
        height="500px"
        interactive={true}
      />
    </div>
  );
}

// ========================================
// Example 7: Read-Only Map Display
// ========================================
export function Example7_ReadOnlyMap() {
  const propertyLocation = {
    lat: 28.6139,
    lng: 77.2090
  };

  return (
    <div>
      <h2>Property Location</h2>
      <OlaMapViewer
        center={propertyLocation}
        zoom={16}
        marker={{
          lat: propertyLocation.lat,
          lng: propertyLocation.lng,
          draggable: false
        }}
        height="300px"
        interactive={false}
        showCurrentLocation={false}
      />
    </div>
  );
}

// ========================================
// Export all examples
// ========================================
export default {
  Example1_LocationPicker,
  Example2_SearchOnly,
  Example3_MapWithMarker,
  Example4_ServiceFunctions,
  Example5_FormIntegration,
  Example6_SearchAndMap,
  Example7_ReadOnlyMap,
};
