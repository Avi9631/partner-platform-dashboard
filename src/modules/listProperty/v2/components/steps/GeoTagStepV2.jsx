import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { MapPin, CheckCircle2, XCircle, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import geoTagSchema from '../../../schemas/geoTagSchema';

// Maximum allowed distance in meters for successful geo-tagging
const MAX_GEOTAG_DISTANCE_METERS = 1000;

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
};

export default function GeoTagStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePropertyFormV2();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [distance, setDistance] = useState(null);

  // Get property coordinates from saved formData
  const propertyCoordinates = formData?.coordinates;

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(geoTagSchema),
    mode: 'onChange',
    defaultValues: {
      geoTagStatus: formData?.geoTagStatus || 'pending',
      geoTagCoordinates: formData?.geoTagCoordinates || null,
      geoTagDistance: formData?.geoTagDistance || null,
      geoTagTimestamp: formData?.geoTagTimestamp || null,
    },
  });

  // Function to get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        setCurrentLocation(currentCoords);
        
        // Calculate distance from property location
        if (propertyCoordinates) {
          const calculatedDistance = calculateDistance(
            currentCoords.lat,
            currentCoords.lng,
            propertyCoordinates.lat,
            propertyCoordinates.lng
          );
          
          setDistance(calculatedDistance);
          
          // Determine geo tag status (success if within maximum allowed distance)
          const status = calculatedDistance <= MAX_GEOTAG_DISTANCE_METERS ? 'success' : 'failed';
          const timestamp = new Date().toISOString();
          
          // Update form values
          form.setValue('geoTagStatus', status);
          form.setValue('geoTagCoordinates', currentCoords);
          form.setValue('geoTagDistance', calculatedDistance);
          form.setValue('geoTagTimestamp', timestamp);
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle form submission
  const onSubmit = (data) => {
    // Pass data to context
    saveAndContinue(data);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
    return () => setCurrentStepSubmitHandler(null);
  }, [form, onSubmit, setCurrentStepSubmitHandler]);

  const geoTagStatus = form.watch('geoTagStatus');
  const isGeoTagSuccess = geoTagStatus === 'success';
  const isGeoTagFailed = geoTagStatus === 'failed';
  const isGeoTagPending = geoTagStatus === 'pending';

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Geo Tag Your Property
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Verify you are at the property location by geo-tagging
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24">
          {/* Property Location Display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <FieldLabel className="text-sm font-semibold mb-2">Property Location</FieldLabel>
                  {propertyCoordinates ? (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Latitude: {propertyCoordinates.lat.toFixed(6)}</p>
                      <p>Longitude: {propertyCoordinates.lng.toFixed(6)}</p>
                      {formData?.addressText && (
                        <p className="mt-2 text-sm">{formData.addressText}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">Property coordinates not found</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Get Current Location Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-3">
              <FieldLabel className="flex items-center gap-2 text-base">
                <Navigation className="w-5 h-5 text-orange-600" />
                Verify Your Current Location
              </FieldLabel>
              <FieldDescription className="text-sm">
                Click the button below to capture your current GPS location and verify you are at the property site.
              </FieldDescription>
              
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation || !propertyCoordinates}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                size="lg"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5 mr-2" />
                    Get Current Location
                  </>
                )}
              </Button>

              {locationError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Current Location Display */}
          {currentLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 bg-muted/30">
                <FieldLabel className="text-sm font-semibold mb-2">Your Current Location</FieldLabel>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
                  <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Geo Tag Status */}
          {!isGeoTagPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isGeoTagSuccess ? (
                <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        ✓ Geo Tag Successful!
                      </h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                        You are at the property location. Distance from property: {distance?.toFixed(2)} meters
                      </p>
                      <div className="text-xs text-green-700 dark:text-green-300">
                        <p>✓ Within {MAX_GEOTAG_DISTANCE_METERS} meter range</p>
                        <p>✓ Location verified successfully</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : isGeoTagFailed ? (
                <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-500">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                        ✗ Geo Tag Failed
                      </h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                        You are not at the property location. Distance from property: {distance?.toFixed(2)} meters
                      </p>
                      <div className="text-xs text-red-700 dark:text-red-300">
                        <p>✗ More than {MAX_GEOTAG_DISTANCE_METERS} meters away from the property</p>
                        <p>Please go to the property location and try again</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}
            </motion.div>
          )}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Tip:</span> Make sure you have enabled location permissions in your browser. 
              You need to be within {MAX_GEOTAG_DISTANCE_METERS} meters of the property location for successful geo-tagging.
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
