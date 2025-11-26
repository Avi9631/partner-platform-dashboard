import { z } from 'zod';

/**
 * Enhanced Schema for amenity object matching JSON structure
 */
const amenitySchema = z.object({
  icon: z.any().optional(), // For React component icons
  name: z.string().min(1, 'Amenity name is required'),
  available: z.boolean().default(true),
});

/**
 * Enhanced Schema for Common and Room Amenities matching JSON structure
 */
const amenitiesPgSchema = z.object({
  // Enhanced Common Amenities array matching JSON structure
  commonAmenities: z.array(amenitySchema).default([]),
  
  // Legacy common amenities (array of strings for backward compatibility)
  commonAmenitiesLegacy: z.array(z.string()).optional().default([]),
  
  // Room-specific amenities are now handled in the room types schema
  // This is kept for any global room amenity settings
  roomAmenities: z.array(z.string()).optional().default([]),
}).refine(
  (data) => {
    // Ensure at least one format of amenities exists
    if (data.commonAmenities.length === 0 && data.commonAmenitiesLegacy.length === 0) {
      return true; // Allow empty amenities during form filling
    }
    return true;
  },
  {
    message: 'Amenities validation passed',
    path: ['commonAmenities'],
  }
);

export default amenitiesPgSchema;

// Enhanced Common Amenities List matching JSON structure with icons
export const COMMON_AMENITIES_LIST = [
  { id: 'high_speed_wifi', name: 'High Speed WiFi', icon: 'Wifi', available: true },
  { id: '2_wheeler_parking', name: '2-Wheeler Parking', icon: 'CarIcon', available: true },
  { id: '4_wheeler_parking', name: '4-Wheeler Parking', icon: 'CarIcon', available: false },
  { id: 'cctv_surveillance', name: 'CCTV Surveillance', icon: 'Shield', available: true },
  { id: 'power_backup', name: 'Power Backup', icon: 'Shield', available: true },
  { id: 'lift', name: 'Lift', icon: 'Building2', available: true },
  { id: 'housekeeping', name: 'Housekeeping', icon: 'Users', available: true },
  { id: 'laundry_service', name: 'Laundry Service', icon: 'Waves', available: true },
  { id: 'water_purifier', name: 'Water Purifier', icon: 'Waves', available: true },
  { id: 'security_guard', name: 'Security Guard', icon: 'Shield', available: true },
  { id: 'biometric_access', name: 'Biometric Access', icon: 'Shield', available: true },
  { id: 'rooftop_access', name: 'Rooftop Access', icon: 'Trees', available: true },
  { id: 'common_tv_room', name: 'Common TV Room', icon: 'Building2', available: false },
  { id: 'gaming_room', name: 'Gaming Room', icon: 'Building2', available: false },
  { id: 'gym', name: 'Gym/Fitness Center', icon: 'Building2', available: false },
  { id: 'common_kitchen', name: 'Common Kitchen', icon: 'Building2', available: false },
  { id: 'study_room', name: 'Study Room', icon: 'Building2', available: false },
  { id: 'meeting_room', name: 'Meeting Room', icon: 'Building2', available: false },
  { id: 'terrace_garden', name: 'Terrace Garden', icon: 'Trees', available: false },
  { id: 'swimming_pool', name: 'Swimming Pool', icon: 'Waves', available: false },
];

// Room Amenities List (now handled in room types schema but kept for reference)
export const ROOM_AMENITIES_LIST = [
  { id: 'queen_size_bed', name: 'Queen Size Bed', icon: 'Bed', available: true },
  { id: 'single_bed', name: 'Single Bed', icon: 'Bed', available: true },
  { id: 'double_bed', name: 'Double Bed', icon: 'Bed', available: true },
  { id: '2_single_beds', name: '2 Single Beds', icon: 'Bed', available: true },
  { id: '3_single_beds', name: '3 Single Beds', icon: 'Bed', available: true },
  { id: 'premium_mattress', name: 'Premium Mattress', icon: 'Bed', available: true },
  { id: 'mattress_included', name: 'Mattress Included', icon: 'Bed', available: true },
  { id: 'large_cupboard', name: 'Large Cupboard', icon: 'Building2', available: true },
  { id: '2_cupboards', name: '2 Cupboards', icon: 'Building2', available: true },
  { id: '3_cupboards', name: '3 Cupboards', icon: 'Building2', available: true },
  { id: 'study_table_chair', name: 'Study Table & Chair', icon: 'Building2', available: true },
  { id: '2_study_tables', name: '2 Study Tables', icon: 'Building2', available: true },
  { id: 'study_tables', name: 'Study Tables', icon: 'Building2', available: true },
  { id: 'ac', name: 'AC', icon: 'Building2', available: true },
  { id: '3_fans', name: '3 Fans', icon: 'Building2', available: true },
  { id: 'attached_bathroom', name: 'Attached Bathroom', icon: 'Building2', available: true },
  { id: 'common_bathroom', name: 'Common Bathroom', icon: 'Building2', available: true },
  { id: 'balcony', name: 'Balcony', icon: 'Building2', available: true },
  { id: 'high_speed_wifi', name: 'High Speed WiFi', icon: 'Wifi', available: true },
  { id: 'mini_refrigerator', name: 'Mini Refrigerator', icon: 'Building2', available: true },
  { id: 'shared_refrigerator', name: 'Shared Refrigerator', icon: 'Building2', available: true },
  { id: 'tv', name: 'TV', icon: 'Building2', available: false },
  { id: 'window', name: 'Window', icon: 'Building2', available: true },
];
