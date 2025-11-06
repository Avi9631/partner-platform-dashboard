import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import useListPropertyStore from '../../store/useListPropertyStore';
import SuitableFor from './SuitableFor';

export default function SuitableForStep() {
  const { formData, nextStep, previousStep } = useListPropertyStore();

  // This step is optional, so always allow continue
  const canContinue = true;

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Tenant Preferences
        </h2>
        <p className="text-muted-foreground text-sm">
          Who is this property suitable for? (Optional)
        </p>
      </motion.div>

      <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 dark:from-orange-950/10 dark:via-background dark:to-orange-900/5 rounded-xl p-6">
        <div className="space-y-6">
          {formData.listingType === 'sale' ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                This section is only applicable for rental and lease properties.
              </p>
            </div>
          ) : (
            <SuitableFor />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-orange-200 dark:border-orange-900">
            <Button
              variant="outline"
              size="default"
              onClick={previousStep}
              className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-800 dark:hover:bg-orange-950/30"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              size="default"
              onClick={nextStep}
              disabled={!canContinue}
              className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
            >
              Continue
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
