import { z } from 'zod';

/**
 * Basic Configuration Schema
 */
export const basicConfigurationSchema = z.object({
  bedrooms: z.string().min(1, 'Please select number of bedrooms'),
  bathrooms: z.string().min(1, 'Please select number of bathrooms'),
  
  additionalRooms: z.array(z.object({
    id: z.string(),
    type: z.enum([
      'balcony',
      'servantRoom',
      'studyRoom',
      'storeRoom',
      'poojaRoom',
      'homeOffice',
      'guestRoom',
      'utilityRoom',
      'diningRoom',
      'familyRoom',
      'laundryRoom'
    ], {
      required_error: 'Please select a room type',
      invalid_type_error: 'Please select a valid room type',
    }),
    count: z.string().min(1, 'Please select count'),
  })).max(10, 'Maximum 10 additional rooms allowed').optional().default([]),
  
  roomDimensions: z.array(z.object({
    id: z.string(),
    roomName: z.string().min(1, 'Room name is required').max(50),
    length: z.string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Length must be a positive number',
      }),
    width: z.string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Width must be a positive number',
      }),
    unit: z.enum(['feet', 'meters']).default('feet'),
  })).max(10, 'Maximum 10 room dimensions allowed').optional().default([]),
});

export default basicConfigurationSchema;
