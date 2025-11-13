import { z } from 'zod';

/**
 * Summary Insights Schema
 * Phase 2 Enhancement - Optional Dashboard Feature
 * 
 * Provides listing quality metrics and suggestions
 */
export const summaryInsightsSchema = z.object({
  // Discoverability Score (0-100)
  discoverabilityScore: z.number()
    .int()
    .min(0)
    .max(100)
    .default(0),
  
  // Component scores
  scoreBreakdown: z.object({
    requiredFieldsScore: z.number().min(0).max(40).default(0),
    optionalFieldsScore: z.number().min(0).max(30).default(0),
    mediaScore: z.number().min(0).max(15).default(0),
    amenitiesScore: z.number().min(0).max(10).default(0),
    documentsScore: z.number().min(0).max(5).default(0),
  }).optional(),
  
  // Completeness percentage
  completenessPercentage: z.number()
    .min(0)
    .max(100)
    .default(0),
  
  // Field statistics
  totalFields: z.number().int().min(0).default(0),
  filledFields: z.number().int().min(0).default(0),
  requiredFields: z.number().int().min(0).default(0),
  filledRequiredFields: z.number().int().min(0).default(0),
  
  // Missing important fields
  missingRequiredFields: z.array(z.string()).default([]),
  missingRecommendedFields: z.array(z.string()).default([]),
  
  // Media statistics
  photoCount: z.number().int().min(0).default(0),
  videoCount: z.number().int().min(0).default(0),
  hasFloorPlan: z.boolean().default(false),
  hasVirtualTour: z.boolean().default(false),
  
  // Documents statistics
  documentsUploaded: z.number().int().min(0).default(0),
  documentsVerified: z.number().int().min(0).default(0),
  
  // Amenities count
  amenitiesCount: z.number().int().min(0).default(0),
  
  // Quality indicators
  hasAllRequiredData: z.boolean().default(false),
  isReadyToPublish: z.boolean().default(false),
  qualityRating: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
  
  // Suggestions (auto-generated)
  suggestions: z.array(z.object({
    type: z.enum(['required', 'recommended', 'optimization']),
    category: z.string(),
    message: z.string(),
    fieldPath: z.string().optional(),
  })).default([]),
  
  // Estimated market data (Phase 3 - AI features)
  estimatedPriceRange: z.object({
    min: z.number(),
    max: z.number(),
    confidence: z.number().min(0).max(100),
  }).optional(),
  
  similarListingsCount: z.number().int().min(0).optional(),
  
  // Timestamp
  calculatedAt: z.string(),
});

export default summaryInsightsSchema;
