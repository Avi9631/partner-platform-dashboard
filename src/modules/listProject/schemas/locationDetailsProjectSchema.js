import { z } from 'zod';

/**
 * Schema for Project Location Details
 * Covers: Address, landmarks, coordinates, nearby places
 */

 
const locationDetailsProjectSchema = z.object({
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
  // showMapExact: z.boolean().default(false),
  city: z.string().optional(),
  locality: z.string().optional(),
  addressText: z.string().optional(),
  landmark: z.string().optional(),
 

 });

export default locationDetailsProjectSchema;
 