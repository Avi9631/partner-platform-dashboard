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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFormContext } from 'react-hook-form';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';

export default function ReviewAndSubmitV2() {
  const { watch } = useFormContext();
  const { previousStep, goToStep, propertyType, isBuildingType } = usePropertyFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    propertyType: true,
    location: true,
    specifications: true,
    pricing: true,
  });

  // Watch all form values
  const formData = watch();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEdit = (step) => {
    goToStep(step);
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
    <div className="w-full max-w-5xl mx-auto pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Review Your Listing
        </h2>
        <p className="text-muted-foreground text-base">
          Please verify all details before submitting. Click Edit to make changes.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Property Type & Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('propertyType')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span>Property Information</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(0);
                  }}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.propertyType ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.propertyType && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white capitalize text-sm px-3 py-1">
                      {propertyType?.replace('_', ' ')}
                    </Badge>
                  </div>
                  {formData.ownershipType && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ownership</p>
                      <p className="font-semibold capitalize">{formData.ownershipType.replace('_', ' ')}</p>
                    </div>
                  )}
                  {formData.projectName && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Project Name</p>
                      <p className="font-semibold">{formData.projectName}</p>
                    </div>
                  )}
                  {formData.reraId && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">RERA ID</p>
                      <p className="font-semibold">{formData.reraId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('location')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span>Location Details</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(1);
                  }}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.location ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.location && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">City</p>
                    <p className="font-semibold">{formData.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Locality</p>
                    <p className="font-semibold">{formData.locality}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Full Address</p>
                    <p className="font-semibold">{formData.addressText}</p>
                  </div>
                  {formData.landmark && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Landmark</p>
                      <p className="font-semibold">{formData.landmark}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property Age</p>
                    <p className="font-semibold">{formData.ageOfProperty} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Possession Status</p>
                    <Badge variant="secondary" className="capitalize">
                      {formData.possessionStatus?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Property Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('specifications')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span>{isBuildingType() ? 'Property Specifications' : 'Land Details'}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(2);
                  }}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.specifications ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.specifications && (
              <CardContent>
                {isBuildingType() ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.bedrooms && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                        <p className="font-semibold">{formData.bedrooms}</p>
                      </div>
                    )}
                    {formData.bathrooms && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bathrooms</p>
                        <p className="font-semibold">{formData.bathrooms}</p>
                      </div>
                    )}
                    {formData.balconies && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Balconies</p>
                        <p className="font-semibold">{formData.balconies}</p>
                      </div>
                    )}
                    {formData.carpetArea && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Carpet Area</p>
                        <p className="font-semibold">{formData.carpetArea} sq.ft</p>
                      </div>
                    )}
                    {formData.superArea && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Super Area</p>
                        <p className="font-semibold">{formData.superArea} sq.ft</p>
                      </div>
                    )}
                    {formData.furnishingStatus && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Furnishing</p>
                        <Badge variant="outline" className="capitalize">
                          {formData.furnishingStatus}
                        </Badge>
                      </div>
                    )}
                    {formData.facing && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Facing</p>
                        <p className="font-semibold capitalize">{formData.facing}</p>
                      </div>
                    )}
                    {formData.coveredParking && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Parking</p>
                        <p className="font-semibold">{formData.coveredParking} Covered</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.plotArea && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Plot Area</p>
                        <p className="font-semibold">
                          {formData.plotArea} {formData.areaUnit}
                        </p>
                      </div>
                    )}
                    {formData.plotDimension && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Dimensions</p>
                        <p className="font-semibold">{formData.plotDimension}</p>
                      </div>
                    )}
                    {formData.landUse && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Land Use</p>
                        <Badge variant="outline" className="capitalize">
                          {formData.landUse}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Listing & Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleSection('pricing')}
            >
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span>Listing & Pricing</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const pricingStep = isBuildingType() ? 
                      (['apartment', 'penthouse'].includes(propertyType) ? 8 : 7) : 3;
                    handleEdit(pricingStep);
                  }}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {expandedSections.pricing ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {expandedSections.pricing && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Listing Type</p>
                    <Badge className="capitalize">{formData.listingType}</Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹ {Number(formData.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  {formData.availableFrom && (
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
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
                      {formData.amenities.slice(0, 8).map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity.replace('_', ' ')}
                        </Badge>
                      ))}
                      {formData.amenities.length > 8 && (
                        <Badge variant="secondary">
                          +{formData.amenities.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
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
        <div className="max-w-5xl mx-auto flex justify-between items-center">
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
            disabled={isSubmitting}
            className="px-16 py-6 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
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
        </div>
      </motion.div>
    </div>
  );
}
