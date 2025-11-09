# Ola Maps - Troubleshooting Guide

## 🔍 Common Issues and Solutions

### 1. Map Not Displaying

**Symptom:** Blank space where map should appear, or "Loading map..." message persists

**Solutions:**

✅ **Check API Key**
```bash
# Verify .env file exists and contains:
VITE_OLA_MAPS_API_KEY=your_actual_api_key
```

✅ **Restart Development Server**
```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

✅ **Check Browser Console**
- Open DevTools (F12)
- Look for errors related to Ola Maps API
- Common error: "Invalid API key" or "API key not found"

✅ **Verify API Key Format**
- Should be a long alphanumeric string
- No quotes, spaces, or extra characters
- Get from: https://maps.olakrutrim.com/

---

### 2. Search Not Working

**Symptom:** No suggestions appear when typing

**Solutions:**

✅ **Minimum Characters**
- Type at least 3 characters
- Search is debounced by 300ms

✅ **Check Network**
- Open Network tab in DevTools
- Look for requests to `api.olamaps.io`
- Check response status (should be 200)

✅ **API Key Permissions**
- Verify API key has Places API access
- Check Ola Maps dashboard for restrictions

✅ **CORS Issues**
```javascript
// If you see CORS errors, the API key might need domain restrictions updated
// Go to Ola Maps dashboard > API Keys > Add your domain
```

---

### 3. Current Location Not Working

**Symptom:** Location button doesn't respond or shows error

**Solutions:**

✅ **Browser Permissions**
```
1. Click lock icon in address bar
2. Allow location permissions
3. Refresh page and try again
```

✅ **HTTPS Required**
- Geolocation API requires secure context
- Use HTTPS in production
- Localhost works for development

✅ **Permission Denied**
```javascript
// User must explicitly allow location access
// If denied, show manual search option
```

---

### 4. Marker Not Appearing

**Symptom:** Map loads but no marker visible

**Solutions:**

✅ **Check Coordinates**
```javascript
// Verify lat/lng are valid numbers
console.log(marker.lat, marker.lng);
// Should be numbers, not strings
// Lat: -90 to 90
// Lng: -180 to 180
```

✅ **Check Marker Prop**
```jsx
<OlaMapViewer
  marker={{
    lat: 28.6139,  // Must be number
    lng: 77.2090,  // Must be number
    draggable: true
  }}
/>
```

✅ **Map Center**
```javascript
// Ensure marker coordinates match map center initially
center={{ lat: 28.6139, lng: 77.2090 }}
marker={{ lat: 28.6139, lng: 77.2090 }}
```

---

### 5. Marker Not Draggable

**Symptom:** Cannot drag marker to new position

**Solutions:**

✅ **Interactive Mode**
```jsx
<OlaMapViewer
  interactive={true}  // Must be true
  marker={{
    draggable: true   // Must be true
  }}
/>
```

✅ **Map Loaded**
- Wait for map to fully load before dragging
- Check if "Loading map..." message has disappeared

---

### 6. Form Fields Not Auto-filling

**Symptom:** Location selected but city/locality/address fields stay empty

**Solutions:**

✅ **Check onChange Handler**
```jsx
<LocationPicker
  onChange={(locationData) => {
    console.log('Location data:', locationData);
    // Should contain city, locality, formattedAddress
  }}
/>
```

✅ **Verify Location Data**
```javascript
// Check if addressComponents are returned
if (locationData.addressComponents) {
  console.log('Has address components');
}
```

✅ **Reverse Geocoding**
```javascript
// If clicking map, reverse geocoding should trigger
// Check console for any errors from reverseGeocode()
```

---

### 7. API Rate Limit Errors

**Symptom:** "Too many requests" or 429 errors

**Solutions:**

✅ **Debouncing**
```javascript
// Already implemented (300ms delay)
// Avoid rapid consecutive searches
```

✅ **Caching**
```javascript
// Consider caching search results
// Implement in service layer if needed
```

✅ **Backend Proxy**
```javascript
// For production, proxy API calls through your backend
// Implement rate limiting on your server
```

---

### 8. Map Tiles Not Loading

**Symptom:** Map shows but tiles are missing/broken

**Solutions:**

✅ **Check Internet Connection**
- Map tiles load from Ola CDN
- Requires stable internet connection

✅ **API Key Restrictions**
- Verify API key allows Maps API access
- Check Ola Maps dashboard settings

✅ **Browser Cache**
```bash
# Clear browser cache and reload
# Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

---

### 9. Dark Mode Issues

**Symptom:** Map looks wrong in dark mode

**Solutions:**

✅ **Map Style**
```javascript
// In OlaMapViewer.jsx, change style URL:
style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json'
// For dark mode
```

✅ **Dynamic Style Switching**
```javascript
// Detect theme and switch style
const isDark = document.documentElement.classList.contains('dark');
const style = isDark 
  ? 'default-dark-standard' 
  : 'default-light-standard';
```

---

### 10. Mobile/Touch Issues

**Symptom:** Map interactions don't work on mobile

**Solutions:**

✅ **Touch Events**
- Ola Maps SDK handles touch events
- Ensure no conflicting touch handlers

✅ **Viewport Meta Tag**
```html
<!-- In index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

✅ **Responsive Container**
```css
/* Ensure map container is properly sized */
width: 100%;
height: 400px;
```

---

### 11. Environment Variables Not Working

**Symptom:** API key undefined or null

**Solutions:**

✅ **File Location**
```
.env file must be in project root:
partner-platform-dashboard/
├── .env          ← Here
├── package.json
├── src/
```

✅ **Variable Prefix**
```env
# Must start with VITE_
VITE_OLA_MAPS_API_KEY=your_key

# Won't work:
OLA_MAPS_API_KEY=your_key
```

✅ **Restart Required**
```bash
# After changing .env, MUST restart dev server
npm run dev
```

✅ **Check Import**
```javascript
console.log(import.meta.env.VITE_OLA_MAPS_API_KEY);
// Should print your API key
```

---

## 🛠️ Debug Mode

### Enable Debug Logging

Add to `olaMapsService.js`:
```javascript
const DEBUG = true;

export const searchPlaces = async (query, options = {}) => {
  if (DEBUG) console.log('Searching for:', query);
  // ... rest of code
  if (DEBUG) console.log('Results:', data);
};
```

### Check Component State

```jsx
// In LocationPicker.jsx
console.log('Selected location:', selectedLocation);
console.log('Map center:', mapCenter);
console.log('Marker:', mapMarker);
```

---

## 📞 Getting Help

1. **Check Console**
   - Open DevTools (F12)
   - Look for error messages
   - Note the error type and message

2. **Check Network Tab**
   - See API requests/responses
   - Verify status codes
   - Check request parameters

3. **Review Documentation**
   - `docs/OLA_MAPS_INTEGRATION.md`
   - `docs/OLA_MAPS_QUICK_START.md`
   - Component examples in `src/components/maps/examples.jsx`

4. **Contact Support**
   - Ola Maps: https://maps.olakrutrim.com/support
   - Check API status page
   - Review rate limits

---

## ✅ Quick Diagnostic Checklist

Run through this checklist:

- [ ] `.env` file exists in project root
- [ ] `VITE_OLA_MAPS_API_KEY` is set correctly
- [ ] Development server restarted after .env changes
- [ ] API key is valid (test in Ola Maps dashboard)
- [ ] Internet connection is stable
- [ ] Browser console shows no errors
- [ ] Browser allows location permissions (if using GPS)
- [ ] Using HTTPS in production (for geolocation)
- [ ] Map container has defined height
- [ ] React components properly imported

---

## 🔄 If All Else Fails

### Complete Reset

```bash
# 1. Stop development server
Ctrl+C

# 2. Clear node_modules and reinstall
rm -rf node_modules
npm install

# 3. Clear browser cache
# Chrome: DevTools > Network > Disable cache

# 4. Verify .env file
cat .env  # or type .env on Windows

# 5. Restart server
npm run dev

# 6. Hard refresh browser
Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

### Test in Isolation

```jsx
// Create test component to isolate issue
import { LocationPicker } from '@/components/maps';

export function TestMap() {
  return (
    <div style={{ padding: '20px' }}>
      <LocationPicker 
        onChange={(loc) => console.log(loc)}
        height="500px"
      />
    </div>
  );
}
```

---

**Last Updated:** November 2025
