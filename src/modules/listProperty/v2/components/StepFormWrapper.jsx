import { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../context/PropertyFormContextV2';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * StepFormWrapper - Wrapper component for individual form steps
 * 
 * This component provides:
 * - Auto-save functionality on form change (debounced)
 * - Navigation buttons (Previous/Next)
 * - Auto-save indicator
 * - Consistent layout and styling
 * 
 * Usage:
 * <StepFormWrapper 
 *   title="Step Title"
 *   description="Step description"
 *   onSubmit={handleSubmit}
 *   formMethods={form}
 * >
 *   {children}
 * </StepFormWrapper>
 */
export default function StepFormWrapper({
  children,
  title,
  description,
  onSubmit,
  formMethods,
  showNavigation = true,
  nextLabel = 'Next Step',
  hideBack = false,
}) {
  const {
    currentStep,
    previousStep,
    saveAndContinue,
    getTotalSteps,
    saveDraft,
    formData,
    completedSteps,
    setCompletedSteps,
  } = usePropertyFormV2();

  const totalSteps = getTotalSteps();
  const isLastStep = currentStep >= totalSteps - 1;

  // Auto-save on form data change (debounced)
  useEffect(() => {
    if (!formMethods) return;

    const subscription = formMethods.watch(() => {
      // Debounce auto-save
      const timeoutId = setTimeout(async () => {
        const currentFormData = formMethods.getValues();
        console.log('Auto-saving form data...', currentFormData);
        await saveDraft({ ...formData, ...currentFormData });
      }, 2000); // 2 second debounce

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [formMethods, saveDraft, formData]);

  const handleNext = useCallback(async () => {
    if (formMethods) {
      // Validate form
      const isValid = await formMethods.trigger();
      if (!isValid) {
        console.log('Form validation failed');
        return;
      }

      // Get form data
      const stepData = formMethods.getValues();
      
      // Save and continue
      await saveAndContinue(stepData);
    } else {
      // If no form methods, just continue (for non-form steps)
      await saveAndContinue({});
    }
  }, [formMethods, saveAndContinue]);

  const handlePrevious = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const handleFormSubmit = useCallback(
    async (data) => {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await handleNext();
      }
    },
    [onSubmit, handleNext]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30">
            {completedSteps.has(currentStep) ? (
              <Check className="w-5 h-5" />
            ) : (
              <span>{currentStep + 1}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          </div>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground ml-13">
            {description}
          </p>
        )}
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 mb-6">
        {formMethods ? (
          <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
            {children}
          </form>
        ) : (
          <div>{children}</div>
        )}
      </div>

      {/* Navigation Buttons */}
      {showNavigation && (
        <div className="flex items-center justify-between">
          {!hideBack && currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Step
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={handleNext}
            disabled={formMethods && !formMethods.formState.isValid}
            className={cn(
              'gap-2 shadow-lg',
              isLastStep
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
            )}
          >
            {isLastStep ? 'Complete' : nextLabel}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
