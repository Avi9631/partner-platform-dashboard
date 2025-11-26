import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat,
  Clock,
  Star,
  Utensils,
  Coffee,
  Plus,
  X,
  Check,
  Calendar,
  Leaf,
  Beef,
  Droplets,
  Timer,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import foodMessPgSchema, { DAYS_OF_WEEK, SAMPLE_MEALS } from '../../../schemas/foodMessPgSchema';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const FOOD_TYPE_OPTIONS = ['Veg', 'Non-veg', 'Veg & Non-veg'];

export default function FoodMessPgStep() {
  const { saveAndContinue, previousStep, formData } = usePgFormV2();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [newMealItem, setNewMealItem] = useState('');
  const [mealType, setMealType] = useState('veg');
  const [showMealDialog, setShowMealDialog] = useState(false);

  const logger = useMemo(() => createStepLogger('Food & Mess PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(foodMessPgSchema),
    mode: 'onChange',
    defaultValues: {
      foodMess: {
        available: formData?.foodMess?.available || formData?.available || false,
        meals: formData?.foodMess?.meals || [],
        foodType: formData?.foodMess?.foodType || 'Veg & Non-veg',
        cookingAllowed: formData?.foodMess?.cookingAllowed || false,
        tiffinService: formData?.foodMess?.tiffinService || false,
        roWater: formData?.foodMess?.roWater || false,
        rating: formData?.foodMess?.rating || 4.0,
        timings: {
          breakfast: formData?.foodMess?.timings?.breakfast || '',
          lunch: formData?.foodMess?.timings?.lunch || '',
          dinner: formData?.foodMess?.timings?.dinner || '',
        },
        weeklyMenu: formData?.foodMess?.weeklyMenu || DAYS_OF_WEEK.map(day => ({
          day,
          breakfast: { veg: [], nonVeg: null },
          lunch: { veg: [], nonVeg: null },
          dinner: { veg: [], nonVeg: null },
        })),
      },
      // Legacy fields
      available: formData?.available || false,
      meals: formData?.meals || [],
      foodType: formData?.foodType || 'veg',
      timings: formData?.timings || {},
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

  // Initialize weekly menu if empty
  useEffect(() => {
    const currentMenu = form.getValues('foodMess.weeklyMenu');
    if (!currentMenu || currentMenu.length === 0) {
      const defaultMenu = DAYS_OF_WEEK.map(day => ({
        day,
        breakfast: { veg: [], nonVeg: null },
        lunch: { veg: [], nonVeg: null },
        dinner: { veg: [], nonVeg: null },
      }));
      form.setValue('foodMess.weeklyMenu', defaultMenu);
    }
  }, [form]);

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
      updatedMenu[dayIndex][mealType].veg.push(newMealItem.trim());
    } else {
      if (!updatedMenu[dayIndex][mealType].nonVeg) {
        updatedMenu[dayIndex][mealType].nonVeg = [];
      }
      updatedMenu[dayIndex][mealType].nonVeg.push(newMealItem.trim());
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

  // Add sample meals for a day
  const addSampleMeals = (dayIndex) => {
    const currentMenu = form.getValues('foodMess.weeklyMenu');
    const updatedMenu = [...currentMenu];
    
    // Add sample breakfast
    updatedMenu[dayIndex].breakfast = {
      veg: SAMPLE_MEALS.breakfast.veg.slice(0, 3),
      nonVeg: form.watch('foodMess.foodType') !== 'Veg' ? SAMPLE_MEALS.breakfast.nonVeg.slice(0, 1) : null,
    };
    
    // Add sample lunch
    updatedMenu[dayIndex].lunch = {
      veg: SAMPLE_MEALS.lunch.veg.slice(0, 5),
      nonVeg: form.watch('foodMess.foodType') !== 'Veg' ? SAMPLE_MEALS.lunch.nonVeg.slice(0, 1) : null,
    };
    
    // Add sample dinner
    updatedMenu[dayIndex].dinner = {
      veg: SAMPLE_MEALS.dinner.veg.slice(0, 4),
      nonVeg: form.watch('foodMess.foodType') !== 'Veg' ? SAMPLE_MEALS.dinner.nonVeg.slice(0, 1) : null,
    };
    
    form.setValue('foodMess.weeklyMenu', updatedMenu);
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  const isNonVegAllowed = form.watch('foodMess.foodType') !== 'Veg';
  const selectedDayIndex = DAYS_OF_WEEK.indexOf(selectedDay);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Food & Mess Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Configure food services, meal timings, and weekly menu for your property
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          
          {/* Food Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                Food Service Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Food Service Toggle */}
              <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors">
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
                          <FieldLabel>
                            Available Meals <span className="text-red-500">*</span>
                          </FieldLabel>
                          <div className="grid grid-cols-3 gap-4">
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
                                className={`p-4 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                                  field.value?.includes(meal)
                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                                    : 'border-muted hover:border-orange-500/50'
                                }`}
                              >
                                {meal === 'Breakfast' && <Coffee className="w-5 h-5" />}
                                {meal === 'Lunch' && <Utensils className="w-5 h-5" />}
                                {meal === 'Dinner' && <ChefHat className="w-5 h-5" />}
                                {meal}
                                {field.value?.includes(meal) && (
                                  <Check className="w-4 h-4 text-orange-600" />
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

                    {/* Food Type & Policies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="foodMess.foodType"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                              Food Type <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className={`h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FOOD_TYPE_OPTIONS.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    <div className="flex items-center gap-2">
                                      {type.includes('Veg') && <Leaf className="w-4 h-4 text-green-600" />}
                                      {type.includes('Non-veg') && <Beef className="w-4 h-4 text-red-600" />}
                                      {type}
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

                      <Controller
                        name="foodMess.rating"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-orange-600" />
                              Food Quality Rating
                            </FieldLabel>
                            <div className="flex items-center gap-3">
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                max="5"
                                step="0.1"
                                className={`h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 4.0)}
                              />
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= Math.floor(field.value)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {field.value}/5
                                </span>
                              </div>
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* Food Policies */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Controller
                        name="foodMess.cookingAllowed"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <Label className="text-sm font-medium cursor-pointer">
                                Cooking Allowed
                              </Label>
                              <p className="text-xs text-muted-foreground">
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

                      <Controller
                        name="foodMess.tiffinService"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <Label className="text-sm font-medium cursor-pointer">
                                Tiffin Service
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                External tiffin delivery
                              </p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />

                      <Controller
                        name="foodMess.roWater"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-blue-500" />
                              <div>
                                <Label className="text-sm font-medium cursor-pointer">
                                  RO Water
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Purified water available
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Meal Timings */}
          {form.watch('foodMess.available') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Meal Timings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <Controller
                      key={meal}
                      name={`foodMess.timings.${meal}`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="flex items-center gap-2 capitalize">
                            <Timer className="w-4 h-4 text-orange-600" />
                            {meal} Timing
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="e.g., 7:00 AM - 9:30 AM"
                            className={`h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Menu */}
          {form.watch('foodMess.available') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    Weekly Menu
                  </span>
                  <Dialog open={showMealDialog} onOpenChange={setShowMealDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Quick Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Quick Add Meal Items</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Select value={selectedDay} onValueChange={setSelectedDay}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS_OF_WEEK.map((day) => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="breakfast">Breakfast</SelectItem>
                              <SelectItem value="lunch">Lunch</SelectItem>
                              <SelectItem value="dinner">Dinner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2">
                          <Input
                            value={newMealItem}
                            onChange={(e) => setNewMealItem(e.target.value)}
                            placeholder="Enter meal item..."
                            className="flex-1"
                          />
                          <Select value={mealType} onValueChange={setMealType}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="veg">Veg</SelectItem>
                              {isNonVegAllowed && (
                                <SelectItem value="nonVeg">Non-Veg</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={() => addMealItem(selectedDayIndex, selectedMeal, mealType)}
                            disabled={!newMealItem.trim()}
                          >
                            Add
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Sample Items for {selectedMeal}:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-sm text-green-600 flex items-center gap-1">
                                <Leaf className="w-3 h-3" /> Veg
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {SAMPLE_MEALS[selectedMeal]?.veg.map((item) => (
                                  <Badge
                                    key={item}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-green-50"
                                    onClick={() => {
                                      setNewMealItem(item);
                                      setMealType('veg');
                                    }}
                                  >
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {isNonVegAllowed && (
                              <div>
                                <Label className="text-sm text-red-600 flex items-center gap-1">
                                  <Beef className="w-3 h-3" /> Non-Veg
                                </Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {SAMPLE_MEALS[selectedMeal]?.nonVeg.map((item) => (
                                    <Badge
                                      key={item}
                                      variant="outline"
                                      className="cursor-pointer hover:bg-red-50"
                                      onClick={() => {
                                        setNewMealItem(item);
                                        setMealType('nonVeg');
                                      }}
                                    >
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                  <TabsList className="grid w-full grid-cols-7 mb-6">
                    {DAYS_OF_WEEK.map((day) => (
                      <TabsTrigger key={day} value={day} className="text-xs">
                        {day.slice(0, 3)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {DAYS_OF_WEEK.map((day, dayIndex) => {
                    const dayMenu = form.watch(`foodMess.weeklyMenu.${dayIndex}`);
                    
                    return (
                      <TabsContent key={day} value={day} className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{day} Menu</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSampleMeals(dayIndex)}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Add Sample Menu
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {['breakfast', 'lunch', 'dinner'].map((mealTime) => (
                            <Card key={mealTime} className="border">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base capitalize flex items-center gap-2">
                                  {mealTime === 'breakfast' && <Coffee className="w-4 h-4" />}
                                  {mealTime === 'lunch' && <Utensils className="w-4 h-4" />}
                                  {mealTime === 'dinner' && <ChefHat className="w-4 h-4" />}
                                  {mealTime}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                
                                {/* Veg Items */}
                                <div>
                                  <Label className="text-xs text-green-600 flex items-center gap-1 mb-2">
                                    <Leaf className="w-3 h-3" /> Veg Items
                                  </Label>
                                  <div className="space-y-1">
                                    {dayMenu?.[mealTime]?.veg?.map((item, itemIndex) => (
                                      <div
                                        key={itemIndex}
                                        className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/10 rounded text-sm"
                                      >
                                        <span>{item}</span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeMealItem(dayIndex, mealTime, 'veg', itemIndex)}
                                          className="h-6 w-6 p-0 text-red-500"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    {(!dayMenu?.[mealTime]?.veg || dayMenu[mealTime].veg.length === 0) && (
                                      <p className="text-xs text-muted-foreground italic">
                                        No veg items added
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Non-Veg Items */}
                                {isNonVegAllowed && (
                                  <div>
                                    <Label className="text-xs text-red-600 flex items-center gap-1 mb-2">
                                      <Beef className="w-3 h-3" /> Non-Veg Items
                                    </Label>
                                    <div className="space-y-1">
                                      {dayMenu?.[mealTime]?.nonVeg?.map((item, itemIndex) => (
                                        <div
                                          key={itemIndex}
                                          className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/10 rounded text-sm"
                                        >
                                          <span>{item}</span>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeMealItem(dayIndex, mealTime, 'nonVeg', itemIndex)}
                                            className="h-6 w-6 p-0 text-red-500"
                                          >
                                            <X className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                      {(!dayMenu?.[mealTime]?.nonVeg || dayMenu[mealTime].nonVeg.length === 0) && (
                                        <p className="text-xs text-muted-foreground italic">
                                          No non-veg items added
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onSaveAndContinue={form.handleSubmit(onSubmit)}
            onBack={previousStep}
            nextDisabled={!form.formState.isValid}
            showBack={true}
          />
        </form>
      </motion.div>
    </div>
  );
}