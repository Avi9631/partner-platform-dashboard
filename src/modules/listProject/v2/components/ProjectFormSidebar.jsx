import { motion } from 'motion/react';
import { Check, ChevronRight, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProjectFormV2 } from '../context/ProjectFormContextV2';
import { getVisibleSteps } from '../config/stepConfigurationProject';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useProjectPublish } from '../hooks/useProjectPublish';
import { useNavigate } from 'react-router-dom';

export default function ProjectFormSidebar() {
  const { 
    currentStep, 
    goToStep, 
    formDataWithType, 
    completedSteps,
    draftId,
  } = useProjectFormV2();

  const navigate = useNavigate();
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const { publish, isPublishing } = useProjectPublish(draftId, formDataWithType);

  const visibleSteps = getVisibleSteps(formDataWithType);

  const handleStepClick = (stepIndex) => {
    // Allow navigation to any step (no locking)
    goToStep(stepIndex);
  };

  const handlePublishClick = () => {
    setIsPublishDialogOpen(true);
  };

  const handlePublish = async () => {
    const result = await publish();
    
    if (result.success) {
      setIsPublishDialogOpen(false);
      // Navigate to projects list after successful publish
      setTimeout(() => {
        navigate('/list-project');
      }, 1500);
    }
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
          List Your Project
        </h2>
        <p className="text-sm text-muted-foreground">
          Complete all sections to publish
        </p>
      </div>

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

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-orange-50/50 to-white dark:from-orange-950/10 dark:to-gray-900 space-y-3">
        {/* Publish Button */}
        <Button
          onClick={handlePublishClick}
          disabled={isPublishing || !draftId}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-200"
        >
          <Send className="w-4 h-4 mr-2" />
          {isPublishing ? 'Publishing...' : 'Publish Project'}
        </Button>

        {/* Info Text */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
          <p>
            Click any step to navigate. Your progress is auto-saved.
          </p>
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to publish your project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make your project visible to potential buyers and investors. 
              You can still edit it after publishing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isPublishing ? 'Publishing...' : 'Publish Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
