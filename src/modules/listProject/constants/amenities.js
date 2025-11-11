/**
 * Project-level amenities and features
 * These are amenities that apply to the entire project/community
 */
export const PROJECT_AMENITIES = [
  // Sports & Fitness
  { id: 'gym', label: 'Gymnasium', icon: '🏋️', category: 'fitness' },
  { id: 'pool', label: 'Swimming Pool', icon: '🏊', category: 'fitness' },
  { id: 'yoga', label: 'Yoga/Meditation Area', icon: '🧘', category: 'fitness' },
  { id: 'jogging', label: 'Jogging Track', icon: '🏃', category: 'fitness' },
  { id: 'sports_court', label: 'Sports Court', icon: '⛹️', category: 'fitness' },
  { id: 'tennis', label: 'Tennis Court', icon: '🎾', category: 'fitness' },
  { id: 'badminton', label: 'Badminton Court', icon: '🏸', category: 'fitness' },
  { id: 'squash', label: 'Squash Court', icon: '🎾', category: 'fitness' },
  
  // Recreation & Entertainment
  { id: 'club', label: 'Club House', icon: '🎪', category: 'recreation' },
  { id: 'party_hall', label: 'Party Hall', icon: '🎉', category: 'recreation' },
  { id: 'theatre', label: 'Mini Theatre', icon: '🎬', category: 'recreation' },
  { id: 'library', label: 'Library', icon: '📚', category: 'recreation' },
  { id: 'kids_play', label: 'Children Play Area', icon: '🎠', category: 'recreation' },
  { id: 'garden', label: 'Landscaped Gardens', icon: '🌳', category: 'recreation' },
  { id: 'amphitheatre', label: 'Amphitheatre', icon: '🎭', category: 'recreation' },
  { id: 'indoor_games', label: 'Indoor Games Room', icon: '🎮', category: 'recreation' },
  
  // Security & Safety
  { id: 'security_24x7', label: '24/7 Security', icon: '🔒', category: 'security' },
  { id: 'cctv', label: 'CCTV Surveillance', icon: '📹', category: 'security' },
  { id: 'gated', label: 'Gated Community', icon: '🚧', category: 'security' },
  { id: 'fire_safety', label: 'Fire Safety Systems', icon: '🚒', category: 'security' },
  { id: 'intercom', label: 'Intercom Facility', icon: '📞', category: 'security' },
  
  // Essential Services
  { id: 'power_backup', label: 'Power Backup', icon: '⚡', category: 'utilities' },
  { id: 'water_24x7', label: '24/7 Water Supply', icon: '💧', category: 'utilities' },
  { id: 'water_harvesting', label: 'Rain Water Harvesting', icon: '🌧️', category: 'utilities' },
  { id: 'sewage', label: 'Sewage Treatment Plant', icon: '♻️', category: 'utilities' },
  { id: 'waste_disposal', label: 'Waste Disposal', icon: '🗑️', category: 'utilities' },
  { id: 'maintenance', label: 'Maintenance Staff', icon: '👷', category: 'utilities' },
  
  // Connectivity
  { id: 'wifi', label: 'High-Speed Internet', icon: '📶', category: 'connectivity' },
  { id: 'gas_pipeline', label: 'Gas Pipeline', icon: '🔥', category: 'connectivity' },
  { id: 'dtv', label: 'DTH/Cable TV', icon: '📺', category: 'connectivity' },
  
  // Parking & Transport
  { id: 'covered_parking', label: 'Covered Parking', icon: '🅿️', category: 'parking' },
  { id: 'visitor_parking', label: 'Visitor Parking', icon: '🚗', category: 'parking' },
  { id: 'ev_charging', label: 'EV Charging Points', icon: '🔌', category: 'parking' },
  
  // Convenience
  { id: 'shopping', label: 'Shopping Center', icon: '🛒', category: 'convenience' },
  { id: 'atm', label: 'ATM', icon: '🏧', category: 'convenience' },
  { id: 'pharmacy', label: 'Pharmacy', icon: '💊', category: 'convenience' },
  { id: 'salon', label: 'Salon/Spa', icon: '💆', category: 'convenience' },
  { id: 'restaurant', label: 'Restaurant/Cafe', icon: '☕', category: 'convenience' },
  
  // Green Features
  { id: 'solar', label: 'Solar Panels', icon: '☀️', category: 'green' },
  { id: 'organic_farm', label: 'Organic Farm', icon: '🌾', category: 'green' },
  { id: 'composting', label: 'Composting Facility', icon: '🌱', category: 'green' },
];

/**
 * Categories for organizing amenities
 */
export const AMENITY_CATEGORIES = {
  fitness: 'Sports & Fitness',
  recreation: 'Recreation & Entertainment',
  security: 'Security & Safety',
  utilities: 'Essential Services',
  connectivity: 'Connectivity',
  parking: 'Parking & Transport',
  convenience: 'Convenience',
  green: 'Green Features',
};
