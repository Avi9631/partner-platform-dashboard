import { useState } from 'react';
import { Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function MediaStepV2() {
  const { saveAndContinue, previousStep } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveAndContinue({
        media: 'Optional - To be implemented',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Image className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Media & Documents
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload logos, images, and documents
              </p>
            </div>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              This section is optional. You can skip it for now and come back later.
            </p>
          </div>
        </CardContent>
      </Card>

      <SaveAndContinueFooter
        onPrevious={previousStep}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
