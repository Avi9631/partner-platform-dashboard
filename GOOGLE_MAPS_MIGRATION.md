# Google Maps Migration Guide

This document outlines the changes made to migrate from Ola Maps to Google Maps in the partner-platform-dashboard.

## ✅ What Was Done

### 1. **Installed Dependencies**
- Added `@react-google-maps/api` package for Google Maps integration

### 2. **Created New Files**

#### Services
- `src/services/googleMapsService.js` - Google Maps API integration service

#### Constants
- `src/lib/constants/maps.js` - Map configuration and constants

#### Hooks
- `src/hooks/useGoogleMapSearch.js` - Custom hook for map search functionality

#### Components
- `src/components/maps/GoogleMapSearch.jsx` - Autocomplete search component
- `src/components/maps/GoogleMapViewer.jsx` - Interactive map viewer
- `src/components/maps/LocationPicker.jsx` - Updated to use Google Maps
- `src/components/maps/MapErrorBoundary.jsx` - Error boundary for maps
- `src/components/maps/examples.jsx` - Usage examples

### 3. **Removed Ola Maps Files**
- Deleted `src/components/maps/OlaMapSearch.jsx`
- Deleted `src/components/maps/OlaMapViewer.jsx`
- Deleted `src/services/olaMapsService.js`
- Deleted `src/services/olaMapsLoader.js`

### 4. **Updated Files**
- `src/components/maps/index.js` - Updated exports to use Google Maps components
- `src/components/maps/README.md` - Updated documentation

## 🔧 Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key with appropriate restrictions

### 2. Add Environment Variable

Create or update your `.env` file in the project root:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Important:** Never commit your API key to version control!

### 3. Update `.gitignore`

Ensure your `.env` file is in `.gitignore`:

```
.env
.env.local
.env.production
```

## 📝 Component Usage

### Before (Ola Maps)
```jsx
import { LocationPicker, OlaMapSearch, OlaMapViewer } from '@/components/maps';
```

### After (Google Maps)
```jsx
import { LocationPicker, GoogleMapSearch, GoogleMapViewer } from '@/components/maps';
```

### API Remains the Same!
The `LocationPicker` component maintains the same API, so most of your code won't need changes:

```jsx
<LocationPicker
  onChange={(location) => {
    console.log(location.coordinates); // { lat, lng }
    console.log(location.city);
    console.log(location.formattedAddress);
  }}
  height="450px"
/>
```

## 🔄 Migration Steps for Existing Code

### Step 1: Update Imports

**Old:**
```jsx
import { OlaMapSearch, OlaMapViewer } from '@/components/maps';
import { searchPlaces } from '@/services/olaMapsService';
```

**New:**
```jsx
import { GoogleMapSearch, GoogleMapViewer } from '@/components/maps';
import { searchPlaces } from '@/services/googleMapsService';
```

### Step 2: Update Component Names

**Old:**
```jsx
<OlaMapSearch onPlaceSelect={handleSelect} />
<OlaMapViewer center={center} marker={marker} />
```

**New:**
```jsx
<GoogleMapSearch onPlaceSelect={handleSelect} />
<GoogleMapViewer center={center} marker={marker} />
```

### Step 3: No Changes Needed for LocationPicker

If you're using `LocationPicker`, no changes are needed! It works exactly the same:

```jsx
<LocationPicker onChange={handleLocationChange} />
```

## 🎯 Key Differences

### Environment Variables
- **Old:** `VITE_OLA_MAPS_API_KEY`
- **New:** `VITE_GOOGLE_MAPS_API_KEY`

### Component Names
- `OlaMapSearch` → `GoogleMapSearch`
- `OlaMapViewer` → `GoogleMapViewer`
- `LocationPicker` → No change (same name, updated internally)

### Service Files
- `olaMapsService.js` → `googleMapsService.js`
- Same function names and signatures

### Additional Features
- ✅ Better error handling with `MapErrorBoundary`
- ✅ More reliable geocoding
- ✅ Support for multiple markers
- ✅ Info windows on markers
- ✅ Better documentation and examples

## 🐛 Common Issues

### Issue: "Failed to Load Google Maps"
**Solution:** 
- Check if API key is correctly set in `.env`
- Verify the APIs are enabled in Google Cloud Console
- Check if billing is enabled for your Google Cloud project

### Issue: "Places search not working"
**Solution:**
- Ensure Places API is enabled
- Check API key restrictions (HTTP referrers, IP addresses)

### Issue: "Reverse geocoding fails"
**Solution:**
- Enable Geocoding API in Google Cloud Console
- Check API quota limits

## 📚 Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [react-google-maps/api Documentation](https://react-google-maps-api-docs.netlify.app/)

## 💡 Usage Examples

See `src/components/maps/examples.jsx` for comprehensive usage examples including:
- Basic LocationPicker usage
- Separate search and map components
- Multiple markers
- Error boundary integration
- Pre-filled locations
- Direct service function usage

## ✅ Testing Checklist

- [ ] API key is set in `.env`
- [ ] All three APIs are enabled in Google Cloud Console
- [ ] Billing is enabled for the project
- [ ] Search functionality works
- [ ] Map displays correctly
- [ ] Markers can be placed by clicking
- [ ] Markers are draggable
- [ ] Current location button works
- [ ] Reverse geocoding works (shows address when clicking map)
- [ ] Fullscreen mode works
- [ ] Mobile responsiveness is good

## 🎉 Benefits of Migration

1. **More Reliable:** Google Maps has better uptime and reliability
2. **Better Documentation:** Extensive documentation and community support
3. **More Features:** Access to Google's extensive mapping ecosystem
4. **Better Geocoding:** More accurate address resolution
5. **Wider Coverage:** Better coverage for international locations
6. **Future-Proof:** Google Maps is more established and maintained

## 📞 Support

If you encounter any issues during migration, check:
1. The examples in `src/components/maps/examples.jsx`
2. The README in `src/components/maps/README.md`
3. Google Cloud Console for API errors
4. Browser console for detailed error messages
