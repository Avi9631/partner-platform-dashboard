import { z } from 'zod';

/**
 * Schema for individual media item
 */
const mediaItemSchema = z.object({
  url: z.string().url('Invalid media URL'),
  file: z.any().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  docType: z.union([z.enum(['pg', 'hostel']), z.literal('')]).optional(),
  fileSize: z.number().optional(),
});

/**
 * Main Media Upload PG Schema
 */
const mediaUploadPgSchema = z.object({
  mediaData: z.array(mediaItemSchema)
    .min(1, 'At least one media item is required'),
});

export default mediaUploadPgSchema;
