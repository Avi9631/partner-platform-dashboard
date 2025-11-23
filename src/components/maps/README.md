# Google Maps Components

This folder contains all Google Maps integration components for location search, map display, and interactive marker placement.

## 📁 Files

- **`GoogleMapSearch.jsx`** - Autocomplete search component using Google Places API
- **`GoogleMapViewer.jsx`** - Interactive map display with markers using react-google-maps
- **`LocationPicker.jsx`** - Integrated location selector (Search + Map)
- **`MapErrorBoundary.jsx`** - Error boundary for map components
- **`index.js`** - Centralized exports

## 🚀 Quick Import

```jsx
// Import individual components
import { LocationPicker, GoogleMapSearch, GoogleMapViewer } from '@/components/maps';

// Or import from specific files
import LocationPicker from '@/components/maps/LocationPicker';
```

## 🎯 Most Common Usage

```jsx
import { LocationPicker } from '@/components/maps';

<LocationPicker
  onChange={(location) => {
    console.log(location.coordinates); // { lat, lng }
    console.log(location.city);
    console.log(location.formattedAddress);
  }}
  height="450px"
/>
```

## 🔧 Service Functions

All API interactions are handled by `src/services/googleMapsService.js`

```jsx
import { 
  searchPlaces, 
  geocodeAddress, 
  reverseGeocode,
  getCurrentLocation 
} from '@/services/googleMapsService';
```

## 📝 Component Props Reference

### LocationPicker
- `value` - Current location object
- `onChange` - Callback when location changes
- `initialCenter` - Default map center `{ lat, lng }`
- `height` - Map height (default: "400px")
- `showSearch` - Show search bar (default: true)

### GoogleMapSearch
- `onPlaceSelect` - Callback when place selected
- `placeholder` - Search input placeholder
- `initialValue` - Initial search text

### GoogleMapViewer
- `center` - Map center `{ lat, lng }`
- `zoom` - Zoom level (default: 15)
- `marker` - Marker config `{ lat, lng, draggable }`
- `markers` - Array of markers for multiple markers
- `onMarkerDragEnd` - Callback when marker dragged
- `onMapClick` - Callback when map clicked
- `height` - Map height
- `interactive` - Enable interactions (default: true)
- `showCurrentLocation` - Show GPS button (default: true)

### MapErrorBoundary
- `children` - Components to wrap
- `onReset` - Callback on error reset
- `showDetails` - Show error stack trace (default: false)

## ✅ Features

- ✅ Real-time search with Google Places autocomplete
- ✅ Click-to-place markers
- ✅ Draggable markers
- ✅ Current location detection
- ✅ Reverse geocoding
- ✅ Fullscreen mode
- ✅ Multiple markers support
- ✅ Mobile responsive
- ✅ Dark mode support
- ✅ Error boundary protection

## 🔑 Setup Required

Add to `.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Get API key from: https://console.cloud.google.com/

### Required APIs to Enable
- Maps JavaScript API
- Places API
- Geocoding API
