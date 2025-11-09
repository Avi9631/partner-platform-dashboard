# Ola Maps Integration Guide

## Overview

This project integrates **Ola Maps** for location search, geocoding, and interactive map display with marker placement functionality. The integration provides a seamless location selection experience for property listing.

## Features

✅ **Location Search with Autocomplete** - Search for places using Ola Maps Autocomplete API
✅ **Interactive Map Display** - View and interact with Ola Maps
✅ **Marker Placement** - Click on map or drag markers to select precise locations
✅ **Reverse Geocoding** - Convert coordinates to human-readable addresses
✅ **Current Location Detection** - Get user's current GPS location
✅ **Integrated Location Picker** - Combined search and map interface

## Setup Instructions

### 1. Get Ola Maps API Key

1. Visit [Ola Maps Developer Portal](https://maps.olakrutrim.com/)
2. Sign up or log in to your account
3. Create a new project or select an existing one
4. Generate an API key for web applications
5. Copy the API key

### 2. Configure Environment Variables

Create or update your `.env` file in the project root:

```env
VITE_OLA_MAPS_API_KEY=your_actual_api_key_here
```

**Important:** Never commit your actual API key to version control. Use `.env` for local development and configure environment variables in your deployment platform.

### 3. Install Dependencies

All required dependencies are already included in `package.json`. No additional packages needed!

## Components

### 1. OlaMapSearch Component

Location search with autocomplete functionality.

**Location:** `src/components/maps/OlaMapSearch.jsx`

**Usage:**
```jsx
import OlaMapSearch from '@/components/maps/OlaMapSearch';

<OlaMapSearch
  onPlaceSelect={(place) => {
    console.log('Selected:', place);
  }}
  placeholder="Search for location..."
  initialValue=""
/>
```

**Props:**
- `onPlaceSelect` (function): Callback when a place is selected
- `placeholder` (string): Search input placeholder
- `className` (string): Additional CSS classes
- `initialValue` (string): Initial search value

### 2. OlaMapViewer Component

Interactive map display with marker placement.

**Location:** `src/components/maps/OlaMapViewer.jsx`

**Usage:**
```jsx
import OlaMapViewer from '@/components/maps/OlaMapViewer';

<OlaMapViewer
  center={{ lat: 28.6139, lng: 77.2090 }}
  zoom={15}
  marker={{
    lat: 28.6139,
    lng: 77.2090,
    draggable: true
  }}
  onMarkerDragEnd={(data) => {
    console.log('New position:', data);
  }}
  onMapClick={(data) => {
    console.log('Clicked:', data);
  }}
  height="400px"
  interactive={true}
  showCurrentLocation={true}
/>
```

**Props:**
- `center` (object): Map center coordinates `{ lat, lng }`
- `zoom` (number): Initial zoom level (default: 15)
- `marker` (object): Marker configuration `{ lat, lng, draggable }`
- `onMarkerDragEnd` (function): Callback when marker is dragged
- `onMapClick` (function): Callback when map is clicked
- `height` (string): Map container height
- `interactive` (boolean): Enable/disable interactions
- `showCurrentLocation` (boolean): Show current location button

### 3. LocationPicker Component

Integrated location selector combining search and map.

**Location:** `src/components/maps/LocationPicker.jsx`

**Usage:**
```jsx
import LocationPicker from '@/components/maps/LocationPicker';

<LocationPicker
  value={selectedLocation}
  onChange={(locationData) => {
    console.log('Selected location:', locationData);
  }}
  initialCenter={{ lat: 28.6139, lng: 77.2090 }}
  height="450px"
  showSearch={true}
/>
```

**Props:**
- `value` (object): Current selected location
- `onChange` (function): Callback when location changes
- `initialCenter` (object): Initial map center
- `height` (string): Map height
- `showSearch` (boolean): Show/hide search bar
- `className` (string): Additional CSS classes

**Location Data Structure:**
```javascript
{
  coordinates: { lat: number, lng: number },
  formattedAddress: string,
  city: string,
  locality: string,
  placeId: string,
  addressComponents: array
}
```

## Service Functions

### Ola Maps Service

**Location:** `src/services/olaMapsService.js`

Available functions:

#### `searchPlaces(query, options)`
Search for places with autocomplete
```javascript
const results = await searchPlaces('Delhi');
```

#### `getPlaceDetails(placeId)`
Get detailed information about a place
```javascript
const details = await getPlaceDetails('ChIJ...');
```

#### `geocodeAddress(address)`
Convert address to coordinates
```javascript
const result = await geocodeAddress('Connaught Place, Delhi');
// Returns: { lat, lng, formattedAddress, placeId }
```

#### `reverseGeocode(lat, lng)`
Convert coordinates to address
```javascript
const address = await reverseGeocode(28.6139, 77.2090);
// Returns: { formattedAddress, addressComponents, placeId }
```

#### `getCurrentLocation()`
Get user's current GPS location
```javascript
const location = await getCurrentLocation();
// Returns: { lat, lng }
```

#### `extractCityFromComponents(addressComponents)`
Extract city name from address components

#### `extractLocalityFromComponents(addressComponents)`
Extract locality/neighborhood from address components

## Integration Example

The map integration is already implemented in the **BasicDetails** form component:

**File:** `src/modules/listProperty/components/BasicDetails.jsx`

The location picker is embedded in the property listing form and automatically:
- Saves coordinates when a location is selected
- Auto-fills city and locality fields
- Updates the address field with formatted address
- Validates location data using Zod schema

## API Endpoints Used

The integration uses the following Ola Maps API endpoints:

1. **Autocomplete API**
   - URL: `https://api.olamaps.io/places/v1/autocomplete`
   - Purpose: Location search suggestions

2. **Place Details API**
   - URL: `https://api.olamaps.io/places/v1/details`
   - Purpose: Get detailed place information

3. **Geocoding API**
   - URL: `https://api.olamaps.io/places/v1/geocode`
   - Purpose: Convert address to coordinates

4. **Reverse Geocoding API**
   - URL: `https://api.olamaps.io/places/v1/reverse-geocode`
   - Purpose: Convert coordinates to address

5. **Map Tiles API**
   - URL: `https://api.olamaps.io/tiles/vector/v1`
   - Purpose: Interactive map display

## Styling

The map components use Tailwind CSS for styling and are fully responsive. Custom marker styling is applied inline for better performance.

### Custom Marker

The marker is a custom SVG with:
- Orange color scheme matching the app theme
- Shadow for better visibility
- White center dot for precise location indication

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** Geolocation requires HTTPS in production.

## Performance Considerations

1. **Debounced Search** - Search queries are debounced by 300ms to reduce API calls
2. **Lazy Loading** - Map SDK is loaded only when needed
3. **Component Optimization** - React hooks properly configured to prevent unnecessary re-renders
4. **Error Handling** - Graceful fallbacks for network errors and API failures

## Troubleshooting

### Map not displaying
- Check if API key is correctly set in `.env`
- Ensure `.env` file is in the project root
- Restart development server after adding environment variables

### Search not working
- Verify API key has autocomplete access enabled
- Check browser console for API errors
- Ensure minimum 3 characters are entered for search

### Current location not working
- Check browser permissions for geolocation
- Ensure HTTPS is used in production
- Handle permission denial gracefully

### Marker not draggable
- Verify `interactive` prop is `true`
- Check if `draggable` is set in marker config
- Ensure map is fully loaded before interaction

## Security Best Practices

1. ✅ Never expose API keys in client-side code
2. ✅ Use environment variables for configuration
3. ✅ Add `.env` to `.gitignore`
4. ✅ Consider implementing API key restrictions in Ola Maps dashboard
5. ✅ Use rate limiting on your backend if proxying requests

## Support & Resources

- [Ola Maps Documentation](https://maps.olakrutrim.com/docs)
- [Ola Maps API Reference](https://maps.olakrutrim.com/api-reference)
- [GitHub Issues](https://github.com/your-repo/issues)

## License

This integration is part of the Partner Platform Dashboard project.

---

**Last Updated:** November 2025
