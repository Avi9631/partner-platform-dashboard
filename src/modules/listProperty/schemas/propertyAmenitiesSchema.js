import { z } from 'zod';

/**
 * Property Amenities Schema
 * Step 2: Property/Building Level Features
 * 
 * Includes building/society-level features and facilities
 */
const propertyAmenitiesSchema = z.object({
  // Property Features (Building/Property Level)
  features: z.array(z.enum([
    'gated_society',
    'fire_safety',
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
});

export default propertyAmenitiesSchema;
