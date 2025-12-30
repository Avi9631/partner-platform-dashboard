import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function SaveAndContinueFooter({
  onBack,
  onSaveAndContinue,
  nextDisabled = false,
  showBack = true,
  nextLabel = 'Save',
  backLabel = 'Back',
  isLastStep = false,
  isLoading = false,
  loadingText = 'Saving...',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {showBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="h-11 px-6 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Button>
        ) : (
          <div /> 
        )}

        <Button
          type="submit"
          onClick={onSaveAndContinue}
          disabled={nextDisabled || isLoading}
          className="h-11 px-8 text-sm font-bold shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {loadingText}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {nextLabel}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
