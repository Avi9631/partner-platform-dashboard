import { z } from 'zod';

/**
 * Media Categories for organized content management
 */
export const MEDIA_CATEGORIES = [
  { id: 'exterior', label: 'Exterior Views', description: 'Building exterior, entrance, parking area' },
  { id: 'lobby', label: 'Lobby & Reception', description: 'Reception area, lobby, waiting area' },
  { id: 'rooms', label: 'Room Types', description: 'Different room configurations and setups' },
  { id: 'common_areas', label: 'Common Areas', description: 'Living areas, study rooms, recreation spaces' },
  { id: 'kitchen_dining', label: 'Kitchen & Dining', description: 'Kitchen, dining area, mess facilities' },
  { id: 'washrooms', label: 'Washrooms & Facilities', description: 'Bathrooms, washrooms, laundry area' },
  { id: 'amenities', label: 'Amenities', description: 'Gym, game room, rooftop, parking' },
  { id: 'surroundings', label: 'Surroundings', description: 'Nearby places, locality, transport' },
];

/**
 * Video Types for categorized video content
 */
export const VIDEO_TYPES = [
  { id: 'property_tour', label: 'Complete Property Tour', description: 'Full walkthrough of the property' },
  { id: 'room_showcase', label: 'Room Showcase', description: 'Detailed room type demonstrations' },
  { id: 'amenities_tour', label: 'Amenities Tour', description: 'Facilities and amenities showcase' },
  { id: 'food_mess_tour', label: 'Food & Mess Tour', description: 'Kitchen and dining area tour' },
  { id: 'locality_tour', label: 'Locality Tour', description: 'Nearby area and connectivity showcase' },
  { id: 'testimonials', label: 'Tenant Testimonials', description: 'Current tenant reviews and experiences' },
];

/**
 * Virtual Tour Platforms supported
 */
export const VIRTUAL_TOUR_PLATFORMS = [
  { id: 'matterport', label: 'Matterport 3D Tour', pattern: /^https?:\/\/(my\.)?matterport\.com/ },
  { id: 'google_tour', label: 'Google Street View Tour', pattern: /^https?:\/\/(www\.)?google\.(com|co\.in)\/(maps|streetview)/ },
  { id: 'panoskin', label: 'PanoSkin Virtual Tour', pattern: /^https?:\/\/(www\.)?panoskin\.com/ },
  { id: 'custom', label: 'Custom Virtual Tour', pattern: /^https?:\/\// },
];

/**
 * Individual image schema with enhanced metadata
 */
const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Please provide a valid image URL'),
  filename: z.string().optional(),
  category: z.enum(['exterior', 'lobby', 'rooms', 'common_areas', 'kitchen_dining', 'washrooms', 'amenities', 'surroundings']),
  subcategory: z.string().optional(), // e.g., 'single_room', 'double_room', etc.
  caption: z.string().max(200, 'Caption must be less than 200 characters').optional(),
  altText: z.string().max(150, 'Alt text must be less than 150 characters').optional(),
  tags: z.array(z.string()).optional().default([]),
  isPrimary: z.boolean().default(false), // Main cover image
  isPublic: z.boolean().default(true),
  sortOrder: z.number().min(0).optional().default(0),
  uploadedAt: z.string().optional(),
  fileSize: z.number().optional(), // in bytes
  dimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
});

/**
 * Individual video schema with enhanced metadata
 */
const videoSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Please provide a valid video URL'),
  filename: z.string().optional(),
  type: z.enum(['property_tour', 'room_showcase', 'amenities_tour', 'food_mess_tour', 'locality_tour', 'testimonials']),
  platform: z.enum(['youtube', 'vimeo', 'direct_upload', 'other']).optional().default('other'),
  title: z.string().max(100, 'Video title must be less than 100 characters').optional(),
  description: z.string().max(500, 'Video description must be less than 500 characters').optional(),
  thumbnail: z.string().url().optional(),
  duration: z.number().min(1).optional(), // in seconds
  isPublic: z.boolean().default(true),
  sortOrder: z.number().min(0).optional().default(0),
  uploadedAt: z.string().optional(),
  fileSize: z.number().optional(), // in bytes
});

/**
 * Virtual tour schema
 */
const virtualTourSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Please provide a valid virtual tour URL'),
  platform: z.enum(['matterport', 'google_tour', 'panoskin', 'custom']).optional().default('custom'),
  title: z.string().max(100).optional(),
  description: z.string().max(300).optional(),
  thumbnail: z.string().url().optional(),
  isActive: z.boolean().default(true),
  embedCode: z.string().optional(), // For iframe embeds
  accessType: z.enum(['public', 'private', 'password_protected']).default('public'),
  password: z.string().optional(),
});

/**
 * Media gallery schema for organized content
 */
const mediaGallerySchema = z.object({
  id: z.string().optional(),
  name: z.string().max(100, 'Gallery name must be less than 100 characters'),
  description: z.string().max(300).optional(),
  category: z.string(),
  images: z.array(imageSchema).default([]),
  coverImage: z.string().optional(), // URL or ID of cover image
  isPublic: z.boolean().default(true),
  sortOrder: z.number().min(0).optional().default(0),
});

/**
 * Main Media Upload PG Schema
 */
const mediaUploadPgSchema = z.object({
  // Enhanced Media Object Structure
  media: z.object({
    // Image Management
    images: z.array(imageSchema)
      .min(3, 'Please upload at least 3 images of your property')
      .max(50, 'Maximum 50 images allowed')
      .default([]),
    
    // Video Management
    videos: z.array(videoSchema)
      .max(20, 'Maximum 20 videos allowed')
      .default([]),
    
    // Virtual Tours
    virtualTours: z.array(virtualTourSchema)
      .max(3, 'Maximum 3 virtual tours allowed')
      .default([]),
    
    // Organized Galleries
    galleries: z.array(mediaGallerySchema)
      .default([]),
    
    // Cover Image Settings
    coverImage: z.object({
      url: z.string().url().optional(),
      caption: z.string().max(200).optional(),
      position: z.enum(['center', 'top', 'bottom']).default('center'),
    }).optional(),
    
    // Media Statistics
    statistics: z.object({
      totalImages: z.number().min(0).default(0),
      totalVideos: z.number().min(0).default(0),
      totalVirtualTours: z.number().min(0).default(0),
      storageUsed: z.number().min(0).default(0), // in bytes
      lastUpdated: z.string().optional(),
    }).optional(),
  }).optional(),
  
  // Media Upload Settings
  uploadSettings: z.object({
    allowedImageFormats: z.array(z.string()).default(['jpg', 'jpeg', 'png', 'webp']),
    allowedVideoFormats: z.array(z.string()).default(['mp4', 'mov', 'avi', 'webm']),
    maxImageSize: z.number().default(10485760), // 10MB in bytes
    maxVideoSize: z.number().default(104857600), // 100MB in bytes
    compressionEnabled: z.boolean().default(true),
    watermarkEnabled: z.boolean().default(false),
    autoGenerateThumbnails: z.boolean().default(true),
  }).optional(),
  
  // Media Display Preferences
  displayPreferences: z.object({
    showImageCaptions: z.boolean().default(true),
    enableImageZoom: z.boolean().default(true),
    enableSlideshow: z.boolean().default(true),
    slideshowSpeed: z.number().min(1000).max(10000).default(4000), // milliseconds
    enableLightbox: z.boolean().default(true),
    showMediaCount: z.boolean().default(true),
  }).optional(),
  
  // SEO and Optimization
  seoSettings: z.object({
    generateAltText: z.boolean().default(true),
    optimizeForWeb: z.boolean().default(true),
    lazyLoading: z.boolean().default(true),
    generateSitemap: z.boolean().default(false),
  }).optional(),
  
  // Legacy support fields (for backward compatibility)
  propertyImages: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['cover', 'gallery']),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  roomImages: z.array(z.object({
    url: z.string().url(),
    roomType: z.string(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  washroomImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  amenitiesImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  virtualTourUrl: z.string().url().optional().or(z.literal('')),
  
  videos: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['property_tour', 'room', 'common_area', 'food_area']),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
});

export { imageSchema, videoSchema, virtualTourSchema, mediaGallerySchema };
export default mediaUploadPgSchema;
