# Ola Maps Components

This folder contains all Ola Maps integration components for location search, map display, and interactive marker placement.

## 📁 Files

- **`OlaMapSearch.jsx`** - Autocomplete search component
- **`OlaMapViewer.jsx`** - Interactive map display with markers
- **`LocationPicker.jsx`** - Integrated location selector (Search + Map)
- **`index.js`** - Centralized exports
- **`examples.jsx`** - Usage examples and demos

## 🚀 Quick Import

```jsx
// Import individual components
import { LocationPicker, OlaMapSearch, OlaMapViewer } from '@/components/maps';

// Or import from specific files
import LocationPicker from '@/components/maps/LocationPicker';
```

## 📖 Documentation

- **Full Guide:** `docs/OLA_MAPS_INTEGRATION.md`
- **Quick Start:** `docs/OLA_MAPS_QUICK_START.md`
- **Examples:** See `examples.jsx` in this folder

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

All API interactions are handled by `src/services/olaMapsService.js`

```jsx
import { 
  searchPlaces, 
  geocodeAddress, 
  reverseGeocode 
} from '@/services/olaMapsService';
```

## 📝 Component Props Reference

### LocationPicker
- `value` - Current location object
- `onChange` - Callback when location changes
- `initialCenter` - Default map center `{ lat, lng }`
- `height` - Map height (default: "400px")
- `showSearch` - Show search bar (default: true)

### OlaMapSearch
- `onPlaceSelect` - Callback when place selected
- `placeholder` - Search input placeholder
- `initialValue` - Initial search text

### OlaMapViewer
- `center` - Map center `{ lat, lng }`
- `zoom` - Zoom level (default: 15)
- `marker` - Marker config `{ lat, lng, draggable }`
- `onMarkerDragEnd` - Callback when marker dragged
- `onMapClick` - Callback when map clicked
- `height` - Map height
- `interactive` - Enable interactions (default: true)
- `showCurrentLocation` - Show GPS button (default: true)

## ✅ Features

- ✅ Real-time search with autocomplete
- ✅ Click-to-place markers
- ✅ Draggable markers
- ✅ Current location detection
- ✅ Reverse geocoding
- ✅ Fullscreen mode
- ✅ Mobile responsive
- ✅ Dark mode support

## 🔑 Setup Required

Add to `.env`:
```env
VITE_OLA_MAPS_API_KEY=your_api_key_here
```

Get API key from: https://maps.olakrutrim.com/
