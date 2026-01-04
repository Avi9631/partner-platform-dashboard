import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Rocket, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePgFormV2 } from '../context/PgFormContextV2';
import { getVisibleSteps } from '../config/stepConfigurationPg';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePgPublish } from '../hooks/usePgPublish';

export default function PgFormSidebar({ isMobileOpen, setIsMobileOpen }) {
  const { 
    currentStep, 
    goToStep, 
    formDataWithType, 
    completedSteps,
    draftId,
    formData
  } = usePgFormV2();

  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { publish, isPublishing } = usePgPublish(draftId, formData);

  const visibleSteps = getVisibleSteps(formDataWithType);

  const handleStepClick = (stepIndex) => {
    // Allow navigation to any step (no locking)
    goToStep(stepIndex);
    // Close mobile drawer after selecting a step
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handlePublishClick = () => {
    setShowPublishDialog(true);
  };

  const handlePublish = async () => {
    setShowPublishDialog(false);
    await publish();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobileOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 md:translate-x-0"
      >
      {/* Mobile Close Button */}
      <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Navigation
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Header */}
      {/* <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
          List Your PG/Hostel
        </h2>
        <p className="text-sm text-muted-foreground">
          Complete all sections to publish
        </p>
      </div> */}

      {/* Progress */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-bold text-orange-600">
            {completedSteps.size} / {visibleSteps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${(completedSteps.size / visibleSteps.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Steps List */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-2">
          {visibleSteps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = completedSteps.has(index);
            
            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-gray-50 dark:hover:bg-gray-800',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                    'group relative',
                    isActive && 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30',
                    isCompleted && !isActive && 'bg-green-50 dark:bg-green-950/30',
                    !isActive && !isCompleted && 'hover:shadow-md'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Step Number/Icon */}
                    <div
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm flex-shrink-0 transition-all',
                        isActive && 'bg-white/20 text-white ring-2 ring-white/30',
                        isCompleted && !isActive && 'bg-green-500 text-white',
                        !isActive && !isCompleted && 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Step Name */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          isActive && 'text-white',
                          isCompleted && !isActive && 'text-green-700 dark:text-green-400',
                          !isActive && !isCompleted && 'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {step.name}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Publish Button Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-gray-900">
        <Button
          onClick={handlePublishClick}
          disabled={isPublishing || !draftId}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-2" />
              Publish PG/Hostel
            </>
          )}
        </Button>

        {/* <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
          <p>
            {completedSteps.size === visibleSteps.length 
              ? "All steps completed! Ready to publish."
              : `Complete ${visibleSteps.length - completedSteps.size} more step(s) for best results.`}
          </p>
        </div> */}
      </div>

      {/* Footer Info */}
      {/* <div className="px-4 pb-4 bg-gradient-to-r from-orange-50/50 to-white dark:from-orange-950/10 dark:to-gray-900">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
          <p>
            Your progress is auto-saved. Click any step to navigate.
          </p>
        </div>
      </div> */}

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish PG/Hostel?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div>
                You have completed <span className="font-semibold text-orange-600">{completedSteps.size} out of {visibleSteps.length}</span> steps.
              </div>
              
              {completedSteps.size === visibleSteps.length ? (
                <div className="text-green-600 dark:text-green-400">
                  ✓ All steps completed! Your listing is ready to publish.
                </div>
              ) : (
                <div className="text-amber-600 dark:text-amber-400">
                  ⚠️ Publishing with incomplete information may affect your listing visibility.
                </div>
              )}
              
              <div className="pt-2 text-sm">
                Once published, your listing will be reviewed and made live on the platform.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Confirm & Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.aside>
    </>
  );
}
