import { z } from 'zod';

// Predefined days of week for weeklyMenu
export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

/**
 * Enhanced Schema for meal items (veg/non-veg) matching JSON structure
 */
const mealItemsSchema = z.object({
  veg: z.array(
    z.string()
      .trim()
      .min(1, 'Meal item cannot be empty')
      .max(50, 'Meal item name too long (max 50 characters)')
  ).default([]),
  nonVeg: z.array(
    z.string()
      .trim()
      .min(1, 'Meal item cannot be empty')
      .max(50, 'Meal item name too long (max 50 characters)')
  ).nullable().optional().default(null),
});

/**
 * Enhanced Schema for daily menu matching JSON structure
 */
const dailyMenuSchema = z.object({
  day: z.enum(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    { errorMap: () => ({ message: 'Invalid day. Must be a valid day of the week' }) }
  ),
  breakfastTiming: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM (24-hour format)')
    .optional(),
  lunchTiming: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM (24-hour format)')
    .optional(),
  dinnerTiming: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM (24-hour format)')
    .optional(),
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
    meals: z.array(z.enum(['Breakfast', 'Lunch', 'Dinner'], {
      errorMap: () => ({ message: 'Invalid meal type. Must be Breakfast, Lunch, or Dinner' })
    }))
    .min(0, 'Meals array cannot be negative')
    .max(3, 'Cannot have more than 3 meal types')
    .default([]),
    
    // Food type matching JSON values
    foodType: z.enum(['Veg', 'Non-veg', 'Veg & Non-veg'], {
      errorMap: () => ({ message: 'Invalid food type. Must be Veg, Non-veg, or Veg & Non-veg' })
    }).default('Veg & Non-veg'),
    
    // Cooking policies
    cookingAllowed: z.boolean().default(false),
    
    // Enhanced weekly menu array matching JSON structure
    weeklyMenu: z.array(dailyMenuSchema)
      .max(7, 'Weekly menu cannot have more than 7 days')
      .default([]),
  }).default({}),

}).refine(
  (data) => {
    // Validation 1: If food is available, ensure meals are selected
    if (data.foodMess?.available) {
      const hasMeals = data.foodMess?.meals && data.foodMess.meals.length > 0;
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
    // Validation 2: Check for duplicate days in weeklyMenu (only when food is available)
    if (data.foodMess?.available && data.foodMess?.weeklyMenu && data.foodMess.weeklyMenu.length > 0) {
      const days = data.foodMess.weeklyMenu.map(menu => menu.day);
      const uniqueDays = new Set(days);
      return days.length === uniqueDays.size;
    }
    return true;
  },
  {
    message: 'Weekly menu cannot have duplicate days',
    path: ['foodMess', 'weeklyMenu'],
  }
).refine(
  (data) => {
    // Validation 4: Ensure foodType matches the menu items (only when weeklyMenu is provided)
    if (data.foodMess?.available && data.foodMess.weeklyMenu.length > 0) {
      const foodType = data.foodMess.foodType;
      let hasVeg = false;
      let hasNonVeg = false;
      
      for (const dayMenu of data.foodMess.weeklyMenu) {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          const meal = dayMenu[mealType];
          if (meal) {
            if (meal.veg && meal.veg.length > 0) hasVeg = true;
            if (meal.nonVeg && meal.nonVeg.length > 0) hasNonVeg = true;
          }
        });
      }
      
      // If foodType is 'Veg', should not have nonVeg items
      if (foodType === 'Veg' && hasNonVeg) {
        return false;
      }
      // If foodType is 'Non-veg', should have nonVeg items (edge case, unusual but handled)
      // If foodType is 'Veg & Non-veg', can have both
      
    }
    return true;
  },
  {
    message: 'Food type does not match the menu items. Veg food type cannot include non-veg items',
    path: ['foodMess', 'foodType'],
  }
);

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
