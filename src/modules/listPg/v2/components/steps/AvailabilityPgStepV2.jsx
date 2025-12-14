import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar,
  CalendarDays,
  Users,
  Bed,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Zap,
  Gift,
  Bell,
  MapPin,
  Eye,
  Percent,
  Plus,
  Minus,
  RefreshCw,
  Info,
  AlertCircle,
  Crown,
  Timer,
  UserPlus
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
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import availabilityPgSchema, { PROPERTY_STATUS_OPTIONS, POSSESSION_OPTIONS, SEASONAL_PERIODS } from '../../../schemas/availabilityPgSchema';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

// Days of the week for scheduling
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPgStep() {
  const { saveAndContinue, previousStep, formData } = usePgFormV2();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSeasonalDialog, setShowSeasonalDialog] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  const logger = useMemo(() => createStepLogger('Availability PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(availabilityPgSchema),
    mode: 'onChange',
    defaultValues: {
      status: formData?.status || 'Available',
      possession: formData?.possession || 'Immediate',
      customPossessionDate: formData?.customPossessionDate || '',
      propertyAvailability: {
        totalBeds: formData?.propertyAvailability?.totalBeds || 0,
        availableBeds: formData?.propertyAvailability?.availableBeds || 0,
        occupancyRate: formData?.propertyAvailability?.occupancyRate || 0,
        waitlistCount: formData?.propertyAvailability?.waitlistCount || 0,
        lastUpdated: formData?.propertyAvailability?.lastUpdated || '',
      },
      roomAvailability: formData?.roomAvailability || [],
      bookingSettings: {
        autoUpdateEnabled: formData?.bookingSettings?.autoUpdateEnabled || false,
        instantBooking: formData?.bookingSettings?.instantBooking || false,
        advanceBookingDays: formData?.bookingSettings?.advanceBookingDays || 30,
        minimumStayDays: formData?.bookingSettings?.minimumStayDays || 30,
        bufferBeds: formData?.bookingSettings?.bufferBeds || 0,
        allowWaitlist: formData?.bookingSettings?.allowWaitlist || true,
      },
      seasonalPricing: {
        enabled: formData?.seasonalPricing?.enabled || false,
        periods: formData?.seasonalPricing?.periods || [],
      },
      moveInSchedule: {
        availableFrom: formData?.moveInSchedule?.availableFrom || '',
        availableTo: formData?.moveInSchedule?.availableTo || '',
        preferredMoveInDays: formData?.moveInSchedule?.preferredMoveInDays || [],
        advanceBookingDays: formData?.moveInSchedule?.advanceBookingDays || 30,
        instantBooking: formData?.moveInSchedule?.instantBooking || false,
      },
      specialOffers: {
        earlyBirdDiscount: formData?.specialOffers?.earlyBirdDiscount || false,
        earlyBirdPercentage: formData?.specialOffers?.earlyBirdPercentage || 0,
        longStayDiscount: formData?.specialOffers?.longStayDiscount || false,
        longStayPercentage: formData?.specialOffers?.longStayPercentage || 0,
        referralDiscount: formData?.specialOffers?.referralDiscount || false,
        referralPercentage: formData?.specialOffers?.referralPercentage || 0,
      },
      availabilityNotes: formData?.availabilityNotes || '',
      // Legacy fields
      totalBeds: formData?.totalBeds || undefined,
      availableBeds: formData?.availableBeds || undefined,
      isSoldOut: formData?.isSoldOut || false,
      nextAvailabilityDate: formData?.nextAvailabilityDate || '',
      autoUpdateEnabled: formData?.autoUpdateEnabled || false,
      hasSeasonalPricing: formData?.hasSeasonalPricing || false,
      seasonalPricingDetails: formData?.seasonalPricingDetails || '',
    },
  });

  const { fields: seasonalPeriodFields, append: appendSeasonalPeriod, remove: removeSeasonalPeriod } = useFieldArray({
    control: form.control,
    name: 'seasonalPricing.periods',
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Calculate occupancy rate
  const occupancyRate = useMemo(() => {
    const { totalBeds, availableBeds } = form.watch('propertyAvailability');
    if (totalBeds === 0) return 0;
    return Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
  }, [form.watch('propertyAvailability')]);

  // Update occupancy rate when beds change
  useEffect(() => {
    form.setValue('propertyAvailability.occupancyRate', occupancyRate);
  }, [occupancyRate, form]);

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = PROPERTY_STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'gray';
  };

  // Load sample availability data
  const loadSampleAvailability = () => {
    form.setValue('propertyAvailability', {
      totalBeds: 45,
      availableBeds: 15,
      occupancyRate: 67,
      waitlistCount: 8,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    
    form.setValue('roomAvailability', [
      {
        roomTypeId: 1,
        totalBeds: 5,
        availableBeds: 2,
        soldOut: false,
        nextAvailability: 'Immediate',
        seasonalPricing: false,
        waitlistCount: 2,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        roomTypeId: 2,
        totalBeds: 20,
        availableBeds: 5,
        soldOut: false,
        nextAvailability: 'Immediate',
        seasonalPricing: false,
        waitlistCount: 3,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        roomTypeId: 3,
        totalBeds: 20,
        availableBeds: 8,
        soldOut: false,
        nextAvailability: 'Immediate',
        seasonalPricing: false,
        waitlistCount: 3,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    ]);
    
    form.setValue('bookingSettings', {
      autoUpdateEnabled: true,
      instantBooking: true,
      advanceBookingDays: 45,
      minimumStayDays: 90,
      bufferBeds: 2,
      allowWaitlist: true,
    });
  };

  // Add seasonal period
  const addSeasonalPeriod = () => {
    appendSeasonalPeriod({
      periodId: '',
      startDate: '',
      endDate: '',
      priceMultiplier: 1.0,
      description: '',
    });
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  const currentStatus = form.watch('status');
  const statusColor = getStatusColor(currentStatus);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Availability & Booking
        </h2>
        <p className="text-muted-foreground text-sm">
          Manage property availability, booking settings, and occupancy tracking
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          
          {/* Property Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  Property Status Overview
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadSampleAvailability}
                >
                  Load Sample Data
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Status and Possession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Property Status <span className="text-red-500">*</span></FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={`h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full bg-${option.color}-500`} />
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
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
                  name="possession"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Move-in Availability <span className="text-red-500">*</span></FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={`h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSSESSION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
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
              </div>

              {/* Custom Possession Date */}
              <AnimatePresence>
                {form.watch('possession') === 'Custom Date' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Controller
                      name="customPossessionDate"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Custom Move-in Date</FieldLabel>
                          <Input
                            {...field}
                            type="date"
                            className={`h-11 ${fieldState.invalid ? 'border-red-500' : ''}`}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Occupancy Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {form.watch('propertyAvailability.totalBeds') || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Beds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {form.watch('propertyAvailability.availableBeds') || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{occupancyRate}%</div>
                  <div className="text-sm text-muted-foreground">Occupied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {form.watch('propertyAvailability.waitlistCount') || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Waitlist</div>
                </div>
              </div>

              <Progress value={occupancyRate} className="h-2" />
            </CardContent>
          </Card>

          {/* Detailed Configuration Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                Availability Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="rooms">Room Types</TabsTrigger>
                  <TabsTrigger value="booking">Booking Settings</TabsTrigger>
                  <TabsTrigger value="seasonal">Seasonal Pricing</TabsTrigger>
                  <TabsTrigger value="offers">Special Offers</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Property Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name="propertyAvailability.totalBeds"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Total Beds</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="500"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className={fieldState.invalid ? 'border-red-500' : ''}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="propertyAvailability.availableBeds"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Available Beds</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className={fieldState.invalid ? 'border-red-500' : ''}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="propertyAvailability.waitlistCount"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Waitlist Count</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  {/* Move-in Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-orange-600" />
                      Move-in Schedule
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="moveInSchedule.availableFrom"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Available From</FieldLabel>
                            <Input
                              {...field}
                              type="date"
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        name="moveInSchedule.availableTo"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Available To</FieldLabel>
                            <Input
                              {...field}
                              type="date"
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      name="moveInSchedule.preferredMoveInDays"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Preferred Move-in Days</FieldLabel>
                          <div className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map((day) => {
                              const isSelected = field.value?.includes(day);
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    const current = field.value || [];
                                    if (isSelected) {
                                      field.onChange(current.filter(d => d !== day));
                                    } else {
                                      field.onChange([...current, day]);
                                    }
                                  }}
                                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                                    isSelected
                                      ? 'bg-orange-500 text-white border-orange-500'
                                      : 'bg-background hover:bg-muted border-muted'
                                  }`}
                                >
                                  {day.slice(0, 3)}
                                </button>
                              );
                            })}
                          </div>
                        </Field>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="rooms" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Room Type Availability</h3>
                    <Badge variant="outline">{form.watch('roomAvailability')?.length || 0} Room Types</Badge>
                  </div>
                  
                  <div className="text-center py-8">
                    <Bed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Room Availability Management</h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      Room-specific availability will be managed through the Room Types step.
                      This section shows an overview of your room availability configuration.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Configure individual room types in the Room Types step to see detailed availability here.
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="booking" className="space-y-6">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    Booking Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="bookingSettings.advanceBookingDays"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Advance Booking (Days)</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="365"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            How many days in advance can tenants book?
                          </p>
                        </Field>
                      )}
                    />

                    <Controller
                      name="bookingSettings.minimumStayDays"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Minimum Stay (Days)</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="365"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum stay duration for bookings
                          </p>
                        </Field>
                      )}
                    />

                    <Controller
                      name="bookingSettings.bufferBeds"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Buffer Beds</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="10"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Keep some beds reserved for walk-ins
                          </p>
                        </Field>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <Controller
                      name="bookingSettings.autoUpdateEnabled"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <Label className="text-base font-medium cursor-pointer">
                              Auto-Update Availability
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically sync availability with owner app
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
                      name="bookingSettings.instantBooking"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <Label className="text-base font-medium cursor-pointer">
                              Instant Booking
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Allow tenants to book without owner approval
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
                      name="bookingSettings.allowWaitlist"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <Label className="text-base font-medium cursor-pointer">
                              Allow Waitlist
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Accept waitlist when fully booked
                            </p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seasonal" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Seasonal Pricing
                    </h3>
                    <Controller
                      name="seasonalPricing.enabled"
                      control={form.control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <AnimatePresence>
                    {form.watch('seasonalPricing.enabled') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Configure different pricing for peak and off-peak seasons
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addSeasonalPeriod}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Period
                          </Button>
                        </div>

                        {seasonalPeriodFields.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground text-sm">No seasonal periods configured</p>
                          </div>
                        )}

                        {seasonalPeriodFields.map((field, index) => (
                          <Card key={field.id} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Period {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSeasonalPeriod(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Controller
                                name={`seasonalPricing.periods.${index}.periodId`}
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Period Type</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select period type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {SEASONAL_PERIODS.map((period) => (
                                          <SelectItem key={period.id} value={period.id}>
                                            <div>
                                              <div className="font-medium">{period.name}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {period.months.join(', ')}
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </Field>
                                )}
                              />

                              <Controller
                                name={`seasonalPricing.periods.${index}.priceMultiplier`}
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Price Multiplier</FieldLabel>
                                    <Input
                                      {...field}
                                      type="number"
                                      min="0.5"
                                      max="2.0"
                                      step="0.1"
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 1.0)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      1.0 = normal price, 1.2 = 20% increase
                                    </p>
                                  </Field>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <Controller
                                name={`seasonalPricing.periods.${index}.startDate`}
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Start Date</FieldLabel>
                                    <Input {...field} type="date" />
                                  </Field>
                                )}
                              />

                              <Controller
                                name={`seasonalPricing.periods.${index}.endDate`}
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>End Date</FieldLabel>
                                    <Input {...field} type="date" />
                                  </Field>
                                )}
                              />
                            </div>
                          </Card>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="offers" className="space-y-6">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    Special Offers & Discounts
                  </h3>

                  <div className="space-y-6">
                    {/* Early Bird Discount */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <Timer className="w-4 h-4 text-blue-600" />
                            Early Bird Discount
                          </h4>
                          <p className="text-sm text-muted-foreground">Discount for advance bookings</p>
                        </div>
                        <Controller
                          name="specialOffers.earlyBirdDiscount"
                          control={form.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      <AnimatePresence>
                        {form.watch('specialOffers.earlyBirdDiscount') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Controller
                              name="specialOffers.earlyBirdPercentage"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Discount Percentage</FieldLabel>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="0"
                                      max="50"
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="flex-1"
                                    />
                                    <Percent className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                </Field>
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>

                    {/* Long Stay Discount */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            Long Stay Discount
                          </h4>
                          <p className="text-sm text-muted-foreground">Discount for extended stays</p>
                        </div>
                        <Controller
                          name="specialOffers.longStayDiscount"
                          control={form.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      <AnimatePresence>
                        {form.watch('specialOffers.longStayDiscount') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Controller
                              name="specialOffers.longStayPercentage"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Discount Percentage</FieldLabel>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="0"
                                      max="30"
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="flex-1"
                                    />
                                    <Percent className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                </Field>
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>

                    {/* Referral Discount */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-purple-600" />
                            Referral Discount
                          </h4>
                          <p className="text-sm text-muted-foreground">Discount for referrals</p>
                        </div>
                        <Controller
                          name="specialOffers.referralDiscount"
                          control={form.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      <AnimatePresence>
                        {form.watch('specialOffers.referralDiscount') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Controller
                              name="specialOffers.referralPercentage"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Discount Percentage</FieldLabel>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="0"
                                      max="25"
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      className="flex-1"
                                    />
                                    <Percent className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                </Field>
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Availability Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="availabilityNotes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Additional Availability Information (Optional)
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Add any special notes about availability, booking procedures, or seasonal changes..."
                      rows={4}
                      className={fieldState.invalid ? 'border-red-500' : ''}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                    Availability Management Tips
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                    <li>• Keep availability information updated to maintain tenant trust</li>
                    <li>• Use buffer beds to handle walk-in inquiries and emergency situations</li>
                    <li>• Seasonal pricing can help maximize revenue during peak periods</li>
                    <li>• Enable auto-updates to sync with your property management system</li>
                    <li>• Consider special offers to attract tenants during slower periods</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

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