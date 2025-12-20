import { z } from 'zod';

/**
 * Media Categories for Project/Property
 */
export const MEDIA_CATEGORIES = [
  { id: 'exterior', label: 'Exterior Views', description: 'Building exterior, facade, entrance' },
  { id: 'interior', label: 'Interior Views', description: 'Lobby, corridors, common indoor spaces' },
  { id: 'sample_flat', label: 'Sample Flat', description: 'Model apartments, sample units' },
  { id: 'amenities', label: 'Amenities', description: 'Gym, pool, clubhouse, sports facilities' },
  { id: 'construction', label: 'Construction Progress', description: 'Current construction status, progress photos' },
  { id: 'master_plan', label: 'Master Plan', description: 'Layout, site plan, development map' },
  { id: 'floor_plan', label: 'Floor Plans', description: 'Unit layouts, floor configurations' },
  { id: 'location', label: 'Location & Surroundings', description: 'Nearby places, connectivity, neighborhood' },
];

/**
 * Video Types for Project showcase
 */
export const VIDEO_TYPES = [
  { id: 'project_walkthrough', label: 'Project Walkthrough', description: 'Complete project tour' },
  { id: 'sample_flat_tour', label: 'Sample Flat Tour', description: 'Detailed apartment showcase' },
  { id: 'amenities_tour', label: 'Amenities Tour', description: 'Facilities and amenities showcase' },
  { id: 'construction_update', label: 'Construction Update', description: 'Progress video updates' },
  { id: 'location_tour', label: 'Location Tour', description: 'Area and connectivity showcase' },
  { id: 'drone_view', label: 'Drone View', description: 'Aerial view of project' },
  { id: 'developer_message', label: 'Developer Message', description: 'Builder introduction and commitment' },
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
  category: z.enum(['exterior', 'interior', 'sample_flat', 'amenities', 'construction', 'master_plan', 'floor_plan', 'location']),
  subcategory: z.string().optional(),
  caption: z.string().max(200, 'Caption must be less than 200 characters').optional(),
  altText: z.string().max(150, 'Alt text must be less than 150 characters').optional(),
  tags: z.array(z.string()).optional().default([]),
  isPrimary: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().min(0).optional().default(0),
  uploadedAt: z.string().optional(),
  fileSize: z.number().optional(),
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
  type: z.enum(['project_walkthrough', 'sample_flat_tour', 'amenities_tour', 'construction_update', 'location_tour', 'drone_view', 'developer_message']),
  platform: z.enum(['youtube', 'vimeo', 'direct_upload', 'other']).optional().default('other'),
  title: z.string().max(100, 'Video title must be less than 100 characters').optional(),
  description: z.string().max(500, 'Video description must be less than 500 characters').optional(),
  thumbnail: z.string().url().optional(),
  duration: z.number().min(1).optional(),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().min(0).optional().default(0),
  uploadedAt: z.string().optional(),
  fileSize: z.number().optional(),
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
  embedCode: z.string().optional(),
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
  coverImage: z.string().optional(),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().min(0).optional().default(0),
});

/**
 * Main Media Upload Project Schema
 */
const mediaUploadProjectSchema = z.object({
  // Enhanced Media Object Structure
  media: z.object({
    // Image Management
    images: z.array(imageSchema)
      .min(3, 'Please upload at least 3 images of your project')
      .max(100, 'Maximum 100 images allowed')
      .default([]),
    
    // Video Management
    videos: z.array(videoSchema)
      .max(20, 'Maximum 20 videos allowed')
      .default([]),
    
    // Virtual Tours
    virtualTours: z.array(virtualTourSchema)
      .max(5, 'Maximum 5 virtual tours allowed')
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
      storageUsed: z.number().min(0).default(0),
      lastUpdated: z.string().optional(),
    }).optional(),
  }).optional(),
  
  // Media Upload Settings
  uploadSettings: z.object({
    allowedImageFormats: z.array(z.string()).default(['jpg', 'jpeg', 'png', 'webp']),
    allowedVideoFormats: z.array(z.string()).default(['mp4', 'mov', 'avi', 'webm']),
    maxImageSize: z.number().default(10485760), // 10MB
    maxVideoSize: z.number().default(104857600), // 100MB
    compressionEnabled: z.boolean().default(true),
    watermarkEnabled: z.boolean().default(false),
    autoGenerateThumbnails: z.boolean().default(true),
  }).optional(),
  
  // Media Display Preferences
  displayPreferences: z.object({
    showImageCaptions: z.boolean().default(true),
    enableImageZoom: z.boolean().default(true),
    enableSlideshow: z.boolean().default(true),
    slideshowSpeed: z.number().min(1000).max(10000).default(4000),
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
  exteriorImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  interiorImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  amenitiesImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  sampleFlatImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  constructionProgressImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  masterPlanImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  locationMapImages: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional(),
  })).optional().default([]),
  
  videoWalkthroughUrl: z.string().url().optional().or(z.literal('')),
  virtualTourUrl: z.string().url().optional().or(z.literal('')),
  youtubeVideoUrl: z.string().url().optional().or(z.literal('')),
  droneShotUrl: z.string().url().optional().or(z.literal('')),
});

export { imageSchema, videoSchema, virtualTourSchema, mediaGallerySchema };
export default mediaUploadProjectSchema;
