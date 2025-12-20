import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProjectFormProviderV2, useProjectFormV2 } from '../context/ProjectFormContextV2';
import { getStepComponent, getVisibleSteps } from '../config/stepConfigurationProject';
import { Button } from '@/components/ui/button';
import { X, Check, Lock } from 'lucide-react';
import { motion } from 'motion/react';

function ProjectFormSheetContent({ onClose }) {
  const context = useProjectFormV2();
  
  if (!context) {
    console.error('ProjectFormSheetContent rendered outside of ProjectFormProviderV2');
    return null;
  }
  
  const { currentStep, formDataWithType, goToStep, completedSteps, isLoadingDraft } = context;
  const visibleSteps = getVisibleSteps(formDataWithType);

  const renderStepContent = () => {
    const StepComponent = getStepComponent(currentStep, formDataWithType);
    
    if (!StepComponent) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Step not found</p>
        </div>
      );
    }
    
    return <StepComponent />;
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-3">
            Project Listing Steps
          </h3>
          <div className="space-y-2">
            {visibleSteps.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isCurrent = currentStep === index;
              const isLocked = index > currentStep && !isCompleted;

              return (
                <button
                  key={step.id}
                  onClick={() => !isLocked && goToStep(index)}
                  disabled={isLocked}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                      : isCompleted
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                      : isLocked
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : isLocked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="font-medium truncate">{step.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 p-3 bg-white dark:bg-gray-800 rounded-lg">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Progress
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(completedSteps.size / visibleSteps.length) * 100}%`,
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {completedSteps.size} of {visibleSteps.length} completed
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoadingDraft ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading draft data...</p>
            </div>
          </div>
        ) : (
          renderStepContent()
        )}
      </div>
    </div>
  );
}

export default function ProjectFormSheetV2({ open, onOpenChange, initialDraftId, editingDraft }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-full p-0">
        <ProjectFormProviderV2
          initialDraftId={initialDraftId}
          editingDraft={editingDraft}
          onClose={() => onOpenChange(false)}
        >
          <ProjectFormSheetContent onClose={() => onOpenChange(false)} />
        </ProjectFormProviderV2>
      </SheetContent>
    </Sheet>
  );
}
