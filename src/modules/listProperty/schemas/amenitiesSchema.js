import { z } from 'zod';

/**
 * Enhanced Amenities Schema
 * Phase 1 Enhancement - Step 14: Amenities & Features
 * 
 * Separated into Property Features (building-level) and Unit Amenities (flat-level)
 */
export const amenitiesSchema = z.object({
  // Existing toggles
  isGated: z.boolean().default(false),
  fireSafety: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  
  // Property Features (Building/Property Level)
  features: z.array(z.enum([
    'gym',
    'swimming_pool',
    'clubhouse',
    'garden',
    'children_play_area',
    'jogging_track',
    'lift',
    'power_backup',
    'water_supply_247',
    'visitor_parking',
    'security_247',
    'cctv_surveillance',
    'maintenance_staff',
    'rainwater_harvesting',
    'waste_disposal',
    'piped_gas',
  ])).optional().default([]),
  
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
  ])).optional().default([]),
});

export default amenitiesSchema;
