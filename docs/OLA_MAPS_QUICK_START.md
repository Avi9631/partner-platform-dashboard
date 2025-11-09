# Ola Maps Integration - Quick Start

## 🚀 Quick Setup (5 minutes)

### Step 1: Get API Key
1. Go to https://maps.olakrutrim.com/
2. Sign up/Login
3. Create project and get API key

### Step 2: Configure
Add to `.env` file:
```env
VITE_OLA_MAPS_API_KEY=your_api_key_here
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

## 📍 Usage Examples

### Simple Location Picker
```jsx
import LocationPicker from '@/components/maps/LocationPicker';

<LocationPicker
  onChange={(location) => {
    console.log(location.coordinates); // { lat, lng }
    console.log(location.formattedAddress);
    console.log(location.city);
  }}
/>
```

### Map with Search
```jsx
import OlaMapSearch from '@/components/maps/OlaMapSearch';
import OlaMapViewer from '@/components/maps/OlaMapViewer';

<OlaMapSearch onPlaceSelect={handleSelect} />
<OlaMapViewer 
  center={{ lat: 28.6139, lng: 77.2090 }}
  marker={{ lat: 28.6139, lng: 77.2090 }}
  onMapClick={handleClick}
/>
```

### Search Only
```jsx
import OlaMapSearch from '@/components/maps/OlaMapSearch';

<OlaMapSearch
  onPlaceSelect={(place) => {
    console.log(place.coordinates);
    console.log(place.description);
  }}
  placeholder="Search location..."
/>
```

## 🎯 Key Features

- ✅ **Search** - Autocomplete with Ola Maps API
- ✅ **Interactive Map** - Click to place marker
- ✅ **Drag Marker** - Fine-tune location
- ✅ **Current Location** - GPS detection
- ✅ **Reverse Geocode** - Coords → Address
- ✅ **Auto-fill Form** - City, locality, address

## 📦 Components Created

```
src/
├── components/maps/
│   ├── OlaMapSearch.jsx       # Search with autocomplete
│   ├── OlaMapViewer.jsx       # Interactive map
│   └── LocationPicker.jsx     # Integrated picker
└── services/
    └── olaMapsService.js      # API service
```

## 🔧 Integrated In

- **BasicDetails Form** (`src/modules/listProperty/components/BasicDetails.jsx`)
  - Location picker embedded
  - Auto-fills city, locality, address
  - Saves coordinates to form

## 🐛 Common Issues

**Map not loading?**
- Check API key in `.env`
- Restart dev server
- Check browser console

**Search not working?**
- Type minimum 3 characters
- Check network tab for API errors
- Verify API key permissions

**Current location fails?**
- Enable browser location permissions
- Use HTTPS in production
- Handle permission denial

## 📚 Full Documentation

See `docs/OLA_MAPS_INTEGRATION.md` for complete documentation.

## 🎨 Customization

### Change Map Style
Edit in `OlaMapViewer.jsx`:
```javascript
style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json'
// Options: default-light-standard, default-dark-standard
```

### Change Marker Color
Edit in `OlaMapViewer.jsx`:
```javascript
fill="#ea580c"  // Change to any color
```

### Change Map Height
```jsx
<LocationPicker height="600px" />
```

## 💡 Pro Tips

1. **Debounced Search** - Already implemented (300ms)
2. **Error Handling** - Built-in fallbacks
3. **Mobile Responsive** - Works on all devices
4. **Fullscreen Mode** - Button on map
5. **Keyboard Navigation** - Arrow keys in search

## 🔐 Security

- ✅ API key in environment variables
- ✅ `.env` in `.gitignore`
- ⚠️ Add API restrictions in Ola Maps dashboard
- ⚠️ Consider backend proxy for production

---

**Need Help?** Check the full documentation or create an issue.
