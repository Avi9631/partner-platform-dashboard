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
 * Seasonal pricing periods
 */
export const SEASONAL_PERIODS = [
  { id: 'peak_summer', name: 'Peak Summer', months: ['April', 'May', 'June'], multiplier: 1.2 },
  { id: 'monsoon', name: 'Monsoon Season', months: ['July', 'August', 'September'], multiplier: 0.9 },
  { id: 'festival_season', name: 'Festival Season', months: ['October', 'November'], multiplier: 1.1 },
  { id: 'winter', name: 'Winter', months: ['December', 'January', 'February'], multiplier: 1.0 },
  { id: 'academic_year', name: 'Academic Year Start', months: ['June', 'July'], multiplier: 1.3 }
];

/**
 * Room-specific availability schema
 */
const roomAvailabilitySchema = z.object({
  roomTypeId: z.number().or(z.string()),
  totalBeds: z.number().min(1, 'Total beds must be at least 1').max(50, 'Maximum 50 beds per room type'),
  availableBeds: z.number().min(0, 'Available beds cannot be negative'),
  soldOut: z.boolean().default(false),
  nextAvailability: z.string().optional().or(z.literal('')),
  seasonalPricing: z.boolean().default(false),
  waitlistCount: z.number().min(0, 'Waitlist count cannot be negative').optional().default(0),
  lastUpdated: z.string().optional().or(z.literal('')),
}).refine(
  (data) => {
    return data.availableBeds <= data.totalBeds;
  },
  {
    message: 'Available beds cannot exceed total beds',
    path: ['availableBeds'],
  }
);

/**
 * Seasonal pricing configuration
 */
const seasonalPricingSchema = z.object({
  periodId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  priceMultiplier: z.number().min(0.5, 'Multiplier must be at least 0.5').max(2.0, 'Multiplier cannot exceed 2.0'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional().or(z.literal('')),
});

/**
 * Move-in scheduling
 */
const moveInScheduleSchema = z.object({
  availableFrom: z.string().optional().or(z.literal('')),
  availableTo: z.string().optional().or(z.literal('')),
  preferredMoveInDays: z.array(z.string()).optional().default([]),
  advanceBookingDays: z.number().min(0, 'Advance booking days cannot be negative').max(365, 'Maximum 365 days advance booking').optional().default(30),
  instantBooking: z.boolean().default(false),
});

/**
 * Schema for Availability and Inventory
 */
const availabilityPgSchema = z.object({
  // Overall property status (matching JSON)
  status: z.enum(['Available', 'Partially Available', 'Fully Booked', 'Under Maintenance', 'Coming Soon'], {
    required_error: 'Property status is required'
  }).default('Available'),
  
  // Possession timing (matching JSON)
  possession: z.string().min(1, 'Possession timing is required').default('Immediate'),
  
  // Custom possession date (if "Custom Date" selected)
  customPossessionDate: z.string().optional().or(z.literal('')),
  
  // Overall property availability summary
  propertyAvailability: z.object({
    totalBeds: z.number().min(1, 'Total beds must be at least 1').max(500, 'Maximum 500 beds allowed'),
    availableBeds: z.number().min(0, 'Available beds cannot be negative'),
    occupancyRate: z.number().min(0, 'Occupancy rate cannot be negative').max(100, 'Occupancy rate cannot exceed 100%').optional().default(0),
    waitlistCount: z.number().min(0, 'Waitlist count cannot be negative').optional().default(0),
    lastUpdated: z.string().optional().or(z.literal('')),
  }).default({
    totalBeds: 0,
    availableBeds: 0,
    occupancyRate: 0,
    waitlistCount: 0,
    lastUpdated: '',
  }),
  
  // Room-type specific availability (matches JSON roomTypes[].availability structure)
  roomAvailability: z.array(roomAvailabilitySchema).optional().default([]),
  
  // Booking and inventory settings
  bookingSettings: z.object({
    autoUpdateEnabled: z.boolean().default(false),
    instantBooking: z.boolean().default(false),
    advanceBookingDays: z.number().min(0).max(365).default(30),
    minimumStayDays: z.number().min(1).max(365).default(30),
    bufferBeds: z.number().min(0).max(10).default(0), // Keep some beds as buffer
    allowWaitlist: z.boolean().default(true),
  }).optional().default({
    autoUpdateEnabled: false,
    instantBooking: false,
    advanceBookingDays: 30,
    minimumStayDays: 30,
    bufferBeds: 0,
    allowWaitlist: true,
  }),
  
  // Seasonal pricing configuration
  seasonalPricing: z.object({
    enabled: z.boolean().default(false),
    periods: z.array(seasonalPricingSchema).optional().default([]),
  }).optional().default({
    enabled: false,
    periods: [],
  }),
  
  // Move-in scheduling
  moveInSchedule: moveInScheduleSchema.optional().default({
    availableFrom: '',
    availableTo: '',
    preferredMoveInDays: [],
    advanceBookingDays: 30,
    instantBooking: false,
  }),
  
  // Special offers and discounts
  specialOffers: z.object({
    earlyBirdDiscount: z.boolean().default(false),
    earlyBirdPercentage: z.number().min(0).max(50).optional().default(0),
    longStayDiscount: z.boolean().default(false),
    longStayPercentage: z.number().min(0).max(30).optional().default(0),
    referralDiscount: z.boolean().default(false),
    referralPercentage: z.number().min(0).max(25).optional().default(0),
  }).optional().default({
    earlyBirdDiscount: false,
    earlyBirdPercentage: 0,
    longStayDiscount: false,
    longStayPercentage: 0,
    referralDiscount: false,
    referralPercentage: 0,
  }),
  
  // Additional availability notes
  availabilityNotes: z.string()
    .max(500, 'Availability notes must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  // Legacy fields for backward compatibility
  totalBeds: z.string().regex(/^\d+$/, 'Total beds must be a number').transform(Number).refine(val => val > 0, 'Total beds must be greater than 0').optional(),
  availableBeds: z.string().regex(/^\d+$/, 'Available beds must be a number').transform(Number).refine(val => val >= 0, 'Available beds cannot be negative').optional(),
  isSoldOut: z.boolean().default(false),
  nextAvailabilityDate: z.string().optional().or(z.literal('')),
  autoUpdateEnabled: z.boolean().default(false),
  hasSeasonalPricing: z.boolean().default(false),
  seasonalPricingDetails: z.string().max(500, 'Seasonal pricing details must be less than 500 characters').optional().or(z.literal('')),
}).refine(
  (data) => {
    // Available beds should not exceed total beds
    if (data.propertyAvailability) {
      return data.propertyAvailability.availableBeds <= data.propertyAvailability.totalBeds;
    }
    return true;
  },
  {
    message: 'Available beds cannot exceed total beds',
    path: ['propertyAvailability', 'availableBeds'],
  }
).refine(
  (data) => {
    // If fully booked, next availability should be provided
    if (data.status === 'Fully Booked' && data.possession === 'Custom Date' && !data.customPossessionDate) {
      return false;
    }
    return true;
  },
  {
    message: 'Custom possession date is required when status is Fully Booked and possession is Custom Date',
    path: ['customPossessionDate'],
  }
);

export default availabilityPgSchema;
