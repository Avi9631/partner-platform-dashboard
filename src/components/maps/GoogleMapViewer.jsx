import { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Maximize2, Minimize2, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reverseGeocode, getCurrentLocation } from '@/services/googleMapsService';
import { cn } from '@/lib/utils';

const libraries = ['places'];

/**
 * GoogleMapViewer Component
 * Interactive map component using Google Maps with marker placement and drag functionality
 */
export default function GoogleMapViewer({
  center = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  zoom = 15,
  marker = null,
  markers = [], // Support multiple markers
  onMarkerDragEnd = null,
  onMapClick = null,
  height = '400px',
  className = '',
  interactive = true,
  showCurrentLocation = true,
}) {
  const [map, setMap] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(marker);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries,
  });

  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: isFullscreen ? '100vh' : height,
  }), [isFullscreen, height]);

  const options = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    mapTypeId: 'roadmap',
    styles: [
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }],
      },
    ],
  }), []);

  // Update current marker when marker prop changes
  useEffect(() => {
    setCurrentMarker(marker);
  }, [marker]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle map click
  const handleMapClick = useCallback(async (event) => {
    if (!interactive || !onMapClick) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Update current marker
    setCurrentMarker({
      lat,
      lng,
      draggable: true,
    });

    try {
      console.log('🔍 Reverse geocoding:', { lat, lng });
      const addressData = await reverseGeocode(lat, lng);
      console.log('🌍 Reverse geocode result:', addressData);
      
      const payload = {
        lat,
        lng,
        address: addressData?.formattedAddress || '',
        addressComponents: addressData?.addressComponents || [],
      };
      
      console.log('📤 Sending to onMapClick:', payload);
      onMapClick(payload);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      onMapClick({ lat, lng, address: '', addressComponents: [] });
    }
  }, [interactive, onMapClick]);

  // Handle marker drag
  const handleMarkerDrag = useCallback(async (event) => {
    if (!onMarkerDragEnd) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Update current marker position immediately
    setCurrentMarker({
      lat,
      lng,
      draggable: true,
    });

    try {
      console.log('🔍 Reverse geocoding (drag):', { lat, lng });
      const addressData = await reverseGeocode(lat, lng);
      console.log('🌍 Reverse geocode result (drag):', addressData);
      
      const payload = {
        lat,
        lng,
        address: addressData?.formattedAddress || '',
        addressComponents: addressData?.addressComponents || [],
      };
      
      console.log('📤 Sending to onMarkerDragEnd:', payload);
      onMarkerDragEnd(payload);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      onMarkerDragEnd({ lat, lng, address: '', addressComponents: [] });
    }
  }, [onMarkerDragEnd]);

  // Get current location
  const handleGetCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      
      if (map) {
        map.setCenter(location);
        map.setZoom(16);
      }

      setCurrentMarker({
        lat: location.lat,
        lng: location.lng,
        draggable: true,
      });

      if (onMapClick) {
        const addressData = await reverseGeocode(location.lat, location.lng);
        onMapClick({
          lat: location.lat,
          lng: location.lng,
          address: addressData?.formattedAddress || '',
          addressComponents: addressData?.addressComponents || [],
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Unable to get your current location. Please check your browser settings.');
    } finally {
      setIsLoadingLocation(false);
    }
  }, [map, onMapClick]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  if (loadError) {
    return (
      <div
        className={cn(
          'relative rounded-lg overflow-hidden border-2 border-muted flex items-center justify-center',
          isFullscreen && 'fixed inset-0 z-50 rounded-none',
          className
        )}
        style={{ height: isFullscreen ? '100vh' : height }}
      >
        <div className="text-center p-6 bg-background rounded-lg border-2 border-red-200 dark:border-red-800 max-w-md mx-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Google Maps</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {loadError.message || 'Unable to load Google Maps. Please check your API key and internet connection.'}
          </p>
          <div className="text-xs text-left bg-muted p-3 rounded mb-3">
            <p className="font-semibold mb-1">Common causes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Invalid or expired Google Maps API key</li>
              <li>API key restrictions (HTTP referrers, IP addresses)</li>
              <li>Billing not enabled for Google Cloud project</li>
              <li>Required APIs not enabled (Maps JavaScript API, Places API)</li>
            </ul>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          'relative rounded-lg overflow-hidden border-2 border-muted flex items-center justify-center',
          isFullscreen && 'fixed inset-0 z-50 rounded-none',
          className
        )}
        style={{ height: isFullscreen ? '100vh' : height }}
      >
        <div className="text-center p-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden border-2 border-muted',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={options}
      >
        {/* Current/Selected Marker */}
        {currentMarker && (
          <Marker
            position={{ lat: currentMarker.lat, lng: currentMarker.lng }}
            draggable={currentMarker.draggable !== false && interactive}
            onDragEnd={handleMarkerDrag}
            onClick={() => setSelectedMarker(currentMarker)}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: '#000000',
              fillOpacity: 1,
              strokeColor: '#ea580c',
              strokeWeight: 3,
              strokeOpacity: 0.8,
              scale: 1.5,
              anchor: { x: 12, y: 22 },
            }}
          />
        )}

        {/* Multiple Markers */}
        {markers?.map((markerData, index) => (
          <Marker
            key={markerData.id || index}
            position={{ lat: markerData.lat, lng: markerData.lng }}
            onClick={() => setSelectedMarker(markerData)}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: '#000000',
              fillOpacity: 1,
              strokeColor: markerData.strokeColor || '#ea580c',
              strokeWeight: 3,
              strokeOpacity: 0.8,
              scale: 1.2,
              anchor: { x: 12, y: 22 },
            }}
          />
        ))}

        {/* Info Window for selected marker */}
        {selectedMarker && selectedMarker.popup && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="text-sm font-medium p-2">
              {selectedMarker.popup}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Fullscreen Toggle */}
        <Button
          size="sm"
          variant="secondary"
          className="h-10 w-10 p-0 shadow-lg"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>

        {/* Current Location */}
        {showCurrentLocation && (
          <Button
            size="sm"
            variant="secondary"
            className="h-10 w-10 p-0 shadow-lg"
            onClick={handleGetCurrentLocation}
            disabled={isLoadingLocation}
            title="Get Current Location"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Interactive Hint */}
      {interactive && isLoaded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <MapPin className="w-3 h-3 text-orange-500" />
            Click on map or drag marker to set location
          </p>
        </div>
      )}
    </div>
  );
}
