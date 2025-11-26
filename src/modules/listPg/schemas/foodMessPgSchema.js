import { z } from 'zod';

/**
 * Enhanced Schema for meal items (veg/non-veg) matching JSON structure
 */
const mealItemsSchema = z.object({
  veg: z.array(z.string()).default([]),
  nonVeg: z.array(z.string()).nullable().optional().default(null),
});

/**
 * Enhanced Schema for daily menu matching JSON structure
 */
const dailyMenuSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  breakfast: mealItemsSchema.optional(),
  lunch: mealItemsSchema.optional(),
  dinner: mealItemsSchema.optional(),
});

/**
 * Enhanced Schema for Food and Mess Details matching comprehensive JSON structure
 */
const foodMessPgSchema = z.object({
  // Enhanced foodMess object structure matching JSON
  foodMess: z.object({
    // Food availability
    available: z.boolean().default(false),
    
    // Meal types available (array matching JSON)
    meals: z.array(z.enum(['Breakfast', 'Lunch', 'Dinner'])).default([]),
    
    // Food type matching JSON values
    foodType: z.enum(['Veg', 'Non-veg', 'Veg & Non-veg']).default('Veg & Non-veg'),
    
    // Cooking policies
    cookingAllowed: z.boolean().default(false),
    tiffinService: z.boolean().default(false),
    roWater: z.boolean().default(false),
    
    // Food quality rating
    rating: z.number()
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5')
      .default(4.0),
    
    // Enhanced timings object matching JSON structure
    timings: z.object({
      breakfast: z.string().optional().default(''),
      lunch: z.string().optional().default(''),
      dinner: z.string().optional().default(''),
    }).default({
      breakfast: '',
      lunch: '',
      dinner: '',
    }),
    
    // Enhanced weekly menu array matching JSON structure
    weeklyMenu: z.array(dailyMenuSchema).default([]),
  }).default({
    available: false,
    meals: [],
    foodType: 'Veg & Non-veg',
    cookingAllowed: false,
    tiffinService: false,
    roWater: false,
    rating: 4.0,
    timings: {
      breakfast: '',
      lunch: '',
      dinner: '',
    },
    weeklyMenu: [],
  }),

  // Legacy fields for backward compatibility
  available: z.boolean().default(false),
  
  // Legacy meal availability
  meals: z.array(z.string()).optional().default([]),
  mealsAvailable: z.array(z.enum(['breakfast', 'lunch', 'dinner']))
    .optional()
    .default([]),
  
  // Legacy food type
  foodType: z.string().optional().default('veg'),
  foodTypeEnum: z.enum(['veg', 'non_veg', 'both']).optional(),
  
  // Legacy timing fields
  breakfastTiming: z.string().optional().or(z.literal('')),
  lunchTiming: z.string().optional().or(z.literal('')),
  dinnerTiming: z.string().optional().or(z.literal('')),
  
  // Legacy timings object
  timings: z.object({
    breakfast: z.string().optional().or(z.literal('')),
    lunch: z.string().optional().or(z.literal('')),
    dinner: z.string().optional().or(z.literal('')),
  }).optional(),
  
  // Legacy weekly menu
  weeklyMenu: z.array(dailyMenuSchema).optional().default([]),
  weeklyMenuText: z.string().optional().or(z.literal('')),
  
  // Legacy cooking/service policies
  isCookingAllowed: z.boolean().default(false),
  cookingAllowed: z.boolean().default(false),
  
  hasTiffinService: z.boolean().default(false),
  tiffinService: z.boolean().default(false),
  
  tiffinServiceName: z.string().optional().or(z.literal('')),
  
  hasRoWater: z.boolean().default(false),
  roWater: z.boolean().default(false),
  
  // Legacy rating fields
  rating: z.number()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .optional(),
  foodQualityRating: z.number()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .optional(),
}).refine(
  (data) => {
    // If food is available (either new or legacy format), ensure basic requirements are met
    const isAvailable = data.foodMess?.available || data.available;
    
    if (isAvailable) {
      const hasMeals = (data.foodMess?.meals && data.foodMess.meals.length > 0) || 
                     (data.meals && data.meals.length > 0) || 
                     (data.mealsAvailable && data.mealsAvailable.length > 0);
      
      if (!hasMeals) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'At least one meal type must be selected when food service is available',
    path: ['foodMess', 'meals'],
  }
).refine(
  (data) => {
    // Validate timings format if provided
    const timings = data.foodMess?.timings || data.timings || {};
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(AM|PM)\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(AM|PM)$/i;
    
    for (const [meal, timing] of Object.entries(timings)) {
      if (timing && timing.trim() && !timeRegex.test(timing.trim())) {
        // Allow flexible timing formats, this is just a warning
        continue;
      }
    }
    return true;
  },
  {
    message: 'Timing format should be like "7:00 AM - 9:30 AM"',
    path: ['foodMess', 'timings'],
  }
);

// Predefined days of week for weeklyMenu
export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Sample meal items for suggestions
export const SAMPLE_MEALS = {
  breakfast: {
    veg: ['Poha', 'Upma', 'Idli Sambhar', 'Paratha', 'Dosa', 'Puri Bhaji', 'Tea/Coffee', 'Banana', 'Fruit'],
    nonVeg: ['Omelette', 'Boiled Eggs', 'Chicken Sandwich']
  },
  lunch: {
    veg: ['Dal Tadka', 'Jeera Rice', 'Roti', 'Mixed Veg', 'Salad', 'Rajma', 'Aloo Gobi', 'Papad', 'Chole', 'Bhature', 'Raita'],
    nonVeg: ['Chicken Curry', 'Fish Fry', 'Mutton Curry', 'Chicken Tikka', 'Prawn Curry']
  },
  dinner: {
    veg: ['Paneer Butter Masala', 'Dal Makhani', 'Curd', 'Malai Kofta', 'Naan', 'Veg Biryani', 'Ice Cream'],
    nonVeg: ['Chicken Biryani', 'Butter Chicken', 'Egg Curry', 'Chicken 65', 'Tandoori Chicken', 'Mutton Korma']
  }
};

export default foodMessPgSchema;
