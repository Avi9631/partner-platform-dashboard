import { useState } from 'react';
import { CheckCircle, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import { useToast } from '@/components/hooks/use-toast';
import { pgHostelApi } from '@/services/pgHostelService';

export default function ReviewAndSubmitPgStep() {
  const { formData, goToStep, previousStep, draftId } = usePgFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!draftId) {
      toast({
        title: 'Error',
        description: 'Draft ID not found. Please save your listing first.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Pass draftId in the payload along with all form data
      const result = await pgHostelApi.publishPgColiveHostel({
        draftId,
        ...formData
      });
      
      toast({
        title: 'Success!',
        description: 'PG/Hostel listing published successfully and is being processed.',
        variant: 'default',
      });
      
      // Optional: Close form or redirect after successful submission
      // setTimeout(() => window.location.href = '/dashboard', 2000);
      
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish PG/Hostel listing.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Review Your Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review all details before submitting
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Basic Property Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-semibold">Basic Information</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToStep(0)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Property Name:</dt>
                    <dd className="text-sm font-medium">{formData.propertyName || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Gender Allowed:</dt>
                    <dd className="text-sm font-medium">{formData.genderAllowed || 'N/A'}</dd>
                  </div>
                  {formData.isBrandManaged && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Brand Name:</dt>
                      <dd className="text-sm font-medium">{formData.brandName || 'N/A'}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Year Built:</dt>
                    <dd className="text-sm font-medium">{formData.yearBuilt || 'N/A'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-semibold">Location</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToStep(1)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">City:</dt>
                    <dd className="text-sm font-medium">{formData.city || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Locality:</dt>
                    <dd className="text-sm font-medium">{formData.locality || 'N/A'}</dd>
                  </div>
                  {formData.addressText && (
                    <div className="flex flex-col gap-1">
                      <dt className="text-sm text-gray-600">Address:</dt>
                      <dd className="text-sm font-medium">{formData.addressText}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Room Types */}
            {formData.roomTypes && formData.roomTypes.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold">Room Types ({formData.roomTypes.length})</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToStep(2)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {formData.roomTypes.map((room, idx) => (
                      <div key={idx} className="border-b last:border-b-0 pb-2 last:pb-0">
                        <div className="font-medium text-sm">{room.name}</div>
                        <div className="text-xs text-gray-600">
                          {room.category} • ₹{room.pricing?.[0]?.amount || 'N/A'}/month
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Common Amenities */}
            {formData.commonAmenities && formData.commonAmenities.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold">Amenities ({formData.commonAmenities.length})</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToStep(3)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.commonAmenities.map((amenity, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Food & Mess */}
            {formData.foodMess?.available && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold">Food & Mess</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToStep(4)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Meals Provided:</dt>
                      <dd className="text-sm font-medium">
                        {formData.foodMess.meals?.join(', ') || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Food Type:</dt>
                      <dd className="text-sm font-medium">{formData.foodMess.foodType || 'N/A'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
              disabled={isSubmitting}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish PG/Hostel Listing'
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Your listing will be reviewed before being published
          </p>
        </div>
      </div>
    </div>
  );
}
