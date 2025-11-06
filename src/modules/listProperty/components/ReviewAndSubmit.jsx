import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Edit,
  MapPin,
  Building2,
  Home,
  DollarSign,
  Calendar,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import useListPropertyStore from '../store/useListPropertyStore';

export default function ReviewAndSubmit() {
  const { formData, previousStep, setCurrentStep } = useListPropertyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isBuildingType = ['apartment', 'villa', 'duplex', 'independent_house', 
                          'penthouse', 'studio', 'independent_floor'].includes(formData.propertyType);

  const handleEdit = (step) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full px-6 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Property Listed Successfully! 🎉
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Your property listing has been submitted and is now under review.
          </p>
          <div className="space-y-3">
            <Button
              size="default"
              className="px-8 bg-gradient-to-r from-primary to-purple-600"
            >
              View My Listings
            </Button>
            <p className="text-xs text-muted-foreground">
              You&apos;ll receive a confirmation email shortly.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Review Your Listing
        </h2>
        <p className="text-muted-foreground text-sm">
          Please verify all details before submitting
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Property Type & Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Property Information
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(0)}
                className="text-primary hover:text-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Property Type</p>
                  <p className="font-semibold capitalize">
                    {formData.propertyType?.replace('_', ' ')}
                  </p>
                </div>
                {formData.projectName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Project Name</p>
                    <p className="font-semibold">{formData.projectName}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location Details
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(1)}
                className="text-primary hover:text-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-semibold">{formData.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Property Age</p>
                  <p className="font-semibold">{formData.ageOfProperty} years</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold">{formData.addressText}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Possession Status</p>
                <Badge variant="secondary" className="capitalize">
                  {formData.possessionStatus?.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Building/Land Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                {isBuildingType ? 'Property Specifications' : 'Land Details'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(2)}
                className="text-primary hover:text-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              {isBuildingType ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.bedrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-semibold">{formData.bedrooms}</p>
                    </div>
                  )}
                  {formData.bathrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-semibold">{formData.bathrooms}</p>
                    </div>
                  )}
                  {formData.carpetArea && (
                    <div>
                      <p className="text-sm text-muted-foreground">Carpet Area</p>
                      <p className="font-semibold">{formData.carpetArea} sq.ft</p>
                    </div>
                  )}
                  {formData.superArea && (
                    <div>
                      <p className="text-sm text-muted-foreground">Super Area</p>
                      <p className="font-semibold">{formData.superArea} sq.ft</p>
                    </div>
                  )}
                  {formData.furnishingStatus && (
                    <div>
                      <p className="text-sm text-muted-foreground">Furnishing</p>
                      <Badge variant="outline" className="capitalize">
                        {formData.furnishingStatus}
                      </Badge>
                    </div>
                  )}
                  {formData.facing && (
                    <div>
                      <p className="text-sm text-muted-foreground">Facing</p>
                      <p className="font-semibold capitalize">{formData.facing}</p>
                    </div>
                  )}
                  {formData.coveredParking && (
                    <div>
                      <p className="text-sm text-muted-foreground">Parking</p>
                      <p className="font-semibold">{formData.coveredParking} Covered</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.plotArea && (
                    <div>
                      <p className="text-sm text-muted-foreground">Plot Area</p>
                      <p className="font-semibold">
                        {formData.plotArea} {formData.areaUnit}
                      </p>
                    </div>
                  )}
                  {formData.plotDimension && (
                    <div>
                      <p className="text-sm text-muted-foreground">Dimensions</p>
                      <p className="font-semibold">{formData.plotDimension}</p>
                    </div>
                  )}
                  {formData.landUse && (
                    <div>
                      <p className="text-sm text-muted-foreground">Land Use</p>
                      <Badge variant="outline" className="capitalize">
                        {formData.landUse}
                      </Badge>
                    </div>
                  )}
                  {formData.roadWidth && (
                    <div>
                      <p className="text-sm text-muted-foreground">Road Width</p>
                      <p className="font-semibold">{formData.roadWidth} ft</p>
                    </div>
                  )}
                  {formData.fencing && (
                    <div>
                      <p className="text-sm text-muted-foreground">Fencing</p>
                      <Badge variant="secondary">✓ Fenced</Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Listing & Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Listing & Pricing
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(3)}
                className="text-primary hover:text-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Listing Type</p>
                  <Badge className="capitalize">{formData.listingType}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹ {Number(formData.price).toLocaleString('en-IN')}
                  </p>
                </div>
                {formData.availableFrom && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Available From
                    </p>
                    <p className="font-semibold">{formData.availableFrom}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Listing Title</p>
                <p className="font-semibold text-lg">{formData.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{formData.description}</p>
              </div>
              {formData.amenities?.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Amenities ({formData.amenities.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between mt-8"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={previousStep}
          disabled={isSubmitting}
          className="px-8 py-6 text-base"
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
          disabled={isSubmitting}
          className="px-12 py-6 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Submit Listing
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
