import { useState } from "react";

export const useLocation = (toast) => {
  const [locationLoading, setLocationLoading] = useState(false);

  const captureLocation = async (onLocationCapture) => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const locationData = {
            latitude,
            longitude,
            address: data.display_name || `${latitude}, ${longitude}`,
          };

          onLocationCapture(locationData);

          toast({
            title: "Success",
            description: "Location captured successfully!",
          });
        } catch (error) {
          console.error("Geocoding error:", error);

          const locationData = {
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          };

          onLocationCapture(locationData);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        toast({
          title: "Error",
          description: "Unable to retrieve your location. Please enable location access.",
          variant: "destructive",
        });
        console.error("Geolocation error:", error);
      }
    );
  };

  return {
    locationLoading,
    captureLocation,
  };
};
