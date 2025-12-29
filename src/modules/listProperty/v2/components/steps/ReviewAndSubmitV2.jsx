import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  MapPin,
  Building2,
  Home,
  DollarSign,
  Calendar,
  Sparkles,
  Loader2,
  FileText,
  Image as ImageIcon,
  Info,
  Bed,
  Bath,
  Square,
  Car,
  Wind,
  Ruler,
  TreePine,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import { draftApi } from '@/services/draftService';
import { useToast } from '@/components/hooks/use-toast';

export default function ReviewAndSubmitV2() {
  const { previousStep, propertyType, isBuildingType, formData, draftId } = usePropertyFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Check if draftId exists
      if (!draftId) {
        setError('No draft found. Please save your form data first.');
        toast({
          title: 'Error',
          description: 'No draft found. Please save your form data first.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Log the complete payload
      const payload = {
        propertyType,
        ...formData
      };
      console.log('=== PUBLISHING PROPERTY LISTING ===');
      console.log('Draft ID:', draftId);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('====================================');
      
      // Call the publish listing API
      const response = await draftApi.submitListingDraft(draftId);
      
      if (response.success) {
        console.log('✅ Property listing published successfully:', response);
        toast({
          title: 'Success',
          description: 'Your property listing has been published successfully!',
        });
        setIsSubmitted(true);
      } else {
        throw new Error(response.message || 'Failed to publish listing');
      }
    } catch (error) {
      console.error('❌ Error publishing listing:', error);
      const errorMessage = error.message || 'Failed to publish property listing. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Property Listed Successfully! 🎉
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your property listing has been submitted and is now under review.
          </p>
          <div className="space-y-4">
            <Button
              size="lg"
              className="px-10 py-6 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              View My Listings
            </Button>
            <p className="text-sm text-muted-foreground">
              You&apos;ll receive a confirmation email shortly.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Review Your Property Listing
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Please review all the information carefully before submitting your property listing. 
          Use the back button to make any changes if needed.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Property Type & Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl">Property Information</span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Basic details about your property
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Property Type</p>
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white capitalize text-base px-4 py-1.5">
                    {propertyType?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                {formData.ownershipType && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Ownership Type</p>
                    <p className="text-lg font-semibold capitalize">{formData.ownershipType.replace(/_/g, ' ')}</p>
                  </div>
                )}
                {formData.projectName && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Project Name</p>
                    <p className="text-lg font-semibold">{formData.projectName}</p>
                  </div>
                )}
                {formData.reraId && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">RERA ID</p>
                    <p className="text-lg font-semibold font-mono">{formData.reraId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-100/50 dark:from-blue-950/20 dark:to-cyan-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl">Location Details</span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Where your property is located
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.city && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">City</p>
                    <p className="text-lg font-semibold">{formData.city}</p>
                  </div>
                )}
                {formData.locality && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Locality</p>
                    <p className="text-lg font-semibold">{formData.locality}</p>
                  </div>
                )}
                {formData.addressText && (
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Complete Address</p>
                    <p className="text-base font-medium leading-relaxed bg-muted/30 p-4 rounded-lg">
                      {formData.addressText}
                    </p>
                  </div>
                )}
                {formData.landmark && (
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Landmark</p>
                    <p className="text-base font-medium">{formData.landmark}</p>
                  </div>
                )}
                {formData.ageOfProperty !== undefined && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Property Age</p>
                    <p className="text-lg font-semibold">{formData.ageOfProperty} {formData.ageOfProperty === 1 ? 'year' : 'years'}</p>
                  </div>
                )}
                {formData.possessionStatus && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Possession Status</p>
                    <Badge variant="secondary" className="capitalize text-base px-4 py-1.5">
                      {formData.possessionStatus?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Property Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-100/50 dark:from-purple-950/20 dark:to-pink-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl">{isBuildingType() ? 'Property Specifications' : 'Land Details'}</span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    {isBuildingType() ? 'Size, layout and features' : 'Plot area and dimensions'}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isBuildingType() ? (
                <div className="space-y-6">
                  {/* Room Configuration */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                      Room Configuration
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.bedrooms !== undefined && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Bedrooms</p>
                          <p className="text-2xl font-bold">{formData.bedrooms}</p>
                        </div>
                      )}
                      {formData.bathrooms !== undefined && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Bathrooms</p>
                          <p className="text-2xl font-bold">{formData.bathrooms}</p>
                        </div>
                      )}
                      {formData.balconies !== undefined && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Balconies</p>
                          <p className="text-2xl font-bold">{formData.balconies}</p>
                        </div>
                      )}
                      {formData.floors !== undefined && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Floors</p>
                          <p className="text-2xl font-bold">{formData.floors}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Area Details */}
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                      Area Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {formData.carpetArea && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Carpet Area</p>
                          <p className="text-xl font-bold">{formData.carpetArea} sq.ft</p>
                        </div>
                      )}
                      {formData.builtUpArea && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Built-up Area</p>
                          <p className="text-xl font-bold">{formData.builtUpArea} sq.ft</p>
                        </div>
                      )}
                      {formData.superArea && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Super Built-up Area</p>
                          <p className="text-xl font-bold">{formData.superArea} sq.ft</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Features */}
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                      Additional Features
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {formData.furnishingStatus && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Furnishing Status</p>
                          <Badge variant="outline" className="capitalize text-base px-4 py-1.5">
                            {formData.furnishingStatus}
                          </Badge>
                        </div>
                      )}
                      {formData.facing && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Facing Direction</p>
                          <p className="text-lg font-semibold capitalize">{formData.facing}</p>
                        </div>
                      )}
                      {formData.floorNumber !== undefined && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Floor Number</p>
                          <p className="text-lg font-semibold">{formData.floorNumber}</p>
                        </div>
                      )}
                      {formData.totalFloors !== undefined && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Total Floors</p>
                          <p className="text-lg font-semibold">{formData.totalFloors}</p>
                        </div>
                      )}
                      {(formData.coveredParking !== undefined || formData.openParking !== undefined) && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Parking</p>
                          <div className="flex gap-2">
                            {formData.coveredParking !== undefined && (
                              <Badge variant="outline" className="text-sm">
                                {formData.coveredParking} Covered
                              </Badge>
                            )}
                            {formData.openParking !== undefined && (
                              <Badge variant="outline" className="text-sm">
                                {formData.openParking} Open
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.plotArea && (
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Plot Area</p>
                      <p className="text-2xl font-bold">
                        {formData.plotArea} {formData.areaUnit || 'sq.ft'}
                      </p>
                    </div>
                  )}
                  {formData.plotLength && formData.plotWidth && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Plot Dimensions</p>
                      <p className="text-lg font-semibold">
                        {formData.plotLength} × {formData.plotWidth} ft
                      </p>
                    </div>
                  )}
                  {formData.plotDimension && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
                      <p className="text-lg font-semibold">{formData.plotDimension}</p>
                    </div>
                  )}
                  {formData.landUse && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Land Use Type</p>
                      <Badge variant="outline" className="capitalize text-base px-4 py-1.5">
                        {formData.landUse}
                      </Badge>
                    </div>
                  )}
                  {formData.boundaryWall !== undefined && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Boundary Wall</p>
                      <Badge variant={formData.boundaryWall ? "default" : "secondary"} className="text-base px-4 py-1.5">
                        {formData.boundaryWall ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing & Listing Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100/50 dark:from-green-950/20 dark:to-emerald-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl">Pricing & Listing Details</span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Price and property description
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Price & Listing Type */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border-2 border-green-200 dark:border-green-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.listingType && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Listing Type</p>
                      <Badge className="bg-green-600 text-white capitalize text-base px-4 py-1.5">
                        {formData.listingType}
                      </Badge>
                    </div>
                  )}
                  {formData.price && (
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Price</p>
                      <p className="text-4xl font-bold text-green-600">
                        ₹ {Number(formData.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              {formData.availableFrom && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Available From
                  </p>
                  <p className="text-lg font-semibold">{formData.availableFrom}</p>
                </div>
              )}

              <Separator />

              {/* Listing Title & Description */}
              {formData.title && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Listing Title</p>
                  <p className="text-xl font-bold leading-relaxed">{formData.title}</p>
                </div>
              )}

              {formData.description && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Property Description</p>
                  <div className="bg-muted/30 p-5 rounded-lg">
                    <p className="text-base leading-relaxed whitespace-pre-line">{formData.description}</p>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {formData.amenities?.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Amenities & Features ({formData.amenities.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-sm px-3 py-1.5 capitalize">
                          {amenity.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Submit Button - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-72 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t-2 border-green-200 dark:border-green-900 p-6 z-50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="lg"
              onClick={previousStep}
              disabled={isSubmitting}
              className="px-8 py-6 text-base border-2"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !draftId}
              className="px-16 py-6 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Publish Listing
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
