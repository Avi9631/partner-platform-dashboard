import { z } from 'zod';

/**
 * Unit Amenities Schema
 * Step 1: Furnishing + Unit Level Amenities
 * 
 * Includes furnishing details and flat/unit-specific amenities
 */
const unitAmenitiesSchema = z.object({
  // Furnishing Details
  furnishingStatus: z.enum(['unfurnished', 'semi', 'fully'], {
    required_error: 'Please select furnishing status',
  }),
  
  flooringTypes: z.array(z.string()).optional(),
  
  furnishingDetails: z.record(z.boolean()).optional(),
  
  smartHomeDevices: z.array(z.enum([
    'smart_door_lock',
    'smart_lights',
    'smart_thermostat',
    'cctv_cameras',
    'smart_switches',
    'video_doorbell',
    'smart_curtains',
    'home_automation_system',
    'voice_assistant',
    'smart_security_system'
  ])).optional().default([]),
  
  furnitureCondition: z.enum([
    'new',
    'excellent',
    'good',
    'fair',
    'needs_repair',
    'not_applicable'
  ]).optional(),
  
  // Unit Amenities (Flat/Unit Level)
  amenities: z.array(z.enum([
    'air_conditioning',
    'modular_kitchen',
    'furnished',
    'semi_furnished',
    'wardrobe',
    'balcony',
    'servant_room',
    'study_room',
    'pooja_room',
    'private_terrace',
    'private_garden',
    'internet_wifi',
    'intercom',
    'gas_pipeline',
    'water_purifier',
    'geyser',
    'pets_allowed',
  ])).optional().default([]),
});

export default unitAmenitiesSchema;
