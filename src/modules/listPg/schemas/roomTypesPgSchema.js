import { z } from 'zod';

/**
 * Enhanced Schema for pricing item in detailed pricing array matching JSON structure
 */
const pricingItemSchema = z.object({
  type: z.string().min(1, 'Pricing type is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  currency: z.string().default('INR'),
  mandatory: z.boolean().default(true),
  refundable: z.boolean().optional(),
  frequency: z.enum(['monthly', 'one_time', 'per_unit']).optional(),
  unit: z.string().optional(),
  note: z.string().optional(),
});

/**
 * Enhanced Schema for room-specific amenity with icon matching JSON structure
 */
const roomAmenitySchema = z.object({
  icon: z.any().optional(), // For React component icons
  name: z.string().min(1, 'Amenity name is required'),
  available: z.boolean().default(true),
});

/**
 * Enhanced Schema for availability object matching JSON structure
 */
const availabilitySchema = z.object({
  totalBeds: z.number().min(0, 'Total beds cannot be negative'),
  availableBeds: z.number().min(0, 'Available beds cannot be negative'),
  soldOut: z.boolean().default(false),
  nextAvailability: z.string().default('Immediate'),
  seasonalPricing: z.boolean().default(false),
});

/**
 * Enhanced Schema for individual room type matching JSON structure
 */
const roomTypeSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(), // For tracking in field array
  
  // Room identification
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  
  // Room category matching JSON values
  category: z.enum([
    'Single sharing',
    'Double sharing', 
    'Triple sharing',
    'Four sharing',
    'Six sharing',
    'Private room',
    'Studio'
  ], {
    required_error: 'Please select room category',
  }),
  
  // Room facilities matching JSON structure
  ac: z.boolean().default(false),
  hasAc: z.boolean().default(false), // Legacy field
  
  attachedWashroom: z.boolean().default(false),
  hasAttachedWashroom: z.boolean().default(false), // Legacy field
  
  balcony: z.boolean().default(false),
  hasBalcony: z.boolean().default(false), // Legacy field
  
  // Room size - enhanced to handle string format from JSON
  roomSize: z.union([
    z.string().min(1, 'Room size is required'),
    z.number().min(1, 'Room size must be positive')
  ]).transform((val) => {
    if (typeof val === 'string') {
      // Handle formats like "120 sq.ft", "150 sq.ft"
      const match = val.match(/(\d+)/);
      return match ? parseInt(match[1]) : val;
    }
    return val;
  }),
  
  // Enhanced Pricing Array - Primary structure from JSON
  pricing: z.array(pricingItemSchema).min(1, 'At least one pricing item is required').default([]),
  
  // Enhanced Availability Object - matching JSON structure
  availability: availabilitySchema.optional().default({
    totalBeds: 0,
    availableBeds: 0,
    soldOut: false,
    nextAvailability: 'Immediate',
    seasonalPricing: false,
  }),
  
  // Legacy pricing fields for backward compatibility
  rentPerMonth: z.union([z.string(), z.number()]).optional()
    .transform((val) => typeof val === 'string' ? parseInt(val) || 0 : val || 0),
  
  securityDeposit: z.union([z.string(), z.number()]).optional()
    .transform((val) => typeof val === 'string' ? parseInt(val) || 0 : val || 0),
  
  maintenanceCharges: z.union([z.string(), z.number()]).optional()
    .transform((val) => typeof val === 'string' ? parseInt(val) || 0 : val || 0),
  
  // Legacy food fields
  isFoodIncluded: z.boolean().default(false),
  foodCost: z.union([z.string(), z.number()]).optional()
    .transform((val) => typeof val === 'string' ? parseInt(val) || 0 : val || 0),
  
  // Legacy electricity fields  
  isElectricityIncluded: z.boolean().default(false),
  electricityPerUnit: z.union([z.string(), z.number()]).optional()
    .transform((val) => typeof val === 'string' ? parseFloat(val) || 0 : val || 0),
  
  // Legacy booking fields
  bookingAmount: z.union([z.string(), z.number()]).optional()
    .transform((val) => typeof val === 'string' ? parseInt(val) || 0 : val || 0),
  
  // Refund policy - enhanced to match JSON structure
  refundPolicy: z.string().min(5, 'Please describe the refund policy'),
  refundPolicyEnum: z.enum(['full', 'partial', 'non_refundable']).optional(),
  
  // Legacy availability fields
  availableRooms: z.union([z.string(), z.number()]).optional()
    .transform((val) => typeof val === 'string' ? parseInt(val) || 0 : val || 0),
  
  totalRooms: z.union([z.string(), z.number()]).optional()  
    .transform((val) => typeof val === 'string' ? parseInt(val) || 1 : val || 1),
  
  available: z.number().min(0, 'Available count cannot be negative').optional(),
  
  // Room-specific amenities matching JSON structure
  amenities: z.array(roomAmenitySchema).default([]),
}).refine(
  (room) => {
    // Enhanced validation for availability
    if (room.availability) {
      return room.availability.availableBeds <= room.availability.totalBeds;
    }
    // Legacy validation
    if (room.availableRooms !== undefined && room.totalRooms !== undefined) {
      return room.availableRooms <= room.totalRooms;
    }
    return true;
  },
  {
    message: 'Available beds/rooms cannot exceed total beds/rooms',
    path: ['availability'],
  }
).refine(
  (room) => {
    // Ensure at least basic pricing structure exists
    if (room.pricing && room.pricing.length === 0 && !room.rentPerMonth) {
      return false;
    }
    return true;
  },
  {
    message: 'Either pricing array or basic rent information is required',
    path: ['pricing'],
  }
);

/**
 * Enhanced Schema for Room Types array matching JSON structure
 */
const roomTypesPgSchema = z.object({
  // Primary roomTypes array matching JSON structure
  roomTypes: z.array(roomTypeSchema)
    .min(1, 'Please add at least one room type')
    .refine(
      (rooms) => {
        // Validate each room type has unique names
        const names = rooms.map(room => room.name.toLowerCase().trim());
        return new Set(names).size === names.length;
      },
      {
        message: 'Room type names must be unique',
      }
    )
    .refine(
      (rooms) => {
        // Validate availability consistency
        return rooms.every(room => {
          if (room.availability) {
            return room.availability.availableBeds <= room.availability.totalBeds;
          }
          return room.availableRooms <= room.totalRooms;
        });
      },
      {
        message: 'Available beds cannot exceed total beds for any room type',
      }
    ),
});

export default roomTypesPgSchema;
export { roomTypeSchema };
