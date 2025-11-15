import { useState } from 'react';
import { CheckCircle, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import { useToast } from '@/components/hooks/use-toast';

export default function ReviewAndSubmitV2() {
  const { formData, goToStep, previousStep, saveDraft } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveDraft(formData);
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Developer profile submitted successfully.',
          variant: 'default',
        });
        // Close the form or redirect
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
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
            {/* Basic Info */}
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
                    <dt className="text-sm text-gray-600">Developer Name:</dt>
                    <dd className="text-sm font-medium">{formData.developerName || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Type:</dt>
                    <dd className="text-sm font-medium">{formData.developerType || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Established:</dt>
                    <dd className="text-sm font-medium">{formData.establishedYear || 'N/A'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-semibold">Contact Information</h4>
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
                    <dt className="text-sm text-gray-600">Email:</dt>
                    <dd className="text-sm font-medium">{formData.primaryContactEmail || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Phone:</dt>
                    <dd className="text-sm font-medium">{formData.primaryContactPhone || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">City:</dt>
                    <dd className="text-sm font-medium">{formData.city || 'N/A'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
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
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg min-w-[180px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Developer Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
