import { z } from 'zod';

/**
 * Enhanced Amenities Schema
 * Phase 1 Enhancement - Step 14: Amenities
 * 
 * Comprehensive amenity categories with green features and accessibility
 */
export const amenitiesSchema = z.object({
  // Existing toggles
  isGated: z.boolean().default(false),
  fireSafety: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  
  // All amenities as array
  amenities: z.array(z.string()).optional().default([]),
  
  // NEW: Phase 1 enhancement - Categorized amenities for better UX
  
  // Building Features
  buildingAmenities: z.array(z.enum([
    'gym',
    'swimming_pool',
    'clubhouse',
    'garden',
    'children_play_area',
    'jogging_track',
    'sports_facility',
    'tennis_court',
    'basketball_court',
    'badminton_court',
    'yoga_center',
    'meditation_center',
    'indoor_games_room',
    'library',
    'multipurpose_hall'
  ])).optional().default([]),
  
  // Security Features
  securityAmenities: z.array(z.enum([
    'security_247',
    'cctv_surveillance',
    'security_guard',
    'intercom_facility',
    'fire_alarms',
    'fire_extinguishers',
    'earthquake_resistant',
    'emergency_exit',
    'emergency_response_system',
    'cctv_with_recording',
    'gated_entry',
    'security_patrol'
  ])).optional().default([]),
  
  // Basic Facilities
  basicFacilities: z.array(z.enum([
    'lift',
    'power_backup',
    'water_supply_247',
    'rainwater_harvesting',
    'waste_disposal',
    'water_purifier',
    'maintenance_staff',
    'housekeeping',
    'piped_gas',
    'sewage_treatment',
    'water_softener_plant'
  ])).optional().default([]),
  
  // Technology & Connectivity
  technologyAmenities: z.array(z.enum([
    'internet_wifi',
    'smart_home_system',
    'video_door_security',
    'solar_panels',
    'ev_charging_station',
    'intercom',
    'cable_tv',
    'high_speed_elevators'
  ])).optional().default([]),
  
  // NEW: Green & Sustainability Features
  greenAmenities: z.array(z.enum([
    'solar_panels',
    'rainwater_harvesting',
    'waste_recycling_system',
    'ev_charging_infrastructure',
    'low_carbon_paint',
    'green_building_certified',
    'composting_facility',
    'organic_waste_converter',
    'energy_efficient_lighting',
    'double_glazed_windows',
    'insulated_walls'
  ])).optional().default([]),
  
  // NEW: Community Facilities
  communityAmenities: z.array(z.enum([
    'coworking_space',
    'rooftop_garden',
    'shared_kitchen',
    'community_events_hall',
    'library',
    'guest_rooms',
    'party_hall',
    'amphitheater',
    'senior_citizen_sit_out',
    'kids_pool'
  ])).optional().default([]),
  
  // NEW: Health & Accessibility
  healthAccessibility: z.array(z.enum([
    'wheelchair_access',
    'ramps',
    'senior_citizen_friendly',
    'air_quality_monitors',
    'dedicated_medical_room',
    'pharmacy_on_site',
    'ambulance_on_call',
    'disabled_friendly',
    'braille_signage',
    'wider_doorways'
  ])).optional().default([]),
  
  // Environment & Landscape
  environmentalAmenities: z.array(z.enum([
    'landscaping',
    'water_feature',
    'terrace_garden',
    'green_area',
    'tree_plantation',
    'flower_garden',
    'herb_garden',
    'butterfly_park',
    'rock_garden'
  ])).optional().default([]),
  
  // Parking
  parkingAmenities: z.array(z.enum([
    'visitor_parking',
    'covered_parking',
    'open_parking',
    'ev_charging_points',
    'valet_parking',
    'two_wheeler_parking',
    'car_wash_area'
  ])).optional().default([]),
  
  // Recreation
  recreationalAmenities: z.array(z.enum([
    'swimming_pool',
    'kids_pool',
    'jacuzzi',
    'sauna',
    'steam_room',
    'spa',
    'salon',
    'banquet_hall',
    'bbq_area',
    'outdoor_cinema',
    'games_room'
  ])).optional().default([]),
  
  // Convenience
  convenienceAmenities: z.array(z.enum([
    'atm',
    'convenience_store',
    'mini_theatre',
    'restaurant',
    'cafe',
    'laundry_service',
    'grocery_shop',
    'milk_booth',
    'newspaper_delivery',
    'package_locker'
  ])).optional().default([]),
});

export default amenitiesSchema;
