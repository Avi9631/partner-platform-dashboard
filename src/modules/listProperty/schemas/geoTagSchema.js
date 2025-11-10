import { z } from 'zod';

export const geoTagSchema = z.object({
  geoTagStatus: z.enum(['pending', 'success', 'failed'], {
    required_error: 'Geo tag status is required',
  }),
  geoTagCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable().optional(),
  geoTagDistance: z.number().nullable().optional(),
  geoTagTimestamp: z.string().nullable().optional(),
});

export default geoTagSchema;
