import { z } from 'zod';

/**
 * Schema for individual rule item
 */
const ruleItemSchema = z.object({
  key: z.string().min(1, 'Rule key is required').max(100, 'Rule key must be less than 100 characters'),
  value: z.string().min(1, 'Rule value is required').max(200, 'Rule value must be less than 200 characters'),
});

/**
 * Common rule categories with default values
 */
export const RULE_CATEGORIES = [
  {
    key: 'Gate Closing Time',
    category: 'Security & Access',
    icon: 'Clock',
    description: 'Property gate closing time',
    suggestions: ['10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '24x7 Open']
  },
  {
    key: 'Visitor Policy',
    category: 'Visitors & Guests', 
    icon: 'Users',
    description: 'Guest and visitor policies',
    suggestions: [
      'Allowed till 9:00 PM with prior notice',
      'Allowed till 10:00 PM with permission',
      'Day visitors only (6 AM - 8 PM)',
      'Prior approval required',
      'Not allowed'
    ]
  },
  {
    key: 'Alcohol',
    category: 'Lifestyle Rules',
    icon: 'Ban',
    description: 'Alcohol consumption policy',
    suggestions: ['Yes', 'No', 'Outside only', 'Special occasions only']
  },
  {
    key: 'Smoking',
    category: 'Lifestyle Rules',
    icon: 'Cigarette',
    description: 'Smoking policy',
    suggestions: ['No', 'Yes', 'Designated areas only', 'Balcony/Terrace only']
  },
  {
    key: 'Non-veg',
    category: 'Food Policy',
    icon: 'UtensilsCrossed',
    description: 'Non-vegetarian food policy',
    suggestions: ['Yes', 'No', 'Outside only', 'Eggs allowed only']
  },
  {
    key: 'Pets',
    category: 'Pet Policy',
    icon: 'Dog',
    description: 'Pet accommodation policy',
    suggestions: ['No', 'Yes', 'Small pets only', 'With approval']
  },
  {
    key: 'Noise Policy',
    category: 'Community Guidelines',
    icon: 'Volume2',
    description: 'Noise and quiet hours policy',
    suggestions: [
      'Silence after 10:30 PM',
      'Quiet hours: 10 PM - 7 AM',
      'No loud music after 9 PM',
      'Maintain normal voice levels'
    ]
  },
  {
    key: 'Minimum Stay',
    category: 'Tenancy Terms',
    icon: 'Calendar',
    description: 'Minimum stay duration',
    suggestions: ['1 month', '2 months', '3 months', '6 months', '11 months']
  },
  {
    key: 'Move Out Notice',
    category: 'Tenancy Terms',
    icon: 'CalendarDays',
    description: 'Notice period for moving out',
    suggestions: ['15 days', '1 month', '30 days', '45 days', '2 months']
  },
  {
    key: 'Other',
    category: 'General Guidelines',
    icon: 'FileText',
    description: 'Additional rules and guidelines',
    suggestions: [
      'Please maintain cleanliness in common areas and respect fellow residents',
      'No parties or gatherings without permission',
      'Use of common facilities on first-come-first-serve basis',
      'Strictly follow COVID-19 safety protocols'
    ]
  }
];

/**
 * Sample rules for quick setup
 */
export const SAMPLE_RULES = [
  { key: 'Gate Closing Time', value: '11:00 PM' },
  { key: 'Visitor Policy', value: 'Allowed till 9:00 PM with prior notice' },
  { key: 'Alcohol', value: 'No' },
  { key: 'Smoking', value: 'No' },
  { key: 'Non-veg', value: 'Yes' },
  { key: 'Pets', value: 'No' },
  { key: 'Noise Policy', value: 'Silence after 10:30 PM' },
  { key: 'Minimum Stay', value: '3 months' },
  { key: 'Move Out Notice', value: '1 month' },
];

/**
 * Schema for Rules and Restrictions
 */
const rulesRestrictionsPgSchema = z.object({
  // Structured rules array (matches JSON format)
  rules: z.array(ruleItemSchema)
    .min(1, 'At least one rule must be specified')
    .max(20, 'Maximum 20 rules allowed')
    .default([]),
  
  // Legacy individual fields for backward compatibility
  gateClosingTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time (HH:MM format)')
    .optional()
    .or(z.literal('')),
  
  visitorPolicy: z.enum(['allowed', 'allowed_with_permission', 'not_allowed'], {
    required_error: 'Please select visitor policy',
  }).optional(),
  
  visitorTimings: z.string()
    .max(100, 'Visitor timings must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  
  isAlcoholAllowed: z.boolean().default(false),
  alcoholAllowed: z.string().optional(),
  
  isSmokingAllowed: z.boolean().default(false),
  smokingAllowed: z.string().optional(),
  
  smokingArea: z.enum(['anywhere', 'designated_area', 'not_allowed'])
    .optional(),
  
  isNonVegAllowed: z.boolean().default(false),
  nonVegAllowed: z.string().optional(),
  
  arePetsAllowed: z.boolean().default(false),
  petsAllowed: z.string().optional(),
  
  noisePolicy: z.string().optional().or(z.literal('')),
  
  quietHoursStart: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time (HH:MM format)')
    .optional()
    .or(z.literal('')),
  
  quietHoursEnd: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time (HH:MM format)')
    .optional()
    .or(z.literal('')),
  
  minimumStayPeriod: z.string()
    .regex(/^\d+$/, 'Please enter number of months')
    .transform(Number)
    .refine(val => val >= 1 && val <= 24, 'Minimum stay must be between 1 and 24 months')
    .optional(),
  
  minimumStay: z.string().optional().or(z.literal('')),
  
  noticePeriod: z.string()
    .regex(/^\d+$/, 'Please enter number of days')
    .transform(Number)
    .refine(val => val >= 0 && val <= 90, 'Notice period must be between 0 and 90 days')
    .optional(),
  
  moveOutNotice: z.string().optional().or(z.literal('')),
  
  additionalRules: z.string()
    .max(500, 'Additional rules must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  other: z.string().optional().or(z.literal('')),
});

export default rulesRestrictionsPgSchema;
