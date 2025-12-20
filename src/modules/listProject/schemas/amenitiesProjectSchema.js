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
 * Enhanced Schema for Project Amenities matching array-based structure
 */
const amenitiesProjectSchema = z.object({
  // Enhanced amenities array matching JSON structure
  amenities: z.array(amenitySchema).default([]),
  
 
}).refine(
  (data) => {
    // Allow empty amenities during form filling
    return true;
  },
  {
    message: 'Amenities validation passed',
    path: ['amenities'],
  }
);

export default amenitiesProjectSchema;

// Project Amenities List organized by category with icons
export const PROJECT_AMENITIES_LIST = [
  // Recreation & Lifestyle
  { 
    id: 'swimming_pool', 
    name: 'Swimming Pool', 
    icon: 'Waves', 
     available: true 
  },
  { 
    id: 'gymnasium', 
    name: 'Gymnasium', 
    icon: 'Dumbbell', 
     available: true 
  },
  { 
    id: 'clubhouse', 
    name: 'Clubhouse', 
    icon: 'Home', 
     available: true 
  },
  { 
    id: 'indoor_games_room', 
    name: 'Indoor Games Room', 
    icon: 'Gamepad2', 
     available: true 
  },
  { 
    id: 'kids_play_area', 
    name: 'Kids Play Area', 
    icon: 'Baby', 
     available: true 
  },
  { 
    id: 'jogging_track', 
    name: 'Jogging Track', 
    icon: 'FootprintsIcon', 
     available: true 
  },
  { 
    id: 'tennis_court', 
    name: 'Tennis Court', 
    icon: 'CircleDot', 
     available: false 
  },
  { 
    id: 'basketball_court', 
    name: 'Basketball Court', 
    icon: 'CircleDot', 
     available: false 
  },
  { 
    id: 'badminton_court', 
    name: 'Badminton Court', 
    icon: 'CircleDot', 
     available: false 
  },
  { 
    id: 'amphitheater', 
    name: 'Amphitheater', 
    icon: 'Theater', 
     available: false 
  },
  { 
    id: 'yoga_meditation_center', 
    name: 'Yoga & Meditation Center', 
    icon: 'Heart', 
     available: false 
  },
  { 
    id: 'party_hall', 
    name: 'Party Hall', 
    icon: 'PartyPopper', 
     available: false 
  },
  { 
    id: 'library', 
    name: 'Library', 
    icon: 'Library', 
     available: false 
  },
  { 
    id: 'coworking_spaces', 
    name: 'Co-working Spaces', 
    icon: 'Briefcase', 
     available: false 
  },
  { 
    id: 'mini_theater', 
    name: 'Mini Theater', 
    icon: 'Theater', 
     available: false 
  },
  { 
    id: 'spa_jacuzzi', 
    name: 'Spa & Jacuzzi', 
    icon: 'Waves', 
     available: false 
  },
  { 
    id: 'cafeteria', 
    name: 'Cafeteria', 
    icon: 'Coffee', 
     available: false 
  },
  { 
    id: 'convenience_store', 
    name: 'Convenience Store', 
    icon: 'Store', 
    category: 'recreation',
    available: false 
  },
  { 
    id: 'guest_rooms', 
    name: 'Guest Rooms', 
    icon: 'Bed', 
     available: false 
  },
  { 
    id: 'pet_park', 
    name: 'Pet Park', 
    icon: 'PawPrint', 
     available: false 
  },
  { 
    id: 'senior_citizen_sitout', 
    name: 'Senior Citizen Sitout', 
    icon: 'Users', 
     available: false 
  },
  { 
    id: 'landscaped_gardens', 
    name: 'Landscaped Gardens', 
    icon: 'Trees', 
     available: true 
  },

  // Security & Safety
  { 
    id: 'security_24x7', 
    name: '24x7 Security', 
    icon: 'Shield', 
     available: true 
  },
  { 
    id: 'cctv_surveillance', 
    name: 'CCTV Surveillance', 
    icon: 'ShieldCheck', 
     available: true 
  },
  { 
    id: 'gated_community', 
    name: 'Gated Community', 
    icon: 'LockKeyhole', 
     available: true 
  },
  { 
    id: 'intercom_facility', 
    name: 'Intercom Facility', 
    icon: 'Phone', 
     available: true 
  },
  { 
    id: 'fire_safety_systems', 
    name: 'Fire Safety Systems', 
    icon: 'Flame', 
     available: true 
  },
  { 
    id: 'earthquake_resistant', 
    name: 'Earthquake Resistant', 
    icon: 'ShieldAlert', 
     available: false 
  },
  { 
    id: 'video_doorphone_system', 
    name: 'Video Doorphone System', 
    icon: 'Video', 
     available: false 
  },
  { 
    id: 'security_cabin', 
    name: 'Security Cabin', 
    icon: 'Building2', 
     available: true 
  },

  // Utilities
  { 
    id: 'power_backup', 
    name: 'Power Backup', 
    icon: 'Zap', 
     available: true 
  },
  { 
    id: 'lift_elevator', 
    name: 'Lift/Elevator', 
    icon: 'MoveVertical', 
     available: true 
  },
  { 
    id: 'water_supply_24x7', 
    name: '24x7 Water Supply', 
    icon: 'Droplet', 
     available: true 
  },
  { 
    id: 'sewage_treatment_plant', 
    name: 'Sewage Treatment Plant', 
    icon: 'Recycle', 
     available: false 
  },
  { 
    id: 'waste_management', 
    name: 'Waste Management', 
    icon: 'Trash2', 
     available: true 
  },
  { 
    id: 'rainwater_harvesting', 
    name: 'Rainwater Harvesting', 
    icon: 'CloudRain', 
     available: false 
  },
  { 
    id: 'solar_panels', 
    name: 'Solar Panels', 
    icon: 'Sun', 
     available: false 
  },
  { 
    id: 'gas_line', 
    name: 'Gas Line', 
    icon: 'Flame', 
     available: true 
  },
  { 
    id: 'broadband_internet', 
    name: 'Broadband Internet', 
    icon: 'Wifi', 
     available: true 
  },
  { 
    id: 'visitor_parking', 
    name: 'Visitor Parking', 
    icon: 'CarIcon', 
     available: true 
  },

  // Green Features
  { 
    id: 'organic_waste_treatment', 
    name: 'Organic Waste Treatment', 
    icon: 'Leaf', 
     available: false 
  },
  { 
    id: 'green_building', 
    name: 'Green Building Certified', 
    icon: 'LeafIcon', 
     available: false 
  },
  { 
    id: 'ev_charging_stations', 
    name: 'EV Charging Stations', 
    icon: 'BatteryCharging', 
     available: false 
  },
  { 
    id: 'water_conservation', 
    name: 'Water Conservation System', 
    icon: 'Droplets', 
     available: false 
  },
  { 
    id: 'energy_efficient_lighting', 
    name: 'Energy Efficient Lighting', 
    icon: 'Lightbulb', 
     available: false 
  },
];
