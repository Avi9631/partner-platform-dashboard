import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function SaveAndContinueFooter({
  onBack,
  onSaveAndContinue,
  nextDisabled = false,
  showBack = true,
  nextLabel = 'Save & Continue',
  backLabel = 'Back',
  isLastStep = false,
  isLoading = false,
  loadingText = 'Saving...',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="  bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {showBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="h-9 sm:h-11 px-3 sm:px-6 text-xs sm:text-sm font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">{backLabel}</span>
            <span className="xs:hidden">Back</span>
          </Button>
        ) : (
          <div /> 
        )}

        <Button
          type="submit"
          onClick={onSaveAndContinue}
          disabled={nextDisabled || isLoading}
          className={`h-9 sm:h-11 px-4 sm:px-8 text-xs sm:text-sm font-bold shadow-lg ${
            isLastStep
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
              <span className="hidden xs:inline">{loadingText}</span>
              <span className="xs:hidden">Saving...</span>
            </>
          ) : isLastStep ? (
            <>
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Submit Project</span>
              <span className="xs:hidden">Submit</span>
            </>
          ) : (
            <>
              <span className="hidden xs:inline">{nextLabel}</span>
              <span className="xs:hidden">Next</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
