import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat,
  Clock,
  Utensils,
  Coffee,
  Plus,
  X,
  Check,
  Calendar,
  Leaf,
  Beef,
  ThumbsUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import foodMessPgSchema, { DAYS_OF_WEEK, SAMPLE_MEALS } from '../../../schemas/foodMessPgSchema';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const FOOD_TYPE_OPTIONS = ['Veg', 'Non-veg', 'Veg & Non-veg'];

const STEP_ID = 'food-mess';

export default function FoodMessPgStep() {
  const { saveAndContinue, previousStep, getStepData, setCurrentStepSubmitHandler } = usePgFormV2();
  const stepData = getStepData(STEP_ID);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [newMealItem, setNewMealItem] = useState('');
  const [mealType, setMealType] = useState('veg');
  const [showMealSheet, setShowMealSheet] = useState(false);
  const [showTimingSection, setShowTimingSection] = useState(false);

  const logger = useMemo(() => createStepLogger('Food & Mess PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(foodMessPgSchema),
    mode: 'onChange',
    defaultValues: {
      foodMess: {
        available: stepData?.foodMess?.available || stepData?.available || false,
        meals: stepData?.foodMess?.meals || [],
        foodType: stepData?.foodMess?.foodType || 'Veg & Non-veg',
        cookingAllowed: stepData?.foodMess?.cookingAllowed || false,
        weeklyMenu: stepData?.foodMess?.weeklyMenu || [],
      },

    },
  });

  const { fields: weeklyMenuFields } = useFieldArray({
    control: form.control,
    name: 'foodMess.weeklyMenu',
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Initialize weekly menu only when user interacts with it
  const initializeWeeklyMenuIfNeeded = () => {
    const currentMenu = form.getValues('foodMess.weeklyMenu');
    if (!currentMenu || currentMenu.length === 0) {
      const defaultMenu = DAYS_OF_WEEK.map(day => ({
        day,
        breakfastTiming: '08:00',
        lunchTiming: '13:00',
        dinnerTiming: '20:00',
      }));
      form.setValue('foodMess.weeklyMenu', defaultMenu);
    }
  };

  // Add meal item to specific day and meal
  const addMealItem = (dayIndex, mealType, itemType) => {
    if (!newMealItem.trim()) return;

    const currentMenu = form.getValues('foodMess.weeklyMenu');
    const updatedMenu = [...currentMenu];
    
    if (!updatedMenu[dayIndex][mealType]) {
      updatedMenu[dayIndex][mealType] = { veg: [], nonVeg: null };
    }
    
    if (itemType === 'veg') {
      if (!updatedMenu[dayIndex][mealType].veg) {
        updatedMenu[dayIndex][mealType].veg = [];
      }
      updatedMenu[dayIndex][mealType].veg.push(newMealItem.trim().toUpperCase());
    } else {
      if (!updatedMenu[dayIndex][mealType].nonVeg) {
        updatedMenu[dayIndex][mealType].nonVeg = [];
      }
      updatedMenu[dayIndex][mealType].nonVeg.push(newMealItem.trim().toUpperCase());
    }
    
    form.setValue('foodMess.weeklyMenu', updatedMenu);
    setNewMealItem('');
  };

  // Remove meal item
  const removeMealItem = (dayIndex, mealType, itemType, itemIndex) => {
    const currentMenu = form.getValues('foodMess.weeklyMenu');
    const updatedMenu = [...currentMenu];
    
    if (itemType === 'veg') {
      updatedMenu[dayIndex][mealType].veg.splice(itemIndex, 1);
    } else {
      updatedMenu[dayIndex][mealType].nonVeg.splice(itemIndex, 1);
      if (updatedMenu[dayIndex][mealType].nonVeg.length === 0) {
        updatedMenu[dayIndex][mealType].nonVeg = null;
      }
    }
    
    form.setValue('foodMess.weeklyMenu', updatedMenu);
  };

  // Update meal timing for a specific day and meal type
  const updateMealTiming = (dayIndex, mealType, time) => {
    const currentMenu = form.getValues('foodMess.weeklyMenu');
    const updatedMenu = [...currentMenu];
    updatedMenu[dayIndex][`${mealType}Timing`] = time;
    form.setValue('foodMess.weeklyMenu', updatedMenu);
  };

  // Add sample meals for a day
  const addSampleMeals = (dayIndex) => {
    const currentMenu = form.getValues('foodMess.weeklyMenu');
    const updatedMenu = [...currentMenu];
    const selectedMeals = form.watch('foodMess.meals') || [];
    
    // Add sample breakfast only if selected
    if (selectedMeals.includes('Breakfast')) {
      updatedMenu[dayIndex].breakfast = {
        veg: SAMPLE_MEALS.breakfast.veg.slice(0, 3),
        nonVeg: form.watch('foodMess.foodType') !== 'Veg' ? SAMPLE_MEALS.breakfast.nonVeg.slice(0, 1) : null,
      };
    }
    
    // Add sample lunch only if selected
    if (selectedMeals.includes('Lunch')) {
      updatedMenu[dayIndex].lunch = {
        veg: SAMPLE_MEALS.lunch.veg.slice(0, 5),
        nonVeg: form.watch('foodMess.foodType') !== 'Veg' ? SAMPLE_MEALS.lunch.nonVeg.slice(0, 1) : null,
      };
    }
    
    // Add sample dinner only if selected
    if (selectedMeals.includes('Dinner')) {
      updatedMenu[dayIndex].dinner = {
        veg: SAMPLE_MEALS.dinner.veg.slice(0, 4),
        nonVeg: form.watch('foodMess.foodType') !== 'Veg' ? SAMPLE_MEALS.dinner.nonVeg.slice(0, 1) : null,
      };
    }
    
    form.setValue('foodMess.weeklyMenu', updatedMenu);
  };

  const onSubmit = (data) => {
    // Clean up weekly menu - remove days without any meals
    if (data.foodMess?.weeklyMenu && data.foodMess.weeklyMenu.length > 0) {
      data.foodMess.weeklyMenu = data.foodMess.weeklyMenu.filter(dayMenu => {
        return dayMenu.breakfast || dayMenu.lunch || dayMenu.dinner;
      });
    }
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit, onError));
  }, [form.handleSubmit]);

  const isNonVegAllowed = form.watch('foodMess.foodType') !== 'Veg';
  const selectedDayIndexFromName = DAYS_OF_WEEK.indexOf(selectedDay);

  return (
    <div className="w-full max-w-7xl mx-auto ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-xl md:text-2xl  font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Food & Mess Details
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Configure food services, meal timings, and weekly menu for your property
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4 md:space-y-6">
          
          {/* Food Service Availability */}
          <div className="space-y-4 md:space-y-6">            
            {/* Food Service Toggle */}
            <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors bg-card">
                <div>
                  <Label htmlFor="foodAvailable" className="text-base font-semibold cursor-pointer">
                    Food Service Available
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable if you provide food/mess services to tenants
                  </p>
                </div>
                <Controller
                  name="foodMess.available"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      id="foodAvailable"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <AnimatePresence>
                {form.watch('foodMess.available') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    {/* Meal Types */}
                    <Controller
                      name="foodMess.meals"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-sm md:text-base font-semibold">
                            Available Meals <span className="text-red-500">*</span>
                          </FieldLabel>
                          <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {MEAL_TYPES.map((meal) => (
                              <button
                                key={meal}
                                type="button"
                                onClick={() => {
                                  const currentMeals = field.value || [];
                                  if (currentMeals.includes(meal)) {
                                    field.onChange(currentMeals.filter(m => m !== meal));
                                  } else {
                                    field.onChange([...currentMeals, meal]);
                                  }
                                }}
                                className={`p-3 md:p-4 border-2 rounded-lg text-xs md:text-sm font-medium transition-all flex flex-col items-center gap-1.5 md:gap-2 hover:scale-105 ${
                                  field.value?.includes(meal)
                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 shadow-sm'
                                    : 'border-muted hover:border-orange-500/50'
                                }`}
                              >
                                {meal === 'Breakfast' && <Coffee className="w-4 h-4 md:w-5 md:h-5" />}
                                {meal === 'Lunch' && <Utensils className="w-4 h-4 md:w-5 md:h-5" />}
                                {meal === 'Dinner' && <ChefHat className="w-4 h-4 md:w-5 md:h-5" />}
                                <span className="text-center">{meal}</span>
                                {field.value?.includes(meal) && (
                                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-600" />
                                )}
                              </button>
                            ))}
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* Food Type */}
                    <Controller
                      name="foodMess.foodType"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-sm md:text-base font-semibold">
                            Food Type <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className={`h-10 md:h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FOOD_TYPE_OPTIONS.map((type) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center gap-2">
                                    {type.includes('Veg') && <Leaf className="w-4 h-4 text-green-600" />}
                                    {type.includes('Non-veg') && <Beef className="w-4 h-4 text-red-600" />}
                                    <span className="text-xs md:text-sm">{type}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* Food Policies */}
                    <Controller
                      name="foodMess.cookingAllowed"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-3 md:p-4 border-2 rounded-lg hover:border-orange-500 transition-colors">
                          <div>
                            <Label className="text-xs md:text-sm font-medium cursor-pointer">
                              Cooking Allowed
                            </Label>
                            <p className="text-[10px] md:text-xs text-muted-foreground">
                              In-room cooking permitted
                            </p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />

                    {/* Meal Timings Section */}
                    <Card className="border-2 border-orange-100">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                            <CardTitle className="text-sm md:text-base">Default Meal Timings</CardTitle>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (!showTimingSection) {
                                initializeWeeklyMenuIfNeeded();
                              }
                              setShowTimingSection(!showTimingSection);
                            }}
                          >
                            {showTimingSection ? 'Hide' : 'Show'}
                          </Button>
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          Set default serving times for each meal (applies to all days)
                        </p>
                      </CardHeader>
                      {showTimingSection && (
                        <CardContent className="space-y-3">
                          {form.watch('foodMess.meals')?.includes('Breakfast') && (
                            <div className="flex items-center gap-3">
                              <Coffee className="w-4 h-4 text-orange-600" />
                              <Label className="text-xs md:text-sm min-w-[80px]">Breakfast</Label>
                              <Input
                                type="time"
                                value={form.watch('foodMess.weeklyMenu.0.breakfastTiming') || '08:00'}
                                onChange={(e) => {
                                  const time = e.target.value;
                                  DAYS_OF_WEEK.forEach((_, index) => {
                                    updateMealTiming(index, 'breakfast', time);
                                  });
                                }}
                                className="max-w-[150px] text-xs md:text-sm"
                              />
                            </div>
                          )}
                          {form.watch('foodMess.meals')?.includes('Lunch') && (
                            <div className="flex items-center gap-3">
                              <Utensils className="w-4 h-4 text-orange-600" />
                              <Label className="text-xs md:text-sm min-w-[80px]">Lunch</Label>
                              <Input
                                type="time"
                                value={form.watch('foodMess.weeklyMenu.0.lunchTiming') || '13:00'}
                                onChange={(e) => {
                                  const time = e.target.value;
                                  DAYS_OF_WEEK.forEach((_, index) => {
                                    updateMealTiming(index, 'lunch', time);
                                  });
                                }}
                                className="max-w-[150px] text-xs md:text-sm"
                              />
                            </div>
                          )}
                          {form.watch('foodMess.meals')?.includes('Dinner') && (
                            <div className="flex items-center gap-3">
                              <ChefHat className="w-4 h-4 text-orange-600" />
                              <Label className="text-xs md:text-sm min-w-[80px]">Dinner</Label>
                              <Input
                                type="time"
                                value={form.watch('foodMess.weeklyMenu.0.dinnerTiming') || '20:00'}
                                onChange={(e) => {
                                  const time = e.target.value;
                                  DAYS_OF_WEEK.forEach((_, index) => {
                                    updateMealTiming(index, 'dinner', time);
                                  });
                                }}
                                className="max-w-[150px] text-xs md:text-sm"
                              />
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          {/* Weekly Menu */}
          {form.watch('foodMess.available') && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                  <h3 className="text-lg md:text-xl font-semibold">Weekly Menu <span className="text-sm text-muted-foreground font-normal">(Optional)</span></h3>
                </div>
                <Sheet open={showMealSheet} onOpenChange={(open) => {
                  if (open) {
                    initializeWeeklyMenuIfNeeded();
                  }
                  setShowMealSheet(open);
                }}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="self-start sm:self-auto">
                        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                        <span className="text-xs md:text-sm">Quick Add</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                      <SheetHeader className="space-y-2 pb-4 border-b">
                        <SheetTitle className="text-xl md:text-2xl flex items-center gap-2">
                          <ChefHat className="w-5 h-5 text-orange-600" />
                          Quick Add Meal Items
                        </SheetTitle>
                        <p className="text-sm text-muted-foreground">
                          Add custom items or choose from sample menu suggestions to build your weekly food menu
                        </p>
                      </SheetHeader>

                      <div className="space-y-6 mt-6">
                        {/* Day and Meal Selection */}
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-foreground">
                            Select Day & Meal Type
                          </Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Day
                              </Label>
                              <Select value={selectedDay} onValueChange={setSelectedDay}>
                                <SelectTrigger className="h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {DAYS_OF_WEEK.map((day) => (
                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Utensils className="w-3 h-3" />
                                Meal
                              </Label>
                              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                                <SelectTrigger className="h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {form.watch('foodMess.meals')?.includes('Breakfast') && (
                                    <SelectItem value="breakfast">
                                      <div className="flex items-center gap-2">
                                        <Coffee className="w-4 h-4" />
                                        Breakfast
                                      </div>
                                    </SelectItem>
                                  )}
                                  {form.watch('foodMess.meals')?.includes('Lunch') && (
                                    <SelectItem value="lunch">
                                      <div className="flex items-center gap-2">
                                        <Utensils className="w-4 h-4" />
                                        Lunch
                                      </div>
                                    </SelectItem>
                                  )}
                                  {form.watch('foodMess.meals')?.includes('Dinner') && (
                                    <SelectItem value="dinner">
                                      <div className="flex items-center gap-2">
                                        <ChefHat className="w-4 h-4" />
                                        Dinner
                                      </div>
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Add Custom Item */}
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-foreground">
                            Add Custom Item
                          </Label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              value={newMealItem}
                              onChange={(e) => setNewMealItem(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newMealItem.trim()) {
                                  addMealItem(selectedDayIndexFromName, selectedMeal, mealType);
                                }
                              }}
                              placeholder="Type a meal item..."
                              className="flex-1 h-11"
                            />
                            <div className="flex gap-2">
                              <Select value={mealType} onValueChange={setMealType}>
                                <SelectTrigger className="w-[130px] h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="veg">
                                    <div className="flex items-center gap-2">
                                      <Leaf className="w-4 h-4 text-green-600" />
                                      Veg
                                    </div>
                                  </SelectItem>
                                  {isNonVegAllowed && (
                                    <SelectItem value="nonVeg">
                                      <div className="flex items-center gap-2">
                                        <Beef className="w-4 h-4 text-red-600" />
                                        Non-Veg
                                      </div>
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                onClick={() => addMealItem(selectedDayIndexFromName, selectedMeal, mealType)}
                                disabled={!newMealItem.trim()}
                                className="h-11 bg-orange-600 hover:bg-orange-700"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            💡 Press Enter to quickly add items
                          </p>
                        </div>

                        {/* Current Items Preview */}
                        {form.watch(`foodMess.weeklyMenu.${selectedDayIndexFromName}.${selectedMeal}`) && (
                          <>
                            <Separator />
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Current {selectedDay} {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Items
                              </Label>
                              <div className="space-y-2">
                                {form.watch(`foodMess.weeklyMenu.${selectedDayIndexFromName}.${selectedMeal}.veg`)?.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {form.watch(`foodMess.weeklyMenu.${selectedDayIndexFromName}.${selectedMeal}.veg`).map((item, idx) => (
                                      <Badge key={idx} className="bg-green-100 text-green-800 border-green-300">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {form.watch(`foodMess.weeklyMenu.${selectedDayIndexFromName}.${selectedMeal}.nonVeg`)?.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {form.watch(`foodMess.weeklyMenu.${selectedDayIndexFromName}.${selectedMeal}.nonVeg`).map((item, idx) => (
                                      <Badge key={idx} className="bg-red-100 text-red-800 border-red-300">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {!form.watch(`foodMess.weeklyMenu.${selectedDayIndexFromName}.${selectedMeal}.veg`)?.length && 
                                 !form.watch(`foodMess.weeklyMenu.${selectedDayIndexFromName}.${selectedMeal}.nonVeg`)?.length && (
                                  <p className="text-xs text-muted-foreground italic text-center py-4 border-2 border-dashed rounded-lg">
                                    No items added yet. Start by selecting items above!
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
              </div>
              
              {/* Scrollable Carousel */}
              <div className="space-y-3">
                {/* Day Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <Button
                      key={day}
                      type="button"
                      variant={selectedDayIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDayIndex(index)}
                      className={`min-w-[80px] text-xs ${
                        selectedDayIndex === index 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'hover:bg-orange-50'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>

                {/* Current Day Content */}
                {DAYS_OF_WEEK.map((day, dayIndex) => {
                  if (selectedDayIndex !== dayIndex) return null;
                  const dayMenu = form.watch(`foodMess.weeklyMenu.${dayIndex}`);
                  
                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h3 className="text-base md:text-lg font-semibold">{day} Menu</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            initializeWeeklyMenuIfNeeded();
                            addSampleMeals(dayIndex);
                          }}
                          className="self-start sm:self-auto"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                          <span className="text-xs md:text-sm">Add Sample Menu</span>
                        </Button>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        {['breakfast', 'lunch', 'dinner'].map((mealTime) => {
                          const selectedMeals = form.watch('foodMess.meals') || [];
                          const mealTypeMap = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
                          if (!selectedMeals.includes(mealTypeMap[mealTime])) return null;
                          
                          return (
                          <Card key={mealTime} className="border hover:border-orange-200 transition-colors">
                            <CardHeader className="pb-2 md:pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm md:text-base capitalize flex items-center gap-2">
                                  {mealTime === 'breakfast' && <Coffee className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-600" />}
                                  {mealTime === 'lunch' && <Utensils className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-600" />}
                                  {mealTime === 'dinner' && <ChefHat className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-600" />}
                                  {mealTime}
                                </CardTitle>
                                {dayMenu?.[`${mealTime}Timing`] && (
                                  <Badge variant="outline" className="text-[10px] md:text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {dayMenu[`${mealTime}Timing`]}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2 md:space-y-3">
                              
                              {/* Veg Items */}
                              <div>
                                <Label className="text-[10px] md:text-xs text-green-600 flex items-center gap-1 mb-1.5 md:mb-2 font-medium">
                                  <Leaf className="w-3 h-3" /> Veg Items
                                </Label>
                                <div className="flex flex-wrap gap-1.5">
                                  {dayMenu?.[mealTime]?.veg?.map((item, itemIndex) => (
                                    <Badge
                                      key={itemIndex}
                                      className="bg-green-100 text-green-800 hover:bg-green-200 text-xs py-1.5"
                                    >
                                      {item}
                                      <X
                                        className="w-3 h-3 ml-1.5 cursor-pointer hover:text-red-600"
                                        onClick={() => removeMealItem(dayIndex, mealTime, 'veg', itemIndex)}
                                      />
                                    </Badge>
                                  ))}
                                  {(!dayMenu?.[mealTime]?.veg || dayMenu[mealTime].veg.length === 0) && (
                                    <div className="w-full text-center py-3 border-2 border-dashed border-green-200 rounded-lg">
                                      <p className="text-[10px] md:text-xs text-muted-foreground italic">
                                        No veg items added. Use "Configure Menu" to add items.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Non-Veg Items */}
                              {isNonVegAllowed && (
                                <div>
                                  <Label className="text-[10px] md:text-xs text-red-600 flex items-center gap-1 mb-1.5 md:mb-2 font-medium">
                                    <Beef className="w-3 h-3" /> Non-Veg Items
                                  </Label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {dayMenu?.[mealTime]?.nonVeg?.map((item, itemIndex) => (
                                      <Badge
                                        key={itemIndex}
                                        className="bg-red-100 text-red-800 hover:bg-red-200 text-xs py-1.5"
                                      >
                                        {item}
                                        <X
                                          className="w-3 h-3 ml-1.5 cursor-pointer hover:text-red-600"
                                          onClick={() => removeMealItem(dayIndex, mealTime, 'nonVeg', itemIndex)}
                                        />
                                      </Badge>
                                    ))}
                                    {(!dayMenu?.[mealTime]?.nonVeg || dayMenu[mealTime].nonVeg.length === 0) && (
                                      <div className="w-full text-center py-3 border-2 border-dashed border-red-200 rounded-lg">
                                        <p className="text-[10px] md:text-xs text-muted-foreground italic">
                                          No non-veg items added. Use "Configure Menu" to add items.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </form>
      </motion.div>
    </div>
  );
}