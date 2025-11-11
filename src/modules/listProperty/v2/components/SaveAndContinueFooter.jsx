import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function SaveAndContinueFooter({ 
  onBack, 
  onSaveAndContinue, 
  nextLabel = 'Continue',
  nextDisabled = false,
  showBack = true,
  isLastStep = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-orange-200 dark:border-orange-900 px-4 py-3 md:px-6 md:py-4 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {showBack ? (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onBack}
            className="px-4 md:px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-800 dark:hover:bg-orange-950/30"
          >
            <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
        ) : (
          <div></div>
        )}
        
        <Button
          size="default"
          type="submit"
          onClick={onSaveAndContinue || undefined}
          disabled={nextDisabled}
          className={`px-4 md:px-8 shadow-lg whitespace-nowrap ${
            isLastStep 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30'
          }`}
        >
          <span className="hidden sm:inline">{nextLabel}</span>
          <span className="sm:hidden">{nextLabel === 'Save & Continue' ? 'Continue' : nextLabel}</span>
          <ArrowRight className="w-4 h-4 ml-1 md:ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
