import { z } from 'zod';

export const locationSelectionSchema = z.object({
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }, {
    required_error: 'Please select a location on the map',
    invalid_type_error: 'Invalid location coordinates',
  }).refine((coords) => {
    // Validate latitude and longitude ranges
    return coords.lat >= -90 && coords.lat <= 90 && 
           coords.lng >= -180 && coords.lng <= 180;
  }, {
    message: 'Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180',
  }),
  showMapExact: z.boolean().default(false),
});

export default locationSelectionSchema;
