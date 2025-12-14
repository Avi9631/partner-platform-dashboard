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
  Copy,
  CheckCircle2,
  AlertCircle
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);
  const [tempRoomData, setTempRoomData] = useState(null);
  const [currentSheetTab, setCurrentSheetTab] = useState('basic');
  const [sheetValidationErrors, setSheetValidationErrors] = useState({});

  const logger = useMemo(() => createStepLogger('Room Types PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(roomTypesPgSchema),
    mode: 'onChange',
    defaultValues: {
      roomTypes: formData?.roomTypes?.length > 0 ? formData.roomTypes : [
       
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

  // Validate tab completion
  const validateTabCompletion = (roomData) => {
    const errors = {};
    
    // Basic tab validation
    if (!roomData.name?.trim()) {
      errors.basic = 'Room name is required';
    } else if (!roomData.roomSize || (typeof roomData.roomSize === 'string' && !roomData.roomSize.trim()) || (typeof roomData.roomSize === 'number' && roomData.roomSize <= 0)) {
      errors.basic = 'Room size is required';
    }
    
    // Pricing tab validation
    if (!roomData.pricing || roomData.pricing.length === 0) {
      errors.pricing = 'At least one pricing item is required';
    } else {
      const hasInvalidPricing = roomData.pricing.some(p => !p.type || p.amount <= 0);
      if (hasInvalidPricing) {
        errors.pricing = 'All pricing items must have type and amount > 0';
      }
    }
    
    // Amenities tab validation
    if (!roomData.amenities || roomData.amenities.length === 0) {
      errors.amenities = 'Please select at least one amenity';
    }
    
    // Availability tab validation
    if (!roomData.availability?.totalBeds || roomData.availability.totalBeds <= 0) {
      errors.availability = 'Total beds must be greater than 0';
    } else if (roomData.availability.availableBeds > roomData.availability.totalBeds) {
      errors.availability = 'Available beds cannot exceed total beds';
    }
    
    return errors;
  };

  // Check if tab is complete
  const isTabComplete = (tabName, roomData) => {
    if (!roomData) return false;
    const errors = validateTabCompletion(roomData);
    return !errors[tabName];
  };

  // Check if all tabs are complete
  const areAllTabsComplete = (roomData) => {
    if (!roomData) return false;
    const errors = validateTabCompletion(roomData);
    return Object.keys(errors).length === 0;
  };

  // Add new room type
  const handleAddRoomType = () => {
    const newRoom = {
      name: '',
      category: 'Single sharing',
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
      },
      refundPolicy: '',
      amenities: [],
    };
    setTempRoomData(newRoom);
    setEditingRoomIndex(null);
    setCurrentSheetTab('basic');
    setSheetValidationErrors({});
    setIsSheetOpen(true);
  };

  // Edit room type
  const handleEditRoomType = (index) => {
    const roomToEdit = form.getValues(`roomTypes.${index}`);
    setTempRoomData({ ...roomToEdit });
    setEditingRoomIndex(index);
    setCurrentSheetTab('basic');
    setSheetValidationErrors(validateTabCompletion({ ...roomToEdit }));
    setIsSheetOpen(true);
  };

  // Save room from sheet
  const handleSaveRoomFromSheet = () => {
    if (!tempRoomData) return;
    
    // Validate all tabs
    const errors = validateTabCompletion(tempRoomData);
    setSheetValidationErrors(errors);
    
    // If there are errors, switch to the first tab with error
    if (Object.keys(errors).length > 0) {
      const firstErrorTab = Object.keys(errors)[0];
      setCurrentSheetTab(firstErrorTab);
      return;
    }
    
    if (editingRoomIndex !== null) {
      // Update existing room
      form.setValue(`roomTypes.${editingRoomIndex}`, tempRoomData);
    } else {
      // Add new room
      addRoomType(tempRoomData);
    }
    
    setIsSheetOpen(false);
    setTempRoomData(null);
    setEditingRoomIndex(null);
    setCurrentSheetTab('basic');
    setSheetValidationErrors({});
  };

  // Update temp room data
  const updateTempRoomField = (fieldPath, value) => {
    setTempRoomData(prev => {
      const newData = { ...prev };
      const keys = fieldPath.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      // Revalidate after update
      const errors = validateTabCompletion(newData);
      setSheetValidationErrors(errors);
      
      return newData;
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
    if (isSheetOpen && tempRoomData) {
      // Working with sheet data
      const currentPricing = tempRoomData.pricing || [];
      updateTempRoomField('pricing', [
        ...currentPricing,
        { type: 'Maintenance Charges', amount: 0, currency: 'INR', mandatory: true, frequency: 'monthly' }
      ]);
    } else {
      // Working with form data
      const currentPricing = form.getValues(`roomTypes.${roomIndex}.pricing`) || [];
      form.setValue(`roomTypes.${roomIndex}.pricing`, [
        ...currentPricing,
        { type: 'Maintenance Charges', amount: 0, currency: 'INR', mandatory: true, frequency: 'monthly' }
      ]);
    }
  };

  // Remove pricing item
  const removePricingItem = (roomIndex, pricingIndex) => {
    if (isSheetOpen && tempRoomData) {
      // Working with sheet data
      const currentPricing = tempRoomData.pricing || [];
      updateTempRoomField('pricing', currentPricing.filter((_, i) => i !== pricingIndex));
    } else {
      // Working with form data
      const currentPricing = form.getValues(`roomTypes.${roomIndex}.pricing`) || [];
      form.setValue(
        `roomTypes.${roomIndex}.pricing`, 
        currentPricing.filter((_, i) => i !== pricingIndex)
      );
    }
  };

  // Toggle room amenity
  const toggleAmenity = (roomIndex, amenityName) => {
    if (isSheetOpen && tempRoomData) {
      // Working with sheet data
      const currentAmenities = tempRoomData.amenities || [];
      const existingIndex = currentAmenities.findIndex(a => a.name === amenityName);
      
      if (existingIndex >= 0) {
        updateTempRoomField('amenities', currentAmenities.filter((_, i) => i !== existingIndex));
      } else {
        const amenityData = ROOM_AMENITIES.find(a => a.name === amenityName);
        updateTempRoomField('amenities', [
          ...currentAmenities,
          { name: amenityName, available: true }
        ]);
      }
    } else {
      // Working with form data
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
    <div className="w-full max-w-7xl mx-auto ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-xl md:text-2xl   font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
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
               
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {roomTypes.map((roomType, index) => {
                  const roomData = form.watch(`roomTypes.${index}`);
                  const hasErrors = form.formState.errors.roomTypes?.[index];
                  
                  return (
                    <Card key={roomType.id} className={`${
                      hasErrors ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2">
                              <Bed className="w-4 md:w-5 h-4 md:h-5 text-orange-600" />
                              <span className="font-medium text-sm md:text-base">
                                {roomData?.name || `Room Type ${index + 1}`}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {roomData?.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditRoomType(index)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => duplicateRoomType(index)}
                              className="h-8 w-8 p-0"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {roomTypes.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeRoomType(index)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
 
                    </Card>
                  );
                })}
              </div>
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

      {/* Room Type Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {editingRoomIndex !== null ? 'Edit Room Type' : 'Add New Room Type'}
            </SheetTitle>
            <SheetDescription>
              Configure room details, pricing, amenities, and availability
            </SheetDescription>
          </SheetHeader>

          {tempRoomData && (
            <div className="mt-6">
              <Tabs value={currentSheetTab} onValueChange={setCurrentSheetTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="basic" className="relative">
                    <span className="flex items-center gap-1.5">
                      Basic
                      {isTabComplete('basic', tempRoomData) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : sheetValidationErrors.basic ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      ) : null}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="relative">
                    <span className="flex items-center gap-1.5">
                      Pricing
                      {isTabComplete('pricing', tempRoomData) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : sheetValidationErrors.pricing ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      ) : null}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="amenities" className="relative">
                    <span className="flex items-center gap-1.5">
                      Amenities
                      {isTabComplete('amenities', tempRoomData) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : sheetValidationErrors.amenities ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      ) : null}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="availability" className="relative">
                    <span className="flex items-center gap-1.5">
                      Availability
                      {isTabComplete('availability', tempRoomData) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : sheetValidationErrors.availability ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      ) : null}
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="mt-6 space-y-6">
                  {sheetValidationErrors.basic && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-600 font-medium">{sheetValidationErrors.basic}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <Label>Room Name <span className="text-red-500">*</span></Label>
                      <Input
                        value={tempRoomData.name || ''}
                        onChange={(e) => updateTempRoomField('name', e.target.value)}
                        placeholder="e.g., Single Occupancy AC"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Room Category <span className="text-red-500">*</span></Label>
                      <Select
                        value={tempRoomData.category || 'Single sharing'}
                        onValueChange={(value) => updateTempRoomField('category', value)}
                      >
                        <SelectTrigger className="mt-2">
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
                    </div>

                    <div>
                      <Label>Room Size <span className="text-red-500">*</span></Label>
                      <Input
                        value={tempRoomData.roomSize || ''}
                        onChange={(e) => updateTempRoomField('roomSize', e.target.value)}
                        placeholder="e.g., 120 sq.ft"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Refund Policy <span className="text-red-500">*</span></Label>
                      <Textarea
                        value={tempRoomData.refundPolicy || ''}
                        onChange={(e) => updateTempRoomField('refundPolicy', e.target.value)}
                        placeholder="e.g., 100% refund if cancelled 15 days before move-in"
                        className="mt-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="mt-6 space-y-6">
                  {sheetValidationErrors.pricing && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-600 font-medium">{sheetValidationErrors.pricing}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Pricing Details</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addPricingItem(null)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {tempRoomData.pricing?.map((pricingItem, pricingIndex) => (
                      <Card key={pricingIndex}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Pricing Item {pricingIndex + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePricingItem(null, pricingIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Type</Label>
                              <Select
                                value={pricingItem.type || 'Monthly Rent'}
                                onValueChange={(value) => {
                                  const updatedPricing = [...tempRoomData.pricing];
                                  updatedPricing[pricingIndex].type = value;
                                  updateTempRoomField('pricing', updatedPricing);
                                }}
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {PRICING_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Amount (₹)</Label>
                              <div className="relative mt-2">
                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  min="0"
                                  value={pricingItem.amount || 0}
                                  onChange={(e) => {
                                    const updatedPricing = [...tempRoomData.pricing];
                                    updatedPricing[pricingIndex].amount = parseInt(e.target.value) || 0;
                                    updateTempRoomField('pricing', updatedPricing);
                                  }}
                                  placeholder="0"
                                  className="pl-9"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Frequency</Label>
                            <Select
                              value={pricingItem.frequency || 'monthly'}
                              onValueChange={(value) => {
                                const updatedPricing = [...tempRoomData.pricing];
                                updatedPricing[pricingIndex].frequency = value;
                                updateTempRoomField('pricing', updatedPricing);
                              }}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="one_time">One Time</SelectItem>
                                <SelectItem value="per_unit">Per Unit</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={pricingItem.mandatory || false}
                                onCheckedChange={(checked) => {
                                  const updatedPricing = [...tempRoomData.pricing];
                                  updatedPricing[pricingIndex].mandatory = checked;
                                  updateTempRoomField('pricing', updatedPricing);
                                }}
                              />
                              <Label>Mandatory</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={pricingItem.refundable || false}
                                onCheckedChange={(checked) => {
                                  const updatedPricing = [...tempRoomData.pricing];
                                  updatedPricing[pricingIndex].refundable = checked;
                                  updateTempRoomField('pricing', updatedPricing);
                                }}
                              />
                              <Label>Refundable</Label>
                            </div>
                          </div>

                          <div>
                            <Label>Note (Optional)</Label>
                            <Input
                              value={pricingItem.note || ''}
                              onChange={(e) => {
                                const updatedPricing = [...tempRoomData.pricing];
                                updatedPricing[pricingIndex].note = e.target.value;
                                updateTempRoomField('pricing', updatedPricing);
                              }}
                              placeholder="Additional notes"
                              className="mt-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {(!tempRoomData.pricing || tempRoomData.pricing.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <DollarSign className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">No pricing items added</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addPricingItem(null)}
                        >
                          Add First Pricing Item
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Amenities Tab */}
                <TabsContent value="amenities" className="mt-6 space-y-6">
                  {sheetValidationErrors.amenities && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-600 font-medium">{sheetValidationErrors.amenities}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Room Amenities</h3>
                    <Badge variant="secondary">
                      {tempRoomData.amenities?.length || 0} Selected
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROOM_AMENITIES.map((amenity) => {
                      const isSelected = tempRoomData.amenities?.some(a => a.name === amenity.name) || false;
                      const IconComponent = amenity.icon;
                      
                      return (
                        <button
                          key={amenity.name}
                          type="button"
                          onClick={() => toggleAmenity(null, amenity.name)}
                          className={`p-4 text-left border-2 rounded-lg transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-muted hover:border-orange-500/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className={`w-5 h-5 ${
                              isSelected ? 'text-orange-600' : 'text-muted-foreground'
                            }`} />
                            <span className="text-sm font-medium flex-1">{amenity.name}</span>
                            {isSelected && <Check className="w-5 h-5 text-orange-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Availability Tab */}
                <TabsContent value="availability" className="mt-6 space-y-6">
                  {sheetValidationErrors.availability && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-600 font-medium">{sheetValidationErrors.availability}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Total Beds <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        min="1"
                        value={tempRoomData.availability?.totalBeds || 0}
                        onChange={(e) => updateTempRoomField('availability.totalBeds', parseInt(e.target.value) || 0)}
                        placeholder="5"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Available Beds <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        min="0"
                        max={tempRoomData.availability?.totalBeds || 999}
                        value={tempRoomData.availability?.availableBeds || 0}
                        onChange={(e) => updateTempRoomField('availability.availableBeds', parseInt(e.target.value) || 0)}
                        placeholder="2"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Next Availability</Label>
                    <Input
                      value={tempRoomData.availability?.nextAvailability || ''}
                      onChange={(e) => updateTempRoomField('availability.nextAvailability', e.target.value)}
                      placeholder="e.g., Immediate, Next month"
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="sheet-soldout">Currently Sold Out</Label>
                      <Switch
                        id="sheet-soldout"
                        checked={tempRoomData.availability?.soldOut || false}
                        onCheckedChange={(checked) => updateTempRoomField('availability.soldOut', checked)}
                      />
                    </div>
                  </div>

                  {/* Availability Summary */}
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-base">Availability Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">Total Beds</span>
                          <span className="text-xl font-bold text-orange-600">
                            {tempRoomData.availability?.totalBeds || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">Available</span>
                          <span className="text-xl font-bold text-green-600">
                            {tempRoomData.availability?.availableBeds || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">Occupancy</span>
                          <span className="text-xl font-bold">
                            {(() => {
                              const total = tempRoomData.availability?.totalBeds || 0;
                              const available = tempRoomData.availability?.availableBeds || 0;
                              const occupied = total - available;
                              const percentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
                              return `${percentage}%`;
                            })()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">Status</span>
                          <span className={`text-xl font-bold ${
                            tempRoomData.availability?.soldOut ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {tempRoomData.availability?.soldOut ? 'Sold Out' : 'Available'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <SheetFooter className="mt-8 gap-3 flex-col sm:flex-row">
                {/* Progress Indicator */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Completion Progress</span>
                    <span className="font-medium">
                      {Object.keys(['basic', 'pricing', 'amenities', 'availability']).filter(tab => 
                        isTabComplete(tab, tempRoomData)
                      ).length} / 4 tabs
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                      style={{ 
                        width: `${(Object.keys(['basic', 'pricing', 'amenities', 'availability']).filter(tab => 
                          isTabComplete(tab, tempRoomData)
                        ).length / 4) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsSheetOpen(false);
                      setTempRoomData(null);
                      setEditingRoomIndex(null);
                      setCurrentSheetTab('basic');
                      setSheetValidationErrors({});
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveRoomFromSheet}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 flex-1 sm:flex-none"
                    disabled={!areAllTabsComplete(tempRoomData)}
                    title={!areAllTabsComplete(tempRoomData) ? 'Please complete all tabs before saving' : ''}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {editingRoomIndex !== null ? 'Update Room' : 'Add Room'}
                  </Button>
                </div>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}