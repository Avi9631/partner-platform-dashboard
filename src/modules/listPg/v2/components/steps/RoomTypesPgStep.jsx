import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bed, 
  Plus, 
  X, 
  DollarSign, 
  Square, 
  Check, 
  Users,
  Snowflake,
  Droplets,
  MapPin,
  Wind,
  IndianRupee,
  Edit3,
  Trash2,
  Copy
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
  FieldGroup,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import roomTypesPgSchema from '../../../schemas/roomTypesPgSchema';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

// Room amenities list matching JSON structure
const ROOM_AMENITIES = [
  { name: 'Queen Size Bed', icon: Bed },
  { name: 'Single Bed', icon: Bed },
  { name: 'Double Bed', icon: Bed },
  { name: '2 Single Beds', icon: Bed },
  { name: '3 Single Beds', icon: Bed },
  { name: 'Premium Mattress', icon: Bed },
  { name: 'Mattress Included', icon: Bed },
  { name: 'Large Cupboard', icon: Square },
  { name: '2 Cupboards', icon: Square },
  { name: '3 Cupboards', icon: Square },
  { name: 'Study Table & Chair', icon: Square },
  { name: '2 Study Tables', icon: Square },
  { name: 'Study Tables', icon: Square },
  { name: 'AC', icon: Snowflake },
  { name: '3 Fans', icon: Wind },
  { name: 'Attached Bathroom', icon: Droplets },
  { name: 'Common Bathroom', icon: Droplets },
  { name: 'Balcony', icon: MapPin },
  { name: 'High Speed WiFi', icon: Square },
  { name: 'Mini Refrigerator', icon: Square },
  { name: 'Shared Refrigerator', icon: Square },
  { name: 'TV', icon: Square },
  { name: 'Window', icon: Square },
];

// Pricing types from JSON structure
const PRICING_TYPES = [
  'Monthly Rent',
  'Security Deposit',
  'Maintenance Charges',
  'Food (Optional)',
  'Electricity',
  'Booking Amount',
];

export default function RoomTypesPgStep() {
  const { saveAndContinue, previousStep, formData } = usePgFormV2();
  const [showAmenitiesDialog, setShowAmenitiesDialog] = useState(false);
  const [selectedAmenitiesRoomIndex, setSelectedAmenitiesRoomIndex] = useState(0);

  const logger = useMemo(() => createStepLogger('Room Types PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(roomTypesPgSchema),
    mode: 'onChange',
    defaultValues: {
      roomTypes: formData?.roomTypes?.length > 0 ? formData.roomTypes : [
        {
          name: '',
          category: 'Single sharing',
          ac: false,
          attachedWashroom: false,
          balcony: false,
          roomSize: '',
          pricing: [],
          availability: {
            totalBeds: 0,
            availableBeds: 0,
            soldOut: false,
            nextAvailability: 'Immediate',
            seasonalPricing: false,
          },
          refundPolicy: '',
          amenities: [],
        }
      ],
    },
  });

  const { fields: roomTypes, append: addRoomType, remove: removeRoomType } = useFieldArray({
    control: form.control,
    name: 'roomTypes',
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Add new room type
  const handleAddRoomType = () => {
    addRoomType({
      name: '',
      category: 'Single sharing',
      ac: false,
      attachedWashroom: false,
      balcony: false,
      roomSize: '',
      pricing: [
        { type: 'Monthly Rent', amount: 0, currency: 'INR', mandatory: true },
        { type: 'Security Deposit', amount: 0, currency: 'INR', mandatory: true, refundable: true },
      ],
      availability: {
        totalBeds: 1,
        availableBeds: 1,
        soldOut: false,
        nextAvailability: 'Immediate',
        seasonalPricing: false,
      },
      refundPolicy: '',
      amenities: [],
    });
  };

  // Duplicate room type
  const duplicateRoomType = (index) => {
    const roomToDuplicate = form.getValues(`roomTypes.${index}`);
    addRoomType({
      ...roomToDuplicate,
      name: `${roomToDuplicate.name} (Copy)`,
    });
  };

  // Add pricing item
  const addPricingItem = (roomIndex) => {
    const currentPricing = form.getValues(`roomTypes.${roomIndex}.pricing`) || [];
    form.setValue(`roomTypes.${roomIndex}.pricing`, [
      ...currentPricing,
      { type: 'Maintenance Charges', amount: 0, currency: 'INR', mandatory: true, frequency: 'monthly' }
    ]);
  };

  // Remove pricing item
  const removePricingItem = (roomIndex, pricingIndex) => {
    const currentPricing = form.getValues(`roomTypes.${roomIndex}.pricing`) || [];
    form.setValue(
      `roomTypes.${roomIndex}.pricing`, 
      currentPricing.filter((_, i) => i !== pricingIndex)
    );
  };

  // Toggle room amenity
  const toggleAmenity = (roomIndex, amenityName) => {
    const currentAmenities = form.getValues(`roomTypes.${roomIndex}.amenities`) || [];
    const existingIndex = currentAmenities.findIndex(a => a.name === amenityName);
    
    if (existingIndex >= 0) {
      // Remove amenity
      form.setValue(
        `roomTypes.${roomIndex}.amenities`,
        currentAmenities.filter((_, i) => i !== existingIndex)
      );
    } else {
      // Add amenity
      const amenityData = ROOM_AMENITIES.find(a => a.name === amenityName);
      form.setValue(
        `roomTypes.${roomIndex}.amenities`,
        [...currentAmenities, { name: amenityName, available: true, icon: amenityData?.icon }]
      );
    }
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Room Types & Pricing
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Configure different room types with detailed pricing, amenities, and availability
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4 md:space-y-6">
          
          {/* Add Room Type Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base md:text-lg font-semibold">Room Types Configuration</h3>
            <Button
              type="button"
              onClick={handleAddRoomType}
              className="flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Room Type</span>
              <span className="sm:hidden">Add Room</span>
            </Button>
          </div>

          {/* Room Types Accordion */}
          <div className="space-y-3 md:space-y-4">
            {roomTypes.length === 0 ? (
              <div className="text-center py-8 md:py-12 border-2 border-dashed rounded-lg">
                <Bed className="w-8 md:w-12 h-8 md:h-12 mx-auto text-muted-foreground/50 mb-2 md:mb-4" />
                <p className="text-base md:text-lg font-medium text-muted-foreground mb-1 md:mb-2">No room types added yet</p>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Start by adding your first room type</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRoomType}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add First Room Type
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {roomTypes.map((roomType, index) => {
                  const roomData = form.watch(`roomTypes.${index}`);
                  const hasErrors = form.formState.errors.roomTypes?.[index];
                  
                  return (
                    <AccordionItem key={roomType.id} value={`room-${index}`} className="border rounded-lg mb-3">
                      <AccordionTrigger className={`px-3 md:px-4 py-3 hover:no-underline ${
                        hasErrors ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''
                      }`}>
                        <div className="flex items-center justify-between w-full pr-2 md:pr-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2">
                              <Bed className="w-4 md:w-5 h-4 md:h-5 text-orange-600" />
                              <span className="font-medium text-sm md:text-base">
                                {roomData?.name || `Room Type ${index + 1}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={roomData?.ac ? 'default' : 'secondary'} className="text-xs">
                                {roomData?.ac ? 'AC' : 'Non-AC'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {roomData?.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-1">
                              {roomData?.ac && <Snowflake className="w-3 h-3 text-blue-500" />}
                              {roomData?.attachedWashroom && <Droplets className="w-3 h-3 text-blue-500" />}
                              {roomData?.balcony && <MapPin className="w-3 h-3 text-green-500" />}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateRoomType(index);
                                }}
                                className="h-6 md:h-7 w-6 md:w-7 p-0"
                                title="Duplicate"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              {roomTypes.length > 1 && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeRoomType(index);
                                  }}
                                  className="h-6 md:h-7 w-6 md:w-7 p-0 text-red-500 hover:text-red-700"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 md:px-4 pb-4">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 text-xs md:text-sm h-8 md:h-10">
                            <TabsTrigger value="basic" className="px-1 md:px-4 text-xs md:text-sm">Basic</TabsTrigger>
                            <TabsTrigger value="pricing" className="px-1 md:px-4 text-xs md:text-sm">Pricing</TabsTrigger>
                            <TabsTrigger value="amenities" className="px-1 md:px-4 text-xs md:text-sm">Amenities</TabsTrigger>
                            <TabsTrigger value="availability" className="px-1 md:px-4 text-xs md:text-sm">Availability</TabsTrigger>
                          </TabsList>

                          {/* Basic Information Tab */}
                          <TabsContent value="basic" className="mt-4 md:mt-6 space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              <Controller
                                name={`roomTypes.${index}.name`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                      Room Name <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                      {...field}
                                      placeholder="e.g., Single Occupancy AC"
                                      className={`h-10 md:h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}
                                    />
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />

                              <Controller
                                name={`roomTypes.${index}.category`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                      Room Category <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className={`h-10 md:h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Single sharing">Single Sharing</SelectItem>
                                        <SelectItem value="Double sharing">Double Sharing</SelectItem>
                                        <SelectItem value="Triple sharing">Triple Sharing</SelectItem>
                                        <SelectItem value="Four sharing">Four Sharing</SelectItem>
                                        <SelectItem value="Six sharing">Six Sharing</SelectItem>
                                        <SelectItem value="Private room">Private Room</SelectItem>
                                        <SelectItem value="Studio">Studio</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              <Controller
                                name={`roomTypes.${index}.roomSize`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                      Room Size <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                      {...field}
                                      placeholder="e.g., 120 sq.ft"
                                      className={`h-10 md:h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}
                                    />
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />

                              <div className="space-y-3 md:space-y-4">
                                <Label className="text-sm font-semibold">Room Features</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                  <Controller
                                    name={`roomTypes.${index}.ac`}
                                    control={form.control}
                                    render={({ field }) => (
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`ac-${index}`}
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                        <Label htmlFor={`ac-${index}`} className="text-xs md:text-sm">
                                          AC
                                        </Label>
                                      </div>
                                    )}
                                  />

                                  <Controller
                                    name={`roomTypes.${index}.attachedWashroom`}
                                    control={form.control}
                                    render={({ field }) => (
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`washroom-${index}`}
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                        <Label htmlFor={`washroom-${index}`} className="text-xs md:text-sm">
                                          Attached Bathroom
                                        </Label>
                                      </div>
                                    )}
                                  />

                                  <Controller
                                    name={`roomTypes.${index}.balcony`}
                                    control={form.control}
                                    render={({ field }) => (
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`balcony-${index}`}
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                        <Label htmlFor={`balcony-${index}`} className="text-xs md:text-sm">
                                          Balcony
                                        </Label>
                                      </div>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>

                            <Controller
                              name={`roomTypes.${index}.refundPolicy`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel>
                                    Refund Policy <span className="text-red-500">*</span>
                                  </FieldLabel>
                                  <Textarea
                                    {...field}
                                    placeholder="e.g., 100% refund if cancelled 15 days before move-in"
                                    className={`min-h-[60px] md:min-h-[80px] ${fieldState.invalid ? 'border-red-500' : ''}`}
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </TabsContent>

                          {/* Pricing Tab */}
                          <TabsContent value="pricing" className="mt-4 md:mt-6 space-y-4 md:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <h3 className="text-base md:text-lg font-semibold">Pricing Details</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addPricingItem(index)}
                                className="self-start sm:self-auto"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Add Item</span>
                                <span className="sm:hidden">Add</span>
                              </Button>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                              {form.watch(`roomTypes.${index}.pricing`)?.map((pricingItem, pricingIndex) => (
                                <motion.div
                                  key={pricingIndex}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-3 md:p-4 border-2 rounded-lg space-y-3 md:space-y-4"
                                >
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm md:text-base">Pricing Item {pricingIndex + 1}</h4>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removePricingItem(index, pricingIndex)}
                                      className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                    <Controller
                                      name={`roomTypes.${index}.pricing.${pricingIndex}.type`}
                                      control={form.control}
                                      render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                          <FieldLabel className="text-xs md:text-sm">Type</FieldLabel>
                                          <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                          >
                                            <SelectTrigger className={`h-9 md:h-10 ${fieldState.invalid ? 'border-red-500' : ''}`}>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {PRICING_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </Field>
                                      )}
                                    />

                                    <Controller
                                      name={`roomTypes.${index}.pricing.${pricingIndex}.amount`}
                                      control={form.control}
                                      render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                          <FieldLabel className="text-xs md:text-sm">Amount (₹)</FieldLabel>
                                          <Input
                                            {...field}
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            className={`h-9 md:h-10 ${fieldState.invalid ? 'border-red-500' : ''}`}
                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                          />
                                        </Field>
                                      )}
                                    />

                                    <Controller
                                      name={`roomTypes.${index}.pricing.${pricingIndex}.frequency`}
                                      control={form.control}
                                      render={({ field }) => (
                                        <Field>
                                          <FieldLabel className="text-xs md:text-sm">Frequency</FieldLabel>
                                          <Select
                                            value={field.value || 'monthly'}
                                            onValueChange={field.onChange}
                                          >
                                            <SelectTrigger className="h-9 md:h-10">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="monthly">Monthly</SelectItem>
                                              <SelectItem value="one_time">One Time</SelectItem>
                                              <SelectItem value="per_unit">Per Unit</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </Field>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <Controller
                                      name={`roomTypes.${index}.pricing.${pricingIndex}.mandatory`}
                                      control={form.control}
                                      render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                          <Label className="text-xs md:text-sm">Mandatory</Label>
                                        </div>
                                      )}
                                    />

                                    <Controller
                                      name={`roomTypes.${index}.pricing.${pricingIndex}.refundable`}
                                      control={form.control}
                                      render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                          <Label className="text-xs md:text-sm">Refundable</Label>
                                        </div>
                                      )}
                                    />
                                  </div>

                                  <Controller
                                    name={`roomTypes.${index}.pricing.${pricingIndex}.note`}
                                    control={form.control}
                                    render={({ field }) => (
                                      <Field>
                                        <FieldLabel className="text-xs md:text-sm">Note (Optional)</FieldLabel>
                                        <Input
                                          {...field}
                                          placeholder="Additional notes about this pricing item"
                                          className="h-9 md:h-10"
                                        />
                                      </Field>
                                    )}
                                  />
                                </motion.div>
                              ))}

                              {(!form.watch(`roomTypes.${index}.pricing`) || 
                                form.watch(`roomTypes.${index}.pricing`).length === 0) && (
                                <div className="text-center py-6 md:py-8 border-2 border-dashed rounded-lg">
                                  <DollarSign className="w-8 md:w-12 h-8 md:h-12 mx-auto text-muted-foreground/50 mb-2" />
                                  <p className="text-sm text-muted-foreground">No pricing items added</p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addPricingItem(index)}
                                    className="mt-2"
                                  >
                                    Add First Pricing Item
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>

                          {/* Amenities Tab */}
                          <TabsContent value="amenities" className="mt-4 md:mt-6 space-y-4 md:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <h3 className="text-base md:text-lg font-semibold">Room Amenities</h3>
                              <Dialog open={showAmenitiesDialog} onOpenChange={setShowAmenitiesDialog}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedAmenitiesRoomIndex(index)}
                                    className="self-start sm:self-auto"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Add Amenities</span>
                                    <span className="sm:hidden">Add</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Select Room Amenities</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                    {ROOM_AMENITIES.map((amenity) => {
                                      const isSelected = form.watch(`roomTypes.${selectedAmenitiesRoomIndex}.amenities`)
                                        ?.some(a => a.name === amenity.name) || false;
                                      
                                      return (
                                        <button
                                          key={amenity.name}
                                          type="button"
                                          onClick={() => toggleAmenity(selectedAmenitiesRoomIndex, amenity.name)}
                                          className={`p-3 text-left border-2 rounded-lg transition-all ${
                                            isSelected
                                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                              : 'border-muted hover:border-orange-500/50'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <amenity.icon className={`w-5 h-5 ${
                                              isSelected ? 'text-orange-600' : 'text-muted-foreground'
                                            }`} />
                                            <span className="text-sm font-medium">{amenity.name}</span>
                                            {isSelected && <Check className="w-4 h-4 text-orange-600 ml-auto" />}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {form.watch(`roomTypes.${index}.amenities`)?.map((amenity, amenityIndex) => {
                                const amenityData = ROOM_AMENITIES.find(a => a.name === amenity.name);
                                const IconComponent = amenityData?.icon || Square;
                                
                                return (
                                  <motion.div
                                    key={amenityIndex}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3 border-2 border-orange-200 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                      <span className="text-sm font-medium flex-1 truncate">{amenity.name}</span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleAmenity(index, amenity.name)}
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>

                            {(!form.watch(`roomTypes.${index}.amenities`) || 
                              form.watch(`roomTypes.${index}.amenities`).length === 0) && (
                              <div className="text-center py-6 md:py-8 border-2 border-dashed rounded-lg">
                                <Square className="w-8 md:w-12 h-8 md:h-12 mx-auto text-muted-foreground/50 mb-2" />
                                <p className="text-sm text-muted-foreground">No amenities selected</p>
                                <p className="text-xs text-muted-foreground">Add amenities to showcase room features</p>
                              </div>
                            )}
                          </TabsContent>

                          {/* Availability Tab */}
                          <TabsContent value="availability" className="mt-4 md:mt-6 space-y-4 md:space-y-6">
                            <h3 className="text-base md:text-lg font-semibold">Availability & Inventory</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              <Controller
                                name={`roomTypes.${index}.availability.totalBeds`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                      Total Beds <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                      {...field}
                                      type="number"
                                      min="1"
                                      placeholder="5"
                                      className={`h-10 md:h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />

                              <Controller
                                name={`roomTypes.${index}.availability.availableBeds`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                      Available Beds <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                      {...field}
                                      type="number"
                                      min="0"
                                      max={form.watch(`roomTypes.${index}.availability.totalBeds`) || 999}
                                      placeholder="2"
                                      className={`h-10 md:h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              <Controller
                                name={`roomTypes.${index}.availability.nextAvailability`}
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Next Availability</FieldLabel>
                                    <Input
                                      {...field}
                                      placeholder="e.g., Immediate, Next month"
                                      className="h-10 md:h-11"
                                    />
                                  </Field>
                                )}
                              />

                              <div className="space-y-4">
                                <Controller
                                  name={`roomTypes.${index}.availability.soldOut`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                      <Label className="text-sm">Currently Sold Out</Label>
                                    </div>
                                  )}
                                />

                                <Controller
                                  name={`roomTypes.${index}.availability.seasonalPricing`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                      <Label className="text-sm">Seasonal Pricing</Label>
                                    </div>
                                  )}
                                />
                              </div>
                            </div>

                            {/* Availability Summary */}
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-2">Availability Summary</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Total Beds:</span>
                                  <span className="ml-2 font-medium">
                                    {form.watch(`roomTypes.${index}.availability.totalBeds`) || 0}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Available:</span>
                                  <span className="ml-2 font-medium">
                                    {form.watch(`roomTypes.${index}.availability.availableBeds`) || 0}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Occupancy:</span>
                                  <span className="ml-2 font-medium">
                                    {(() => {
                                      const total = form.watch(`roomTypes.${index}.availability.totalBeds`) || 0;
                                      const available = form.watch(`roomTypes.${index}.availability.availableBeds`) || 0;
                                      const occupied = total - available;
                                      const percentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
                                      return `${percentage}%`;
                                    })()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className={`ml-2 font-medium ${
                                    form.watch(`roomTypes.${index}.availability.soldOut`)
                                      ? 'text-red-600'
                                      : 'text-green-600'
                                  }`}>
                                    {form.watch(`roomTypes.${index}.availability.soldOut`) 
                                      ? 'Sold Out' 
                                      : 'Available'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>

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