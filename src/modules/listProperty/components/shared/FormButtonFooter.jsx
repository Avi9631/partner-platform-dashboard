import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function FormButtonFooter({ 
  onBack, 
  onNext, 
  onCancel,
  nextLabel = 'Continue',
  nextDisabled = false,
  showBack = true,
  isSheetMode = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-orange-200 dark:border-orange-900 p-4 z-50"
    >
      <div className="max-w-7xl mx-auto flex justify-between">
        {showBack ? (
          isSheetMode ? (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onCancel}
              className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-800 dark:hover:bg-orange-950/30"
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onBack}
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
          )
        ) : (
          <div></div>
        )}
        <Button
          size="default"
          type="submit"
          onClick={onNext}
          disabled={nextDisabled}
          className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
        >
          {nextLabel}
          {nextLabel === 'Continue' && (
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
          )}
        </Button>
      </div>
    </motion.div>
  );
}
