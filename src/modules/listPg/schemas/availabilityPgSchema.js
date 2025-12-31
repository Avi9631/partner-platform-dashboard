import { z } from 'zod';

/**
 * Property status options
 */
export const PROPERTY_STATUS_OPTIONS = [
  { value: 'Available', label: 'Available', description: 'Property is ready for bookings with available beds', color: 'green' },
  { value: 'Partially Available', label: 'Partially Available', description: 'Some beds available, limited availability', color: 'orange' },
  { value: 'Fully Booked', label: 'Fully Booked', description: 'All beds occupied, accepting waitlist', color: 'red' },
  { value: 'Under Maintenance', label: 'Under Maintenance', description: 'Property temporarily unavailable for bookings', color: 'yellow' },
  { value: 'Coming Soon', label: 'Coming Soon', description: 'Property will be available soon', color: 'blue' }
];

/**
 * Possession options
 */
export const POSSESSION_OPTIONS = [
  { value: 'Immediate', label: 'Immediate', description: 'Move-in available immediately' },
  { value: 'Within 7 days', label: 'Within 7 days', description: 'Move-in available within a week' },
  { value: 'Within 15 days', label: 'Within 15 days', description: 'Move-in available within 2 weeks' },
  { value: 'Within 1 month', label: 'Within 1 month', description: 'Move-in available within 30 days' },
  { value: 'Custom Date', label: 'Custom Date', description: 'Specific move-in date' }
];
 

/**
 * Room-specific availability schema
 */
const availabilityPgSchema = z.object({
  roomTypeId: z.number().or(z.string()),
  soldOut: z.boolean().default(false),
  nextAvailability: z.string().optional().or(z.literal('')),
 }) ;
   
export default availabilityPgSchema;
