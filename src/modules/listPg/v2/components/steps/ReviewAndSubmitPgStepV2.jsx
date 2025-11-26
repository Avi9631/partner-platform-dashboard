import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle,
  AlertCircle,
  Edit2,
  Eye,
  Send,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Bed,
  Users,
  Wifi,
  Shield,
  Camera,
  Video,
  Globe,
  Star,
  Calendar,
  Clock,
  IndianRupee,
  Building2,
  Utensils,
  FileText,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Info,
  Zap,
  Award,
  Sparkles,
  CheckSquare,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

// Validation helpers
const validateFormData = (formData) => {
  const errors = [];
  const warnings = [];
  const missing = [];

  // Required sections validation
  if (!formData.title?.trim()) missing.push('Property title');
  if (!formData.location?.fullAddress?.trim()) missing.push('Property address');
  if (!formData.roomTypes || formData.roomTypes.length === 0) missing.push('Room types');
  if (!formData.media?.images || formData.media.images.length < 3) missing.push('At least 3 property images');

  // Data quality checks
  if (formData.roomTypes?.length > 0) {
    formData.roomTypes.forEach((room, index) => {
      if (!room.pricing || room.pricing.length === 0) {
        warnings.push(`Room type ${index + 1} is missing pricing information`);
      }
    });
  }

  if (formData.amenities?.basic?.length < 5) {
    warnings.push('Consider adding more amenities to attract more tenants');
  }

  if (!formData.contact?.phone && !formData.contact?.email) {
    errors.push('At least one contact method is required');
  }

  return { errors, warnings, missing, isValid: errors.length === 0 && missing.length === 0 };
};

export default function ReviewAndSubmitPgStepV2() {
  const { formData, previousStep, saveDraft, resetForm, onClose } = usePgFormV2();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitOptions, setSubmitOptions] = useState({
    publishImmediately: true,
    sendForReview: false,
    saveDraft: false,
    notifyContacts: true,
  });
  const [validationResult, setValidationResult] = useState({ errors: [], warnings: [], missing: [], isValid: false });

  const logger = useMemo(() => createStepLogger('Review & Submit PG Step V2'), []);

  // Validate form data on mount and when formData changes
  useEffect(() => {
    if (formData) {
      const result = validateFormData(formData);
      setValidationResult(result);
      logger.logValidationResult(result);
    }
  }, [formData, logger]);

  // Generate property summary
  const propertySummary = useMemo(() => {
    if (!formData) return null;

    const totalBeds = formData.roomTypes?.reduce((sum, room) => sum + (room.availability?.totalBeds || 0), 0) || 0;
    const availableBeds = formData.roomTypes?.reduce((sum, room) => sum + (room.availability?.availableBeds || 0), 0) || 0;
    const priceRange = formData.roomTypes?.length > 0 ? {
      min: Math.min(...formData.roomTypes.map(room => {
        const mainPrice = room.pricing?.find(p => p.type === 'Monthly Rent');
        return mainPrice?.amount || 0;
      }).filter(price => price > 0)),
      max: Math.max(...formData.roomTypes.map(room => {
        const mainPrice = room.pricing?.find(p => p.type === 'Monthly Rent');
        return mainPrice?.amount || 0;
      }).filter(price => price > 0))
    } : { min: 0, max: 0 };

    return {
      totalBeds,
      availableBeds,
      occupancyRate: totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0,
      priceRange,
      roomTypes: formData.roomTypes?.length || 0,
      totalImages: formData.media?.statistics?.totalImages || 0,
      totalVideos: formData.media?.statistics?.totalVideos || 0,
      totalAmenities: (formData.amenities?.basic?.length || 0) + (formData.amenities?.premium?.length || 0),
    };
  }, [formData]);

  // Handle final submission
  const handleSubmit = async () => {
    if (!validationResult.isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Save final draft
      const saveResult = await saveDraft(formData);
      
      if (saveResult.success) {
        // Here you would typically call your submission API
        logger.logSubmission(formData, {});
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success handling
        setShowSubmitDialog(false);
        
        // Show success message or redirect
        if (onClose) {
          onClose(true); // Pass success flag
        }
      } else {
        throw new Error(saveResult.message || 'Failed to save');
      }
    } catch (error) {
      logger.logError('Submission failed', error);
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format price range
  const formatPriceRange = (priceRange) => {
    if (!priceRange || priceRange.min === 0 && priceRange.max === 0) return 'Not specified';
    if (priceRange.min === priceRange.max) return `₹${priceRange.min.toLocaleString()}/month`;
    return `₹${priceRange.min.toLocaleString()} - ₹${priceRange.max.toLocaleString()}/month`;
  };

  // Get validation status icon
  const getValidationIcon = (hasErrors, hasWarnings, hasMissing) => {
    if (hasErrors || hasMissing) return <XCircle className="w-5 h-5 text-red-500" />;
    if (hasWarnings) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  if (!formData) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No data to review</h3>
          <p className="text-muted-foreground mb-4">
            Please complete the previous steps before reviewing your listing
          </p>
          <Button onClick={previousStep} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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
          Review & Submit Your Listing
        </h2>
        <p className="text-muted-foreground text-sm">
          Review all details and submit your PG/Hostel listing for approval
        </p>
      </motion.div>

      {/* Validation Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className={`border-2 ${validationResult.isValid ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10'}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {getValidationIcon(
                validationResult.errors.length > 0,
                validationResult.warnings.length > 0,
                validationResult.missing.length > 0
              )}
              <div className="flex-1">
                <h3 className="font-semibold mb-2">
                  {validationResult.isValid ? 'Ready to Submit!' : 'Action Required'}
                </h3>
                
                {validationResult.missing.length > 0 && (
                  <Alert className="mb-4 border-red-200">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Missing Required Information</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {validationResult.missing.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResult.errors.length > 0 && (
                  <Alert className="mb-4 border-red-200">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Errors Found</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {validationResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResult.warnings.length > 0 && (
                  <Alert className="mb-4 border-yellow-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Recommendations</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {validationResult.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResult.isValid && (
                  <p className="text-green-600 dark:text-green-400">
                    Your listing is complete and ready for submission!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Property Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{propertySummary?.totalBeds || 0}</div>
            <div className="text-sm text-muted-foreground">Total Beds</div>
            <div className="text-xs text-green-600 mt-1">
              {propertySummary?.availableBeds || 0} Available
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <IndianRupee className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-600">
              {formatPriceRange(propertySummary?.priceRange)}
            </div>
            <div className="text-sm text-muted-foreground">Price Range</div>
            <div className="text-xs text-muted-foreground mt-1">
              {propertySummary?.roomTypes || 0} Room Types
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {propertySummary?.totalImages || 0}
            </div>
            <div className="text-sm text-muted-foreground">Images</div>
            <div className="text-xs text-muted-foreground mt-1">
              {propertySummary?.totalVideos || 0} Videos
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {propertySummary?.totalAmenities || 0}
            </div>
            <div className="text-sm text-muted-foreground">Amenities</div>
            <div className="text-xs text-green-600 mt-1">
              {propertySummary?.occupancyRate || 0}% Occupied
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Review Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Property Details Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rooms">Rooms & Pricing</TabsTrigger>
                <TabsTrigger value="amenities">Amenities & Food</TabsTrigger>
                <TabsTrigger value="policies">Policies & Safety</TabsTrigger>
                <TabsTrigger value="media">Media & Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Property Title</Label>
                        <p className="text-base font-medium">{formData.title || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Property Type</Label>
                        <p className="text-base">{formData.propertyType || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Gender Preference</Label>
                        <p className="text-base">{formData.genderPreference || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Availability Status</Label>
                        <Badge variant={formData.status === 'Available' ? 'default' : 'secondary'}>
                          {formData.status || 'Not specified'}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                        <p className="text-sm leading-relaxed">
                          {formData.description || 'No description provided'}
                        </p>
                      </div>
                      {formData.highlights && formData.highlights.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Key Highlights</Label>
                          <ul className="mt-2 space-y-1">
                            {formData.highlights.slice(0, 4).map((highlight, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                {highlight}
                              </li>
                            ))}
                            {formData.highlights.length > 4 && (
                              <li className="text-sm text-muted-foreground">
                                +{formData.highlights.length - 4} more highlights
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Location Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Address</Label>
                      <p className="text-base">{formData.location?.fullAddress || 'Address not provided'}</p>
                    </div>
                    {formData.location?.nearby && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.location.nearby.colleges && formData.location.nearby.colleges.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Nearby Colleges</Label>
                            <ul className="mt-1 space-y-1">
                              {formData.location.nearby.colleges.slice(0, 3).map((college, index) => (
                                <li key={index} className="text-sm flex items-center justify-between">
                                  <span>{college.name}</span>
                                  <span className="text-muted-foreground">{college.distance}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {formData.location.nearby.transport && formData.location.nearby.transport.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Transport</Label>
                            <ul className="mt-1 space-y-1">
                              {formData.location.nearby.transport.slice(0, 3).map((transport, index) => (
                                <li key={index} className="text-sm flex items-center justify-between">
                                  <span>{transport.name}</span>
                                  <span className="text-muted-foreground">{transport.distance}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {formData.location.nearby.hospitals && formData.location.nearby.hospitals.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Healthcare</Label>
                            <ul className="mt-1 space-y-1">
                              {formData.location.nearby.hospitals.slice(0, 3).map((hospital, index) => (
                                <li key={index} className="text-sm flex items-center justify-between">
                                  <span>{hospital.name}</span>
                                  <span className="text-muted-foreground">{hospital.distance}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="space-y-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-orange-600" />
                  Room Types & Pricing
                </h3>
                
                {formData.roomTypes && formData.roomTypes.length > 0 ? (
                  <div className="space-y-4">
                    {formData.roomTypes.map((room, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{room.name || `Room Type ${index + 1}`}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{room.sharing}</Badge>
                              {room.ac && <Badge variant="secondary">AC</Badge>}
                              {room.attachedWashroom && <Badge variant="secondary">Attached Bathroom</Badge>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ₹{room.pricing?.find(p => p.type === 'Monthly Rent')?.amount?.toLocaleString() || 'N/A'}
                              <span className="text-sm text-muted-foreground">/month</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {room.availability?.availableBeds || 0}/{room.availability?.totalBeds || 0} available
                            </div>
                          </div>
                        </div>
                        
                        {room.pricing && room.pricing.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Pricing Breakdown</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              {room.pricing.slice(0, 4).map((price, priceIndex) => (
                                <div key={priceIndex} className="flex items-center justify-between">
                                  <span className="text-muted-foreground">{price.type}</span>
                                  <span className="font-medium">₹{price.amount?.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium text-muted-foreground">Room Amenities</Label>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {room.amenities.slice(0, 6).map((amenity, amenityIndex) => (
                                <Badge key={amenityIndex} variant="outline" className="text-xs">
                                  {amenity.name}
                                </Badge>
                              ))}
                              {room.amenities.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.amenities.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No room types configured</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-orange-600" />
                    Property Amenities
                  </h3>
                  
                  {(formData.amenities?.basic?.length > 0 || formData.amenities?.premium?.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.amenities?.basic?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Basic Amenities</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.amenities.basic.map((amenity, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {amenity.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formData.amenities?.premium?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Premium Amenities</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.amenities.premium.map((amenity, index) => (
                              <Badge key={index} variant="default" className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {amenity.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No amenities specified</p>
                  )}
                </div>

                <Separator />

                {/* Food & Mess */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-600" />
                    Food & Mess Details
                  </h3>
                  
                  {formData.foodMess ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Food Service</Label>
                          <Badge variant={formData.foodMess.available ? 'default' : 'secondary'}>
                            {formData.foodMess.available ? 'Available' : 'Not Available'}
                          </Badge>
                        </div>
                        {formData.foodMess.available && (
                          <>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Food Type</Label>
                              <p className="text-sm">{formData.foodMess.foodType || 'Not specified'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Meals</Label>
                              <div className="flex gap-1 mt-1">
                                {formData.foodMess.meals?.map((meal, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{meal}</Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {formData.foodMess.available && formData.foodMess.timings && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Meal Timings</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            {Object.entries(formData.foodMess.timings).map(([meal, timing]) => (
                              <div key={meal} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm capitalize">{meal}</span>
                                <span className="text-sm font-medium">{timing}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Food service details not specified</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                {/* Rules & Restrictions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Rules & Policies
                  </h3>
                  
                  {formData.rules && formData.rules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm font-medium">{rule.key}</span>
                          <Badge variant={rule.value?.toLowerCase() === 'yes' ? 'default' : 'secondary'}>
                            {rule.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No rules specified</p>
                  )}
                </div>

                <Separator />

                {/* Safety & Security */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    Safety & Security
                  </h3>
                  
                  {formData.safety ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className={`w-5 h-5 ${formData.safety.cctvSurveillance ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm">CCTV Surveillance</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className={`w-5 h-5 ${formData.safety.securityGuard ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm">Security Guard</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className={`w-5 h-5 ${formData.safety.fireSafety ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm">Fire Safety</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Safety information not provided</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                {/* Media Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-600" />
                    Media Content
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {formData.media?.statistics?.totalImages || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Images</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {formData.media?.statistics?.totalVideos || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Videos</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">
                        {formData.media?.statistics?.totalVirtualTours || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Virtual Tours</div>
                    </div>
                  </div>
                  
                  {formData.media?.images && formData.media.images.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Sample Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {formData.media.images.slice(0, 8).map((image, index) => (
                          <div key={index} className="aspect-video relative overflow-hidden rounded-lg border">
                            <img
                              src={image.url}
                              alt={image.caption || `Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {image.isPrimary && (
                              <Badge className="absolute top-2 left-2 text-xs">Primary</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      {formData.media.images.length > 8 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          +{formData.media.images.length - 8} more images
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    Contact Information
                  </h3>
                  
                  {formData.contact ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                          <p className="text-base font-medium">{formData.contact.name || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                          <p className="text-sm">{formData.contact.role || 'Property Manager'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                          <p className="text-base">{formData.contact.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                          <p className="text-base">{formData.contact.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Contact information not provided</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-between pt-8"
      >
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </Button>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => saveDraft(formData)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save your progress without submitting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            type="button"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            onClick={() => setShowSubmitDialog(true)}
            disabled={!validationResult.isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Listing
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-orange-600" />
              Submit Your Listing
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You're about to submit your PG/Hostel listing for review. Please confirm your submission preferences:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Publish immediately after approval</Label>
                <Switch
                  checked={submitOptions.publishImmediately}
                  onCheckedChange={(checked) => 
                    setSubmitOptions(prev => ({ ...prev, publishImmediately: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Send email notifications</Label>
                <Switch
                  checked={submitOptions.notifyContacts}
                  onCheckedChange={(checked) => 
                    setSubmitOptions(prev => ({ ...prev, notifyContacts: checked }))
                  }
                />
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Review Process</AlertTitle>
              <AlertDescription className="text-sm">
                Your listing will be reviewed within 24-48 hours. You'll receive email updates about the status.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Confirm Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}