/**
 * Amenities and features available for property listings
 * Each amenity has a unique id, display label, and emoji icon
 */
export const AMENITIES_LIST = [
  { id: 'gym', label: 'Gymnasium', icon: '🏋️', category: 'fitness' },
  { id: 'pool', label: 'Swimming Pool', icon: '🏊', category: 'fitness' },
  { id: 'yoga', label: 'Yoga/Meditation Area', icon: '🧘', category: 'fitness' },
  { id: 'jogging', label: 'Jogging Track', icon: '🏃', category: 'fitness' },
  
  { id: 'club', label: 'Club House', icon: '🎪', category: 'recreation' },
  { id: 'park', label: 'Children Park', icon: '🎠', category: 'recreation' },
  { id: 'garden', label: 'Landscaped Garden', icon: '🌳', category: 'recreation' },
  
  { id: 'security', label: '24/7 Security', icon: '🔒', category: 'security' },
  { id: 'cctv', label: 'CCTV Surveillance', icon: '📹', category: 'security' },
  { id: 'intercom', label: 'Intercom Facility', icon: '📞', category: 'security' },
  
  { id: 'lift', label: 'Lift/Elevator', icon: '🛗', category: 'utilities' },
  { id: 'parking', label: 'Visitor Parking', icon: '🅿️', category: 'utilities' },
  { id: 'power', label: 'Power Backup', icon: '⚡', category: 'utilities' },
  { id: 'water', label: '24/7 Water Supply', icon: '💧', category: 'utilities' },
  { id: 'wifi', label: 'High-Speed Internet', icon: '📶', category: 'utilities' },
  { id: 'maintenance', label: 'Maintenance Staff', icon: '👷', category: 'utilities' },
];

/**
 * Categories for organizing amenities
 */
export const AMENITY_CATEGORIES = {
  fitness: 'Fitness & Wellness',
  recreation: 'Recreation',
  security: 'Security',
  utilities: 'Utilities & Services',
};
