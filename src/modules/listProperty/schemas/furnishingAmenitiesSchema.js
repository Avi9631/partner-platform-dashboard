import { z } from 'zod';

/**
 * Enhanced Furnishing & Amenities Schema
 * Phase 1 Enhancement - Step 6: Furnishing
 */
const furnishingAmenitiesSchema = z.object({
  furnishingStatus: z.enum(['unfurnished', 'semi', 'fully'], {
    required_error: 'Please select furnishing status',
  }),
  flooringTypes: z.array(z.string()).optional(),
  furnishingDetails: z.record(z.boolean()).optional(),
  
  // NEW: Phase 1 enhancements
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
});

export default furnishingAmenitiesSchema;
